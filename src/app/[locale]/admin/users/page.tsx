export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";
import { UserManagementTable } from "./UserManagementTable";

interface AdminUsersPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1"));
  const limit = 20;
  const skip = (page - 1) * limit;

  const [users, total] = await safeDb(() => Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, name: true, email: true, role: true, createdAt: true,
        _count: { select: { reports: true } },
      },
    }),
    prisma.user.count(),
  ]), [[], 0]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Management</h1>
      <UserManagementTable users={users} total={total} page={page} limit={limit} />
    </div>
  );
}
