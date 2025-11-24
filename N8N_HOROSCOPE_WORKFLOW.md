# n8n Horoscope Generation Workflow

This document describes the n8n workflow structure for generating horoscope text and images. All OpenAI API calls for horoscope generation happen in n8n, not in the Next.js application.

## Workflow Overview

1. **Webhook Trigger** - Receives horoscope generation request from Next.js
2. **Parallel Execution**:
   - **OpenAI Text Transformation Node** - Transforms Cafe Astrology text to Co-Star style
   - **OpenAI Image Generation Node** - Generates horoscope image using DALL-E 3 (runs in parallel)
3. **Parse Text Result Node** - Extracts and validates JSON response from text transformation
4. **Merge Results Node** - Combines results from both parallel paths
5. **Combine Results Node** - Merges text and image data into final format
6. **Webhook Response** - Returns combined results to Next.js

## Node-by-Node Configuration

### 1. Webhook Trigger

**Node Type**: Webhook

**Settings**:
- HTTP Method: POST
- Path: `/webhook-test/horoscope-generation`
- Response Mode: Respond to Webhook

**Expected Input**:
```json
{
  "cafeAstrologyText": "Original horoscope text from Cafe Astrology...",
  "starSign": "Aries",
  "imagePrompt": "Generated image prompt string...",
  "slots": { ... },
  "reasoning": { ... },
  "userId": "user-uuid",
  "date": "2024-01-15"
}
```

**Output**: Passes through to next node

---

### 2. OpenAI Text Transformation

**Node Type**: OpenAI (Chat Model)

**Settings**:
- Model: `gpt-4o-mini`
- Temperature: 0.9
- Response Format: JSON Object
- Max Tokens: 600

**System Prompt**:
```
You are a witty horoscope transformer. You take traditional horoscopes and make them irreverent and fun in the style of Co-Star. You always return valid JSON.
```

**User Prompt**:
```
Transform this horoscope from Cafe Astrology into the irreverent, silly style of Co-Star. Make it witty, slightly sarcastic, and fun. Keep the core meaning but make it more casual and entertaining.

Original horoscope for {{starSign}}:
{{cafeAstrologyText}}

Return a JSON object with this exact structure:
{
  "horoscope": "An irreverent, expanded version of the horoscope in Co-Star's style. Make it approximately 150 words. Keep it witty, casual, and entertaining while expanding on the themes from the original. Break it into multiple paragraphs for readability.",
  "dos": ["Do thing 1", "Do thing 2", "Do thing 3"],
  "donts": ["Don't thing 1", "Don't thing 2", "Don't thing 3"]
}

Make the do's and don'ts silly, specific, and related to the horoscope content. They should be funny and slightly absurd but still relevant.
```

**Expected Response**:
```json
{
  "choices": [{
    "message": {
      "content": "{\"horoscope\": \"...\", \"dos\": [...], \"donts\": [...]}"
    }
  }]
}
```

**Error Handling**: On error, go to Webhook Response with error

---

### 3. Parse Text Result

**Node Type**: Code

**Purpose**: Extract and validate JSON from OpenAI response

**Code**:
```javascript
// Parse OpenAI response - extract JSON from choices[0].message.content
const openAiOutput = $input.item.json;
let textResult = openAiOutput;

// Extract content from OpenAI response structure
if (openAiOutput.choices && openAiOutput.choices[0] && openAiOutput.choices[0].message) {
  textResult = openAiOutput.choices[0].message.content;
}

// Parse JSON if it's a string
let parsedText = textResult;
if (typeof textResult === 'string') {
  try {
    parsedText = JSON.parse(textResult);
  } catch (e) {
    // If parsing fails, try to extract JSON from text
    const jsonMatch = textResult.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsedText = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Could not parse text transformation response as JSON');
    }
  }
}

// Validate structure
if (!parsedText.horoscope || !Array.isArray(parsedText.dos) || !Array.isArray(parsedText.donts)) {
  throw new Error('Invalid response format from OpenAI text transformation');
}

// Store text result and pass through original webhook data for image generation
return {
  json: {
    horoscope: parsedText.horoscope,
    dos: parsedText.dos,
    donts: parsedText.donts,
    imagePrompt: $('Webhook').item.json.imagePrompt,
    slots: $('Webhook').item.json.slots,
    reasoning: $('Webhook').item.json.reasoning
  }
};
```

**Output**: Validated text result with image prompt data

---

### 4. Merge Results

**Node Type**: Merge

**Settings**:
- Mode: Combine
- Combine By: Combine All

**Purpose**: Waits for both parallel paths (text and image) to complete, then combines their outputs

