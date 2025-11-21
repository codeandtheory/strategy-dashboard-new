# Database Setup Instructions

## Common Database Errors and Fixes

### Error 1: Missing Birthday Column

If you're getting the error: **"Could not find the 'birthday' column of 'profiles' in the schema cache"**, you need to add the missing columns to your Supabase database.

### Error 2: Check Constraint Violation

If you're getting the error: **"new row for relation 'profiles' violates check constraint 'profiles_role_check'"**, you need to remove the check constraint from the `role` column.

### Steps to Fix:

1. **Go to your Supabase Dashboard**
   - Navigate to: https://app.supabase.com/
   - Select your project

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Migration Script**
   - Copy the contents of `supabase/add-profile-fields.sql`
   - Paste it into the SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)

4. **Verify the Columns Were Added**
   - The script will show you a query result confirming the columns exist
   - You should see `birthday`, `discipline`, and `role` columns listed

### Alternative: Run the Full Schema

If you prefer, you can run the complete profiles schema:

1. Open `supabase/profiles-schema.sql` in the SQL Editor
2. Run the entire script
3. This will create the table with all columns if it doesn't exist, or add missing columns

### What the Migration Does

The migration script (`supabase/add-profile-fields.sql`) will:
- Add `birthday` column (TEXT) - stores birthday as "MM/DD" format
- Add `discipline` column (TEXT) - stores department/team
- Add `role` column (TEXT) - stores job title
- Only adds columns if they don't already exist (safe to run multiple times)

### Fix Check Constraint Error

If you're getting a constraint violation error on the `role` column:

1. **Go to Supabase SQL Editor**
2. **Run the fix script**: `supabase/fix-role-constraint.sql`
3. This will remove the check constraint from the `role` column
4. The `role` column should be a free text field for job titles

### After Running the Migrations

1. Refresh your browser
2. Try saving your profile again
3. The errors should be resolved

## Troubleshooting

### If the migration fails:
- Check that you have the correct permissions in Supabase
- Make sure you're running it in the SQL Editor (not the Table Editor)
- Verify you're connected to the correct project

### If columns still don't appear:
- Wait a few seconds and refresh
- Check the Table Editor to see if columns were added
- Try running the migration again (it's safe to run multiple times)

