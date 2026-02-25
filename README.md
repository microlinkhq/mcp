# Microlink MCP

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that exposes [Microlink API](https://microlink.io) capabilities to AI assistants. Runs over stdio transport, making it compatible with Claude Desktop, VS Code, Cursor, and any other MCP-capable client.

Links:

- Website: [microlink.io](https://microlink.io)
- MCP integration page: [microlink.io/integration/mcp](https://microlink.io/integration/mcp)
- npm package: [@microlink/mcp](https://www.npmjs.com/package/@microlink/mcp)

## Requirements

- Node.js >= 20

## Install

### Use the published package (recommended)

No local installation is required. Run directly with `npx`:

```bash
npx -y @microlink/mcp
```

### Optional: install globally

```bash
npm install -g @microlink/mcp
microlink-mcp
```

### Local development (this repository)

```bash
npm install
```

## Run

Local repository:

```bash
npm start
```

Global install:

```bash
microlink-mcp
```

Without installation:

```bash
npx -y @microlink/mcp
```

## MCP client configuration

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "microlink": {
      "command": "npx",
      "args": ["-y", "@microlink/mcp"],
      "env": {
        "MICROLINK_API_KEY": "YOUR_MICROLINK_API_KEY"
      }
    }
  }
}
```

### VS Code / Codex

Published package:

```json
{
  "mcpServers": {
    "microlink": {
      "command": "npx",
      "args": ["-y", "@microlink/mcp"],
      "env": {
        "MICROLINK_API_KEY": "YOUR_MICROLINK_API_KEY"
      }
    }
  }
}
```

Local repository:

```json
{
  "mcpServers": {
    "microlink": {
      "command": "node",
      "args": ["/absolute/path/to/mcp/src/index.js"],
      "env": {
        "MICROLINK_API_KEY": "YOUR_MICROLINK_API_KEY"
      }
    }
  }
}
```

### Cursor

Add to your Cursor MCP settings (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "microlink": {
      "command": "npx",
      "args": ["-y", "@microlink/mcp"],
      "env": {
        "MICROLINK_API_KEY": "YOUR_MICROLINK_API_KEY"
      }
    }
  }
}
```

## Tools

### Capabilities at a glance

- `microlink_extract`: metadata extraction + custom scraping rules (`data`) + multi-capability composition in one call.
- `microlink_screenshot`: screenshot generation with element/full-page modes and browser controls.
- `microlink_pdf`: PDF generation with page/layout controls.
- `microlink_video`: playable video source extraction.
- `microlink_audio`: playable audio source extraction.
- `microlink_insights`: Lighthouse + technology detection.
- `microlink_meta`: normalized metadata extraction with include/exclude config.
- `microlink_palette`: image palette and contrast color extraction.
- `microlink_markdown`: URL to Markdown conversion.
- `microlink_text`: URL to plain text conversion.
- Cross-cutting request capabilities: device/viewport emulation, click/scroll actions, JS/CSS injection, modules, wait conditions, cache controls (`ttl`, `staleTtl`, `force`), retries/timeouts, media mode, headers/proxy, and endpoint/auth routing.

### Response shape

- JSON tools (`microlink_extract`, `microlink_screenshot`, `microlink_pdf`, `microlink_video`, `microlink_audio`, `microlink_insights`, `microlink_meta`, `microlink_palette`) return `structuredContent` with:
  - `endpoint`, `requestUrl`, `finalUrl`, `statusCode`, `responseHeaders`, `microlink`
  - `microlink` preserves Microlink API JSend payload (`status`, `data`, and error fields like `code`, `id`, `message`, `more`, `report`).
  - `responseHeaders` includes key cache/rate headers (such as `x-cache-status`, `cf-cache-status`, `cache-control`, `x-rate-limit-*`) when present.
  - MCP `isError` is set when transport fails or when `microlink.status !== "success"`.
- Embed tools (`microlink_markdown`, `microlink_text`) return plain text in `content[0].text`.

Parameters labeled `PRO` in the official Microlink docs require a paid plan.

### `microlink_extract`

Extract structured metadata from any public URL. Returns normalized fields (`title`, `description`, `author`, `publisher`, `date`, `image`, `logo`, `lang`, `url`) plus any custom fields defined via CSS selectors.

Supports combining multiple features in a single request: screenshot, PDF, video, audio, insights, and palette.

**Key parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | The URL to extract data from *(required)* |
| `data` | `object` | Custom CSS-selector extraction rules |
| `embed` | `string` | Microlink embed mode |
| `iframe` | `boolean \| object` | Include iframe payload options |
| `function` | `string` | Custom Microlink function hook |
| `ping` | `boolean \| object` | Enable ping checks |
| `screenshot` | `boolean \| object` | Capture a screenshot |
| `pdf` | `boolean \| object` | Generate a PDF |
| `video` | `boolean` | Extract video source |
| `audio` | `boolean` | Extract audio source |
| `insights` | `boolean \| object` | Run Lighthouse / tech detection |
| `palette` | `boolean` | Extract color palette |
| `adblock` | `boolean` | Enable ad blocking |
| `animations` | `boolean` | Enable/disable animations |
| `device` | `string` | Emulate a device (e.g. `"iPhone 12"`) |
| `viewport` | `object` | Custom viewport dimensions |
| `click` | `string \| string[]` | CSS selector(s) to click before capture |
| `scroll` | `string` | CSS selector to scroll to |
| `javascript` | `boolean` | Toggle JavaScript execution |
| `modules` | `string \| string[]` | Browser module(s) to inject |
| `scripts` | `string \| string[]` | JavaScript to inject |
| `styles` | `string \| string[]` | CSS to inject |
| `mediaType` | `"screen" \| "print"` | CSS media mode |
| `prerender` | `"auto" \| boolean` | Prerender strategy |
| `proxy` | `string \| object` | Proxy configuration *(PRO)* |
| `retry` | `number` | Retry count |
| `ttl` | `string \| number` | Cache TTL |
| `staleTtl` | `string \| number \| boolean` | Stale cache TTL policy *(PRO)* |
| `force` | `boolean` | Bypass cache |
| `timeout` | `string \| number` | Request timeout |
| `headers` | `object` | Custom HTTP headers *(PRO)* |
| `filename` | `string` | Preferred output filename *(PRO)* |
| `filter` | `string` | Response filter |
| `waitForSelector` | `string` | Wait for element before capture |
| `waitForTimeout` | `string \| number` | Wait an additional timeout before capture |
| `waitUntil` | `string \| string[]` | Navigation event(s): `auto`, `load`, `domcontentloaded`, `networkidle0`, `networkidle2` |

---

### `microlink_screenshot`

Capture a screenshot of any public URL and receive a permanent CDN asset URL (`data.screenshot.url`).

**Key parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | The URL to screenshot *(required)* |
| `screenshot.fullPage` | `boolean` | Capture the full scrollable page |
| `screenshot.element` | `string` | CSS selector to capture a specific element |
| `screenshot.type` | `"jpeg" \| "png"` | Output format (default: `"png"`) |
| `screenshot.omitBackground` | `boolean` | Transparent background |
| `screenshot.overlay` | `object` | Browser chrome overlay (`browser`: `"light"\|"dark"`, `background`: CSS color) |
| `screenshot.codeScheme` | `string` | Syntax-highlight theme for code pages (e.g. `"dracula"`) |
| `colorScheme` | `"light" \| "dark" \| "no-preference"` | Preferred color scheme |
| `device` | `string` | Device emulation |
| `viewport` | `object` | Custom viewport |
| `click` | `string \| string[]` | Click before capture |
| `scroll` | `string` | Scroll to element |
| `scripts` | `string \| string[]` | JavaScript to inject before capture |
| `styles` | `string \| string[]` | CSS to inject before capture |
| `modules` | `string \| string[]` | Browser module(s) to inject |
| `proxy` | `string \| object` | Proxy configuration *(PRO)* |
| `headers` | `object` | Custom HTTP headers *(PRO)* |
| `force` | `boolean` | Bypass cache |
| `ttl` | `string \| number` | Cache TTL |
| `staleTtl` | `string \| number \| boolean` | Stale cache TTL policy *(PRO)* |
| `retry` | `number` | Retry count |
| `timeout` | `string \| number` | Request timeout |
| `prerender` | `"auto" \| boolean` | Prerender strategy |
| `adblock` | `boolean` | Enable ad blocking |
| `animations` | `boolean` | Enable/disable animations |
| `javascript` | `boolean` | Toggle JavaScript execution |
| `mediaType` | `"screen" \| "print"` | CSS media mode |
| `filename` | `string` | Preferred output filename *(PRO)* |
| `filter` | `string` | Response filter |
| `waitForSelector` | `string` | Wait for element |
| `waitForTimeout` | `string \| number` | Wait an additional timeout before capture |
| `waitUntil` | `string \| string[]` | Navigation event(s): `auto`, `load`, `domcontentloaded`, `networkidle0`, `networkidle2` |

---

### `microlink_pdf`

Generate a PDF of any public URL and receive a permanent CDN asset URL (`data.pdf.url`).

**Key parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | The URL to convert *(required)* |
| `pdf.format` | `string` | Paper size: `"A4"` (default), `"Letter"`, `"Legal"`, `"Tabloid"`, `"Ledger"`, `"A0"`–`"A6"` |
| `pdf.landscape` | `boolean` | Landscape orientation |
| `pdf.margin` | `string \| object` | Page margins (e.g. `"0.35cm"` or `{top, bottom, left, right}`) |
| `pdf.scale` | `number` | Page scale factor (0.1–2.0) |
| `pdf.pageRanges` | `string` | Page range (e.g. `"1-5"`) |
| `pdf.width` / `pdf.height` | `string` | Custom dimensions (overrides `format`) |
| `scripts` | `string \| string[]` | JavaScript to inject before rendering |
| `styles` | `string \| string[]` | CSS to inject before rendering |
| `modules` | `string \| string[]` | Browser module(s) to inject |
| `proxy` | `string \| object` | Proxy configuration *(PRO)* |
| `headers` | `object` | Custom HTTP headers *(PRO)* |
| `force` | `boolean` | Bypass cache |
| `ttl` | `string \| number` | Cache TTL |
| `staleTtl` | `string \| number \| boolean` | Stale cache TTL policy *(PRO)* |
| `retry` | `number` | Retry count |
| `timeout` | `string \| number` | Request timeout |
| `prerender` | `"auto" \| boolean` | Prerender strategy |
| `adblock` | `boolean` | Enable ad blocking |
| `animations` | `boolean` | Enable/disable animations |
| `javascript` | `boolean` | Toggle JavaScript execution |
| `device` | `string` | Device emulation |
| `viewport` | `object` | Custom viewport |
| `filename` | `string` | Preferred output filename *(PRO)* |
| `filter` | `string` | Response filter |
| `mediaType` | `"screen" \| "print"` | CSS media type |
| `waitForSelector` | `string` | Wait for element |
| `waitForTimeout` | `string \| number` | Wait an additional timeout before rendering |
| `waitUntil` | `string \| string[]` | Navigation event(s): `auto`, `load`, `domcontentloaded`, `networkidle0`, `networkidle2` |

---

### `microlink_video`

Detect and extract a playable video source from any URL. Returns the video URL in `data.video.url` along with `type`, `duration`, `size`, `width`, `height`, `duration_pretty`, and `size_pretty`.

Supports YouTube, Vimeo, Twitter/X, TikTok, Instagram, Dailymotion, and hundreds of other platforms.

**Key parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | The URL containing a video *(required)* |
| `proxy` | `string \| object` | Proxy for restricted platforms *(PRO)* |
| `meta` | `boolean \| object` | Include/suppress page metadata |

---

### `microlink_audio`

Detect and extract a playable audio source from any URL. Returns the audio URL in `data.audio.url` along with `type`, `duration`, `size`, `duration_pretty`, and `size_pretty`.

Supports SoundCloud, Spotify, Mixcloud, and other audio platforms.

**Key parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | The URL containing audio *(required)* |
| `proxy` | `string \| object` | Proxy for restricted platforms *(PRO)* |
| `meta` | `boolean \| object` | Include/suppress page metadata |

---

### `microlink_insights`

Get web performance and technology-stack insights for any URL.

**Key parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | The URL to analyze *(required)* |
| `insights.lighthouse` | `boolean \| object` | Run a Lighthouse audit |
| `insights.lighthouse.output` | `"json" \| "html" \| "csv"` | Report format (default: `"json"`) |
| `insights.lighthouse.preset` | `string` | Audit preset: `"default"`, `"desktop"`, `"perf"`, `"experimental"`, `"full"`, `"lr-desktop"`, `"lr-mobile"` |
| `insights.lighthouse.onlyCategories` | `string \| string[]` | Lighthouse category IDs (e.g. `["performance", "accessibility"]`) |
| `insights.technologies` | `boolean` | Detect tech stack via Wappalyzer |

---

### `microlink_meta`

Extract normalized metadata from any public URL. Returns: `title`, `description`, `lang`, `author`, `publisher`, `date`, `url`, `image` (with dimensions and file info), and `logo` (publisher favicon).

**Key parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | The URL to inspect *(required)* |
| `meta` | `boolean \| object` | `false` to skip all metadata; object to include/exclude specific fields (e.g. `{ logo: true, title: true }`) |

---

### `microlink_palette`

Extract a color palette from images detected on any public URL. For each image returns: `palette` (hex colors from most to least dominant), `background_color` (optimal WCAG-contrast background), `color` (best overlay color), and `alternative_color`.

Color data is nested under each image field (e.g. `data.image.palette`). Useful for generating design tokens, theming, or accessibility checks.

**Key parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | The URL to analyze *(required)* |
| `meta` | `boolean \| object` | Control metadata fields returned |
| `palette` | `boolean` | Enable palette extraction (default: `true`) |

---

### `microlink_markdown`

Convert any public URL to Markdown. Returns the page content as clean Markdown text, useful for extracting readable content from web pages, articles, and documentation.

**Key parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | The URL to convert *(required)* |
| `apiKey` | `string` | Microlink API key *(optional)* |

---

### `microlink_text`

Extract plain text from any public URL. Returns the page content stripped of all HTML and formatting.

**Key parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | The URL to extract text from *(required)* |
| `apiKey` | `string` | Microlink API key *(optional)* |

---

## Authentication

The API key is resolved from these sources in order of priority:

1. `apiKey` field in the tool input parameters
2. `Authorization: Bearer <key>` header from the MCP request
3. `x-api-key` header from the MCP request
4. `MICROLINK_API_KEY` environment variable

The `MICROLINK_API_KEY` environment variable is the recommended approach for most integrations. Get your key at [microlink.io](https://microlink.io).

If an API key is present, requests are sent to `https://pro.microlink.io`; otherwise they go to `https://api.microlink.io` (free endpoint).

When the free endpoint returns `429`, this MCP adds a clear hint in the tool error message: free daily quota reached (`50 requests/day`) and upgrade/API key guidance at [microlink.io/#pricing](https://microlink.io/#pricing).

## Development

```bash
# Run tests
npm test
```

## License

MIT
