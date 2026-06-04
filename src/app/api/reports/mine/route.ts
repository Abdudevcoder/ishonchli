import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reports = await prisma.report.findMany({
    where: { userId: session.user.id },
    include: {
      seller: { select: { id: true, phone: true, telegramUsername: true, marketplaceUsername: true } },
      _count: { select: { comments: true, votes: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reports);
}
