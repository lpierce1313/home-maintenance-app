import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function getProvidersAction() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  const rawProviders = await prisma.serviceProvider.findMany({
    where: { userId: session.user.id },
    include: {
      logs: {
        include: { 
          task: { 
            include: { home: true } 
          } 
        },
        orderBy: { completedAt: 'desc' },
      }
    },
    orderBy: { name: 'asc' }
  });

  return rawProviders.map(pro => ({
    ...pro,
    jobCount: pro.logs.length,
    lastLog: pro.logs[0] || null
  }));
}

export async function getProviderStats(homeId: string) {
  const stats = await prisma.maintenanceLog.groupBy({
    by: ['performedBy'],
    where: {
      task: { homeId: homeId },
      performedBy: { 
        not: null,
        notIn: ["", "Self", "self", "none"]
      }
    },
    _count: { id: true },
    _sum: { cost: true },
  });

  const providersWithDetails = await Promise.all(
    stats.map(async (provider) => {
      const lastLog = await prisma.maintenanceLog.findFirst({
        where: { 
          performedBy: provider.performedBy,
          task: { homeId: homeId }
        },
        orderBy: { completedAt: 'desc' },
        select: { completedAt: true, task: { select: { title: true } } }
      });

      return {
        name: provider.performedBy,
        totalJobs: provider._count.id,
        totalSpent: provider._sum.cost || 0,
        lastJobDate: lastLog?.completedAt,
        lastJobTitle: lastLog?.task.title
      };
    })
  );

  return providersWithDetails.sort((a, b) => b.totalSpent - a.totalSpent);
}