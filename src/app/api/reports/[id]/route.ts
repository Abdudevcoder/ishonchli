import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recalculateSellerTrust } from "@/lib/trust-score";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const report = await prisma.report.findUnique({
    where: { id },
    include: {
      seller: true,
      user: { select: { id: true, name: true, createdAt: true } },
      comments: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "asc" },
      },
      votes: { select: { userId: true, voteType: true } },
    },
  });

  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  return NextResponse.json(report);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const { status } = body;

  if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const report = await prisma.report.update({
    where: { id },
    data: { status },
    include: { seller: true },
  });

  // Recalculate trust after moderation
  await recalculateSellerTrust(report.sellerId);

  return NextResponse.json(report);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.report.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
