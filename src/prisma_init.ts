import { PrismaClient } from "@prisma/client"
import "dotenv/config"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"

const adapter = new PrismaMariaDb(process.env.TEST_DATABASE_URL!)

const prisma = new PrismaClient({
  adapter,
})

export default prisma
