"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

interface Comment {
  id: string;
  content: string;
  createdAt: Date | string;
  user: { id: string; name: string };
}

export function CommentSection({ reportId, initialComments }: { reportId: string; initialComments: Comment[] }) {
  const { data: session } = useSession();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("report");
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError("");

    const res = await fetch(`/api/comments/${reportId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      const comment = await res.json();
      setComments((prev) => [...prev, comment]);
      setContent("");
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to post comment");
    }
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-800 mb-4">{t("comments")} ({comments.length})</h3>

      <div className="space-y-4 mb-6">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium text-blue-600">
              {c.user.name[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-700">{c.user.name}</span>
                <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-600">{c.content}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">{t("no_comments")}</p>
        )}
      </div>

      {session?.user ? (
        <form onSubmit={submit} className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("comment_placeholder")}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button type="submit" loading={loading} size="sm">{t("post_comment")}</Button>
        </form>
      ) : (
        <p className="text-sm text-gray-500 text-center">
          <a href={`/${locale}/auth/login`} className="text-blue-600 hover:underline">{t("login_link")}</a>{" "}
          {t("login_comment")}
        </p>
      )}
    </div>
  );
}
