'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Dynamically import react-quill-new to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

interface PostFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function PostForm({ initialData, isEdit = false }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    tag: initialData?.tag || 'Latest',
    section: initialData?.section || 'main_feed',
    author: initialData?.author || '',
    imageUrl: initialData?.imageUrl || '',
    slug: initialData?.slug || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit ? `/api/admin/posts/${initialData._id}` : '/api/admin/posts';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save post');
      }

      router.push('/admin');
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-xl font-bold text-white">{isEdit ? 'Edit Article' : 'New Article'}</h2>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-6 py-2.5 rounded-md text-sm font-bold transition-all disabled:opacity-50"
        >
          {loading ? (
             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
             <Save className="w-4 h-4" />
          )}
          {loading ? 'Saving...' : 'Publish'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-400 mb-2">Title</label>
              <input
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter article title"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors text-lg font-serif"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-zinc-400 mb-2">Excerpt (Optional)</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Brief summary of the article"
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors resize-none"
              />
            </div>

            <div className="pt-2">
              <label className="block text-sm font-semibold text-zinc-400 mb-2">Article Content</label>
              <div className="bg-white text-black rounded-lg overflow-hidden">
                <ReactQuill 
                  theme="snow" 
                  value={formData.content} 
                  onChange={handleContentChange} 
                  className="h-96"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
            <h3 className="text-white font-bold mb-4 border-b border-zinc-800 pb-2">Publishing Details</h3>
            
            <div>
              <label className="block text-sm font-semibold text-zinc-400 mb-2">Category</label>
              <select
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500"
              >
                <option value="Latest">Latest</option>
                <option value="Markets">Markets</option>
                <option value="News">News</option>
                <option value="Brands Story">Brands Story</option>
                <option value="Politics">Politics</option>
                <option value="Business">Business</option>
                <option value="IPO">IPO</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-400 mb-2">Home Page Section</label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500"
              >
                <option value="main_feed">Main Feed (Top)</option>
                <option value="ledger">The Ledger (Sidebar)</option>
                <option value="featured">Featured Stories</option>
                <option value="opinions">Opinions</option>
                <option value="style">Style & Culture</option>
                <option value="weekend">Weekend Reads</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-400 mb-2">Author Name</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="e.g. Neha Sharma"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-400 mb-2">Custom Slug (Optional)</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="leave blank to auto-generate"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 font-mono text-xs"
              />
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
            <h3 className="text-white font-bold mb-4 border-b border-zinc-800 pb-2">Media</h3>
            <div>
              <label className="block text-sm font-semibold text-zinc-400 mb-2">Featured Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 text-sm"
              />
              {formData.imageUrl && (
                <div className="mt-4 aspect-video bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
