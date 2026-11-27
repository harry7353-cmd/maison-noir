// ═══════════════════════════════════════════════════════════
// MAISON NOIR — Prisma Client Singleton
// Prevents multiple client instances & configures Vercel serverless SQLite
// ═══════════════════════════════════════════════════════════

import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// On Vercel / serverless environment, copy SQLite database to writable /tmp
let dbUrl: string | undefined = undefined;

if (process.env.VERCEL) {
  const dbPath = path.join(process.cwd(), "prisma", "dev.db");
  const tmpDbPath = path.join("/tmp", "dev.db");
  try {
    if (!fs.existsSync(tmpDbPath) && fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, tmpDbPath);
    }
    if (fs.existsSync(tmpDbPath)) {
      dbUrl = "file:/tmp/dev.db";
    }
  } catch (e) {
    console.error("Vercel SQLite init error:", e);
  }
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

export const prisma = db;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

export default db;
