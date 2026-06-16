// Verify a candidate admin password against the hash in .env.local — WITHOUT
// hitting the login form, so it never consumes a rate-limited attempt. This
// loads env exactly the way Next.js does (@next/env), so it also proves the
// $-escaping in .env.local resolves to a clean hash at runtime.
//
// Usage:
//   node scripts/check-admin-password.mjs 'your-password'
import pkg from "@next/env";
import bcrypt from "bcryptjs";

const { loadEnvConfig } = pkg;
loadEnvConfig(process.cwd());

const pw = process.argv[2];
if (!pw) {
  console.error("Usage: node scripts/check-admin-password.mjs 'your-password'");
  process.exit(1);
}

const hash = process.env.ADMIN_PASSWORD_HASH;
if (!hash) {
  console.error("ADMIN_PASSWORD_HASH is not set in the environment.");
  process.exit(1);
}

const ok = bcrypt.compareSync(pw, hash);
console.log(ok ? "MATCH — this password is correct for the current hash" : "NO MATCH — wrong password, or the hash is for a different password");
process.exit(ok ? 0 : 1);
