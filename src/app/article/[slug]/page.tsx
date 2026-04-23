import Image from "next/image"
import Link from "next/link"
import { Share, MessageSquare, Home, Type, Printer, BookmarkPlus, ArrowLeft, Headphones } from "lucide-react"
import connectToDatabase from "@/lib/mongodb"
import Post from "@/models/Post"
import { notFound } from "next/navigation"
import { ReadingProgress } from "@/components/article/ReadingProgress"
import { LikeButton } from "@/components/article/LikeButton"
import { ShareButtons } from "@/components/article/ShareButtons"
import { CommentSection } from "@/components/article/CommentSection"
import { headers } from "next/headers"
import { AdBanner } from "@/components/ads/AdBanner"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  
  await connectToDatabase();
  let post;
  
  try {
    post = await Post.findById(slug).lean();
  } catch(e) {
    return notFound();
  }

  if (!post) {
    return notFound();
  }

  const defaultImage = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&auto=format&fit=crop";
  const host = (await headers()).get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const currentUrl = `${protocol}://${host}/article/${slug}`;

  return (
    <div className="w-full bg-white dark:bg-black font-sans min-h-screen">
      <ReadingProgress />
      
      {/* Mobile-only Hero Header overlay style */}
      <div className="md:hidden relative w-full h-[60vh] min-h-[400px]">
        <Image 
          src={post.imageUrl || defaultImage} 
          alt={post.title} 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 flex flex-col justify-between p-4">
          <div className="flex justify-between items-start w-full">
            <Link href="/" className="w-10 h-10 bg-black/40 backdrop-blur rounded-full flex items-center justify-center text-white text-[16px] border border-zinc-200/20">
               <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
          <div className="pb-4 text-white">
            <span className="font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">{post.tag || post.section || "Article"}</span>
            <h1 className="font-serif text-[32px] font-black leading-[1.1] drop-shadow-lg">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-10 md:py-16">
        
        {/* Desktop Title Header */}
        <header className="hidden md:block max-w-[900px] mx-auto text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="h-px w-8 bg-red-600"></span>
            <span className="text-sm font-black uppercase tracking-[0.2em] text-red-700 dark:text-red-500 whitespace-nowrap">
              {post.tag || post.section || "Article"}
            </span>
            <span className="h-px w-8 bg-red-600"></span>
          </div>
          <h1 className="font-serif text-[48px] md:text-[60px] font-black leading-[1.05] tracking-tighter text-zinc-950 dark:text-white mb-6">
            {post.title}
          </h1>
          <p className="font-serif italic text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-[800px] mx-auto leading-relaxed">
            {post.excerpt || post.description || "A deep dive into the latest developments shaping the global narrative."}
          </p>
        </header>

        {/* Action Row */}
        <div className="flex items-center justify-between border-y border-zinc-200 dark:border-zinc-800 py-4 mb-10 max-w-[800px] mx-auto">
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden grayscale">
               <Image src={post.authorImageUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"} fill alt="Author" className="object-cover" />
            </div>
            <div>
              <span className="block text-[13px] font-bold">
                By <Link href="#" className="text-zinc-950 dark:text-zinc-50 hover:text-red-700 transition-colors uppercase">{post.author || "The Ledger Editorial Board"}</Link>
              </span>
              <span className="block text-[12px] text-zinc-500 font-medium">
                Published {post.timeAgo || new Date(post.createdAt || Date.now()).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <LikeButton postId={post._id.toString()} />
             <button aria-label="Listen" className="hidden sm:flex items-center justify-center p-2 rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
               <Headphones className="w-4 h-4" />
             </button>
             <button aria-label="Bookmark" className="flex items-center justify-center p-2 rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
               <BookmarkPlus className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* 2-Column Desktop Content Section */}
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Main Content */}
            <article className="flex-1 min-w-0">
              {/* Feature Image */}
              <figure className="hidden md:block w-full mb-12">
                <div className="relative w-full aspect-[21/9] max-h-[450px] overflow-hidden bg-zinc-100 dark:bg-zinc-900 group">
                  <Image 
                    src={post.imageUrl || defaultImage} 
                    alt={post.title}
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-[3s]"
                    priority
                  />
                </div>
                {post.imageCaption && (
                  <figcaption className="mt-3 text-[13px] text-zinc-500 italic font-serif">
                    {post.imageCaption}
                  </figcaption>
                )}
              </figure>

              {/* Body Text */}
              <div className="editorial-measure text-zinc-900 dark:text-zinc-200">
                <div className="drop-cap prose prose-zinc dark:prose-invert max-w-none 
                             prose-p:font-serif prose-p:text-[20px] md:prose-p:text-[22px] prose-p:leading-[1.75] prose-p:mb-6
                             prose-a:text-red-700 dark:prose-a:text-red-500 prose-a:font-bold prose-a:underline-offset-4
                             prose-strong:font-black prose-strong:text-zinc-950 dark:prose-strong:text-white">
                  <p>{post.excerpt || post.description || "The global stock market rally hit a major roadblock on Thursday. The latest inflation figures from the Labor Department arrived hotter than economists anticipated, triggering a massive sell-off across equities, bonds, and even some commodities."}</p>
                  <p>For months, the defining narrative on Wall Street has been one of optimism—specifically, the belief that central banks were fully prepared to ease monetary policy. But the new Consumer Price Index (CPI) data suggests that the "last mile" of defeating inflation may be the hardest yet. As demonstrated by recent polling, <Link href="#">Democratic voters</Link> appear to be watching these developments closely.</p>
                  
                  {/* In-feed Ad */}
                  <AdBanner type="in-feed" className="my-10" />

                  <p>By midday trading, the S&P 500 was down more than 1.8%, while the tech-heavy Nasdaq Composite dropped 2.2%. Yields on the 10-year Treasury note, which move inversely to prices, spiked to their highest levels since November.</p>
                  <p>"What we are seeing today is a fundamental repricing of risk," said Michael Thorne, a senior portfolio manager at Horizon Asset Management. "The market had priced in three rate cuts this year. We might be lucky to get one."</p>
                  <p>The data revealed that core services, particularly housing and auto insurance, remained stubbornly expensive. While goods inflation has cooled dramatically, the service sector continues to run hot, fueled by a resilient labor market.</p>
                </div>
              </div>

              {/* Share & Like Footer Actions */}
              <div className="editorial-measure flex flex-col sm:flex-row items-center justify-between border-y border-zinc-200 dark:border-zinc-800 py-6 mt-8 gap-6">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Did you like this?</span>
                  <LikeButton postId={post._id.toString()} />
                </div>
                <div className="flex items-center gap-2">
                   <button className="flex items-center justify-center p-3 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                     <Printer className="w-4 h-4" />
                   </button>
                   <button className="flex items-center justify-center p-3 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                     <Type className="w-4 h-4" />
                   </button>
                </div>
              </div>

              {/* Components */}
              <div className="mt-8">
                <ShareButtons title={post.title} url={currentUrl} />
                
                {/* Leaderboard Ad before comments */}
                <AdBanner type="leaderboard" className="mt-12 mb-8" />

                <CommentSection postId={post._id.toString()} />
              </div>
            </article>

            {/* Sidebar (Tablet/Desktop only) */}
            <aside className="hidden lg:block w-[300px] flex-shrink-0">
               <div className="sticky top-24 space-y-10">
                  <div className="p-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                    <h4 className="font-serif font-black text-lg mb-2">Support Independent Journalism</h4>
                    <p className="text-[13px] text-zinc-500 mb-4 leading-relaxed">Read without limits and join a community of insightful readers for just $2/week.</p>
                    <button className="w-full bg-black dark:bg-white text-white dark:text-black py-4 font-black uppercase tracking-widest text-[11px] hover:bg-red-700 transition-colors">
                      Choose Plan
                    </button>
                  </div>

                  <div>
                     <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-red-700">Recommended</h4>
                     <ul className="space-y-6">
                        {[1, 2, 3].map(i => (
                          <li key={i} className="group cursor-pointer">
                             <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Business</span>
                             <h5 className="font-serif font-bold text-[16px] leading-snug group-hover:text-red-700 transition-colors">Why the global supply chain is facing another bottleneck in 2026.</h5>
                          </li>
                        ))}
                     </ul>
                  </div>

                  {/* Sidebar Ad */}
                  <AdBanner type="sidebar" className="mt-10" />
               </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
