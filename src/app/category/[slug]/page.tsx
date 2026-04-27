import Link from 'next/link'
import Image from 'next/image'
import { getPostsByTag } from '@/lib/posts'
import { notFound } from 'next/navigation'

export const dynamic = "force-dynamic";


interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const posts = await getPostsByTag(decodedSlug);

  const categoryName = decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1).replace(/_/g, ' ');

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="w-full bg-white dark:bg-black font-sans min-h-screen">
      <main className="max-w-[1600px] mx-auto px-4 md:px-8 w-full py-8 md:py-12">
        
        {/* Category Header */}
        <header className="mb-10 lg:mb-16 border-b-2 border-black dark:border-white pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-[40px] sm:text-[56px] lg:text-[72px] font-black uppercase tracking-tighter text-zinc-900 dark:text-zinc-100 leading-[0.9]">
              {categoryName}
            </h1>
            <p className="text-zinc-500 font-sans tracking-[0.2em] uppercase text-[10px] md:text-[11px] font-black mt-2">
              Deep Intelligence & Investigative Coverage
            </p>
          </div>
          <div className="flex md:flex-col items-center md:items-end gap-3">
             <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] bg-red-700 text-white px-2 py-1">Archive {new Date().getFullYear()}</span>
             <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{posts.length} STORIES FOUND</span>
          </div>
        </header>

        {posts.length === 0 ? (
          <div className="py-24 lg:py-32 text-center border border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950 rounded-sm">
            <h2 className="font-serif text-3xl font-bold mb-4">No stories found in this section.</h2>
            <p className="text-zinc-500 mb-8">Check back later for updates or explore our other sections.</p>
            <Link href="/" className="inline-block bg-black dark:bg-white text-white dark:text-black px-10 py-4 font-black uppercase tracking-widest text-[11px] hover:bg-red-700 hover:text-white transition-all">Return Home</Link>
          </div>
        ) : (
          <>
            {/* Top Featured Post in Category */}
            {featuredPost && (
              <Link href={`/article/${featuredPost._id}`} className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-12 lg:mb-20 border-b border-zinc-200 dark:border-zinc-800 pb-12 lg:pb-20">
                <div className="lg:col-span-7 xl:col-span-8 relative aspect-[16/10] sm:aspect-[21/9] lg:aspect-auto lg:h-[500px] bg-zinc-100 dark:bg-zinc-900 overflow-hidden shadow-sm">
                   <Image 
                     src={featuredPost.imageUrl || `https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1500&auto=format&fit=crop`} 
                     alt={featuredPost.title} 
                     fill 
                     sizes="(max-width: 1024px) 100vw, 1000px"
                     className="object-cover group-hover:scale-105 transition-transform duration-[3s]" 
                     priority
                   />
                </div>
                <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-center">
                  <span className="text-red-700 dark:text-red-500 font-black uppercase tracking-[0.2em] text-[10px] md:text-[11px] mb-4">Featured Story</span>
                  <h2 className="font-serif text-[32px] sm:text-[44px] lg:text-[52px] font-black leading-[1] lg:leading-[0.95] tracking-tighter mb-6 group-hover:text-red-700 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-lg lg:text-xl mb-8 leading-relaxed font-serif italic">
                    {featuredPost.excerpt || featuredPost.description}
                  </p>
                  <div className="flex items-center text-[10px] md:text-[11px] font-black text-zinc-500 uppercase tracking-widest gap-4 border-t border-zinc-100 dark:border-zinc-900 pt-6">
                    <span className="text-zinc-900 dark:text-white">By {featuredPost.author || "Editorial Board"}</span>
                    <span className="text-zinc-300">|</span>
                    <span>{featuredPost.timeAgo || "Updated moments ago"}</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 lg:gap-x-12 gap-y-12 lg:gap-y-16">
              {otherPosts.map((post: any) => (
                <Link href={`/article/${post._id}`} key={post._id} className="group flex flex-col h-full border-t border-zinc-100 dark:border-zinc-900 pt-8">
                  <div className="relative aspect-[3/2] mb-6 overflow-hidden bg-zinc-100 dark:bg-zinc-900 grayscale group-hover:grayscale-0 transition-all duration-500 shadow-sm">
                     <Image 
                       src={post.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=400&auto=format&fit=crop"} 
                       fill 
                       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                       alt="" 
                       className="object-cover group-hover:scale-105 transition-transform duration-700" 
                     />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <span className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">
                      {post.tag || categoryName} • {post.timeAgo || "Recent Coverage"}
                    </span>
                    <h3 className="font-serif text-[20px] lg:text-[24px] font-black leading-tight mb-4 group-hover:text-red-700 transition-colors tracking-tight">
                      {post.title}
                    </h3>
                    <p className="text-[13px] md:text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3 mb-6">
                      {post.excerpt || post.description}
                    </p>
                    <div className="mt-auto pt-4 border-t border-zinc-50 dark:border-zinc-950 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                       {post.author || "The Indian Berg Staff"}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

      </main>
    </div>
  )
}
