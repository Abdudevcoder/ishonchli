import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const seller = await prisma.seller.findUnique({
    where: { id },
    include: {
      reports: {
        where: { status: "APPROVED" },
        include: {
          user: { select: { id: true, name: true } },
          _count: { select: { comments: true, votes: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!seller) {
    return NextResponse.json({ error: "Seller not found" }, { status: 404 });
  }

  return NextResponse.json(seller);
}
