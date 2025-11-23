#!/usr/bin/env python3
"""
Import users from CSV file into Supabase profiles table.
This script parses the CSV and generates SQL UPDATE statements for existing users.
"""

import csv
import re
import sys
from datetime import datetime
from pathlib import Path

def extract_photo_url(photo_text):
    """Extract URL from photo field format: 'filename (https://url)' or just URL"""
    if not photo_text or not photo_text.strip():
        return None
    
    # Try to extract URL from parentheses
    match = re.search(r'\(https?://[^)]+\)', photo_text)
    if match:
        return match.group(0)[1:-1]  # Remove parentheses
    
    # If it's already a URL, return it
    if photo_text.strip().startswith(('http://', 'https://')):
        return photo_text.strip()
    
    return None

def convert_birthday(birthday_text):
    """Convert birthday from M/D/YYYY to MM/DD format"""
    if not birthday_text or not birthday_text.strip():
        return None
    
    try:
        # Parse date
        parts = birthday_text.strip().split('/')
        if len(parts) >= 2:
            month = parts[0].zfill(2)
            day = parts[1].zfill(2)
            return f"{month}/{day}"
    except:
        pass
    
    return None

def convert_start_date(date_text):
    """Convert start date from M/D/YYYY to YYYY-MM-DD format"""
    if not date_text or not date_text.strip():
        return None
    
    try:
        # Parse date
        parts = date_text.strip().split('/')
        if len(parts) == 3:
            month = parts[0].zfill(2)
            day = parts[1].zfill(2)
            year = parts[2]
            return f"{year}-{month}-{day}"
    except:
        pass
    
    return None

def map_base_role(access_text):
    """Map access level to base_role"""
    if not access_text or not access_text.strip():
        return 'user'
    
    access_lower = access_text.strip().lower()
    if access_lower == 'admin':
        return 'admin'
    elif access_lower == 'contributor':
        return 'contributor'
    elif access_lower == 'leader':
        return 'leader'
    else:
        return 'user'

def build_special_access(curator_text, lead_text):
    """Build special_access array from curator and lead fields"""
    access = []
    
    if curator_text and curator_text.strip().lower() == 'checked':
        access.append('curator')
    
    if lead_text and lead_text.strip().lower() == 'checked':
        access.append('lead')
    
    return access

def escape_sql_string(value):
    """Escape single quotes for SQL"""
    if value is None:
        return 'NULL'
    return "'" + str(value).replace("'", "''") + "'"

def generate_sql_updates(csv_path):
    """Generate SQL UPDATE statements from CSV file"""
    
    updates = []
    not_found = []
    
    with open(csv_path, 'r', encoding='utf-8-sig') as f:  # utf-8-sig handles BOM
        reader = csv.DictReader(f)
        
        for row in reader:
            # Helper to get value handling BOM
            def get_value(key):
                return row.get(key, '') or row.get(f'\ufeff{key}', '')
            
            email = get_value('Email').strip()
            if not email:
                continue
            
            # Extract and process fields
            name = get_value('Name').strip() or None
            role = get_value('Role').strip() or None
            discipline = get_value('Discipline').strip() or None
            photo_url = extract_photo_url(get_value('Photo'))
            birthday = convert_birthday(get_value('Birthday'))
            start_date = convert_start_date(get_value('Start Date'))
            location = get_value('Location').strip() or None
            bio = get_value('Bio').strip() or None
            website = get_value('Website').strip() or None
            base_role = map_base_role(get_value('Access'))
            special_access = build_special_access(
                get_value('Curator'),
                get_value('Lead')
            )
            
            # Build UPDATE statement
            set_clauses = []
            
            # Always update full_name if it exists in CSV
            if name and name.strip():
                set_clauses.append(f"full_name = {escape_sql_string(name)}")
            if role:
                set_clauses.append(f"role = {escape_sql_string(role)}")
            if discipline:
                set_clauses.append(f"discipline = {escape_sql_string(discipline)}")
            if photo_url:
                set_clauses.append(f"avatar_url = {escape_sql_string(photo_url)}")
            if birthday:
                set_clauses.append(f"birthday = {escape_sql_string(birthday)}")
            if start_date:
                set_clauses.append(f"start_date = {escape_sql_string(start_date)}::DATE")
            if location:
                set_clauses.append(f"location = {escape_sql_string(location)}")
            if bio:
                set_clauses.append(f"bio = {escape_sql_string(bio)}")
            if website:
                set_clauses.append(f"website = {escape_sql_string(website)}")
            
            # Always update base_role and special_access
            set_clauses.append(f"base_role = {escape_sql_string(base_role)}")
            
            if special_access:
                access_array = "ARRAY['" + "','".join(special_access) + "']::TEXT[]"
                set_clauses.append(f"special_access = {access_array}")
            
            set_clauses.append("updated_at = TIMEZONE('utc', NOW())")
            
            if set_clauses:
                sql = f"""UPDATE public.profiles
SET {', '.join(set_clauses)}
WHERE LOWER(TRIM(email)) = LOWER(TRIM({escape_sql_string(email)}));"""
                updates.append(sql)
                not_found.append({
                    'name': name or 'Unknown',
                    'email': email,
                    'role': role or 'N/A',
                    'discipline': discipline or 'N/A'
                })
    
    return updates, not_found

def main():
    if len(sys.argv) < 2:
        print("Usage: python import-users-from-csv.py <path-to-csv-file>")
        print("Example: python import-users-from-csv.py '/Users/karenpiper/Downloads/Team-Grid view.csv'")
        sys.exit(1)
    
    csv_path = Path(sys.argv[1])
    
    if not csv_path.exists():
        print(f"Error: CSV file not found: {csv_path}")
        sys.exit(1)
    
    print(f"Parsing CSV file: {csv_path}")
    updates, not_found = generate_sql_updates(csv_path)
    
    # Generate SQL file
    output_path = csv_path.parent / 'import-users-updates.sql'
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("-- Import Users from CSV - Generated SQL Updates\n")
        f.write(f"-- Generated: {datetime.now().isoformat()}\n")
        f.write(f"-- Source: {csv_path.name}\n")
        f.write("-- \n")
        f.write("-- This script updates existing user profiles based on email matching\n")
        f.write("-- Users must already exist in auth.users for profiles to be updated\n")
        f.write("-- \n\n")
        
        f.write("BEGIN;\n\n")
        
        for update in updates:
            f.write(update + "\n\n")
        
        f.write("COMMIT;\n\n")
        
        # Summary query
        f.write("-- Summary: Count updated profiles\n")
        f.write("SELECT COUNT(*) as updated_profiles FROM public.profiles WHERE updated_at > NOW() - INTERVAL '1 minute';\n\n")
        
        # List users that need to be created
        if not_found:
            f.write("-- Users in CSV (these should exist in auth.users):\n")
            f.write("-- If any are missing, create them in auth.users first, then re-run this script\n")
            for user in not_found:
                f.write(f"-- {user['name']} ({user['email']}) - {user['role']} - {user['discipline']}\n")
    
    print(f"\n✅ Generated SQL file: {output_path}")
    print(f"   - {len(updates)} UPDATE statements generated")
    print(f"   - {len(not_found)} users found in CSV")
    print(f"\nNext steps:")
    print(f"1. Review the generated SQL file: {output_path}")
    print(f"2. Run it in Supabase SQL Editor")
    print(f"3. Verify the updates were successful")

if __name__ == '__main__':
    main()

