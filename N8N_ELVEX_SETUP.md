# Setting Up Elvex as OpenAI Proxy

This guide explains how to route OpenAI API calls through Elvex to avoid rate limits and manage API keys centrally.

## Overview

Instead of calling OpenAI directly from the Next.js app, you can configure it to call through Elvex. This provides:
- Better rate limit management
- Centralized API key management
- Ability to use different API keys without code changes
- Better monitoring and logging
- **Simpler than n8n** - No workflow setup needed, just a proxy endpoint

## Configuration

### Use Elvex Proxy (Recommended)

Set the `OPENAI_PROXY_URL` environment variable to your Elvex endpoint:

```bash
# In Vercel or .env.local
# For chat completions:
OPENAI_PROXY_URL=https://api.elvex.ai/v1/chat/completions
# OR your custom Elvex endpoint
OPENAI_PROXY_URL=https://your-elvex-instance.com/v1/chat/completions
```

**Note:** Elvex typically uses OpenAI's native API format, so the endpoint should match OpenAI's structure:
- Chat: `/v1/chat/completions`
- Embeddings: `/v1/embeddings` (handled automatically)

When `OPENAI_PROXY_URL` is set, the app will automatically route all OpenAI calls through Elvex instead of calling OpenAI directly.

### Option 2: Direct OpenAI (Default)

If `OPENAI_PROXY_URL` is not set, the app will call OpenAI directly using `OPENAI_API_KEY` (with fallback to `OPENAI_API_KEY_FALLBACK` if configured).

## Elvex Setup

### Step 1: Get Your Elvex Endpoint

Elvex provides proxy endpoints that match OpenAI's API format. You'll need:

1. **Chat Completions Endpoint**: `https://api.elvex.ai/v1/chat/completions` (or your custom Elvex URL)
2. **Embeddings Endpoint**: `https://api.elvex.ai/v1/embeddings` (automatically derived from chat endpoint)

### Step 2: Configure Elvex

1. Log into your Elvex account
2. Add your OpenAI API key to Elvex (Elvex will use this to forward requests)
3. Get your Elvex API endpoint URL
4. Set it as `OPENAI_PROXY_URL` in your environment variables

### Step 3: Request Format

Elvex accepts OpenAI's native format directly. The app automatically sends:

**For Chat Completions:**
```json
{
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
  "model": "text-embedding-3-small",
  "input": "Text to embed"
}
```

### Step 4: Response Format

Elvex returns responses in OpenAI's native format:

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

## Alternative: n8n Setup (If Needed)

If you prefer n8n for more complex workflows, the system also supports n8n. The request format includes a `type` field to distinguish between chat and embedding requests. See the code in `lib/decks/services/openaiProxyService.ts` for details.

## Testing

1. Set up your Elvex endpoint
2. Test it directly with a curl command:
   ```bash
   # Test chat completions
   curl -X POST https://api.elvex.ai/v1/chat/completions \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ELVEX_API_KEY" \
     -d '{
       "model": "gpt-4o-mini",
       "messages": [{"role": "user", "content": "Hello"}]
     }'
   
   # Test embeddings
   curl -X POST https://api.elvex.ai/v1/embeddings \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ELVEX_API_KEY" \
     -d '{
       "model": "text-embedding-3-small",
       "input": "Test text"
     }'
   ```
3. Set `OPENAI_PROXY_URL` in your environment variables (Vercel dashboard or `.env.local`)
4. Try uploading a deck - it should use Elvex automatically

## Benefits

- **No Rate Limits**: Elvex handles rate limiting and retries automatically
- **Centralized Keys**: Manage API keys in Elvex dashboard
- **Monitoring**: Track all OpenAI usage through Elvex logs
- **Flexibility**: Switch API keys or add processing without code changes
- **Simple**: No workflow setup needed - just a proxy endpoint

## Fallback Behavior

If the proxy fails, the system will:
1. Log the error
2. Return the error to the user
3. Not automatically fall back to direct OpenAI (to avoid double charges)

To enable fallback, you can modify the proxy service to catch errors and retry with direct OpenAI.

