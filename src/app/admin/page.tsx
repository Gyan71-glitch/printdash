'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { FilePlus, Trash2, Pencil, Eye, RefreshCw, Search, SlidersHorizontal, X, ChevronUp, ChevronDown } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  tag: string;
  author: string;
  publishedAt: string;
  imageUrl?: string;
}

type SortField = 'publishedAt' | 'title' | 'tag' | 'author';
type SortDir = 'asc' | 'desc';

const TAG_COLORS: Record<string, string> = {
  'Latest': 'bg-blue-900/50 text-blue-300',
  'Markets': 'bg-green-900/50 text-green-300',
  'News': 'bg-orange-900/50 text-orange-300',
  'Brands Story': 'bg-purple-900/50 text-purple-300',
  'Politics': 'bg-red-900/50 text-red-300',
  'Business': 'bg-yellow-900/50 text-yellow-300',
  'IPO': 'bg-teal-900/50 text-teal-300',
};

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Filter & Sort State
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortField, setSortField] = useState<SortField>('publishedAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

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

  // Unique tags from all posts
  const allTags = useMemo(() => {
    const tags = new Set(posts.map(p => p.tag).filter(Boolean));
    return Array.from(tags).sort();
  }, [posts]);

  // Filtered & Sorted posts
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.author?.toLowerCase().includes(q) ||
        p.tag?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedTag) {
      result = result.filter(p => p.tag === selectedTag);
    }

    // Sort
    result.sort((a, b) => {
      let valA: any;
      let valB: any;

      if (sortField === 'publishedAt') {
        // Use publishedAt if valid, otherwise fall back to _id timestamp
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : NaN;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : NaN;

        // Extract timestamp from MongoDB ObjectID (first 4 bytes = unix seconds)
        const idTimeA = parseInt(a._id.substring(0, 8), 16) * 1000;
        const idTimeB = parseInt(b._id.substring(0, 8), 16) * 1000;

        valA = isNaN(dateA) ? idTimeA : dateA;
        valB = isNaN(dateB) ? idTimeB : dateB;
      } else {
        valA = (a[sortField as keyof Post] || '').toString().toLowerCase();
        valB = (b[sortField as keyof Post] || '').toString().toLowerCase();
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [posts, search, selectedTag, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp className="w-3 h-3 opacity-20" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-red-400" />
      : <ChevronDown className="w-3 h-3 text-red-400" />;
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedTag('');
    setSortField('publishedAt');
    setSortDir('desc');
  };

  const hasActiveFilters = search || selectedTag || sortField !== 'publishedAt' || sortDir !== 'desc';

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">All Articles</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {filteredPosts.length} of {posts.length} articles
          </p>
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

      {/* Filter Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by title, author, category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-red-600 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-zinc-500" />
          <select
            value={selectedTag}
            onChange={e => setSelectedTag(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
          >
            <option value="">All Categories</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <select
          value={`${sortField}:${sortDir}`}
          onChange={e => {
            const [f, d] = e.target.value.split(':');
            setSortField(f as SortField);
            setSortDir(d as SortDir);
          }}
          className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-600 transition-colors flex-shrink-0"
        >
          <option value="publishedAt:desc">Newest First</option>
          <option value="publishedAt:asc">Oldest First</option>
          <option value="title:asc">Title A→Z</option>
          <option value="title:desc">Title Z→A</option>
          <option value="tag:asc">Category A→Z</option>
          <option value="author:asc">Author A→Z</option>
        </select>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/30 px-3 py-2 rounded-lg transition-all flex-shrink-0"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
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
                <th className="text-left px-6 py-4 font-semibold">
                  <button onClick={() => toggleSort('title')} className="flex items-center gap-1 hover:text-white transition-colors">
                    Title <SortIcon field="title" />
                  </button>
                </th>
                <th className="text-left px-6 py-4 font-semibold hidden md:table-cell">
                  <button onClick={() => toggleSort('tag')} className="flex items-center gap-1 hover:text-white transition-colors">
                    Category <SortIcon field="tag" />
                  </button>
                </th>
                <th className="text-left px-6 py-4 font-semibold hidden lg:table-cell">
                  <button onClick={() => toggleSort('author')} className="flex items-center gap-1 hover:text-white transition-colors">
                    Author <SortIcon field="author" />
                  </button>
                </th>
                <th className="text-left px-6 py-4 font-semibold hidden lg:table-cell">
                  <button onClick={() => toggleSort('publishedAt')} className="flex items-center gap-1 hover:text-white transition-colors">
                    Published <SortIcon field="publishedAt" />
                  </button>
                </th>
                <th className="text-right px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredPosts.map(post => (
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
                        href={`/article/${post.slug || post._id}`}
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

          {filteredPosts.length === 0 && !loading && (
            <div className="text-center py-20 text-zinc-500">
              {hasActiveFilters ? (
                <>
                  <p className="text-lg font-semibold mb-2">No articles match your filters</p>
                  <button onClick={clearFilters} className="text-red-400 hover:text-red-300 text-sm font-bold">Clear filters</button>
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold mb-2">No articles yet</p>
                  <p className="text-sm mb-6">Get started by creating your first article.</p>
                  <Link href="/admin/posts/new" className="bg-red-700 text-white px-6 py-3 rounded-md text-sm font-bold hover:bg-red-600 transition-all">
                    Create First Article
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
