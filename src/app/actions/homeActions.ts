'use server'

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createHomeAction(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a home.");
  }

  const nickname = formData.get("nickname") as string;
  const address = formData.get("address") as string;

  try {
    await prisma.home.create({
      data: {
        nickname,
        address,
        userId: session.user.id,
      },
    });

    // This tells Next.js to refresh the homepage data immediately
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to create home:", error);
    return { success: false, error: "Database error" };
  }
}

export async function deleteHomeAction(homeId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.home.delete({
    where: {
      id: homeId,
      userId: session.user.id,
    },
  });

  revalidatePath("/");
}

export async function updateHomeAction(formData: FormData) {
  const homeId = formData.get("homeId") as string;
  const nickname = formData.get("nickname") as string;
  const address = formData.get("address") as string;

  await prisma.home.update({
    where: { id: homeId },
    data: { nickname, address }
  });

  revalidatePath(`/homes/${homeId}`);
  revalidatePath("/");
}

export type HomeWithTasksAndLogs = Prisma.PromiseReturnType<typeof getHomeData>;

export async function getHomeData(homeId: string, userId: string) {
  return await prisma.home.findUnique({
    where: { id: homeId, userId },
    include: {
      tasks: {
        orderBy: { dueDate: 'asc' },
        include: {
          logs: { 
            orderBy: { completedAt: 'desc' },
            include: { provider: true } // Don't forget this for the PDF!
          }
        }
      }
    }
  });
}