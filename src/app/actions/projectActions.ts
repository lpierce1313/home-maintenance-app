'use server'

import { Priority } from "@/generated/client/client";
import { prisma } from "@/lib/prisma"; 
import { revalidatePath } from "next/cache";

export async function addProjectAction(formData: FormData) {
  const homeId = formData.get("homeId") as string;
  const title = formData.get("title") as string;
  const priority = formData.get("priority") as Priority;
  const cost = parseFloat(formData.get("estimatedCost") as string) || 0;

  const lastProject = await prisma.futureProject.findFirst({
    where: { homeId },
    orderBy: { order: 'desc' }
  });

  await prisma.futureProject.create({
    data: {
      title,
      homeId,
      priority,
      estimatedCost: cost,
      order: lastProject ? lastProject.order + 1 : 0,
    }
  });

  revalidatePath(`/homes/${homeId}`);
  revalidatePath(`/`); // Also revalidate dashboard to update the counter
}

export async function reorderProjectAction(projectId: string, direction: 'up' | 'down') {
  const project = await prisma.futureProject.findUnique({ where: { id: projectId } });
  if (!project) return;

  const otherProject = await prisma.futureProject.findFirst({
    where: {
      homeId: project.homeId,
      order: direction === 'up' ? { lt: project.order } : { gt: project.order }
    },
    orderBy: { order: direction === 'up' ? 'desc' : 'asc' }
  });

  if (otherProject) {
    await prisma.$transaction([
      prisma.futureProject.update({ where: { id: project.id }, data: { order: otherProject.order } }),
      prisma.futureProject.update({ where: { id: otherProject.id }, data: { order: project.order } }),
    ]);
  }

  revalidatePath(`/homes/${project.homeId}`);
}

export async function updateProjectAction(formData: FormData) {
  const projectId = formData.get("projectId") as string;
  const homeId = formData.get("homeId") as string;
  const title = formData.get("title") as string;
  const priority = formData.get("priority") as Priority;
  const cost = parseFloat(formData.get("estimatedCost") as string) || 0;

  await prisma.futureProject.update({
    where: { id: projectId },
    data: {
      title,
      priority,
      estimatedCost: cost,
    }
  });

  revalidatePath(`/homes/${homeId}/projects`);
}

export async function deleteProjectAction(formData: FormData) {
  const projectId = formData.get("projectId") as string;
  const homeId = formData.get("homeId") as string;

  await prisma.futureProject.delete({
    where: { id: projectId }
  });

  revalidatePath(`/homes/${homeId}/projects`);
  revalidatePath(`/`); // Update dashboard counter
}

export async function completeProjectAction(formData: FormData) {
  const projectId = formData.get("projectId") as string;
  const homeId = formData.get("homeId") as string;
  const completionDate = formData.get("completedAt") as string;

  await prisma.futureProject.update({
    where: { id: projectId },
    data: {
      status: "COMPLETED",
      completedAt: new Date(completionDate),
      // We set order to a high number to move it out of the active ranking
      order: 999, 
    }
  });

  revalidatePath(`/homes/${homeId}/projects`);
  revalidatePath(`/`); // Update dashboard counter
}