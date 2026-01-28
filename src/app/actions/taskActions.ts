"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleTaskStatus(taskId: string, currentStatus: string) {
  const newStatus = currentStatus === "completed" ? "pending" : "completed";

  await prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  });

  revalidatePath("/homes/[id]", "page");
}

export async function createTaskAction(formData: FormData) {
  const homeId = formData.get("homeId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const frequency = formData.get("frequency") as string;
  const category = formData.get("category") as string; // Added
  const lastDoneVal = formData.get("lastDone") as string;

  const existingTask = await prisma.task.findFirst({
    where: {
      homeId: homeId,
      title: { equals: title, mode: "insensitive" },
    },
  });

  if (existingTask) {
    throw new Error(
      `A task with the title "${title}" already exists for this home.`,
    );
  }

  const startPoint = lastDoneVal ? new Date(lastDoneVal) : new Date();
  const dueDate = new Date(startPoint);

  if (frequency === "monthly") dueDate.setMonth(dueDate.getMonth() + 1);
  else if (frequency === "quarterly") dueDate.setMonth(dueDate.getMonth() + 3);
  else if (frequency === "annually")
    dueDate.setFullYear(dueDate.getFullYear() + 1);

  await prisma.task.create({
    data: {
      title,
      frequency,
      category: category || "General", // Added
      dueDate,
      description,
      lastDone: lastDoneVal ? new Date(lastDoneVal) : null,
      homeId,
    },
  });

  revalidatePath(`/homes/${homeId}`);
}

export async function completeTaskAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const taskId = formData.get("taskId") as string; // Needed for revalidation
  const workerType = formData.get("workerType") as string;
  const providerId = formData.get("providerId") as string;
  const companyName = formData.get("companyName") as string;

  let finalProviderId: string | undefined = undefined;

  if (workerType === "company") {
    if (providerId && providerId !== "undefined") {
      finalProviderId = providerId;
    } else if (companyName) {
      const newPro = await prisma.serviceProvider.create({
        data: {
          name: companyName,
          userId: session.user.id,
          phone: formData.get("providerPhone") as string,
          email: formData.get("providerEmail") as string,
        },
      });
      finalProviderId = newPro.id;
    }
  }

  // Create log and update the task's lastDone/dueDate
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error("Task not found");

  const nextDue = new Date();
  if (task.frequency === "monthly") nextDue.setMonth(nextDue.getMonth() + 1);
  else if (task.frequency === "quarterly") nextDue.setMonth(nextDue.getMonth() + 3);
  else if (task.frequency === "annually") nextDue.setFullYear(nextDue.getFullYear() + 1);

  await prisma.$transaction([
    prisma.maintenanceLog.create({
      data: {
        taskId,
        cost: parseFloat((formData.get("cost") as string) || "0"),
        comment: formData.get("comment") as string,
        fileUrl: formData.get("fileUrl") as string,
        providerId: finalProviderId,
        completedAt: new Date(),
      },
    }),
    prisma.task.update({
      where: { id: taskId },
      data: {
        lastDone: new Date(),
        dueDate: nextDue
      }
    })
  ]);

  revalidatePath(`/homes/${task.homeId}`);
}

export async function deleteTaskAction(taskId: string, homeId: string) {
  await prisma.task.delete({ where: { id: taskId } });
  revalidatePath(`/homes/${homeId}`);
}

export async function updateTaskAction(formData: FormData) {
  const taskId = formData.get("taskId") as string;
  const homeId = formData.get("homeId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const frequency = formData.get("frequency") as string;
  const category = formData.get("category") as string; // Already present in your snippet, kept for consistency

  await prisma.task.update({
    where: { id: taskId },
    data: {
      title,
      description,
      frequency,
      category: category || "General",
    },
  });

  revalidatePath(`/homes/${homeId}`);
}