import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { TrustScore } from "@/components/ui/TrustScore";
import { CommentSection } from "./CommentSection";
import { VoteButtons } from "./VoteButtons";
import Link from "next/link";
import { ReportCategory, ReportStatus } from "@prisma/client";
import { getTranslations, getLocale } from "next-intl/server";

interface ReportPageProps {
  params: Promise<{ id: string; locale: string }>;
}

const statusVariant: Record<ReportStatus, "default" | "success" | "warning" | "danger"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};

export default async function ReportPage({ params }: ReportPageProps) {
  const { id, locale } = await params;
  const t = await getTranslations("report");
  const tCat = await getTranslations("categories");
  const tStatus = await getTranslations("status");

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

  if (!report) notFound();

  const upvotes = report.votes.filter((v) => v.voteType === "UPVOTE").length;
  const downvotes = report.votes.filter((v) => v.voteType === "DOWNVOTE").length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-4">
        <Link href={`/${locale}/reports`} className="text-sm text-blue-600 hover:underline">← {t("back")}</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant={report.type === "FRAUD" ? "danger" : "success"}>
                {report.type === "FRAUD" ? t("fraud") : t("positive")}
              </Badge>
              {report.type === "FRAUD" && (
                <Badge variant="default">{tCat(report.category as ReportCategory)}</Badge>
              )}
              <Badge variant={statusVariant[report.status]}>{tStatus(report.status)}</Badge>
            </div>

            <p className="text-gray-800 mb-4 leading-relaxed">{report.description}</p>

            {report.type === "POSITIVE" && report.rating && (
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < report.rating! ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-sm text-gray-500 ml-1">{report.rating}/5</span>
              </div>
            )}

            {report.evidenceUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600 mb-2">{t("evidence")}:</p>
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200">
                  <Image src={report.evidenceUrl} alt="Evidence" fill className="object-contain" />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                {t("reported_by")} <span className="font-medium text-gray-700">{report.user.name}</span>
                {" · "}
                {new Date(report.createdAt).toLocaleDateString()}
              </div>
              <VoteButtons reportId={report.id} upvotes={upvotes} downvotes={downvotes} userVotes={report.votes} />
            </div>
          </div>

          <CommentSection reportId={report.id} initialComments={report.comments} />
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-3">{t("seller_info")}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              {report.seller.phone && <div>📞 {report.seller.phone}</div>}
              {report.seller.telegramUsername && <div>✈ @{report.seller.telegramUsername}</div>}
              {report.seller.marketplaceUsername && <div>🛒 {report.seller.marketplaceUsername}</div>}
            </div>
            <Link href={`/${locale}/sellers/${report.seller.id}`} className="mt-3 block text-sm text-blue-600 hover:underline">
              {t("view_profile")} →
            </Link>
          </div>
          <TrustScore score={report.seller.trustScore} riskLevel={report.seller.riskLevel} />
        </div>
      </div>
    </div>
  );
}
