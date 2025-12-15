# Elvex Horoscope Generation Setup

This guide explains how horoscope generation works with Elvex API and what needs to be configured.

## Overview

The system uses Elvex API for both horoscope text and image generation. It makes direct API calls to Elvex's OpenAI-compatible endpoints - **no assistant configuration is required**.

## How It Works

The system makes **3 API calls to Elvex**:

### 1. Text Transformation (Chat Completions)
**Endpoint:** `POST /v1/chat/completions`

**What's sent:**
```json
{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "system",
      "content": "You are a witty horoscope transformer. You take traditional horoscopes and make them irreverent and fun in the style of Co-Star. You always return valid JSON."
    },
    {
      "role": "user",
      "content": "Transform this horoscope from Cafe Astrology into the irreverent, silly style of Co-Star. Make it witty, slightly sarcastic, and fun. Keep the core meaning but make it more casual and entertaining.\n\nOriginal horoscope for [STAR_SIGN]:\n[CAFE_ASTROLOGY_TEXT]\n\nReturn a JSON object with this exact structure:\n{\n  \"horoscope\": \"An irreverent, expanded version of the horoscope in Co-Star's style. Make it approximately 150 words. Keep it witty, casual, and entertaining while expanding on the themes from the original. Break it into multiple paragraphs for readability.\",\n  \"dos\": [\"Do thing 1\", \"Do thing 2\", \"Do thing 3\"],\n  \"donts\": [\"Don't thing 1\", \"Don't thing 2\", \"Don't thing 3\"]\n}\n\nMake the do's and don'ts silly, specific, and related to the horoscope content. They should be funny and slightly absurd but still relevant."
    }
  ],
  "response_format": { "type": "json_object" },
  "temperature": 0.9,
  "max_tokens": 600
}
```

**What's returned:**
```json
{
  "horoscope": "The transformed horoscope text...",
  "dos": ["Do thing 1", "Do thing 2", "Do thing 3"],
  "donts": ["Don't thing 1", "Don't thing 2", "Don't thing 3"]
}
```

### 2. Image Prompt Generation (Chat Completions)
**Endpoint:** `POST /v1/chat/completions`

**What's sent:**
```json
{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "user",
      "content": "You are an expert at creating detailed, vivid image prompts for AI image generation (like DALL-E 3).\n\nCreate a detailed image prompt based on this user profile:\n- Name: [USER_NAME]\n- Role: [USER_ROLE]\n- Hobbies: [USER_HOBBIES]\n- Likes fantasy: [Yes/No]\n- Likes sci-fi: [Yes/No]\n- Likes cute things: [Yes/No]\n- Likes minimal design: [Yes/No]\n- Hates clowns: [Yes/No]\n- Star Sign: [STAR_SIGN]\n- Day of week: [WEEKDAY]\n- Season: [SEASON]\n\nThe image should be a hero image for a horoscope dashboard. It should be:\n- Visually striking and engaging\n- Related to the user's interests and preferences\n- Appropriate for the star sign, day, and season\n- Professional but fun\n- Suitable for a dashboard background\n\nReturn ONLY the image prompt text, nothing else. Make it detailed and specific (approximately 100-150 words). Include style, mood, colors, composition, and any relevant details."
    }
  ],
  "temperature": 0.8,
  "max_tokens": 300
}
```

**What's returned:**
```
A detailed image prompt text (100-150 words)
```

### 3. Image Generation (Images API)
**Endpoint:** `POST /v1/images/generations`

**What's sent:**
```json
{
  "model": "dall-e-3",
  "prompt": "[GENERATED_IMAGE_PROMPT]",
  "size": "1024x1024",
  "quality": "standard",
  "n": 1
}
```

**What's returned:**
```json
{
  "data": [
    {
      "url": "https://..."
    }
  ]
}
```

## Setup Required

### 1. Elvex API Key
You already have this set up for deck talk! The same `ELVEX_API_KEY` is used.

**Environment Variable:**
```bash
ELVEX_API_KEY=your-elvex-api-key
```

### 2. Elvex Image Generation Provider
Configure image generation in Elvex dashboard:

1. Go to **Settings > Apps** in Elvex
2. Under **Image generation provider**, select your preferred provider (e.g., DALL-E 3)
3. Click **Save**

**Note:** This is a global setting in your Elvex account, not per-assistant.

### 3. Optional: Custom Base URL
If you're using a custom Elvex instance:

```bash
ELVEX_BASE_URL=https://api.elvex.ai  # Optional, defaults to this
```

## No Assistant Configuration Needed

Unlike deck processing (which uses `/v1/assistants/{id}/process`), horoscope generation uses:
- `/v1/chat/completions` - Direct OpenAI-compatible chat API
- `/v1/images/generations` - Direct OpenAI-compatible images API

These are **direct API calls** that don't require creating or configuring an assistant in Elvex. The prompts are built dynamically in the code based on user profile data.

## What Gets Sent (Summary)

**Input Data:**
- Cafe Astrology horoscope text (fetched from Cafe Astrology website)
- User star sign
- User profile (name, role, hobbies, preferences)
- Weekday and season

**API Calls Made:**
1. **Text transformation** → Converts Cafe Astrology text to Co-Star style with dos/donts
2. **Image prompt generation** → Creates detailed image prompt from user profile
3. **Image generation** → Generates image from the prompt

**Output:**
- Transformed horoscope text
- Array of 3 "do's"
- Array of 3 "don'ts"
- Generated image URL

## Testing

1. Make sure `ELVEX_API_KEY` is set
2. Configure image generation provider in Elvex dashboard
3. Visit your dashboard app
4. Check server logs for:
   - `🚀 Generating horoscope text and image via Elvex API...`
   - `🔄 Transforming horoscope to Co-Star style using Elvex API...`
   - `🔄 Generating image prompt using Elvex API...`
   - `🖼️ Generating image using Elvex API...`
   - `✅ Elvex API generation completed in Xms`

## Troubleshooting

### Error: "ELVEX_API_KEY is not set"
- Make sure `ELVEX_API_KEY` is set in environment variables
- Restart your Vercel deployment after adding env vars

### Error: "Elvex image generation failed"
- Verify image generation provider is configured in Elvex (Settings > Apps)
- Check that your Elvex account has image generation enabled
- Verify the API key has proper permissions

### Error: "Invalid response format from Elvex"
- Check server logs for the actual response
- Verify Elvex is returning JSON format for text transformation
- The response should have `horoscope`, `dos`, and `donts` fields

## Differences from Deck Talk

| Feature | Deck Talk | Horoscope Generation |
|---------|-----------|---------------------|
| API Endpoint | `/v0/apps/{id}/versions/{version}/text/generate` | `/v1/chat/completions` |
| Requires Assistant | ✅ Yes | ❌ No |
| Requires Assistant ID | ✅ Yes | ❌ No |
| Requires Version | ✅ Yes | ❌ No |
| Uses Same API Key | ✅ Yes | ✅ Yes |

**Key Point:** Horoscope generation uses the **OpenAI-compatible API** directly, while deck talk uses the **Elvex Assistant API**. They're different endpoints but use the same API key.
