import { Prisma } from "@/generated/client/client";

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