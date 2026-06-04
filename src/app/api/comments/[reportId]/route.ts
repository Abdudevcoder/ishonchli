import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { commentSchema } from "@/lib/validations";

export async function GET(_req: Request, { params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;

  const comments = await prisma.comment.findMany({
    where: { reportId },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(comments);
}

export async function POST(request: Request, { params }: { params: Promise<{ reportId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reportId } = await params;
  const body = await request.json();

  const parsed = commentSchema.safeParse({ reportId, content: body.content });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: { reportId, userId: session.user.id, content: parsed.data.content },
    include: { user: { select: { id: true, name: true } } },
  });

  return NextResponse.json(comment, { status: 201 });
}
