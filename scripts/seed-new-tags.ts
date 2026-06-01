import mongoose from 'mongoose';
import Post from '../src/models/Post';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/premium-news';

const NEW_POSTS = [
  // Brands Story - The Indianberg Story
  {
    title: "The Indianberg: Redefining Investigative Journalism for the Digital Age",
    excerpt: "Born out of a necessity for truth in an era of misinformation, The Indianberg has grown from a humble news desk into a powerhouse of digital forensics, cyber crime reporting, and relentless investigative journalism.",
    content: `
      <p>In a landscape cluttered with sensationalism and superficial reporting, <strong>The Indianberg</strong> emerged with a singular mission: to dig deeper.</p>
      <p>Founded by a collective of veteran journalists, data scientists, and cybersecurity experts, the publication was built on the belief that modern journalism requires modern tools. The Indianberg isn’t just a newspaper—it’s a digital intelligence unit.</p>
      <h3>The Genesis</h3>
      <p>The journey began when traditional media houses failed to adequately cover the rising tide of digital crimes affecting millions of Indians. The founders realized that to report on the 21st century, they needed to understand its underlying code. By bridging the gap between open-source intelligence (OSINT), dark web monitoring, and traditional shoe-leather reporting, The Indianberg created a new paradigm.</p>
      <h3>Impact & Vision</h3>
      <p>Today, our investigations have led to parliamentary debates, influenced national data protection policies, and helped dismantle international extortion syndicates. From exposing state-sponsored cyber warfare to tracking the illicit flow of cryptocurrency, The Indianberg stands at the vanguard of accountability.</p>
      <p>As we look to the future, our commitment remains unwavering: <em>Breaking barriers, shaping narrative.</em></p>
    `,
    tag: "Brands Story",
    section: "main_feed",
    author: "Editorial Board",
    imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80",
    slug: "the-indianberg-redefining-investigative-journalism",
    timeAgo: "1 hour ago",
    publishedAt: new Date()
  },
  {
    title: "How Legacy Brands are Pivoting to Web3 and AI",
    excerpt: "A deep dive into the corporate reinvention strategies of century-old companies.",
    tag: "Brands Story",
    section: "featured",
    author: "Neha Sharma",
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
    slug: "legacy-brands-web3-ai",
    timeAgo: "5 hours ago",
    publishedAt: new Date()
  },

  // Latest
  {
    title: "RBI Announces New Framework for Cross-Border Digital Payments",
    excerpt: "The central bank's latest move is set to drastically reduce transaction times for international remittances.",
    tag: "Latest",
    section: "news_flash",
    author: "Vikram Desai",
    slug: "rbi-new-framework-cross-border-digital-payments",
    timeAgo: "20 mins ago",
    publishedAt: new Date()
  },
  {
    title: "Global Supply Chain Disruptions Expected as Major Port Faces Strike",
    excerpt: "Retailers brace for impact as dockworkers announce an indefinite strike starting next Monday.",
    tag: "Latest",
    section: "main_feed",
    imageUrl: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=800&q=80",
    slug: "global-supply-chain-disruptions-port-strike",
    timeAgo: "45 mins ago",
    publishedAt: new Date()
  },

  // Markets
  {
    title: "Sensex Hits Record High Amid Global Tech Rally",
    excerpt: "Indian equity markets saw unprecedented gains today, driven by strong quarterly earnings from IT majors.",
    tag: "Markets",
    section: "ledger",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
    slug: "sensex-hits-record-high-tech-rally",
    timeAgo: "2 hours ago",
    publishedAt: new Date()
  },
  {
    title: "Commodities Update: Gold Prices Stabilize After Week-Long Volatility",
    excerpt: "Investors find safe haven in precious metals as geopolitical tensions simmer.",
    tag: "Markets",
    section: "main_feed",
    slug: "gold-prices-stabilize-volatility",
    timeAgo: "3 hours ago",
    publishedAt: new Date()
  },

  // News
  {
    title: "Supreme Court Issues Notice on Content Moderation Guidelines",
    excerpt: "Social media giants have been given four weeks to respond to the new petition.",
    tag: "News",
    section: "main_feed",
    imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80",
    slug: "supreme-court-notice-content-moderation",
    timeAgo: "4 hours ago",
    publishedAt: new Date()
  },
  {
    title: "Monsoon Forecast: Above Average Rainfall Expected in Southern Peninsula",
    excerpt: "The IMD's latest bulletin brings hope for the agricultural sector in the region.",
    tag: "News",
    section: "main_feed",
    slug: "monsoon-forecast-above-average-rainfall",
    timeAgo: "5 hours ago",
    publishedAt: new Date()
  },

  // Politics
  {
    title: "Inside the High-Stakes Negotiations for the Upcoming Winter Session",
    excerpt: "Key legislative bills are hanging in the balance as opposition leaders demand a joint committee.",
    tag: "Politics",
    section: "politics",
    imageUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80",
    slug: "high-stakes-negotiations-winter-session",
    timeAgo: "1 day ago",
    publishedAt: new Date()
  },
  {
    title: "State Elections: New Polling Data Suggests a Tight Race in Key Constituencies",
    excerpt: "Urban voter turnout might be the deciding factor according to the latest ground reports.",
    tag: "Politics",
    section: "politics",
    slug: "state-elections-tight-race-polling",
    timeAgo: "2 days ago",
    publishedAt: new Date()
  },

  // Business
  {
    title: "The Rise of Quick Commerce: Are 10-Minute Deliveries Sustainable?",
    excerpt: "An analysis of the unit economics behind the latest trend sweeping urban India.",
    tag: "Business",
    section: "ledger",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    slug: "quick-commerce-sustainability-10-minute-deliveries",
    timeAgo: "1 day ago",
    publishedAt: new Date()
  },
  {
    title: "Semiconductor Manufacturing Push: Three New Fabs Approved",
    excerpt: "The government clears proposals worth ₹1.2 lakh crore to boost domestic electronics production.",
    tag: "Business",
    section: "featured",
    slug: "semiconductor-manufacturing-push-new-fabs",
    timeAgo: "2 days ago",
    publishedAt: new Date()
  },

  // IPO
  {
    title: "Tech Unicorn's $2B IPO Oversubscribed by 50x on Final Day",
    excerpt: "Retail and institutional investors alike showed massive interest in the highly anticipated tech listing.",
    tag: "IPO",
    section: "ledger",
    imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
    slug: "tech-unicorn-ipo-oversubscribed",
    timeAgo: "6 hours ago",
    publishedAt: new Date()
  },
  {
    title: "Upcoming IPOs to Watch Next Quarter: A Comprehensive Guide",
    excerpt: "From renewable energy firms to fintech disruptors, here are the public offerings to keep on your radar.",
    tag: "IPO",
    section: "main_feed",
    slug: "upcoming-ipos-to-watch-next-quarter",
    timeAgo: "1 day ago",
    publishedAt: new Date()
  }
];

async function seedNewTags() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    for (const postData of NEW_POSTS) {
      // Check if it already exists
      const existing = await Post.findOne({ slug: postData.slug });
      if (!existing) {
        await Post.create(postData);
        console.log(`Created post: \${postData.title} [\${postData.tag}]`);
      } else {
        console.log(`Skipped existing post: \${postData.title}`);
      }
    }

    console.log('✅ Successfully seeded dummy posts for the new tags.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedNewTags();
