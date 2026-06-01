'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FilePlus, Trash2, Pencil, Eye, RefreshCw } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  tag: string;
  author: string;
  publishedAt: string;
  imageUrl?: string;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/posts');
      const data = await res.json();
      setPosts(data);
    } catch (e) {
      console.error('Failed to load posts', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
      setPosts(prev => prev.filter(p => p._id !== id));
    } catch (e) {
      alert('Failed to delete post.');
    } finally {
      setDeleting(null);
    }
  };

  const TAG_COLORS: Record<string, string> = {
    'Latest': 'bg-blue-900/50 text-blue-300',
    'Markets': 'bg-green-900/50 text-green-300',
    'News': 'bg-orange-900/50 text-orange-300',
    'Brands Story': 'bg-purple-900/50 text-purple-300',
    'Politics': 'bg-red-900/50 text-red-300',
    'Business': 'bg-yellow-900/50 text-yellow-300',
    'IPO': 'bg-teal-900/50 text-teal-300',
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">All Articles</h1>
          <p className="text-zinc-500 text-sm mt-1">{posts.length} total articles in the database</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPosts}
            className="p-2 rounded-md bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-4 py-2.5 rounded-md text-sm font-bold transition-all"
          >
            <FilePlus className="w-4 h-4" />
            New Article
          </Link>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-widest">
                <th className="text-left px-6 py-4 font-semibold">Title</th>
                <th className="text-left px-6 py-4 font-semibold hidden md:table-cell">Category</th>
                <th className="text-left px-6 py-4 font-semibold hidden lg:table-cell">Author</th>
                <th className="text-left px-6 py-4 font-semibold hidden lg:table-cell">Published</th>
                <th className="text-right px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {posts.map(post => (
                <tr key={post._id} className="hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-white line-clamp-1 max-w-xs lg:max-w-md">{post.title}</p>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${TAG_COLORS[post.tag] || 'bg-zinc-800 text-zinc-400'}`}>
                      {post.tag}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell text-zinc-400">{post.author || '—'}</td>
                  <td className="px-6 py-4 hidden lg:table-cell text-zinc-500 text-xs">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/article/${post._id}`}
                        target="_blank"
                        className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-700 transition-all"
                        title="View Live"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/posts/${post._id}/edit`}
                        className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-700 transition-all"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post._id, post.title)}
                        disabled={deleting === post._id}
                        className="p-1.5 rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-900/30 transition-all disabled:opacity-40"
                        title="Delete"
                      >
                        {deleting === post._id
                          ? <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" />
                          : <Trash2 className="w-4 h-4" />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {posts.length === 0 && !loading && (
            <div className="text-center py-20 text-zinc-500">
              <p className="text-lg font-semibold mb-2">No articles yet</p>
              <p className="text-sm mb-6">Get started by creating your first article.</p>
              <Link href="/admin/posts/new" className="bg-red-700 text-white px-6 py-3 rounded-md text-sm font-bold hover:bg-red-600 transition-all">
                Create First Article
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
