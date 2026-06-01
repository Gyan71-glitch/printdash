import mongoose from 'mongoose';
import Post from '../src/models/Post';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/premium-news';

const TRENDING_POSTS = [
  {
    title: "Trump's New Tariffs Threaten Global Supply Chains",
    excerpt: "The latest round of aggressive trade tariffs proposed by the administration sends shockwaves through international markets, prompting retaliation threats from major trading partners.",
    content: "<p>The administration has announced a sweeping new series of tariffs aimed at protecting domestic manufacturing. However, economists warn this could trigger a full-scale trade war.</p><p>International markets tumbled on the news, with tech and auto sectors taking the heaviest hits.</p>",
    tag: "Politics",
    section: "main_feed",
    author: "Editorial Board",
    imageUrl: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=1200&q=80",
    slug: "trumps-new-tariffs-threaten-global-supply-chains"
  },
  {
    title: "Global Stock Market Crash Wipes Out $2 Trillion in Wealth",
    excerpt: "A sudden and severe correction in tech equities triggered a domino effect across global indices, marking the worst single-day drop since 2020.",
    content: "<p>Panic selling gripped Wall Street today as the tech-heavy Nasdaq composite plummeted over 5%.</p><p>The catalyst appears to be lower-than-expected earnings from mega-cap tech companies combined with fears of a looming recession.</p>",
    tag: "Markets",
    section: "main_feed",
    author: "Financial Desk",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    slug: "global-stock-market-crash-wipes-out-wealth"
  },
  {
    title: "Reviving the Iran Nuclear Deal: Diplomatic Breakthrough or Mirage?",
    excerpt: "Secret talks in Oman have allegedly yielded a framework to reinstate key provisions of the 2015 Iran nuclear deal, but massive political hurdles remain.",
    content: "<p>Diplomatic sources suggest that a preliminary understanding has been reached to unfreeze certain Iranian assets in exchange for enriched uranium caps.</p><p>Critics in Washington and Tel Aviv remain highly skeptical of the regime's compliance.</p>",
    tag: "News",
    section: "featured",
    author: "Foreign Correspondent",
    imageUrl: "https://images.unsplash.com/photo-1532375810709-75b1d0d10c53?auto=format&fit=crop&w=1200&q=80",
    slug: "reviving-iran-nuclear-deal-diplomatic-breakthrough"
  },
  {
    title: "EU Passes Landmark AI Regulation Act, Setting Global Standard",
    excerpt: "The European Union has officially adopted the world's first comprehensive legal framework governing Artificial Intelligence, placing strict limits on high-risk applications.",
    content: "<p>Tech giants will now face severe penalties if their AI models violate the new transparency and bias requirements.</p><p>The legislation bans biometric surveillance in public spaces and requires explicit labeling of AI-generated content.</p>",
    tag: "Business",
    section: "ledger",
    author: "Tech Policy Team",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
    slug: "eu-passes-landmark-ai-regulation-act"
  },
  {
    title: "Fed Rate Decision Sparks Surprising Market Rally",
    excerpt: "The Federal Reserve's unexpected decision to hold interest rates steady, accompanied by dovish forward guidance, has ignited a massive risk-on rally across equities and crypto.",
    content: "<p>Chairman Jerome Powell cited cooling inflation metrics and a balanced labor market as the primary reasons for the pause.</p><p>Investors are now pricing in aggressive rate cuts for the third quarter.</p>",
    tag: "Markets",
    section: "main_feed",
    author: "Markets Editor",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80",
    slug: "fed-rate-decision-sparks-surprising-market-rally"
  },
  {
    title: "UK Election 2026: Labour Surges in Latest Polls",
    excerpt: "With the general election approaching, the opposition party has widened its lead over the Conservatives, promising sweeping economic reforms.",
    content: "<p>The latest polling data suggests a potential landslide victory for the Labour Party.</p><p>Voter fatigue and cost-of-living concerns appear to be the driving factors behind the shift in political sentiment.</p>",
    tag: "Politics",
    section: "opinions",
    author: "Political Desk",
    imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80",
    slug: "uk-election-2026-labour-surges-polls"
  },
  {
    title: "Silicon Valley Layoffs Deepen as AI Replaces Junior Developers",
    excerpt: "A new wave of tech layoffs has hit the Valley, this time explicitly tied to efficiency gains from enterprise AI coding assistants.",
    content: "<p>Several prominent tech unicorns have announced a 15% reduction in their engineering workforce.</p><p>Executives point to new AI tools that have dramatically increased the output of senior engineers, reducing the need for entry-level code maintainers.</p>",
    tag: "Business",
    section: "main_feed",
    author: "Tech Reporter",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    slug: "silicon-valley-layoffs-deepen-ai-replaces-devs"
  }
];

async function seedTrending() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    let added = 0;
    for (const post of TRENDING_POSTS) {
      const exists = await Post.findOne({ slug: post.slug });
      if (!exists) {
        await Post.create({
          ...post,
          publishedAt: new Date(),
          timeAgo: 'Just now',
          readTime: '3 min read'
        });
        added++;
        console.log(`Created: ${post.title}`);
      }
    }
    
    console.log(`✅ Successfully seeded ${added} Trending stories.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
}

seedTrending();
