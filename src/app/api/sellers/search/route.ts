import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 1) {
    return NextResponse.json({ error: "Query required" }, { status: 400 });
  }

  const sellers = await prisma.seller.findMany({
    where: {
      OR: [
        { phone: { contains: q, mode: "insensitive" } },
        { telegramUsername: { contains: q, mode: "insensitive" } },
        { marketplaceUsername: { contains: q, mode: "insensitive" } },
      ],
    },
    include: {
      _count: {
        select: {
          reports: { where: { type: "FRAUD", status: "APPROVED" } },
        },
      },
    },
    take: 20,
  });

  return NextResponse.json(sellers);
}
