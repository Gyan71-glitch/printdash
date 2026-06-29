'use client';

import { useState, useEffect, FormEvent } from 'react';
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
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/seed?tags=true')
      .then(res => res.json())
      .then(data => {
        if (data.success) setDynamicCategories(data.tags);
      })
      .catch(console.error);
  }, []);

  const STATIC_CATEGORIES = ["Latest", "Markets", "News", "Brands Story", "Politics", "Business", "IPO"];
  const allCategories = Array.from(new Set([...STATIC_CATEGORIES, ...dynamicCategories]));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85); // Compress to 85% JPEG
        setFormData(prev => ({ ...prev, imageUrl: dataUrl }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
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
              <div className="bg-white text-black rounded-lg overflow-hidden flex flex-col h-[500px]">
                <style dangerouslySetInnerHTML={{__html: `
                  .quill { display: flex; flex-direction: column; height: 100%; }
                  .ql-toolbar { flex-shrink: 0; }
                  .ql-container { flex-grow: 1; overflow-y: auto; height: auto !important; }
                  .ql-editor { min-height: 100%; }
                `}} />
                <ReactQuill 
                  theme="snow" 
                  value={formData.content} 
                  onChange={handleContentChange} 
                  className="flex-1"
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
              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                list="category-options"
                placeholder="Select or type a new category..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500"
              />
              <datalist id="category-options">
                {allCategories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
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
              <label className="block text-sm font-semibold text-zinc-400 mb-2">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-900/30 file:text-red-500 hover:file:bg-red-900/50 transition-all cursor-pointer border border-zinc-800 rounded-lg bg-zinc-950"
              />
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="flex-shrink-0 mx-4 text-zinc-500 text-xs uppercase font-bold">OR PASTE LINK</span>
              <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-zinc-400">Featured Image URL</label>
                <button 
                  type="button"
                  onClick={async () => {
                    if (!formData.imageUrl) return;
                    // If it already looks like a direct image link, don't scrape
                    if (formData.imageUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i)) return;
                    
                    try {
                      const res = await fetch('/api/scrape-image', {
                        method: 'POST',
                        body: JSON.stringify({ url: formData.imageUrl })
                      });
                      const data = await res.json();
                      if (data.imageUrl) {
                        setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
                      } else {
                        alert("Could not extract an image from this link. Try pasting the direct Image Address (right-click the image -> Copy Image Address).");
                      }
                    } catch (e) {
                      alert("Error extracting image. Please paste a direct image URL.");
                    }
                  }}
                  className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1 rounded transition-colors font-bold"
                >
                  Extract Image from Link
                </button>
              </div>
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
