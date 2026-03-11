import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db