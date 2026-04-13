import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ArrowRight } from "lucide-react"
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import { AdBanner } from "@/components/ads/AdBanner"

export const revalidate = 0; // Disable static caching so the CMS updates instantly

export default async function Home() {
  await connectToDatabase();
  
  // Fetch everything and group by section
  const dbPosts = await Post.find({}).sort({ order: 1, createdAt: -1 }).lean();
  const allPosts = dbPosts.map(post => ({
    ...post,
    _id: post._id.toString()
  }));
  
  const sections = {
    news_flash: allPosts.filter((p: any) => p.section === 'news_flash'),
    main_feed: allPosts.filter((p: any) => p.section === 'main_feed'),
    featured: allPosts.filter((p: any) => p.section === 'featured'),
    opinions: allPosts.filter((p: any) => p.section === 'opinions'),
    ledger: allPosts.filter((p: any) => p.section === 'ledger'),
    visual: allPosts.filter((p: any) => p.section === 'visual'),
    politics: allPosts.filter((p: any) => p.section === 'politics'),
    style: allPosts.filter((p: any) => p.section === 'style'),
  };

  const newsFlash = sections.news_flash[0]; // Assuming one live flash
  const topStory = sections.main_feed.find((p: any) => p.subType === 'top');
  const mainSubStories = sections.main_feed.filter((p: any) => p.subType !== 'top');
  
  const mainFeatured = sections.featured.find((p: any) => p.subType === 'main');
  const secondaryFeatured = sections.featured.filter((p: any) => p.subType !== 'main');

  const mainPolitics = sections.politics.find((p: any) => p.subType === 'main');
  const sidePolitics = sections.politics.filter((p: any) => p.subType !== 'main');

  return (
    <div className="w-full min-h-screen bg-[#FCFBF9][#0A0A0A] font-sans selection:bg-red-500/20 selection:text-red-900">
      <main className="max-w-[1440px] mx-auto px-5 sm:px-8 py-8 md:py-6">
        
        {/* TOP LEADERBOARD AD */}
        <AdBanner type="leaderboard" className="mb-8" />

        {/* LATEST NEWS FLASH STRIP */}
        {newsFlash && (
          <Link href={`/article/${newsFlash._id}`} className="flex items-center gap-4 mb-10 pb-4 border-b border-zinc-200/80 group cursor-pointer w-fit pr-8">
              {newsFlash.isLive && <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>}
              {newsFlash.isLive && <span className="text-[11px] font-black tracking-[0.25em] uppercase text-red-600">Live</span>}
              <span className="text-[13px] font-semibold text-zinc-800 group-hover:text-red-600 transition-colors">{newsFlash.title}</span>
              <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-red-600 transition-colors group-hover:translate-x-1" />
          </Link>
        )}

        {/* HOMEPAGE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* LEFT COLUMN: Main News Feed */}
          <section className="lg:col-span-3 order-2 lg:order-1 flex flex-col gap-0 border-t-2 border-black pt-5">
            {/* Top Story */}
            {topStory && (
              <article className="border-b border-zinc-200/80 pb-8 mb-8 group">
                <Link href={`/article/${topStory._id}`} className="block focus:outline-none">
                  <h2 className="font-serif text-[38px] leading-[1.05] tracking-tight font-black text-zinc-950 mb-4 group-hover:text-red-700 transition-colors duration-300">
                    {topStory.title}
                  </h2>
                  <p className="font-serif text-[18px] text-zinc-600 leading-[1.6] mb-5 italic">
                    {topStory.excerpt}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="text-[11px] font-bold text-zinc-800 tracking-wider uppercase font-sans">
                      {topStory.author}
                    </div>
                  </div>
                </Link>
              </article>
            )}

            {/* Sub Stories */}
            {mainSubStories.map((story: any) => (
              <article key={story._id.toString()} className="border-b border-zinc-200/80 last:border-0 pb-6 mb-6 last:pb-0 last:mb-0 group">
                <Link href={`/article/${story._id}`} className="block focus:outline-none flex gap-4">
                  <div className="flex-1">
                    {story.tag && <div className="text-[10px] font-black tracking-[0.2em] text-blue-700 uppercase mb-2">{story.tag}</div>}
                    <h3 className="font-serif text-[20px] leading-[1.25] font-bold text-zinc-900 group-hover:text-red-700 transition-colors">
                      {story.title}
                    </h3>
                    {story.timeAgo && <span className="text-[12px] text-zinc-400 mt-2 block font-sans">{story.timeAgo}</span>}
                  </div>
                </Link>
              </article>
            ))}
          </section>

          {/* CENTER COLUMN: Big Featured Media */}
          <section className="lg:col-span-6 order-1 lg:order-2 flex flex-col pt-0">
            {mainFeatured && (
              <Link href={`/article/${mainFeatured._id}`} className="group block focus:outline-none">
                <div className="relative w-full aspect-[4/3] md:aspect-[3/2] overflow-hidden bg-zinc-100 shadow-xl shadow-zinc-200/40 mb-4">
                  <Image 
                    src={mainFeatured.imageUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop"} 
                    alt={mainFeatured.title} 
                    fill 
                    priority
                    className="object-cover transform group-hover:scale-[1.03] transition-transform duration-[1.5s] ease-out"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
                {mainFeatured.tag && (
                  <div className="flex items-center justify-between text-[11px] font-sans text-zinc-500 uppercase tracking-widest px-1 mb-2">
                    <span>{mainFeatured.tag}</span>
                    <span className="flex items-center gap-1 group-hover:text-black transition-colors">Read Full <ArrowRight className="w-3 h-3"/></span>
                  </div>
                )}
                <h2 className="font-serif text-3xl font-black">{mainFeatured.title}</h2>
              </Link>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-zinc-200/80">
                {secondaryFeatured.map((item: any) => (
                  <article key={item._id.toString()} className="group cursor-pointer">
                    <Link href={item.url || "#"}>
                      <div className="relative w-full aspect-[16/10] overflow-hidden mb-4">
                         <Image src={item.imageUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop"} alt={item.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                      </div>
                      <h4 className="font-serif text-[18px] font-bold leading-snug group-hover:text-red-700 transition-colors">{item.title}</h4>
                    </Link>
                  </article>
                ))}
            </div>
          </section>

          {/* RIGHT COLUMN: Opinions */}
          <aside className="lg:col-span-3 order-3 flex flex-col border-t-2 border-black pt-5 lg:pl-4">
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-zinc-200/80 group cursor-pointer w-full">
              <h3 className="font-serif italic text-2xl text-zinc-900 group-hover:text-red-700 transition-colors">Opinions</h3>
              <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-red-700 transition-colors group-hover:translate-x-1" />
            </div>

            <div className="flex flex-col">
              {sections.opinions.map((opinion: any) => (
                <Link key={opinion._id.toString()} href={`/article/${opinion._id}`} className="flex py-5 border-b border-zinc-200/80 last:border-0 group justify-between gap-5 focus:outline-none">
                  <div className="flex-1">
                    <span className="font-sans text-[11px] font-black uppercase tracking-widest text-zinc-500 block mb-2">{opinion.author}</span>
                    <h4 className="font-serif text-[19px] font-bold leading-[1.3] text-zinc-900 group-hover:text-red-700 transition-colors decoration-2 underline-offset-4 group-hover:underline">
                      {opinion.title}
                    </h4>
                  </div>
                  {opinion.authorImageUrl && (
                    <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex-shrink-0 border-2 border-transparent group-hover:border-red-200 transition-colors p-[2px]">
                      <div className="w-full h-full rounded-full overflow-hidden bg-zinc-100 relative">
                          <Image src={opinion.authorImageUrl} alt={opinion.author} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      </div>
                    </div>
                  )}
                </Link>
              ))}
              
              <Link href="#" className="mt-6 w-full py-3.5 border border-zinc-300 flex items-center justify-center gap-2 text-[12px] font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all">
                Read All Opinions <ArrowRight className="w-4 h-4"/>
              </Link>
            </div>
          </aside>
        </div>

        {/* MASSIVE NEW SECTION - INCREASING HOMEPAGE LENGTH */}
        <section className="mt-16 pt-12 border-t-4 border-black">
          <div className="flex items-center justify-between mb-8 group cursor-pointer">
            <h3 className="font-serif italic text-[32px] font-black text-zinc-900 group-hover:text-red-700 transition-colors">More from The Ledger</h3>
            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1 group-hover:text-red-700 transition-colors">See all <ArrowRight className="w-4 h-4"/></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sections.ledger.map((article: any) => (
              <article key={article._id.toString()} className="group border-b border-zinc-200/80 pb-6 mb-6">
                <Link href={`/article/${article._id}`} className="block focus:outline-none">
                  <div className="relative w-full aspect-[4/3] overflow-hidden mb-4 bg-zinc-100">
                     <Image src={article.imageUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop"} alt="" fill className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.2s] ease-out" />
                  </div>
                  <span className="text-[10px] font-black tracking-[0.2em] text-red-700 uppercase block mb-2">{article.tag}</span>
                  <h4 className="font-serif text-[18px] font-bold leading-snug text-zinc-900 group-hover:text-blue-700 transition-colors mb-3">
                    {article.title}
                  </h4>
                  <span className="text-[12px] font-sans text-zinc-500">{article.timeAgo}</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* IN-FEED HOMEPAGE AD */}
        <AdBanner type="leaderboard" className="my-12" />

        {/* VISUAL INVESTIGATIONS */}
        {sections.visual && sections.visual.length > 0 && (
          <section className="mt-8 mb-12 bg-zinc-950[#050505] text-white p-8 md:p-12 shadow-2xl">
            <div className="flex items-center gap-2 mb-10 w-fit cursor-pointer group">
              <span className="w-3 h-3 bg-red-600 rounded-sm"></span>
              <h3 className="font-sans text-[13px] font-black uppercase tracking-[0.25em] group-hover:text-red-500 transition-colors">Visual Investigations</h3>
            </div>
            <Link href={`/article/${sections.visual[0]._id}`} className="group block focus:outline-none">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <div>
                  <h2 className="font-serif text-[42px] md:text-[56px] leading-[1.05] tracking-tight font-black mb-6 group-hover:text-zinc-300 transition-colors">
                    {sections.visual[0].title}
                  </h2>
                  <p className="font-sans text-[16px] text-zinc-400 leading-relaxed mb-8 max-w-lg">
                    {sections.visual[0].description || sections.visual[0].excerpt}
                  </p>
                  <button className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold uppercase tracking-widest px-6 py-3 rounded-none transition-colors">
                    Explore The Analysis
                  </button>
                </div>
                <div className="relative w-full aspect-[4/3] md:aspect-square overflow-hidden shadow-2xl bg-zinc-900">
                  {sections.visual[0].imageUrl && <Image src={sections.visual[0].imageUrl} alt={sections.visual[0].title} fill className="object-cover group-hover:scale-[1.02] transition-all duration-[2s]" />}
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* POLITICS FOCUS SECTION (2 Columns) */}
        <section className="mb-16 pt-12 border-t border-zinc-200/80">
          <div className="flex items-center gap-2 mb-10 w-fit cursor-pointer group border-b-2 border-black pb-2 pr-6">
            <h3 className="font-serif italic text-3xl font-black text-zinc-900 group-hover:text-red-700 transition-colors">Politics Focus</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {mainPolitics ? (
              <article className="group cursor-pointer">
                <Link href={`/article/${mainPolitics._id}`}>
                  <div className="relative w-full aspect-[16/9] overflow-hidden mb-6 bg-zinc-100 object-cover">
                    <Image src={mainPolitics.imageUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop"} alt="" fill className="object-cover transform group-hover:scale-[1.03] transition-all duration-[1s]" />
                  </div>
                  <h4 className="font-serif text-[28px] font-bold leading-tight group-hover:text-red-700 transition-colors mb-3">
                    {mainPolitics.title}
                  </h4>
                  <p className="font-serif text-[17px] text-zinc-600 mb-4">
                    {mainPolitics.excerpt}
                  </p>
                  <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500">{mainPolitics.author} • {mainPolitics.timeAgo}</span>
                </Link>
              </article>
            ) : <div></div>}

            <div className="flex flex-col gap-6">
              {sidePolitics.map((sub: any) => (
                <article key={sub._id.toString()} className="group border-b border-zinc-200/80 last:border-0 pb-6 last:pb-0 flex items-center justify-between cursor-pointer">
                  <Link href={`/article/${sub._id}`} className="flex-1 pr-6 flex items-center justify-between w-full">
                    <div>
                      <h4 className="font-serif text-[20px] font-bold leading-snug group-hover:text-red-700 transition-colors mb-2">
                        {sub.title}
                      </h4>
                      <span className="text-[12px] font-sans text-zinc-500">{sub.timeAgo}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-red-700 transition-colors group-hover:translate-x-1" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* THE STYLE SECTION (3 Columns) */}
        <section className="mb-16 pt-12 border-t-2 border-black">
          <div className="flex items-center justify-between mb-8 group cursor-pointer">
            <h3 className="font-serif italic text-4xl font-black text-zinc-900 group-hover:text-red-700 transition-colors">The Style Section</h3>
            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1 group-hover:text-red-700 transition-colors">More Style <ArrowRight className="w-4 h-4"/></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sections.style.map((item: any) => (
              <article key={item._id.toString()} className="group cursor-pointer">
                <Link href={`/article/${item._id}`}>
                  <div className="relative w-full aspect-[4/5] overflow-hidden mb-5 bg-zinc-100">
                     <Image src={item.imageUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop"} alt={item.title} fill className="object-cover group-hover:scale-105 transition-all duration-[1.5s]" />
                     <div className="absolute inset-0 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <h4 className="font-serif text-[22px] font-bold leading-snug group-hover:text-red-700 transition-colors w-11/12">
                    {item.title}
                  </h4>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* FULL WIDTH NEWSLETTER CTA */}
        <section className="w-full bg-zinc-100 border border-zinc-200 p-8 md:p-16 text-center mt-12 mb-8">
           <h3 className="font-serif text-3xl md:text-5xl font-black text-zinc-900 mb-4 tracking-tight">The Morning Briefing</h3>
           <p className="font-serif text-[18px] text-zinc-600 mb-8 max-w-2xl mx-auto">
             Start your day with the stories you need to know. Expert curation, delivered to your inbox every morning at 6 AM EST.
           </p>
           <form className="max-w-md mx-auto flex" action="#">
             <input type="email" placeholder="Your email address" className="flex-1 px-4 py-3 border border-zinc-300 bg-white focus:outline-none text-zinc-900" />
             <button className="bg-black text-white font-bold uppercase tracking-widest text-[11px] px-6 py-3 hover:bg-neutral-800 transition-colors">
               Sign Up
             </button>
           </form>
        </section>

      </main>
    </div>
  )
}