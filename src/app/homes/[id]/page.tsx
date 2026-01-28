// src/app/homes/[id]/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getHomeData } from "@/app/actions/homeActions";
import HomeDetailsClient from "./HomeDetailsClient";

export default async function HomeDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const home = await getHomeData(params.id, session.user.id);
  if (!home) notFound();

  const allUserProviders = await prisma.serviceProvider.findMany({
    where: { userId: session.user.id },
    orderBy: { name: 'asc' }
  });

  return <HomeDetailsClient home={home} allUserProviders={allUserProviders} />;
}