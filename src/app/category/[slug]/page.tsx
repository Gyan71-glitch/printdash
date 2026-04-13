import Link from 'next/link'
import Image from 'next/image'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Await the params since Next.js recommends params to be treated as a Promise in the App Router starting v15.
  const { slug } = await params;
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  // Generate some dummy content for the specific category
  const dummyNews = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    title: `Major developments in ${categoryName} policy reported today across various international bureaus.`,
    desc: `Experts weigh in on the long term implications of the recent shifts in ${categoryName} and how they will shape the upcoming quarter. The fallout reveals deeper structural challenges requiring immediate legislative action.`,
    time: `${i + 1 * 2} hours ago`
  }));

  return (
    <div className="w-full bg-white dark:bg-black font-sans min-h-screen">
      <main className="max-w-[1200px] mx-auto px-4 md:px-6 w-full py-12">
        
        {/* Category Header */}
        <header className="mb-12 border-b border-black dark:border-white pb-6">
          <h1 className="font-serif text-5xl font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 mb-2">
            {categoryName}
          </h1>
          <p className="text-zinc-500 font-sans tracking-widest uppercase text-sm font-bold">
            Latest Coverage in {categoryName}
          </p>
        </header>

        {/* Top Featured Post in Category */}
        <Link href={`/article/featured-${slug}-post`} className="group flex flex-col lg:flex-row gap-8 mb-16 border-b border-zinc-200 dark:border-zinc-800 pb-16">
          <div className="lg:w-2/3 relative aspect-[16/9] bg-zinc-100 overflow-hidden">
             <Image 
               src={`https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1500&auto=format&fit=crop`} 
               alt={`${categoryName} featured news`} 
               fill 
               className="object-cover group-hover:scale-105 transition-transform duration-700" 
             />
          </div>
          <div className="lg:w-1/3 flex flex-col justify-center">
            <span className="text-red-600 font-bold uppercase tracking-wider text-sm mb-3">Trending</span>
            <h2 className="font-serif text-4xl font-bold leading-tight mb-4 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
              {categoryName} Faces Major Headwinds Heading Into Q3
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-6 leading-relaxed">
              Global strategists are adjusting forecasts as unexpected data shifts the landscape. Several key indicators point to a volatile season ahead.
            </p>
            <div className="flex items-center text-sm font-semibold text-zinc-500 uppercase tracking-wide gap-3">
              <span>By Editorial Board</span>
              <span>•</span>
              <span>Just now</span>
            </div>
          </div>
        </Link>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {dummyNews.map((news) => (
            <Link href={`/article/${slug}-news-${news.id}`} key={news.id} className="group flex flex-col border-t border-zinc-200 dark:border-zinc-800 pt-6">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
                {news.time}
              </span>
              <h3 className="font-serif text-2xl font-bold leading-snug mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {news.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {news.desc}
              </p>
            </Link>
          ))}
        </div>

      </main>
    </div>
  )
}
