import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { reportId, voteType } = body;

  if (!reportId || !["UPVOTE", "DOWNVOTE"].includes(voteType)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const existing = await prisma.vote.findUnique({
    where: { reportId_userId: { reportId, userId: session.user.id } },
  });

  if (existing) {
    if (existing.voteType === voteType) {
      await prisma.vote.delete({ where: { id: existing.id } });
      return NextResponse.json({ action: "removed" });
    }
    const vote = await prisma.vote.update({
      where: { id: existing.id },
      data: { voteType },
    });
    return NextResponse.json({ action: "updated", vote });
  }

  const vote = await prisma.vote.create({
    data: { reportId, userId: session.user.id, voteType },
  });

  return NextResponse.json({ action: "created", vote }, { status: 201 });
}
