const { execSync } = require("node:child_process");

const out = execSync("bun pm ls zod --json", { stdio: ["ignore","pipe","inherit"] }).toString();
if ((out.match(/\"zod@/g) || []).length > 1) {
  console.error("Multiple zod versions detected:\n", out);
  process.exit(1);
}