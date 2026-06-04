import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const skip = (page - 1) * limit;

  const [sellers, total] = await Promise.all([
    prisma.seller.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { reports: true } } },
    }),
    prisma.seller.count(),
  ]);

  return NextResponse.json({ sellers, total, page, limit });
}
