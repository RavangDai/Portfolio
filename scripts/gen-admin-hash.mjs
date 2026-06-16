// Generate a bcrypt hash for the admin password.
//
// Usage:
//   node scripts/gen-admin-hash.mjs 'your-new-password'
//
// Then:
//   - Put the ESCAPED line into .env.local (every $ becomes \$, or @next/env
//     variable-expansion corrupts the hash at runtime and login always fails).
//   - Put the RAW hash into the Vercel dashboard env var ADMIN_PASSWORD_HASH
//     (Vercel injects env vars literally, so no escaping there).
//   - Restart `npm run dev` / redeploy for the change to take effect.
import bcrypt from "bcryptjs";

const pw = process.argv[2];
if (!pw) {
  console.error("Usage: node scripts/gen-admin-hash.mjs 'your-new-password'");
  process.exit(1);
}

const hash = bcrypt.hashSync(pw, 12);
console.log("\nRAW hash (for Vercel dashboard):");
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log("\nESCAPED line (for .env.local):");
console.log(`ADMIN_PASSWORD_HASH=${hash.replace(/\$/g, "\\$")}`);
console.log("\nverify:", bcrypt.compareSync(pw, hash) ? "ok" : "FAILED");
