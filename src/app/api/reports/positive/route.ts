import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { phone, telegramUsername, marketplaceUsername, description, rating, evidenceUrl } = parsed.data;

    if (!phone && !telegramUsername && !marketplaceUsername) {
      return NextResponse.json({ error: "At least one seller identifier required" }, { status: 400 });
    }

    let seller = await prisma.seller.findFirst({
      where: {
        OR: [
          phone ? { phone } : undefined,
          telegramUsername ? { telegramUsername } : undefined,
          marketplaceUsername ? { marketplaceUsername } : undefined,
        ].filter(Boolean) as { phone?: string; telegramUsername?: string; marketplaceUsername?: string }[],
      },
    });

    if (!seller) {
      seller = await prisma.seller.create({
        data: { phone, telegramUsername, marketplaceUsername },
      });
    }

    const report = await prisma.report.create({
      data: {
        sellerId: seller.id,
        userId: session.user.id,
        category: "OTHER",
        description,
        evidenceUrl: evidenceUrl || null,
        type: "POSITIVE",
        status: "PENDING",
        rating,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
