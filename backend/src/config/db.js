// Prisma client singleton.
// One client instance is shared across the whole app — creating one per
// request would exhaust database connections.
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()
