"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Heart, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";

interface LikeButtonProps {
  postId: string;
}

export function LikeButton({ postId }: LikeButtonProps) {
  const { data: session } = useSession();
  const { openSignInModal } = useAuth();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const fetchLikes = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`);
      const data = await res.json();
      setLiked(data.liked);
      setCount(data.count);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => { fetchLikes(); }, [fetchLikes]);

  const handleToggle = async () => {
    if (!session) { openSignInModal(); return; }
    if (toggling) return;

    // Optimistic update
    setToggling(true);
    setLiked(v => !v);
    setCount(v => liked ? v - 1 : v + 1);

    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      const data = await res.json();
      setLiked(data.liked);
      setCount(data.count);
    } catch {
      // Rollback on error
      setLiked(v => !v);
      setCount(v => liked ? v + 1 : v - 1);
    } finally {
      setToggling(false);
    }
  };

  if (loading) return <div className="w-16 h-8 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />;

  return (
    <button
      onClick={handleToggle}
      disabled={toggling}
      className={`group flex items-center gap-2 py-2 px-4 border transition-all duration-300 font-sans text-sm font-bold ${
        liked
          ? "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-600"
          : "border-zinc-200 dark:border-zinc-700 hover:border-red-400 hover:text-red-600 text-zinc-600 dark:text-zinc-400"
      }`}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <motion.div
        animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        <Heart
          className={`w-4 h-4 transition-colors ${liked ? "fill-red-500 stroke-red-500" : "stroke-current"}`}
        />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {count} {count === 1 ? "like" : "likes"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
