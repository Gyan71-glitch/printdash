import mongoose from 'mongoose';
import Post from '../src/models/Post';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/premium-news';

const BRAND_STORIES = [
  {
    title: "Vantara: Revolutionizing Wildlife Conservation with Unprecedented Scale",
    excerpt: "Anant Ambani's visionary project is not just a rescue center—it's setting global benchmarks for animal welfare and rehabilitation.",
    content: "<p>Inside the sprawling greens of Jamnagar lies Vantara, a testament to what corporate resources paired with genuine empathy can achieve.</p>",
    tag: "Brands Story",
    section: "ledger",
    author: "Aditi Rao",
    imageUrl: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1200&q=80",
    slug: "vantara-revolutionizing-wildlife-conservation",
    timeAgo: "2 days ago",
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    title: "Tata Motors: The Electric Renaissance of an Indian Giant",
    excerpt: "How the legacy automaker transformed itself into the undisputed leader of India's EV revolution.",
    tag: "Brands Story",
    section: "main_feed",
    author: "Karan Singh",
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80",
    slug: "tata-motors-electric-renaissance",
    timeAgo: "3 days ago",
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    title: "Zerodha's Bootstrapped Billion: The Architecture of Trust",
    excerpt: "Nithin and Nikhil Kamath built India's largest stock broker without raising a single rupee from external investors. Here's how.",
    tag: "Brands Story",
    section: "opinions",
    author: "Priya Sharma",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    slug: "zerodha-bootstrapped-billion-architecture-trust",
    timeAgo: "4 days ago",
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  },
  {
    title: "Royal Enfield: The Cult Brand That Refused to Die",
    excerpt: "From the brink of bankruptcy in the 1990s to becoming a global motorcycling icon, the remarkable turnaround story of Eicher Motors.",
    tag: "Brands Story",
    section: "main_feed",
    author: "Rohan Das",
    imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
    slug: "royal-enfield-cult-brand-turnaround",
    timeAgo: "1 week ago",
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    title: "The Jio Disruption: 8 Years That Changed India's Digital Destiny",
    excerpt: "Analyzing the telecom giant's aggressive strategy that brought a billion Indians online and dismantled the status quo.",
    tag: "Brands Story",
    section: "featured",
    author: "Siddharth Jain",
    imageUrl: "https://images.unsplash.com/photo-1563986768854-1b54c0e66c6c?auto=format&fit=crop&w=1200&q=80",
    slug: "jio-disruption-india-digital-destiny",
    timeAgo: "2 weeks ago",
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  },
  {
    title: "Zomato vs Swiggy: The Infinite Game of Food Delivery",
    excerpt: "Beyond discounts and unit economics: The operational brilliance and brand wars defining India's duopoly.",
    tag: "Brands Story",
    section: "style",
    author: "Ananya Patel",
    imageUrl: "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200&q=80",
    slug: "zomato-vs-swiggy-infinite-game",
    timeAgo: "3 weeks ago",
    publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
  }
];

async function seedBrandsStory() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    let addedCount = 0;
    for (const postData of BRAND_STORIES) {
      const existing = await Post.findOne({ slug: postData.slug });
      if (!existing) {
        await Post.create(postData);
        console.log(`Created: \${postData.title}`);
        addedCount++;
      }
    }

    console.log(`✅ Successfully seeded \${addedCount} new Brand Stories.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedBrandsStory();
