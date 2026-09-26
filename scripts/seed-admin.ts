// scripts/seed-admin.ts
// Run ONCE to create your admin user.
// Delete or disable this route immediately after running.
// Never commit your actual password to this file.
// Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local first.

import bcrypt from "bcryptjs";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local");
    process.exit(1);
  }

  // Cost factor 12 — production standard
  const passwordHash = await bcrypt.hash(password, 12);

  console.log("═══════════════════════════════════════════");
  console.log("Run this SQL in your Cloudflare D1 Console:");
  console.log("═══════════════════════════════════════════");
  console.log(`
INSERT OR IGNORE INTO admin_user (id, email, password_hash)
VALUES (1, '${email}', '${passwordHash}');
  `);
  console.log("═══════════════════════════════════════════");
  console.log("After running the SQL:");
  console.log("1. Delete ADMIN_PASSWORD from .env.local");
  console.log("2. Disable the /api/seed route");
  console.log("═══════════════════════════════════════════");
}

seedAdmin();
