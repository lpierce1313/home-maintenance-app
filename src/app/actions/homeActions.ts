'use server'

import { auth } from "@/auth";
import { Prisma } from "@/generated/client/client";
import { prisma } from "@/lib/prisma";
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

export const homeDetailsInclude = {
  tasks: {
    orderBy: { dueDate: 'asc' as Prisma.SortOrder },
    include: {
      logs: { 
        orderBy: { completedAt: 'desc' as Prisma.SortOrder },
        include: { provider: true } 
      }
    }
  }
} satisfies Prisma.HomeInclude;

export type HomeWithTasksAndLogs = Prisma.HomeGetPayload<{
  include: typeof homeDetailsInclude;
}>;

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