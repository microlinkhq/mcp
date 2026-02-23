# Microlink MCP (Stdio)

Stdio-only MCP server for Microlink API.

## Install

```bash
npm install
```

## Run

```bash
npm start
```

Or via the package binary:

```bash
npx -y @microlink/mcp-stdio
```

## MCP client config example (Codex)

Published package:

```json
{
  "mcpServers": {
    "microlink": {
      "command": "npx",
      "args": ["-y", "@microlink/mcp-stdio"],
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
      "args": ["/absolute/path/to/mcp-stdio/src/index.js"],
      "env": {
        "MICROLINK_API_KEY": "YOUR_MICROLINK_API_KEY"
      }
    }
  }
}
```

## Tools

- `microlink_extract`
- `microlink_screenshot`
- `microlink_pdf`
- `microlink_video`
- `microlink_audio`
- `microlink_insights`
- `microlink_meta`
- `microlink_palette`

## Authentication

Optional auth sources, in order:

1. `apiKey` in tool input
2. `Authorization: Bearer <key>` header from MCP request
3. `x-api-key` header from MCP request
4. `MICROLINK_API_KEY` environment variable
