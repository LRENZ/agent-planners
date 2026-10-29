# Agent Planners for Claude, Codex and Gemini

[Agent Planners](https://www.agentplanners.com) is an AI marketing agent for the ad, analytics, commerce and
CRM accounts a workspace connects — Google Ads, Meta, Google Analytics, Search Console, Microsoft Advertising,
TikTok, LinkedIn, Reddit, Pinterest, Snapchat, Shopify, SHOPLINE, HubSpot, Klaviyo and more. This repository
packages its remote MCP server for AI agents:

| Host | What you get | Manifest |
| :- | :- | :- |
| Claude Code (and the Claude directory) | MCP server + the `using-agent-planners` skill | `.claude-plugin/marketplace.json` → `plugins/claude-code/agent-planners` |
| Codex (and the ChatGPT / Codex plugin directory) | MCP server + the same skill | `.agents/plugins/marketplace.json` → `plugins/codex/agent-planners` |
| Gemini CLI | MCP server + `GEMINI.md` context | `gemini-extension.json` |
| Any MCP client / the MCP Registry | The server by URL | `server.json` |

Nothing runs on your machine and nothing here holds a secret. The server is
`https://www.agentplanners.com/api/mcp` (Streamable HTTP). It signs people in with OAuth 2.1: the first time,
your browser opens the Agent Planners consent page, where a person in your workspace chooses what the agent may
do. By default every change the agent proposes waits for a person to approve it, and some changes — permanent
deletes, refunds, publishing, turning spend on — always do.

You need an Agent Planners workspace with at least one connected account. Start free at
https://www.agentplanners.com.

## Install

### Claude Code

```
/plugin marketplace add LRENZ/agent-planners
/plugin install agent-planners@agent-planners
```

Then run `/mcp`, choose `plugin:agent-planners:agent-planners` and sign in. The skill runs as
`/agent-planners:using-agent-planners`, and Claude loads it on its own when a task involves Agent Planners.

### Codex

```
codex plugin marketplace add LRENZ/agent-planners
```

Then run `/plugins` in Codex, open the Agent Planners tab and install the plugin. Codex asks you to sign in when
you install it.

### Gemini CLI

```
gemini extensions install https://github.com/LRENZ/agent-planners
```

Then run `/mcp auth agent-planners` in Gemini CLI and approve in your browser.

### Claude.ai, Claude Desktop and ChatGPT

Add `https://www.agentplanners.com/api/mcp` as a custom connector and sign in. For Claude Desktop there is also a
one-click extension: Agent Planners → API & MCP → Set up for: Claude Desktop. Step-by-step guides for every host:
https://www.agentplanners.com/docs/mcp-setup.

### Any other MCP client

Point it at `https://www.agentplanners.com/api/mcp`. Clients that support OAuth discover the sign-in on their
own (protected-resource metadata, client ID metadata documents and dynamic client registration are all
supported). A client without OAuth can send an API key instead — `Authorization: Bearer <key>`, created on the
API & MCP page; keep it in an environment variable, never in a file you share.

## What the agent can do

- **Hand over a goal.** `create_task` runs a whole task on Agent Planners' own agent — a weekly review, a budget
  check across channels, a report — and `get_task` returns the result.
- **Call platform tools directly.** Around a thousand typed tools across the connected platforms. When the list
  is large the server shows three instead: `search_tools`, `describe_tool` and `call_tool`.
- **Respect the workspace's limits.** Scopes and platforms chosen on the consent page, approvals, the workspace's
  Forbidden Rules and its credits apply to every call. `describe_permissions` says what a connection can do.

## Privacy, terms and support

- Privacy policy: https://www.agentplanners.com/privacy
- Terms: https://www.agentplanners.com/terms
- Support: https://www.agentplanners.com/support — hi@agentplanners.com
- Documentation: https://www.agentplanners.com/docs/mcp-setup and https://www.agentplanners.com/docs/oauth

To disconnect, remove the connection on the Agent Planners API & MCP page, or remove the server from your host.

## For maintainers

Before tagging a release:

1. Validate: `claude plugin validate .`, `claude plugin validate ./plugins/claude-code/agent-planners` and
   `gemini extensions validate .` must pass. The `validate` workflow also checks that every JSON file parses,
   every server points at the same URL, the skill copies and `GEMINI.md` match, and the versions agree.
2. Bump `version` in `plugins/claude-code/agent-planners/.claude-plugin/plugin.json`,
   `plugins/codex/agent-planners/plugin.json`, `gemini-extension.json` and `server.json` together.
3. Push a tag `vX.Y.Z`. The `publish-mcp-registry` workflow publishes `server.json` to the
   [MCP Registry](https://registry.modelcontextprotocol.io).

## License

MIT — see [LICENSE](LICENSE).
