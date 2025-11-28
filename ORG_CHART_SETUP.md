# Org Chart Implementation Guide

## Overview

This guide explains how to implement a programmatic org chart using manager relationships in the profiles table.

## Database Setup

### Step 1: Add Manager Field

Run the SQL migration to add the `manager_id` field:

```sql
-- Run this in Supabase SQL Editor
-- File: supabase/add-manager-field.sql
```

This adds:
- `manager_id` (UUID) - References another profile (self-referential foreign key)
- `hierarchy_level` (INTEGER) - Optional depth level for performance
- Index on `manager_id` for faster queries

### Step 2: Set Manager Relationships

You can set managers in two ways:

**Option A: Via Supabase Dashboard**
1. Go to Table Editor > profiles
2. Edit a profile
3. Set `manager_id` to another profile's ID (or leave NULL for top-level)

**Option B: Via SQL**
```sql
-- Example: Set John's manager to Jane
UPDATE profiles 
SET manager_id = 'jane-profile-id-here'
WHERE id = 'john-profile-id-here';

-- Set hierarchy levels (optional, can be calculated)
UPDATE profiles 
SET hierarchy_level = 0 
WHERE manager_id IS NULL;

UPDATE profiles 
SET hierarchy_level = 1 
WHERE manager_id IN (SELECT id FROM profiles WHERE manager_id IS NULL);
```

## How It Works

### Data Structure

The org chart uses a **self-referential relationship**:
- Each profile can have one `manager_id` (or NULL for top-level)
- This creates a tree structure: Manager → Direct Reports → Their Reports, etc.

### Hierarchy Levels

The system determines hierarchy in three ways (in priority order):

1. **Database field** (`hierarchy_level`) - Explicitly set in database
2. **Manager relationships** - Calculated from tree depth (0 = top level, 1 = reports to top, etc.)
3. **Job title parsing** - Automatically inferred from role/title:
   - **Level 10**: CEO, Chief Executive
   - **Level 9**: President
   - **Level 8**: C-level (CFO, CTO, COO, Chief)
   - **Level 7**: EVP, SVP, Executive VP
   - **Level 6**: VP, Vice President, Executive Director
   - **Level 5**: Director, Senior Director
   - **Level 4**: Associate Director, Senior Manager
   - **Level 3**: Manager, Senior Engineer/Designer/Analyst, Lead, Principal
   - **Level 2**: Engineer, Designer, Developer, Analyst, Specialist, Assistant Manager
   - **Level 1**: Associate, Coordinator, Assistant, Intern
   - **Level 0**: Unknown/Other

The `getHierarchyLevelFromTitle()` function parses job titles to assign these levels automatically.

### Building the Tree

The `buildOrgChartTree()` function in `lib/org-chart.ts`:
1. Takes a flat array of profiles with `manager_id` fields
2. Builds a hierarchical tree structure
3. Returns root nodes (people with no manager)

### Rendering

The `OrgChartView` component:
- Renders the tree with expand/collapse functionality
- Groups by discipline for better organization
- Shows avatars, names, and roles
- Supports click to view profile details

## Integration

### Update Team Page

Replace the current org chart section in `app/team/page.tsx`:

```tsx
import { OrgChartView } from '@/components/org-chart-view'

// In your component, replace the org chart section:
{activeFilter === 'all' || activeFilter === 'org-chart') && (
  <Card className={...}>
    <div className="flex items-center gap-3 mb-4">
      <div className={...}>
        <Briefcase className="w-5 h-5 text-white" />
      </div>
      <h2 className={...}>Org Chart</h2>
    </div>
    
    <OrgChartView
      profiles={allProfiles}
      mode={mode}
      onProfileClick={handleProfileClick}
      getRoundedClass={getRoundedClass}
      getTextColor={() => mode === 'chill' ? '#4A1818' : '#FFFFFF'}
      greenColors={greenColors}
    />
  </Card>
)}
```

### Fetch Profiles with Manager Data

Make sure your `fetchAllProfiles` function includes `manager_id`:

```tsx
const fetchAllProfiles = async () => {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url, role, discipline, manager_id, hierarchy_level')
      .eq('is_active', true)
      .order('full_name', { ascending: true })
    
    if (!error && profiles) {
      setAllProfiles(profiles)
    }
  } catch (error) {
    console.error('Error fetching profiles:', error)
  }
}
```

## Example Org Structure

```
CEO (manager_id: NULL)
├── VP Engineering (manager_id: CEO)
│   ├── Engineering Manager (manager_id: VP Engineering)
│   │   ├── Senior Engineer (manager_id: Engineering Manager)
│   │   └── Engineer (manager_id: Engineering Manager)
│   └── Design Manager (manager_id: VP Engineering)
└── VP Marketing (manager_id: CEO)
    └── Marketing Manager (manager_id: VP Marketing)
```

## Advanced Features

### Auto-Calculate Hierarchy Levels from Titles

You can automatically set hierarchy levels based on job titles:

