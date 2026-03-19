import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
})

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["query"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
