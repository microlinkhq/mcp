# Microlink MCP (Stdio)

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that exposes [Microlink API](https://microlink.io) capabilities to AI assistants. Runs over stdio transport, making it compatible with Claude Desktop, VS Code, Cursor, and any other MCP-capable client.

## Requirements

- Node.js >= 20

## Install

```bash
npm install
```

## Run

```bash
npm start
```

Or directly via the package binary:

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

### `microlink_extract`

Extract structured metadata from any public URL. Returns normalized fields (`title`, `description`, `author`, `publisher`, `date`, `image`, `logo`, `lang`, `url`) plus any custom fields defined via CSS selectors.

Supports combining multiple features in a single request: screenshot, PDF, video, audio, insights, and palette.

**Key parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | The URL to extract data from *(required)* |
| `data` | `object` | Custom CSS-selector extraction rules |
| `screenshot` | `boolean \| object` | Capture a screenshot |
| `pdf` | `boolean \| object` | Generate a PDF |
| `video` | `boolean` | Extract video source |
| `audio` | `boolean` | Extract audio source |
| `insights` | `boolean \| object` | Run Lighthouse / tech detection |
| `palette` | `boolean` | Extract color palette |
| `device` | `string` | Emulate a device (e.g. `"iPhone 12"`) |
| `viewport` | `object` | Custom viewport dimensions |
| `click` | `string \| string[]` | CSS selector(s) to click before capture |
| `scroll` | `string` | CSS selector to scroll to |
| `scripts` | `string \| string[]` | JavaScript to inject |
| `styles` | `string \| string[]` | CSS to inject |
| `proxy` | `string \| object` | Proxy configuration |
| `ttl` | `string \| number` | Cache TTL |
| `force` | `boolean` | Bypass cache |
| `headers` | `object` | Custom HTTP headers |
| `waitForSelector` | `string` | Wait for element before capture |
| `waitUntil` | `string \| string[]` | Navigation event(s) to await (`load`, `networkidle0`, etc.) |

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
| `waitForSelector` | `string` | Wait for element |
| `waitUntil` | `string \| string[]` | Navigation event(s) |

---

### `microlink_pdf`

Generate a PDF of any public URL and receive a permanent CDN asset URL (`data.pdf.url`).

**Key parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | The URL to convert *(required)* |
| `pdf.format` | `string` | Paper size: `"A4"` (default), `"Letter"`, `"Legal"`, `"A0"`–`"A6"` |
| `pdf.landscape` | `boolean` | Landscape orientation |
| `pdf.margin` | `string \| object` | Page margins (e.g. `"0.35cm"` or `{top, bottom, left, right}`) |
| `pdf.scale` | `number` | Page scale factor (0.1–2.0) |
| `pdf.pageRanges` | `string` | Page range (e.g. `"1-5"`) |
| `pdf.width` / `pdf.height` | `string` | Custom dimensions (overrides `format`) |
| `mediaType` | `"screen" \| "print"` | CSS media type |
| `waitForSelector` | `string` | Wait for element |
| `waitUntil` | `string \| string[]` | Navigation event(s) |

---

### `microlink_video`

Detect and extract a playable video source from any URL. Returns the video URL in `data.video.url` along with `type`, `duration`, `size`, `width`, `height`, `duration_pretty`, and `size_pretty`.

Supports YouTube, Vimeo, Twitter/X, TikTok, Instagram, Dailymotion, and hundreds of other platforms.

**Key parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | The URL containing a video *(required)* |
| `proxy` | `string \| object` | Proxy for restricted platforms |
| `meta` | `boolean \| object` | Include/suppress page metadata |

---

### `microlink_audio`

Detect and extract a playable audio source from any URL. Returns the audio URL in `data.audio.url` along with `type`, `duration`, `size`, `duration_pretty`, and `size_pretty`.

Supports SoundCloud, Spotify, Mixcloud, and other audio platforms.

**Key parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | The URL containing audio *(required)* |
| `proxy` | `string \| object` | Proxy for restricted platforms |
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
| `insights.lighthouse.preset` | `string` | Audit preset: `"default"`, `"desktop"`, `"perf"`, `"full"`, `"lr-desktop"`, `"lr-mobile"` |
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

## Authentication

The API key is resolved from these sources in order of priority:

1. `apiKey` field in the tool input parameters
2. `Authorization: Bearer <key>` header from the MCP request
3. `x-api-key` header from the MCP request
4. `MICROLINK_API_KEY` environment variable

The `MICROLINK_API_KEY` environment variable is the recommended approach for most integrations. Get your key at [microlink.io](https://microlink.io).

## Development

```bash
# Run tests
npm test
```

## License

MIT
