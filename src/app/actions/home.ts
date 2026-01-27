'use server'
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function createHome(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error("You must be logged in.")
  }

  const nickname = formData.get("nickname") as string

  await prisma.home.create({
    data: {
      nickname: nickname,
      userId: session.user.id,
    }
  })

  // Once created, send them to the dashboard
  redirect("/dashboard")
}