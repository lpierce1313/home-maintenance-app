import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Check for Vercel's Cron Secret to ensure only the cron can call this
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Perform a simple read or write to register activity
    // Counting homes is a lightweight way to poke the DB
    const count = await prisma.home.count();
    
    return NextResponse.json({ 
      success: true, 
      message: `Heartbeat successful. Homes found: ${count}`,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error("Cron failed:", error);
    return NextResponse.json({ success: false, error: "Database poke failed" }, { status: 500 });
  }
}