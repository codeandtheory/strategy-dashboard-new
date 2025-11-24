# Building Prompt from Slots in n8n

This guide shows how to add a node to build the image prompt from slots in n8n instead of sending a pre-built prompt.

## New Node: Build Image Prompt from Slots

Add this node **after** "Validate Image Prompt" and **before** "Log Prompt Before OpenAI".

### Node Configuration

**Node Type**: Code

**Node Name**: "Build Image Prompt from Slots"

**Code**:
```javascript
// Build image prompt from slots by querying Supabase for catalog labels
const webhookData = $input.item.json;

// Extract slots and user profile data
const slots = webhookData.slots || {};
const userProfile = {
  name: webhookData.userName || webhookData.name || 'User',
  role: webhookData.userRole || webhookData.role || null,
  hobbies: webhookData.userHobbies || webhookData.hobbies || null,
  starSign: webhookData.starSign || null
};

// Collect all slot IDs that need to be looked up
const slotIds = [
  slots.style_medium_id,
  slots.style_reference_id,
  slots.subject_role_id,
  slots.subject_twist_id,
  slots.setting_place_id,
  slots.setting_time_id,
  slots.activity_id,
  slots.mood_vibe_id,
  slots.color_palette_id,
  slots.camera_frame_id,
  slots.lighting_style_id,
  ...(slots.constraints_ids || [])
].filter(Boolean);

console.log('🔍 Building prompt from slots...');
console.log('Slot IDs to lookup:', slotIds);
console.log('User profile:', userProfile);

// Query Supabase to get catalog items
// Note: You'll need to configure Supabase credentials in n8n
// Or use HTTP Request node to call your Next.js API endpoint
const supabaseUrl = $env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = $env.SUPABASE_SERVICE_ROLE_KEY;

// Use HTTP Request to query Supabase
// Alternative: Use Supabase node if available in n8n
const catalogResponse = await fetch(`${supabaseUrl}/rest/v1/prompt_slot_catalogs?select=id,slot_type,label,value&id=in.(${slotIds.join(',')})`, {
  method: 'GET',
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json'
  }
});

if (!catalogResponse.ok) {
  throw new Error(`Failed to fetch catalog items: ${catalogResponse.statusText}`);
}

const catalogItems = await catalogResponse.json();

// Create a map of ID to catalog item
const catalogMap = new Map(catalogItems.map(item => [item.id, item]));

// Get catalog items for each slot
const getCatalogItem = (slotId) => catalogMap.get(slotId) || null;

const styleMedium = getCatalogItem(slots.style_medium_id);
const styleReference = getCatalogItem(slots.style_reference_id);
const subjectRole = getCatalogItem(slots.subject_role_id);
const subjectTwist = slots.subject_twist_id ? getCatalogItem(slots.subject_twist_id) : null;
const settingPlace = getCatalogItem(slots.setting_place_id);
const settingTime = getCatalogItem(slots.setting_time_id);
const activity = getCatalogItem(slots.activity_id);
const moodVibe = getCatalogItem(slots.mood_vibe_id);
const colorPalette = getCatalogItem(slots.color_palette_id);
const cameraFrame = getCatalogItem(slots.camera_frame_id);
const lightingStyle = getCatalogItem(slots.lighting_style_id);
const constraints = (slots.constraints_ids || []).map(id => getCatalogItem(id)).filter(Boolean);

// Build subject clause - include star sign
let subjectClause = userProfile.name;
if (userProfile.starSign) {
  subjectClause += ` (${userProfile.starSign})`;
}
if (userProfile.role) {
  subjectClause += `, a ${userProfile.role.toLowerCase()}`;
}
if (userProfile.hobbies && userProfile.hobbies.length > 0) {
  subjectClause += ` who loves ${userProfile.hobbies[0].toLowerCase()}`;
}
if (subjectRole) {
  subjectClause += `, as ${subjectRole.label.toLowerCase()}`;
}
// Handle subject_twist
if (subjectTwist) {
  const twistLabel = subjectTwist.label.toLowerCase();
  if (twistLabel.includes('living') || twistLabel.includes('version') || twistLabel.includes('form')) {
    if (subjectRole) {
      subjectClause = subjectClause.replace(
        `, as ${subjectRole.label.toLowerCase()}`,
        `, as ${twistLabel} ${subjectRole.label.toLowerCase()}`
      );
    } else {
      subjectClause += `, as ${twistLabel}`;
    }
  } else {
    subjectClause += ` ${twistLabel}`;
  }
}

// Build style text
const styleText = styleReference
  ? `${styleReference.label}${styleMedium ? `. ${styleMedium.label}` : ''}`
  : styleMedium?.label || '';

// Build activity text
const activityText = activity ? ` ${activity.label.toLowerCase()}` : '';

// Build setting text
const settingText = settingPlace?.label.toLowerCase() || 'a setting';
let timeText = settingTime?.label.toLowerCase() || 'a time';

// Fix grammar: "at stormy afternoon" -> "during a stormy afternoon"
if (timeText.startsWith('stormy') || timeText.startsWith('sunny') || timeText.startsWith('rainy')) {
  timeText = `during a ${timeText}`;
} else if (timeText.includes('afternoon') || timeText.includes('morning') || timeText.includes('evening') || timeText.includes('night')) {
  if (!timeText.startsWith('during') && !timeText.startsWith('at') && !timeText.startsWith('on')) {
    timeText = `during ${timeText}`;
  }
} else if (!timeText.startsWith('at') && !timeText.startsWith('during') && !timeText.startsWith('on')) {
  timeText = `at ${timeText}`;
}

// Build mood, color, lighting
const moodText = moodVibe?.label.toLowerCase() || 'moody';
const colorText = colorPalette?.label.toLowerCase() || 'colorful';
const lightingText = lightingStyle?.label.toLowerCase() || 'natural lighting';

// Build constraints text
const constraintsText = constraints.map(c => c.label.toLowerCase()).join(', ');

// Build prompt following the original working format
const imagePrompt = `${styleText}. ${cameraFrame?.label || 'Portrait'} of ${subjectClause}${activityText}. They are in ${settingText} ${timeText}. ${moodText} mood, ${colorText} palette, ${lightingText}. ${constraintsText}.`.trim();

console.log('✅ Built image prompt from slots:');
console.log('Prompt:', imagePrompt);

// Return with built prompt
return [{
  json: {
    ...webhookData,
    imagePrompt: imagePrompt
  }
}];
```

**Note**: This requires Supabase credentials. Alternatively, you can use an HTTP Request node to call a Next.js API endpoint that returns the catalog items.

## Alternative: Use HTTP Request to Next.js API

If you prefer not to query Supabase directly from n8n, create a Next.js API endpoint that builds the prompt:

**Next.js API Route**: `/api/internal/horoscope/build-prompt`

```typescript
export async function POST(request: NextRequest) {
  const { slots, userProfile } = await request.json();
  
  // Use existing buildHoroscopePrompt logic
  const { prompt } = await buildHoroscopePrompt(...);
  
  return NextResponse.json({ prompt });
}
```

Then in n8n, use an HTTP Request node instead of the Code node above.

