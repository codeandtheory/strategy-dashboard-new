# Announcements & News Setup Guide

## Database Migrations Required

### 1. Add `headline_only` to News Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Add headline_only column to news table
ALTER TABLE public.news 
ADD COLUMN IF NOT EXISTS headline_only BOOLEAN DEFAULT false;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_news_headline_only ON public.news(headline_only);
```

### 2. Create Announcements Table

Run the SQL from `supabase/create-announcements-table.sql` in your Supabase SQL Editor.

### 3. Add Text Format Column

Run this SQL in your Supabase SQL Editor:

```sql
-- Add text_format column to announcements table
ALTER TABLE public.announcements 
ADD COLUMN IF NOT EXISTS text_format TEXT DEFAULT 'days_until';

-- Update existing countdown announcements to use default format
UPDATE public.announcements 
SET text_format = 'days_until' 
WHERE mode = 'countdown' AND text_format IS NULL;
```

## How to Use Announcements

### Text Mode (Scrolling Headline)

1. Go to `/admin/announcements`
2. Click "Add New"
3. Select Mode: **"Text (Scrolling headline)"**
4. Enter:
   - **Headline**: Your announcement text (e.g., "New office hours starting Monday!")
   - **Start Date**: When to start showing
   - **End Date** (optional): When to stop showing
   - **Active**: Check to enable
5. Click "Add"

The announcement will appear as a scrolling white text banner above the hero section.

### Countdown Mode (Event Countdown)

1. Go to `/admin/announcements`
2. Click "Add New"
3. Select Mode: **"Countdown (Event countdown)"**
4. Enter:
   - **Headline**: Brief description (optional, shown in scrolling text)
   - **Event Name**: Name of the event (e.g., "Q4 Planning Session", "Product Launch")
   - **Target Date & Time**: The exact date and time of the event
   - **Text Format**: Choose how the countdown displays:
     - **"X days until [Event]"** - Example: "5 days until Team Meeting"
     - **"[Event] happens in X days"** - Example: "Product Launch happens in 10 days"
   - **Start Date**: When to start showing the countdown
   - **End Date** (optional): When to stop showing (usually set to event date)
   - **Active**: Check to enable
5. Click "Add"

The countdown will display **only days** (not hours/minutes/seconds) in the format you selected and update daily.

### Example Countdown Setup

- **Headline**: "Upcoming Event"
- **Event Name**: "Team All-Hands Meeting"
- **Target Date & Time**: `2024-12-20 14:00` (December 20, 2024 at 2:00 PM)
- **Text Format**: "X days until [Event]"
- **Start Date**: `2024-12-01` (Start showing on December 1st)
- **End Date**: `2024-12-20` (Stop showing on event day)
- **Active**: ✓

Result: Banner shows "19 days until Team All-Hands Meeting" and updates daily.

**Alternative Format Example:**
- **Text Format**: "[Event] happens in X days"
- Result: Banner shows "Team All-Hands Meeting happens in 19 days"

## News vs Announcements

- **Announcements**: Scrolling banner above hero, for time-sensitive messages or countdowns
- **News**: Full story cards, only shows if there's news from the past 7 days

## Troubleshooting

### Error: "column news.headline_only does not exist"
- Run the SQL migration from `supabase/add-headline-only-to-news.sql` in Supabase SQL Editor

### Countdown not showing
- Check that "Active" is checked
- Verify Start Date is today or in the past
- Verify End Date is in the future (or empty)
- Check that Target Date is in the future

### Announcement not appearing
- Ensure "Active" checkbox is checked
- Check that Start Date ≤ Today
- Check that End Date is empty or ≥ Today
- Only the most recent active announcement is shown

