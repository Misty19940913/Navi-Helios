---
name: gif-search
description: "Search/download GIFs from Tenor via curl + jq."
trigger: "User asks for a GIF, reaction image, or says things like 'search GIF', 'find a GIF for X', 'send me a funny GIF', or 'tenor' — explicit Tenor API calls also trigger this skill."
version: 1.1.0
author: Hermes Agent
license: MIT
prerequisites:
  env_vars: [TENOR_API_KEY]
  commands: [curl, jq]
required_primitives:
  - terminal
  - http
metadata:
  hermes:
    tags: [GIF, Media, Search, Tenor, API]
---

# GIF Search (Tenor API)

Search and download GIFs directly via the Tenor API using curl. No extra tools needed.

## When to use

Useful for finding reaction GIFs, creating visual content, and sending GIFs in chat.

## Setup

Set your Tenor API key in your environment (add to `~/.hermes/.env`):

```bash
TENOR_API_KEY=your_key_here
```

Get a free API key at https://developers.google.com/tenor/guides/quickstart — the Google Cloud Console Tenor API key is free and has generous rate limits.

## Prerequisites

- `curl` and `jq` (both standard on macOS/Linux)
- `TENOR_API_KEY` environment variable

## Search for GIFs

```bash
# Search and get GIF URLs
curl -s "https://tenor.googleapis.com/v2/search?q=thumbs+up&limit=5&key=${TENOR_API_KEY}" | jq -r '.results[].media_formats.gif.url'

# Get smaller/preview versions
curl -s "https://tenor.googleapis.com/v2/search?q=nice+work&limit=3&key=${TENOR_API_KEY}" | jq -r '.results[].media_formats.tinygif.url'
```

## Download a GIF

```bash
# Search and download the top result
URL=$(curl -s "https://tenor.googleapis.com/v2/search?q=celebration&limit=1&key=${TENOR_API_KEY}" | jq -r '.results[0].media_formats.gif.url')
curl -sL "$URL" -o celebration.gif
```

## Get Full Metadata

```bash
curl -s "https://tenor.googleapis.com/v2/search?q=cat&limit=3&key=${TENOR_API_KEY}" | jq '.results[] | {title: .title, url: .media_formats.gif.url, preview: .media_formats.tinygif.url, dimensions: .media_formats.gif.dims}'
```

## API Parameters

| Parameter | Description |
|-----------|-------------|
| `q` | Search query (URL-encode spaces as `+`) |
| `limit` | Max results (1-50, default 20) |
| `key` | API key (from `$TENOR_API_KEY` env var) |
| `media_filter` | Filter formats: `gif`, `tinygif`, `mp4`, `tinymp4`, `webm` |
| `contentfilter` | Safety: `off`, `low`, `medium`, `high` |
| `locale` | Language: `en_US`, `es`, `fr`, etc. |

## Available Media Formats

Each result has multiple formats under `.media_formats`:

| Format | Use case |
|--------|----------|
| `gif` | Full quality GIF |
| `tinygif` | Small preview GIF |
| `mp4` | Video version (smaller file size) |
| `tinymp4` | Small preview video |
| `webm` | WebM video |
| `nanogif` | Tiny thumbnail |

## Notes

- URL-encode the query: spaces as `+`, special chars as `%XX`
- For sending in chat, `tinygif` URLs are lighter weight
- GIF URLs can be used directly in markdown: `![alt](url)`

---

## Steps

### 1. Verify setup

```bash
echo "TENOR_API_KEY set: $([ -n "$TENOR_API_KEY" ] && echo YES || echo NO)"
command -v jq > /dev/null && echo "jq: OK" || echo "jq: MISSING"
command -v curl > /dev/null && echo "curl: OK" || echo "curl: MISSING"
```

If `TENOR_API_KEY` missing → add to `~/.hermes/.env`. If `jq` missing → `apt install jq` or `brew install jq`.

### 2. Search for GIFs

```bash
curl -s "https://tenor.googleapis.com/v2/search?q=$(echo "YOUR_QUERY" | tr ' ' '+')&limit=5&key=${TENOR_API_KEY}" | jq -r '.results[].media_formats.gif.url'
```

Replace `YOUR_QUERY` with URL-encoded search term. Use `limit` to control number of results (1-50).

### 3. Pick and download

```bash
# Get tinygif (lighter) or gif (full quality)
URL=$(curl -s "https://tenor.googleapis.com/v2/search?q=celebration&limit=1&key=${TENOR_API_KEY}" | jq -r '.results[0].media_formats.tinygif.url')
curl -sL "$URL" -o /tmp/celebration.gif
```

### 4. Deliver

Use `MEDIA:/path/to/file.gif` in Discord — the platform delivers it as a native attachment.

---

## Verification

| Step | How to verify |
|------|---------------|
| API key works | `curl -s "...&key=${TENOR_API_KEY}"` returns JSON, not 403 |
| Search returns results | `jq -r '.results | length'` > 0 |
| Download succeeds | File exists and `file <path>` shows GIF image |
| GIF plays | `file <path>` shows `GIF`; size > 0 bytes |

---

## Common Pitfalls

- ❌ **No API key** — Tenor returns 403 without `TENOR_API_KEY`. Get free key at https://developers.google.com/tenor/guides/quickstart
- ❌ **Spaces in query not encoded** — use `+` or URL-encode; `curl` fails with bare spaces in URL
- ❌ **Using full `gif` for chat previews** — `tinygif` is smaller and faster; full GIF can be 10MB+
- ❌ **Rate limiting** — Tenor has rate limits; if seeing empty results, pause and retry
- ❌ **Not setting `Content-Type`** for download — Tenor redirects; `-L` follows redirects, `-sL` silences output
