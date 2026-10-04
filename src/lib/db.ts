import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Analytics database. The site must keep working without it (local runs with
 * no DATABASE_URL, the image build, a database outage), so callers get `null`
 * instead of a throw and decide what to skip.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function db(): PrismaClient | null {
  if (!process.env.DATABASE_URL) return null;
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma;
}
