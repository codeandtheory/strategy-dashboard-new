/**
 * Import snaps from CSV file
 * Usage: npx tsx scripts/import-snaps-from-csv.ts path/to/snaps.csv
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

interface SnapRow {
  date: string
  snapContent: string
  mentioned: string | null
  submittedBy: string | null
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
async function parseCSV(filePath: string): Promise<SnapRow[]> {
  const fileStream = fs.createReadStream(filePath)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  
  const rows: SnapRow[] = []
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
    const snapContent = row['snap content'] || row['snap_content'] || ''
    const mentioned = row['mentioned'] || ''
    const submittedBy = row['submitted by'] || row['submitted_by'] || ''
    
    if (snapContent.trim()) {
      rows.push({
        date: parseDate(date) || new Date().toISOString().split('T')[0],
        snapContent: snapContent.trim(),
        mentioned: mentioned.trim() || null,
        submittedBy: submittedBy.trim() || null,
      })
    }
  }
  
  return rows
}

async function importSnaps() {
  const csvPath = process.argv[2]
  
  if (!csvPath) {
    console.error('Usage: npx tsx scripts/import-snaps-from-csv.ts path/to/snaps.csv')
    process.exit(1)
  }
  
  if (!fs.existsSync(csvPath)) {
    console.error(`File not found: ${csvPath}`)
    process.exit(1)
  }
  
  console.log('Parsing CSV file...')
  const rows = await parseCSV(csvPath)
  console.log(`Found ${rows.length} snaps to import`)
  
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
    matchedMentioned: 0,
    matchedSubmittedBy: 0,
    unmatchedMentioned: [] as string[],
    unmatchedSubmittedBy: [] as string[],
  }
  
  console.log('\nImporting snaps...')
  
  for (const row of rows) {
    try {
      // Try to match mentioned and submitted_by to profiles
      let mentionedUserId: string | null = null
      let submittedById: string | null = null
      
      if (row.mentioned) {
        mentionedUserId = await findProfileByName(row.mentioned)
        if (mentionedUserId) {
          stats.matchedMentioned++
        } else {
          stats.unmatchedMentioned.push(row.mentioned)
        }
      }
      
      if (row.submittedBy) {
        submittedById = await findProfileByName(row.submittedBy)
        if (submittedById) {
          stats.matchedSubmittedBy++
        } else {
          stats.unmatchedSubmittedBy.push(row.submittedBy)
        }
      }
      
      // Insert snap
      const { error: insertError } = await supabase
        .from('snaps')
        .insert({
          date: row.date,
          snap_content: row.snapContent,
          mentioned: row.mentioned,
          mentioned_user_id: mentionedUserId,
          submitted_by: submittedById, // null for anonymous
        })
      
      if (insertError) {
        console.error(`Error inserting snap: ${insertError.message}`)
        stats.errors++
        stats.skipped++
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
  console.log(`  Matched mentioned users: ${stats.matchedMentioned}`)
  console.log(`  Matched submitted_by users: ${stats.matchedSubmittedBy}`)
  
  if (stats.unmatchedMentioned.length > 0) {
    console.log(`\nUnmatched mentioned names (${stats.unmatchedMentioned.length}):`)
    const unique = [...new Set(stats.unmatchedMentioned)]
    unique.forEach(name => console.log(`  - ${name}`))
  }
  
  if (stats.unmatchedSubmittedBy.length > 0) {
    console.log(`\nUnmatched submitted_by names (${stats.unmatchedSubmittedBy.length}):`)
    const unique = [...new Set(stats.unmatchedSubmittedBy)]
    unique.forEach(name => console.log(`  - ${name}`))
  }
}

importSnaps().catch(console.error)