```sql
-- Update hierarchy_level based on role/title
UPDATE profiles
SET hierarchy_level = CASE
  -- C-level
  WHEN LOWER(role) LIKE '%ceo%' OR LOWER(role) LIKE '%chief executive%' THEN 10
  WHEN LOWER(role) LIKE '%president%' THEN 9
  WHEN LOWER(role) LIKE '%chief%' OR LOWER(role) LIKE '%cfo%' OR LOWER(role) LIKE '%cto%' OR LOWER(role) LIKE '%coo%' THEN 8
  
  -- VP level
  WHEN LOWER(role) LIKE '%executive vice president%' OR LOWER(role) LIKE '%evp%' THEN 7
  WHEN LOWER(role) LIKE '%senior vice president%' OR LOWER(role) LIKE '%svp%' THEN 7
  WHEN LOWER(role) LIKE '%vice president%' OR LOWER(role) LIKE '%vp %' OR LOWER(role) ~ '\bvp\b' THEN 6
  
  -- Directors
  WHEN LOWER(role) LIKE '%executive director%' THEN 6
  WHEN LOWER(role) LIKE '%senior director%' OR LOWER(role) LIKE '%sr director%' THEN 5
  WHEN LOWER(role) LIKE '%director%' AND LOWER(role) NOT LIKE '%associate%' THEN 5
  WHEN LOWER(role) LIKE '%associate director%' THEN 4
  
  -- Managers
  WHEN LOWER(role) LIKE '%senior manager%' OR LOWER(role) LIKE '%sr manager%' THEN 4
  WHEN LOWER(role) LIKE '%manager%' AND LOWER(role) NOT LIKE '%associate%' AND LOWER(role) NOT LIKE '%assistant%' THEN 3
  WHEN LOWER(role) LIKE '%assistant manager%' OR LOWER(role) LIKE '%associate manager%' THEN 2
  
  -- Senior ICs
  WHEN (LOWER(role) LIKE '%senior%' AND (LOWER(role) LIKE '%engineer%' OR LOWER(role) LIKE '%designer%' OR LOWER(role) LIKE '%developer%' OR LOWER(role) LIKE '%analyst%')) THEN 3
  WHEN LOWER(role) LIKE '%lead%' OR LOWER(role) LIKE '%principal%' THEN 3
  
  -- Mid-level ICs
  WHEN LOWER(role) LIKE '%engineer%' OR LOWER(role) LIKE '%designer%' OR LOWER(role) LIKE '%developer%' OR LOWER(role) LIKE '%analyst%' OR LOWER(role) LIKE '%specialist%' THEN 2
  
  -- Entry level
  WHEN LOWER(role) LIKE '%associate%' OR LOWER(role) LIKE '%coordinator%' OR LOWER(role) LIKE '%assistant%' OR LOWER(role) LIKE '%intern%' THEN 1
  
  ELSE 0
END
WHERE role IS NOT NULL;
```

### Calculate Hierarchy Levels from Manager Relationships

You can also create a function to automatically calculate and update hierarchy levels based on manager relationships:

```sql
CREATE OR REPLACE FUNCTION update_hierarchy_levels()
RETURNS void AS $$
DECLARE
  max_depth INTEGER := 10; -- Safety limit
  current_level INTEGER := 0;
BEGIN
  -- Reset all levels
  UPDATE profiles SET hierarchy_level = NULL;
  
  -- Set level 0 (top level)
  UPDATE profiles SET hierarchy_level = 0 WHERE manager_id IS NULL;
  
  -- Recursively set levels
  WHILE current_level < max_depth LOOP
    UPDATE profiles p
    SET hierarchy_level = current_level + 1
    WHERE p.manager_id IS NOT NULL
      AND p.hierarchy_level IS NULL
      AND EXISTS (
        SELECT 1 FROM profiles m
        WHERE m.id = p.manager_id
        AND m.hierarchy_level = current_level
      );
    
    EXIT WHEN NOT FOUND;
    current_level := current_level + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Run periodically or on manager_id updates
SELECT update_hierarchy_levels();
```

### Query Direct Reports

```sql
-- Get all direct reports for a manager
SELECT * FROM profiles 
WHERE manager_id = 'manager-profile-id-here';

-- Get entire team (all descendants)
WITH RECURSIVE team AS (
  SELECT id, full_name, manager_id, 0 as depth
  FROM profiles
  WHERE id = 'manager-profile-id-here'
  
  UNION ALL
  
  SELECT p.id, p.full_name, p.manager_id, t.depth + 1
  FROM profiles p
  INNER JOIN team t ON p.manager_id = t.id
)
SELECT * FROM team;
```

## Best Practices

1. **Set Top-Level First**: Start with people who have no manager (CEO, founders, etc.)
2. **Work Down**: Then set managers for their direct reports
3. **Validate**: Ensure no circular references (person A manages person B, who manages person A)
4. **Update Levels**: Periodically run the hierarchy level calculation function
5. **Handle Missing Managers**: If a manager_id references a deleted profile, it will be NULL (safe)

## Troubleshooting

**Q: Some people don't show up in the org chart**
- Check that their `is_active` is true
- Verify they're included in your profile query

**Q: Org chart shows everyone at the top level**
- Make sure `manager_id` fields are set correctly
- Check that manager_id values match actual profile IDs

**Q: Circular reference error**
- This shouldn't happen with the current implementation, but validate your data
- Run a query to check: `SELECT id, manager_id FROM profiles WHERE id = manager_id` (should return nothing)