**Output**: Passes both text and image results to Combine Results node

---

### 5. OpenAI Image Generation (Parallel Path)

**Node Type**: OpenAI (Image Generation)

**Settings**:
- Model: `dall-e-3`
- Size: `1024x1024`
- Quality: `standard`
- N: 1

**Prompt**: `{{$json['imagePrompt']}}`

**Expected Response**:
```json
{
  "data": [{
    "url": "https://oaidalleapiprodscus.blob.core.windows.net/..."
  }]
}
```

**Error Handling**: On error, go to Webhook Response with error

---

### 6. Combine Results

**Node Type**: Code

**Purpose**: Merge text and image results into final response

**Code**:
```javascript
// Extract image URL from OpenAI response
const imageOutput = $input.item.json;
let imageUrl = null;

// OpenAI image generation returns data array
if (imageOutput.data && imageOutput.data[0] && imageOutput.data[0].url) {
  imageUrl = imageOutput.data[0].url;
} else if (imageOutput.url) {
  imageUrl = imageOutput.url;
}

if (!imageUrl) {
  throw new Error('Failed to extract image URL from OpenAI response');
}

// Get text result from previous node
const textResult = $('Parse Text Result').item.json;

// Combine all results
return {
  json: {
    horoscope: textResult.horoscope,
    dos: textResult.dos,
    donts: textResult.donts,
    imageUrl: imageUrl,
    prompt: textResult.imagePrompt,
    slots: textResult.slots,
    reasoning: textResult.reasoning
  }
};
```

**Output**: Combined result with text and image

---

### 7. Webhook Response

**Node Type**: Respond to Webhook

**Settings**:
- Respond With: JSON
- Response Body: `{{$json}}`

**Expected Response to Next.js**:
```json
{
  "horoscope": "...",
  "dos": ["...", "...", "..."],
  "donts": ["...", "...", "..."],
  "imageUrl": "https://...",
  "prompt": "...",
  "slots": { ... },
  "reasoning": { ... }
}
```

---

## Environment Variables in n8n

Set these in your n8n environment:

- `OPENAI_API_KEY`: Your OpenAI API key (enterprise key for higher rate limits)

## Workflow Execution Flow

```
Webhook Trigger
    ↓
    ├─→ OpenAI Text Transformation ─→ Parse Text Result ─┐
    │                                                      │
    └─→ OpenAI Image Generation ─────────────────────────┼─→ Merge Results ─→ Combine Results ─→ Webhook Response
                                                          │
    (on error from either path → Webhook Response with error)
```

**Key Points:**
- Text and Image generation run **in parallel** (simultaneously)
- Both paths must complete before Merge Results node processes
- Total execution time is determined by the **longer** of the two operations (not the sum)

## Synchronous Execution

This workflow is designed for **synchronous execution**:
- Next.js calls the webhook and waits for the response
- n8n processes both text and image generation **in parallel** (simultaneously)
- Total execution time: ~15-30 seconds (faster than sequential)
  - Text transformation: ~5-10 seconds
  - Image generation: ~15-30 seconds
  - Total: ~15-30 seconds (max of both, not sum)
- Next.js timeout: 60 seconds (configured in service)

## Error Handling

- **Text Transformation Errors**: Returned to Next.js with error details
- **Image Generation Errors**: Returned to Next.js with error details
- **Timeout Errors**: Handled by Next.js service (60s timeout)
- **Retry Logic**: Handled in Next.js service (3 retries with exponential backoff)

## Testing the Workflow

1. **Test Webhook**: Use Postman or curl to send test data to webhook URL
2. **Test Text Transformation**: Verify OpenAI API key works and model is accessible
3. **Test Image Generation**: Verify DALL-E 3 access and image generation works
4. **Test End-to-End**: Call from Next.js API route and verify complete flow

## Integration with Next.js

The Next.js application:
1. Builds the image prompt using `buildHoroscopePrompt()` (kept in Next.js)
2. Fetches Cafe Astrology horoscope text
3. Calls n8n webhook with all required data
4. Waits for synchronous response (up to 60 seconds)
5. Downloads image from OpenAI and uploads to Supabase storage
6. Saves all results to database
7. Updates user avatar state

## Performance Considerations

- **Parallel Processing**: Text and image are generated **in parallel** for optimal performance
- **Execution Time**: Total time is the maximum of both operations (~15-30s), not the sum
- **Timeout**: 60-second timeout in Next.js to handle long-running requests
- **Retry Logic**: 3 retries with exponential backoff for transient failures
- **Rate Limiting**: n8n handles OpenAI rate limiting automatically
- **Error Handling**: If either path fails, the workflow returns an error immediately

