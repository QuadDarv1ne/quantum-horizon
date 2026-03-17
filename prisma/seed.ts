/**
 * Seed script для создания тестовых пользователей
 * Запуск: node --loader ts-node/esm prisma/seed.ts
 * Или: bun prisma/seed.ts
 */

import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

const testUsers = [
  {
    email: "admin@quantum-horizon.app",
    password: "Admin@123456",
    name: "Администратор",
    role: "ADMIN" as const,
  },
  {
    email: "teacher@quantum-horizon.app",
    password: "Teacher@123456",
    name: "Преподаватель",
    role: "MODERATOR" as const,
  },
  {
    email: "student@quantum-horizon.app",
    password: "Student@123456",
    name: "Студент",
    role: "USER" as const,
  },
]

async function main() {
  console.log("🌱 Starting seed...")

  for (const userData of testUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    })

    if (existingUser) {
      console.log(`⏭️  User ${userData.email} already exists, skipping...`)
      continue
    }

    const hashedPassword = await hash(userData.password, 12)

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        role: userData.role,
      },
    })

    console.log(`✅ Created user: ${String(user.email)} (${user.role})`)

    // Создание записи прогресса
    await prisma.userProgress.create({
      data: {
        userId: String(user.id),
        topic: "general",
        completedCount: 0,
      },
    })

    // Создание настроек пользователя
    await prisma.userSettings.create({
      data: {
        userId: String(user.id),
        theme: "system",
        language: "ru",
      },
    })

    console.log(`   📊 Created progress and settings for ${String(user.email)}`)
  }

  console.log("\n🎉 Seed completed!")
  console.log("\n📋 Test accounts:")
  console.log("   Admin:    admin@quantum-horizon.app    / Admin@123456")
  console.log("   Teacher:  teacher@quantum-horizon.app  / Teacher@123456")
  console.log("   Student:  student@quantum-horizon.app  / Student@123456")
}

main()
  .catch((e: unknown) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
