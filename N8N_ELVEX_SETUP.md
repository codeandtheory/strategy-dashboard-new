# Setting Up n8n or Elvex as OpenAI Proxy

This guide explains how to route OpenAI API calls through n8n or Elvex to avoid rate limits and manage API keys centrally.

## Overview

Instead of calling OpenAI directly from the Next.js app, you can configure it to call through n8n or Elvex workflows. This provides:
- Better rate limit management
- Centralized API key management
- Ability to use different API keys without code changes
- Better monitoring and logging

## Configuration

### Option 1: Use n8n/Elvex Proxy

Set the `OPENAI_PROXY_URL` environment variable to your n8n or Elvex workflow endpoint:

```bash
# In Vercel or .env.local
OPENAI_PROXY_URL=https://your-n8n-instance.com/webhook/openai-proxy
# OR
OPENAI_PROXY_URL=https://your-elvex-instance.com/api/openai
```

When `OPENAI_PROXY_URL` is set, the app will automatically route all OpenAI calls through the proxy instead of calling OpenAI directly.

### Option 2: Direct OpenAI (Default)

If `OPENAI_PROXY_URL` is not set, the app will call OpenAI directly using `OPENAI_API_KEY` (with fallback to `OPENAI_API_KEY_FALLBACK` if configured).

## n8n Workflow Setup

### Expected Request Format

Your n8n workflow should accept POST requests with this format:

**For Chat Completions:**
```json
{
  "type": "chat",
  "model": "gpt-4o-mini",
  "messages": [
    { "role": "system", "content": "You are a helpful assistant." },
    { "role": "user", "content": "Hello!" }
  ],
  "response_format": { "type": "json_object" },
  "temperature": 0.3,
  "max_tokens": 1000
}
```

**For Embeddings:**
```json
{
  "type": "embedding",
  "model": "text-embedding-3-small",
  "input": "Text to embed"
}
```

### Expected Response Format

Your n8n workflow should return responses in OpenAI's format:

**Chat Completion Response:**
```json
{
  "choices": [
    {
      "message": {
        "content": "{\"deck_title\": \"My Deck\", ...}"
      }
    }
  ]
}
```

**Embedding Response:**
```json
{
  "data": [
    {
      "embedding": [0.123, 0.456, ...]
    }
  ]
}
```

### n8n Workflow Steps

1. **Webhook Trigger** - Accept POST requests
2. **Switch Node** - Route based on `type` field ("chat" vs "embedding")
3. **HTTP Request Node** - Call OpenAI API with the appropriate endpoint:
   - Chat: `https://api.openai.com/v1/chat/completions`
   - Embeddings: `https://api.openai.com/v1/embeddings`
4. **Set Headers** - Include `Authorization: Bearer YOUR_OPENAI_API_KEY`
5. **Return Response** - Format and return the OpenAI response

### Example n8n Workflow Structure

```
Webhook (POST)
  ↓
Switch (on type)
  ├─ "chat" → HTTP Request (POST /v1/chat/completions)
  └─ "embedding" → HTTP Request (POST /v1/embeddings)
  ↓
Return Response
```

## Elvex Setup

If using Elvex, configure it similarly:
1. Create an API endpoint that accepts the same request format
2. Forward requests to OpenAI with your API key
3. Return responses in OpenAI's format
4. Set `OPENAI_PROXY_URL` to your Elvex endpoint

## Testing

1. Set up your n8n/Elvex workflow
2. Test it directly with a curl command:
   ```bash
   curl -X POST https://your-proxy-url \
     -H "Content-Type: application/json" \
     -d '{
       "type": "chat",
       "model": "gpt-4o-mini",
       "messages": [{"role": "user", "content": "Hello"}]
     }'
   ```
3. Set `OPENAI_PROXY_URL` in your environment variables
4. Try uploading a deck - it should use the proxy automatically

## Benefits

- **No Rate Limits**: n8n/Elvex can handle rate limiting and retries
- **Centralized Keys**: Manage API keys in one place
- **Monitoring**: Track all OpenAI usage through n8n/Elvex logs
- **Flexibility**: Switch API keys or add processing without code changes

## Fallback Behavior

If the proxy fails, the system will:
1. Log the error
2. Return the error to the user
3. Not automatically fall back to direct OpenAI (to avoid double charges)

To enable fallback, you can modify the proxy service to catch errors and retry with direct OpenAI.

