import Link from 'next/link'
import Image from 'next/image'
import { searchPosts, getAllPosts } from '@/lib/posts'

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const posts = query ? await searchPosts(query) : await getAllPosts();

  return (
    <div className="w-full bg-white dark:bg-black font-sans min-h-screen">
      <main className="max-w-[1600px] mx-auto px-4 md:px-8 w-full py-8 md:py-12">
        
        {/* Search Header */}
        <header className="mb-10 lg:mb-16 border-b-2 border-black dark:border-white pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[#B00000] font-black tracking-widest uppercase text-sm md:text-base mb-2 block">
              {query ? 'Search Results' : 'All Stories'}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black tracking-tight text-black dark:text-white leading-none">
              {query ? `"${query}"` : 'The Archive'}
            </h1>
          </div>
          <div className="text-sm font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">
            {posts.length} {posts.length === 1 ? 'Article' : 'Articles'} {query ? 'Found' : 'Available'}
          </div>
        </header>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {posts.length > 0 ? (
            posts.map((post: any, index: number) => (
              <Link 
                key={post._id} 
                href={`/article/${post._id}`}
                className="group flex flex-col h-full border-t border-zinc-200 dark:border-zinc-800 pt-4"
              >
                <div className="mb-3">
                  <span className="text-[#B00000] font-black text-[10px] md:text-[11px] uppercase tracking-widest">
                    {post.tag || post.section}
                  </span>
                </div>
                {post.imageUrl && (
                  <div className="relative aspect-[4/3] w-full mb-4 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                )}
                <h2 className="font-serif font-black text-xl md:text-2xl leading-[1.1] text-black dark:text-white mb-2 group-hover:text-[#B00000] transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="font-serif text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-snug line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-auto pt-4 flex items-center justify-between text-[11px] text-zinc-500 font-bold uppercase tracking-widest">
                  <span>{post.author || 'Editorial Board'}</span>
                  <span>{post.timeAgo || new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-zinc-500 font-serif text-xl">
                {query ? `We couldn't find any articles matching "${query}".` : "Try searching for something else."}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
