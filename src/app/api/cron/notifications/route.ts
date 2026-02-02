import { prisma } from "@/lib/prisma";
import webpush from "web-push";
import { NextResponse } from "next/server";

// Configure the "Sender" identity
webpush.setVapidDetails(
  'mailto:lp.photography1313@gmail.com', // Your admin email for push service contact
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY!
);

export async function GET(request: Request) {
  // 1. SECURITY: Verify the request comes from your trusted Cron provider
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // 2. Normalize Dates (Start of today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 3. THE QUERY: Get tasks and drill up to get User Email + Push Tokens
    const tasks = await prisma.task.findMany({
      where: {
        dueDate: {
          in: [today, oneWeekFromNow, oneWeekAgo]
        }
      },
      include: {
        home: {
          include: {
            user: {
              include: {
                pushSubscriptions: true // This gets the device tokens
              }
            }
          }
        }
      }
    });

    const notificationsPromises: Promise<unknown>[] = [];

    // 4. PROCESS THE RESULTS
    for (const task of tasks) {
      const user = task.home.user;
      const userEmail = user.email; // <--- HERE IS YOUR USER EMAIL LOOKUP
      const subscriptions = user.pushSubscriptions;

      // Skip if the user has no registered devices
      if (!subscriptions || subscriptions.length === 0) {
        console.log(`No devices registered for user: ${userEmail}`);
        continue;
      }

      // Determine the context for the message
      let timingContext = "is due today!";
      if (task.dueDate > today) timingContext = "is due in 1 week.";
      if (task.dueDate < today) timingContext = "is 1 week overdue!";

      const payload = JSON.stringify({
        title: `Maintenance Alert: ${task.title}`,
        body: `Property: ${task.home.nickname}\nThis task ${timingContext}`,
        url: `/homes/${task.homeId}` 
      });

      console.log(`Notifying ${userEmail} about task: ${task.title}`);

      // 5. SEND TO ALL DEVICES
      const taskPromises = subscriptions.map(sub => 
        webpush.sendNotification({
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        }, payload).catch(async (err) => {
          // Cleanup dead tokens (User uninstalled browser or cleared cache)
          if (err.statusCode === 410 || err.statusCode === 401) {
            await prisma.pushSubscription.delete({ where: { id: sub.id } });
          }
        })
      );

      notificationsPromises.push(...taskPromises);
    }

    // 6. EXECUTE ALL DISPATCHES
    await Promise.all(notificationsPromises);

    return NextResponse.json({ 
      success: true, 
      tasksAnalyzed: tasks.length, 
      devicesNotified: notificationsPromises.length 
    });

  } catch (error) {
    console.error("CRON_ERROR:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}