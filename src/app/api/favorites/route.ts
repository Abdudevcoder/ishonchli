import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      seller: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(favorites);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sellerId } = await request.json();
  if (!sellerId) return NextResponse.json({ error: "sellerId required" }, { status: 400 });

  const favorite = await prisma.favorite.upsert({
    where: { userId_sellerId: { userId: session.user.id, sellerId } },
    update: {},
    create: { userId: session.user.id, sellerId },
  });

  return NextResponse.json(favorite, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sellerId } = await request.json();
  if (!sellerId) return NextResponse.json({ error: "sellerId required" }, { status: 400 });

  await prisma.favorite.deleteMany({
    where: { userId: session.user.id, sellerId },
  });

  return NextResponse.json({ success: true });
}
