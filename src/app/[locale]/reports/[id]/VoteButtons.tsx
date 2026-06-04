"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

interface Vote { userId: string; voteType: string }

export function VoteButtons({ reportId, upvotes: initial_up, downvotes: initial_down, userVotes }: {
  reportId: string;
  upvotes: number;
  downvotes: number;
  userVotes: Vote[];
}) {
  const { data: session } = useSession();
  const [upvotes, setUpvotes] = useState(initial_up);
  const [downvotes, setDownvotes] = useState(initial_down);
  const [myVote, setMyVote] = useState<string | null>(
    userVotes.find((v) => v.userId === session?.user?.id)?.voteType ?? null
  );
  const [loading, setLoading] = useState(false);

  async function vote(type: "UPVOTE" | "DOWNVOTE") {
    if (!session?.user || loading) return;
    setLoading(true);

    const prevVote = myVote;
    // Optimistic update
    if (prevVote === type) {
      setMyVote(null);
      type === "UPVOTE" ? setUpvotes((v) => v - 1) : setDownvotes((v) => v - 1);
    } else {
      if (prevVote) prevVote === "UPVOTE" ? setUpvotes((v) => v - 1) : setDownvotes((v) => v - 1);
      setMyVote(type);
      type === "UPVOTE" ? setUpvotes((v) => v + 1) : setDownvotes((v) => v + 1);
    }

    await fetch("/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportId, voteType: type }),
    });
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => vote("UPVOTE")}
        disabled={!session?.user || loading}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border transition ${
          myVote === "UPVOTE"
            ? "bg-green-50 border-green-300 text-green-700"
            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
        } disabled:opacity-50`}
      >
        ▲ {upvotes}
      </button>
      <button
        onClick={() => vote("DOWNVOTE")}
        disabled={!session?.user || loading}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border transition ${
          myVote === "DOWNVOTE"
            ? "bg-red-50 border-red-300 text-red-700"
            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
        } disabled:opacity-50`}
      >
        ▼ {downvotes}
      </button>
    </div>
  );
}
