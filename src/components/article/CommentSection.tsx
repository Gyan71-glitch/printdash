"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/components/auth/AuthProvider";

interface Comment {
  _id: string;
  userName: string;
  userImage?: string;
  body: string;
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { data: session } = useSession();
  const { openSignInModal } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchComments = useCallback(async () => {
    const res = await fetch(`/api/posts/${postId}/comments`);
    const data = await res.json();
    setComments(data.data || []);
    setLoading(false);
  }, [postId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { openSignInModal(); return; }
    if (!body.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setComments(prev => [data.data, ...prev]);
      setBody("");
    } catch {
      setError("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const initials = (name: string) =>
    name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <section className="mt-16 pt-10 border-t-2 border-black dark:border-white">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="w-5 h-5" />
        <h2 className="font-serif font-black text-2xl">
          Comments <span className="text-zinc-400 dark:text-zinc-600 font-sans text-lg font-normal">({comments.length})</span>
        </h2>
      </div>

      {/* Submit Form */}
      <div className="mb-10">
        {session ? (
          <form onSubmit={handleSubmit}>
            <div className="flex items-start gap-3">
              {/* User Avatar */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden text-sm font-bold text-zinc-600 dark:text-zinc-400">
                {session.user?.image ? (
                  <Image src={session.user.image} alt="" width={40} height={40} className="object-cover w-full h-full" />
                ) : (
                  initials(session.user?.name || "?")
                )}
              </div>
              <div className="flex-1">
                <textarea
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  placeholder={`Join the discussion as ${session.user?.name?.split(" ")[0]}…`}
                  rows={3}
                  maxLength={2000}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors resize-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-zinc-400">{body.length}/2000</span>
                  <button
                    type="submit"
                    disabled={submitting || !body.trim()}
                    className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-5 py-2 text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                    Post
                  </button>
                </div>
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
              </div>
            </div>
          </form>
        ) : (
          <button
            onClick={openSignInModal}
            className="w-full py-5 border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-center text-zinc-500 dark:text-zinc-400 hover:border-black dark:hover:border-white hover:text-zinc-900 dark:hover:text-white transition-all text-sm font-bold"
          >
            Sign in to join the conversation →
          </button>
        )}
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-32" />
                <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-full" />
                <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-zinc-400 dark:text-zinc-600 text-sm font-serif italic text-center py-8">
          Be the first to share your thoughts…
        </p>
      ) : (
        <AnimatePresence initial={false}>
          <div className="space-y-8">
            {comments.map(comment => (
              <motion.div
                key={comment._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex gap-3"
              >
                {/* Avatar */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden text-sm font-bold text-zinc-600 dark:text-zinc-400">
                  {comment.userImage ? (
                    <Image src={comment.userImage} alt="" width={40} height={40} className="object-cover w-full h-full" />
                  ) : (
                    initials(comment.userName)
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-baseline gap-3 mb-1.5">
                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{comment.userName}</span>
                    <span className="text-xs text-zinc-400">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-[15px] text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {comment.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </section>
  );
}
