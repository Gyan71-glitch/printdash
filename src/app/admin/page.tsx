"use client";

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, LayoutDashboard, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

export const dynamic = "force-dynamic";


type Section = 'news_flash' | 'main_feed' | 'featured' | 'opinions' | 'ledger' | 'visual' | 'politics' | 'style';

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'news_flash', label: 'News Flash (Live)' },
  { id: 'main_feed', label: 'Main News Feed' },
  { id: 'featured', label: 'Featured Media' },
  { id: 'opinions', label: 'Opinions' },
  { id: 'ledger', label: 'More from The Ledger' },
  { id: 'visual', label: 'Visual Investigations' },
  { id: 'politics', label: 'Politics Focus' },
  { id: 'style', label: 'The Style Section' },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<Section>('main_feed');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>({});

  const fetchPosts = async (section: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?section=${section}`);
      const json = await res.json();
      if (json.success) {
        setPosts(json.data);
      } else {
        console.error(json.error);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts(activeSection);
  }, [activeSection]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = currentPost._id ? 'PUT' : 'POST';
    
    // Auto-assign section
    const postData = { ...currentPost, section: activeSection };

    try {
      const res = await fetch('/api/posts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      const json = await res.json();
      if (json.success) {
        setIsEditing(false);
        setCurrentPost({});
        fetchPosts(activeSection);
      } else {
        alert("Error saving: " + json.error);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPosts(activeSection);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-[#0A0A0A] border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-red-600" />
          <h1 className="font-serif font-black text-xl tracking-tight">The Ledger CMS</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {SECTIONS.map((sec) => (
              <li key={sec.id}>
                <button
                  onClick={() => { setActiveSection(sec.id); setIsEditing(false); }}
                  className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    activeSection === sec.id
                      ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  {sec.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
             <Link href="/" className="block text-center w-full px-4 py-2 bg-zinc-900 text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-widest rounded-md hover:opacity-90">View Live Site</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-[#0A0A0A] px-8 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-2xl font-serif font-black">
            {SECTIONS.find(s => s.id === activeSection)?.label}
          </h2>
          <button
            onClick={() => { setIsEditing(true); setCurrentPost({}); }}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-bold shadow hover:bg-red-700 transition"
          >
            <Plus className="w-4 h-4" /> Create Post
          </button>
        </header>

        {/* Workspace */}
        <div className="flex-1 overflow-y-auto p-8">
          {isEditing ? (
            <div className="max-w-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0A0A0A] p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-6 font-serif">{currentPost._id ? 'Edit Post' : 'New Post'}</h3>
              <form onSubmit={handleSave} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                     <div className="col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Title</label>
                        <input required type="text" value={currentPost.title || ''} onChange={e => setCurrentPost({...currentPost, title: e.target.value})} className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-transparent rounded focus:ring-1 focus:ring-red-600 outline-none" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Sub Type / Variation</label>
                        <input type="text" placeholder="top, sub, main, side..." value={currentPost.subType || ''} onChange={e => setCurrentPost({...currentPost, subType: e.target.value})} className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-transparent rounded focus:ring-1 focus:ring-red-600 outline-none" />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Link URL</label>
                        <input type="text" value={currentPost.url || ''} onChange={e => setCurrentPost({...currentPost, url: e.target.value})} className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-transparent rounded focus:ring-1 focus:ring-red-600 outline-none" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Author</label>
                        <input type="text" value={currentPost.author || ''} onChange={e => setCurrentPost({...currentPost, author: e.target.value})} className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-transparent rounded focus:ring-1 focus:ring-red-600 outline-none" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Tag / Category</label>
                        <input type="text" value={currentPost.tag || ''} onChange={e => setCurrentPost({...currentPost, tag: e.target.value})} className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-transparent rounded focus:ring-1 focus:ring-red-600 outline-none" />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Time Ago</label>
                        <input type="text" placeholder="2 hours ago..." value={currentPost.timeAgo || ''} onChange={e => setCurrentPost({...currentPost, timeAgo: e.target.value})} className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-transparent rounded focus:ring-1 focus:ring-red-600 outline-none" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Order</label>
                        <input type="number" value={currentPost.order || 0} onChange={e => setCurrentPost({...currentPost, order: parseInt(e.target.value)})} className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-transparent rounded focus:ring-1 focus:ring-red-600 outline-none" />
                    </div>
                    
                    <div className="col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Image URL</label>
                        <input type="text" value={currentPost.imageUrl || ''} onChange={e => setCurrentPost({...currentPost, imageUrl: e.target.value})} className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-transparent rounded focus:ring-1 focus:ring-red-600 outline-none" />
                    </div>
                    
                    <div className="col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Description / Excerpt</label>
                        <textarea rows={3} value={currentPost.excerpt || currentPost.description || ''} onChange={e => setCurrentPost({...currentPost, excerpt: e.target.value, description: e.target.value})} className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-transparent rounded focus:ring-1 focus:ring-red-600 outline-none"></textarea>
                    </div>
                    
                    <div className="col-span-2 flex items-center gap-2">
                        <input type="checkbox" id="isLive" checked={currentPost.isLive || false} onChange={e => setCurrentPost({...currentPost, isLive: e.target.checked})} className="w-4 h-4" />
                        <label htmlFor="isLive" className="text-sm font-bold">Mark as "Live" (For News Flash)</label>
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-semibold rounded-md border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition flex-1">Cancel</button>
                  <button type="submit" disabled={loading} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-bold uppercase tracking-widest rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition flex-1">
                    {loading ? 'Saving...' : 'Save Post'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                   <thead className="text-xs uppercase bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                     <tr>
                       <th className="px-6 py-4">Title</th>
                       <th className="px-6 py-4">Type/Order</th>
                       <th className="px-6 py-4">Date</th>
                       <th className="px-6 py-4 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody>
                     {loading && posts.length === 0 && (
                         <tr><td colSpan={4} className="px-6 py-8 text-center text-zinc-500"><RefreshCcw className="w-5 h-5 mx-auto animate-spin" /></td></tr>
                     )}
                     {!loading && posts.length === 0 && (
                         <tr><td colSpan={4} className="px-6 py-8 text-center text-zinc-500">No posts found in this section.</td></tr>
                     )}
                     {posts.map(post => (
                       <tr key={post._id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                         <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white max-w-xs truncate" title={post.title}>
                             {post.isLive && <span className="inline-block w-2 h-2 bg-red-600 rounded-full mr-2"></span>}
                             {post.title}
                         </td>
                         <td className="px-6 py-4 text-zinc-500">{post.subType || 'Default'} <span className="text-xs opacity-50 bg-zinc-200 dark:bg-zinc-800 px-1 rounded ml-1">Ord:{post.order}</span></td>
                         <td className="px-6 py-4 text-zinc-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                         <td className="px-6 py-4 text-right space-x-2">
                           <button onClick={() => { setCurrentPost(post); setIsEditing(true); }} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1">
                              <Edit2 className="w-4 h-4" />
                           </button>
                           <button onClick={() => handleDelete(post._id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1">
                              <Trash2 className="w-4 h-4" />
                           </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
