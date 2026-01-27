'use server'
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function createInitialHome(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const nickname = formData.get("nickname") as string

  await prisma.home.create({
    data: {
      nickname,
      userId: session.user.id,
    }
  })

  redirect("/dashboard")
}