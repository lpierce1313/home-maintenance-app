'use server';
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveSubscriptionAction(subscription: any) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const { endpoint, keys } = subscription;

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: {},
    create: {
      userId: session.user.id,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    },
  });

  return { success: true };
}