/**
 * Import beast babe history from CSV file
 * Usage: npx tsx scripts/import-beast-babe-from-csv.ts path/to/beast-babe.csv
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'
import * as fs from 'fs'
import * as readline from 'readline'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

interface BeastBabeRow {
  date: string
  person: string
  achievement: string
}

// Parse date from various formats (M/D/YYYY, M/DD/YYYY, etc.)
function parseDate(dateStr: string): string | null {
  if (!dateStr || !dateStr.trim()) return null
  
  // Try to parse various date formats
  const formats = [
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // M/D/YYYY or MM/DD/YYYY
  ]
  
  for (const format of formats) {
    const match = dateStr.trim().match(format)
    if (match) {
      const month = parseInt(match[1], 10)
      const day = parseInt(match[2], 10)
      const year = parseInt(match[3], 10)
      
      // Validate date
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      }
    }
  }
  
  // Try native Date parsing as fallback
  const parsed = new Date(dateStr)
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0]
  }
  
  return null
}

// Fuzzy match name to profile
async function findProfileByName(name: string): Promise<string | null> {
  if (!name || !name.trim()) return null
  
  const trimmedName = name.trim()
  
  // Try exact match first (case-insensitive)
  const { data: exactMatch } = await supabase
    .from('profiles')
    .select('id, full_name')
    .ilike('full_name', trimmedName)
    .limit(1)
    .maybeSingle()
  
  if (exactMatch) {
    return exactMatch.id
  }
  
  // Try partial match
  const { data: partialMatch } = await supabase
    .from('profiles')
    .select('id, full_name')
    .ilike('full_name', `%${trimmedName}%`)
    .limit(1)
    .maybeSingle()
  
  if (partialMatch) {
    return partialMatch.id
  }
  
  // Try matching first name or last name
  const nameParts = trimmedName.split(' ')
  if (nameParts.length > 1) {
    const firstName = nameParts[0]
    const lastName = nameParts[nameParts.length - 1]
    
    // Try matching by first name
    const { data: firstNameMatch } = await supabase
      .from('profiles')
      .select('id, full_name')
      .ilike('full_name', `${firstName}%`)
      .limit(1)
      .maybeSingle()
    
    if (firstNameMatch) {
      return firstNameMatch.id
    }
  }
  
  return null
}

// Parse CSV file
async function parseCSV(filePath: string): Promise<BeastBabeRow[]> {
  const fileStream = fs.createReadStream(filePath)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  
  const rows: BeastBabeRow[] = []
  let lineNumber = 0
  let headers: string[] = []
  
  for await (const line of rl) {
    lineNumber++
    
    // Skip empty lines
    if (!line.trim()) continue
    
    // Parse CSV line (handling quoted fields with commas)
    const fields: string[] = []
    let currentField = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const nextChar = line[i + 1]
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          currentField += '"'
          i++ // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        fields.push(currentField.trim())
        currentField = ''
      } else {
        currentField += char
      }
    }
    // Add last field
    fields.push(currentField.trim())
    
    if (lineNumber === 1) {
      // Header row
      headers = fields.map(h => h.toLowerCase().trim())
      continue
    }
    
    // Data row
    const row: any = {}
    headers.forEach((header, index) => {
      row[header] = fields[index] || ''
    })
    
    // Map CSV columns to our structure
    const date = row['date'] || ''
    const person = row['person'] || ''
    const achievement = row['achievement'] || ''
    
    if (person.trim() && date.trim()) {
      rows.push({
        date: date.trim(),
        person: person.trim(),
        achievement: achievement.trim(),
      })
    }
  }
  
  return rows
}

async function importBeastBabe() {
  const csvPath = process.argv[2]
  
  if (!csvPath) {
    console.error('Usage: npx tsx scripts/import-beast-babe-from-csv.ts path/to/beast-babe.csv')
    process.exit(1)
  }
  
  if (!fs.existsSync(csvPath)) {
    console.error(`File not found: ${csvPath}`)
    process.exit(1)
  }
  
  console.log('Parsing CSV file...')
  const rows = await parseCSV(csvPath)
  console.log(`Found ${rows.length} beast babe entries to import`)
  
  // Get all profiles for matching
  console.log('Loading profiles for name matching...')
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name, email')
  
  if (profilesError) {
    console.error('Error loading profiles:', profilesError)
    throw profilesError
  }
  
  console.log(`Loaded ${profiles?.length || 0} profiles`)
  
  const stats = {
    total: rows.length,
    imported: 0,
    skipped: 0,
    errors: 0,
    matched: 0,
    unmatched: [] as string[],
  }
  
  console.log('\nImporting beast babe history...')
  
  for (const row of rows) {
    try {
      // Parse date
      const parsedDate = parseDate(row.date)
      if (!parsedDate) {
        console.warn(`Skipping row with invalid date: ${row.date}`)
        stats.skipped++
        continue
      }
      
      // Try to match person to profile
      const userId = await findProfileByName(row.person)
      
      if (!userId) {
        stats.unmatched.push(row.person)
        console.warn(`Could not find profile for: ${row.person}`)
        stats.skipped++
        continue
      }
      
      stats.matched++
      
      // Insert beast babe history entry
      // Note: passed_by_user_id is null for CSV imports (historical data)
      const { error: insertError } = await supabase
        .from('beast_babe_history')
        .insert({
          date: parsedDate,
          user_id: userId,
          achievement: row.achievement || null,
          passed_by_user_id: null, // Historical data doesn't have this
        })
      
      if (insertError) {
        // Check if it's a duplicate (same user, same date)
        if (insertError.code === '23505') {
          console.warn(`Skipping duplicate entry for ${row.person} on ${parsedDate}`)
          stats.skipped++
        } else {
          console.error(`Error inserting entry: ${insertError.message}`)
          stats.errors++
          stats.skipped++
        }
      } else {
        stats.imported++
        if (stats.imported % 10 === 0) {
          process.stdout.write(`\rImported ${stats.imported}/${stats.total}...`)
        }
      }
    } catch (error: any) {
      console.error(`Error processing row:`, error.message)
      stats.errors++
      stats.skipped++
    }
  }
  
  console.log('\n\nImport complete!')
  console.log('Statistics:')
  console.log(`  Total rows: ${stats.total}`)
  console.log(`  Successfully imported: ${stats.imported}`)
  console.log(`  Skipped: ${stats.skipped}`)
  console.log(`  Errors: ${stats.errors}`)
  console.log(`  Matched users: ${stats.matched}`)
  
  if (stats.unmatched.length > 0) {
    console.log(`\nUnmatched names (${stats.unmatched.length}):`)
    const unique = [...new Set(stats.unmatched)]
    unique.forEach(name => console.log(`  - ${name}`))
    console.log('\nNote: You may need to update these names in the CSV to match profile names exactly,')
    console.log('or create profiles for these users first.')
  }
  
  // Check if we should set the most recent entry as current beast babe
  if (stats.imported > 0) {
    console.log('\nNote: The import creates historical records only.')
    console.log('To set the current beast babe, use the admin interface to pass the torch')
    console.log('to the most recent person from the history.')
  }
}

importBeastBabe().catch(console.error)

