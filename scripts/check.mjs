// Consistency checks for this repository. Run: node scripts/check.mjs
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const MCP_URL = "https://www.agentplanners.com/api/mcp";
const problems = [];
const walk = (d) => readdirSync(d).flatMap((f) => (f === ".git" || f === "node_modules" ? [] : statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const files = walk(".").map((f) => f.replace(/\\/g, "/"));
const json = {};
for (const f of files.filter((f) => f.endsWith(".json"))) {
  try { json[f] = JSON.parse(readFileSync(f, "utf8")); } catch (e) { problems.push(`${f} does not parse: ${e.message}`); }
}
const cc = json["plugins/claude-code/agent-planners/.claude-plugin/plugin.json"];
const cx = json["plugins/codex/agent-planners/plugin.json"];
const gem = json["gemini-extension.json"];
const reg = json["server.json"];
const urls = [
  json["plugins/claude-code/agent-planners/.mcp.json"]?.mcpServers?.["agent-planners"]?.url,
  json["plugins/codex/agent-planners/mcp.json"]?.mcpServers?.["agent-planners"]?.url,
  gem?.mcpServers?.["agent-planners"]?.httpUrl,
  reg?.remotes?.[0]?.url,
];
if (!urls.every((u) => u === MCP_URL)) problems.push(`every server must point at ${MCP_URL}: ${JSON.stringify(urls)}`);
const versions = [cc?.version, cx?.version, gem?.version, reg?.version];
if (new Set(versions).size !== 1) problems.push(`versions disagree: ${JSON.stringify(versions)}`);
const skill = (p) => readFileSync(`plugins/${p}/agent-planners/skills/using-agent-planners/SKILL.md`, "utf8");
if (skill("claude-code") !== skill("codex")) problems.push("the two SKILL.md copies differ");
const body = skill("claude-code").replace(/^---\n[\s\S]*?\n---\n/, "");
if (!readFileSync("GEMINI.md", "utf8").endsWith(body)) problems.push("GEMINI.md is not the skill's body");
// Built from pieces so this file does not match its own pattern.
const CREDENTIAL = new RegExp(["ap" + "_live_[0-9a-f]{8}", "apo" + "_(at|rt|cs)_[A-Za-z0-9_-]{12}", "Bear" + "er [A-Za-z0-9]{12}"].join("|"));
for (const f of files.filter((f) => !/\.(png|jpe?g|webp)$/.test(f))) {
  if (CREDENTIAL.test(readFileSync(f, "utf8"))) problems.push(`${f} looks like it holds a credential`);
}
if (problems.length) { console.error(problems.map((p) => `✗ ${p}`).join("\n")); process.exit(1); }
console.log(`✓ ${Object.keys(json).length} JSON files, one MCP URL, version ${versions[0]}, skill and GEMINI.md in sync`);
