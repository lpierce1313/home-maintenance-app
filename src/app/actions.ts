'use server';
import { revalidatePath } from 'next/cache';

export async function addTask(formData: FormData) {
  const title = formData.get('title');
  const homeId = formData.get('homeId');

  // 1. In a real app: await prisma.task.create({ data: { title, homeId } })
  console.log(`Saving task: ${title} for home ${homeId}`);

  // 2. Tell Next.js to refresh the data on the page
  revalidatePath(`/homes/${homeId}`);
}