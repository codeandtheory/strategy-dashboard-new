# Solutions for OpenAI API Rate Limits

## Problem

The deck processing system makes many OpenAI API calls per deck:
- 1 call for deck metadata
- 1 call for topic segmentation  
- 30+ calls for slide labeling (one per slide)
- 30+ calls for embeddings (one per topic/slide)

This can easily hit OpenAI rate limits (typically 60 requests/minute for tier 1 accounts).

## Solutions Implemented

### 1. Sequential Processing with Delays ✅

**What changed:**
- Slide labeling now processes sequentially (not in parallel)
- Added 500ms delay between slide processing
- Added 300ms delay between embedding generation

**Impact:**
- Reduces burst of API calls
- Spreads requests over time
- Still processes efficiently but within rate limits

**Trade-off:**
- Slightly slower processing (adds ~15-30 seconds for a 30-slide deck)
- But prevents rate limit errors

### 2. n8n/Elvex Proxy (Recommended) ✅

**Already implemented!** Set `OPENAI_PROXY_URL` to route through n8n/Elvex:

```bash
OPENAI_PROXY_URL=https://your-n8n-instance.com/webhook/openai-proxy
```

**Benefits:**
- n8n/Elvex can handle rate limiting and retries
- Can use different API keys
- Better monitoring and logging
- No code changes needed

**Setup:**
See `N8N_ELVEX_SETUP.md` for detailed instructions.

### 3. Fallback API Key ✅

Already implemented! Set `OPENAI_API_KEY_FALLBACK`:

```bash
OPENAI_API_KEY=sk-primary...
OPENAI_API_KEY_FALLBACK=sk-secondary...
```

If the primary key hits limits, it automatically tries the fallback.

## Recommended Approach

**For immediate relief:**
1. The sequential processing with delays is already active
2. Set `OPENAI_API_KEY_FALLBACK` if you have a second API key

**For long-term solution:**
1. **Set up n8n/Elvex proxy** (best option)
   - Handles rate limiting automatically
   - Can queue requests
   - Better monitoring
   - Set `OPENAI_PROXY_URL` environment variable

2. **Or upgrade OpenAI tier**
   - Higher tier = higher rate limits
   - Contact OpenAI support

## Configuration Options

### Environment Variables

```bash
# Primary API key (required)
OPENAI_API_KEY=sk-...

# Fallback API key (optional, for quota errors)
OPENAI_API_KEY_FALLBACK=sk-...

# Proxy URL (optional, for n8n/Elvex)
OPENAI_PROXY_URL=https://your-proxy-url

# Model configuration
OPENAI_CHAT_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

### Rate Limiting Behavior

Current implementation:
- **Slide labeling**: Sequential with 500ms delays
- **Embeddings**: Sequential with 300ms delays
- **Deck/Topic analysis**: No delays (only 2 calls total)

This ensures:
- ~2 requests/second maximum
- Well within OpenAI's 60 requests/minute limit
- Processing time: ~30-60 seconds per deck (acceptable)

## Monitoring

Watch for these errors:
- `429 Too Many Requests` - Rate limit hit
- `401 Unauthorized` - API key issue
- `Quota exceeded` - Billing/quota limit

If you see these:
1. Check if `OPENAI_PROXY_URL` is set (should use proxy)
2. Check if `OPENAI_API_KEY_FALLBACK` is set (will auto-retry)
3. Check OpenAI dashboard for usage/quota
4. Consider upgrading OpenAI tier

## Alternative: Background Processing

If you want to process decks asynchronously:

1. Upload file to Drive → Return immediately
2. Queue processing job (e.g., using Supabase Edge Functions or Vercel Cron)
3. Process in background with rate limiting
4. Notify user when complete

This would require additional infrastructure but provides better UX.

