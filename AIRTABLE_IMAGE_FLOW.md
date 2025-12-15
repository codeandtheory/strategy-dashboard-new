# Airtable Image Generation Flow

## How It Works End-to-End

### 1. User Visits the Site
- User navigates to the horoscope page
- Frontend makes a GET request to `/api/horoscope`

### 2. API Route Processes Request
**File:** `app/api/horoscope/route.ts`

The route:
1. Authenticates the user
2. Fetches user profile (including timezone)
3. Checks for cached horoscope
4. If no cache, generates new horoscope:
   - Fetches base horoscope text from Cafe Astrology
   - Builds image prompt using slot-based logic (`buildHoroscopePrompt()`)
   - Calls `generateHoroscopeViaElvex()` with the image prompt

### 3. Elvex Service Generates Text & Triggers Image
**File:** `lib/elvex-horoscope-service.ts`

The `generateHoroscopeViaElvex()` function:
1. **Generates horoscope text** using Elvex Assistant API
2. **Calls `generateImageViaAirtable(imagePrompt)`** to generate the image

### 4. Airtable Image Generation (Polling Pattern)

**File:** `lib/elvex-horoscope-service.ts` → `generateImageViaAirtable()`

#### Step 1: Create Record in Airtable
```typescript
// Creates a new record in Airtable with:
{
  fields: {
    'Image Prompt': prompt,        // The slot-based prompt
    'Status': 'Pending',           // Initial status
    'Created At': timestamp        // When request was created
  }
}
```

**API Call:**
- `POST https://api.airtable.com/v0/{baseId}/{tableName}`
- Uses `AIRTABLE_API_KEY` for authentication
- Returns a `recordId`

#### Step 2: Airtable Automation Triggers
**This happens in Airtable (not in code):**

1. **Trigger:** New record created with `Status = "Pending"`
2. **Action:** "Generate image with AI"
   - Uses the `Image Prompt` field
   - Generates image (DALL-E 3)
   - Saves image to `Image` attachment field
3. **Action:** Update record
   - Sets `Status` to "Completed"
   - Optionally saves `Image URL` if needed

#### Step 3: Polling for Result
The code polls Airtable every 2 seconds (up to 60 attempts = 2 minutes):

```typescript
// Polls: GET https://api.airtable.com/v0/{baseId}/{tableName}/{recordId}
// Checks if Status === "Completed"
// Extracts image URL from attachment field
```

**Attachment Field Format:**
```json
{
  "Image": [
    {
      "url": "https://dl.airtable.com/.attachments/...",
      "filename": "image.png",
      "size": 12345
    }
  ]
}
```

#### Step 4: Return Image URL
Once `Status === "Completed"` and image is found:
- Extracts `attachmentField[0].url`
- Returns the URL to `generateHoroscopeViaElvex()`
- Which returns it to the route
- Route saves to database and returns to frontend

### 5. Response to Frontend
The route returns:
```json
{
  "horoscope_text": "...",
  "horoscope_dos": [...],
  "horoscope_donts": [...],
  "image_url": "https://dl.airtable.com/...",
  "character_name": null
}
```

Frontend displays the horoscope text and image.

## Key Points

1. **Synchronous but Polling:** The API call waits for Airtable to generate the image (up to 2 minutes)
2. **No Webhooks:** Uses polling instead of webhooks (simpler, no callback endpoint needed)
3. **Separate Operations:** Text generation (Elvex) and image generation (Airtable) are independent
4. **Image is Optional:** If image generation fails, horoscope text still returns

## Airtable Setup Required

### Table Structure
- **Table Name:** "Image Generation" (or set `AIRTABLE_IMAGE_TABLE_NAME`)
- **Fields:**
  - `Image Prompt` (Long text) - The prompt to generate
  - `Status` (Single select) - "Pending", "Completed", "Failed"
  - `Image` (Attachment) - Where Airtable saves the generated image
  - `Created At` (Date) - When request was created
  - `Error Message` (Long text, optional) - Error details if failed

### Automation Setup
1. **Trigger:** When record created (where `Status = "Pending"`)
2. **Action:** "Generate image with AI"
   - Prompt field: `{{Image Prompt}}`
   - Output field: `Image` (attachment field)
   - Model: DALL-E 3
   - Size: 1024x1024
3. **Action:** Update record
   - Set `Status` to "Completed"

## Environment Variables

```bash
AIRTABLE_API_KEY=your-api-key
AIRTABLE_IMAGE_BASE_ID=your-base-id
AIRTABLE_IMAGE_TABLE_NAME=Image Generation  # Optional, defaults to this
```

## Timezone Handling

The `Created At` field should use the user's local timezone, not UTC. Currently it uses `new Date().toISOString()` which is UTC. This needs to be fixed to use the user's timezone from their profile.


