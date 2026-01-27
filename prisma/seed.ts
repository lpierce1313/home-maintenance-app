import { prisma } from '../src/lib/prisma'

async function main() {
  const home = await prisma.home.create({
    data: {
      nickname: "My Cozy Cottage",
      address: "123 Maintenance Lane",
      userId: "test-user-123", // Replace with your actual Google ID later
      tasks: {
        create: [
          { title: "Change HVAC Filter", dueDate: new Date("2026-03-01") },
          { title: "Check Smoke Detectors", dueDate: new Date("2026-04-01") },
        ],
      },
    },
  })
  console.log({ home })
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())