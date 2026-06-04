import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reportSchema } from "@/lib/validations";
import { recalculateSellerTrust } from "@/lib/trust-score";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (type) where.type = type;
  if (status) where.status = status;

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        seller: { select: { id: true, phone: true, telegramUsername: true, marketplaceUsername: true, trustScore: true, riskLevel: true } },
        user: { select: { id: true, name: true } },
        _count: { select: { comments: true, votes: true } },
      },
    }),
    prisma.report.count({ where }),
  ]);

  return NextResponse.json({ reports, total, page, limit });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = reportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { phone, telegramUsername, marketplaceUsername, category, description, evidenceUrl } = parsed.data;

    if (!phone && !telegramUsername && !marketplaceUsername) {
      return NextResponse.json({ error: "At least one seller identifier required" }, { status: 400 });
    }

    // Find or create seller
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
        category,
        description,
        evidenceUrl: evidenceUrl || null,
        type: "FRAUD",
        status: "PENDING",
      },
      include: {
        seller: true,
        user: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
