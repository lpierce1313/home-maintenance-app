'use server'
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleTaskStatus(taskId: string, currentStatus: string) {
  const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
  
  await prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus }
  });

  revalidatePath("/homes/[id]", "page");
}

export async function createTaskAction(formData: FormData) {
  const homeId = formData.get("homeId") as string;
  const title = formData.get("title") as string;
  const frequency = formData.get("frequency") as string;
  const lastDoneVal = formData.get("lastDone") as string;

  // Logic: Calculate due date based on Last Done or Today
  const startPoint = lastDoneVal ? new Date(lastDoneVal) : new Date();
  const dueDate = new Date(startPoint);
  
  if (frequency === 'monthly') dueDate.setMonth(dueDate.getMonth() + 1);
  else if (frequency === 'quarterly') dueDate.setMonth(dueDate.getMonth() + 3);
  else if (frequency === 'annually') dueDate.setFullYear(dueDate.getFullYear() + 1);

  await prisma.task.create({
    data: {
      title,
      frequency,
      dueDate,
      lastDone: lastDoneVal ? new Date(lastDoneVal) : null,
      homeId
    }
  });
  revalidatePath(`/homes/${homeId}`);
}

export async function completeTaskAction(formData: FormData) {
  const taskId = formData.get("taskId") as string;
  const homeId = formData.get("homeId") as string;
  const fileUrl = formData.get("fileUrl") as string; // Received from the hidden input
  const cost = parseFloat(formData.get("cost") as string || "0");

  await prisma.maintenanceLog.create({
    data: {
      taskId,
      cost,
      fileUrl,
      performedBy: formData.get("performedBy") as string,
      comment: formData.get("comment") as string,
    }
  });

  // 2. Set new Due Date
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (task) {
    const newDue = new Date(); // Next cycle starts from today (completion date)
    if (task.frequency === 'monthly') newDue.setMonth(newDue.getMonth() + 1);
    else if (task.frequency === 'quarterly') newDue.setMonth(newDue.getMonth() + 3);
    else if (task.frequency === 'annually') newDue.setFullYear(newDue.getFullYear() + 1);

    await prisma.task.update({
      where: { id: taskId },
      data: { dueDate: newDue, lastDone: new Date() }
    });
  }
  revalidatePath(`/homes/${homeId}`);
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

  await prisma.task.update({
    where: { id: taskId },
    data: {
      title,
      description,
      frequency,
    },
  });

  revalidatePath(`/homes/${homeId}`);
}