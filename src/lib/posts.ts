import Post from '@/models/Post';
import connectToDatabase from './mongodb';

export async function getPostsBySection(section: string) {
  try {
    await connectToDatabase();
    const posts = await Post.find({ section }).sort({ order: 1, createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(posts));
  } catch (e) {
    console.error("Error fetching posts by section:", e);
    return [];
  }
}

// Maps nav category slugs to DB queries
const CATEGORY_MAP: Record<string, { sections?: string[], keywords?: string[] }> = {
  'latest':       { sections: ['main_feed', 'news_flash', 'ledger', 'opinions', 'politics', 'style'] },
  'news':         { sections: ['main_feed', 'news_flash'] },
  'markets':      { keywords: ['market', 'stock', 'nifty', 'sensex', 'trading', 'equity', 'mutual fund', 'economy', 'finance', 'rupee', 'rbi', 'sebi', 'gold', 'crude'] },
  'brands story': { sections: ['ledger'], keywords: ['brand', 'company', 'corporate', 'startup', 'business', 'industry'] },
  'politics':     { sections: ['politics'], keywords: ['politics', 'election', 'government', 'minister', 'parliament', 'bjp', 'congress', 'modi', 'rahul', 'party', 'vote', 'democracy'] },
  'business':     { keywords: ['business', 'economy', 'gdp', 'growth', 'investment', 'trade', 'export', 'import', 'startup', 'entrepreneur', 'msme', 'industry', 'manufacturing'] },
  'ipo':          { keywords: ['ipo', 'listing', 'shares', 'offer', 'allotment', 'grey market', 'subscription', 'nse', 'bse', 'primary market'] },
  'opinions':     { sections: ['opinions'] },
  'style':        { sections: ['style'], keywords: ['fashion', 'lifestyle', 'culture', 'art', 'style'] },
};

export async function getPostsByTag(tag: string) {
  try {
    await connectToDatabase();
    const normalized = tag.replace(/_/g, ' ').toLowerCase().trim();
    const mapping = CATEGORY_MAP[normalized];

    if (mapping) {
      const orConditions: any[] = [];

      if (mapping.sections && mapping.sections.length > 0) {
        orConditions.push({ section: { $in: mapping.sections } });
      }

      if (mapping.keywords && mapping.keywords.length > 0) {
        const keywordRegex = mapping.keywords.join('|');
        orConditions.push({ title: { $regex: keywordRegex, $options: 'i' } });
        orConditions.push({ excerpt: { $regex: keywordRegex, $options: 'i' } });
        orConditions.push({ content: { $regex: keywordRegex, $options: 'i' } });
      }

      // If no conditions built, return all (e.g. 'latest')
      const query = orConditions.length > 0 ? { $or: orConditions } : {};
      const posts = await Post.find(query).sort({ createdAt: -1 }).lean();
      return JSON.parse(JSON.stringify(posts));
    }

    // Fallback: search by tag field or section field
    const searchTag = tag.replace(/_/g, ' ');
    const posts = await Post.find({
      $or: [
        { tag: { $regex: searchTag, $options: 'i' } },
        { section: { $regex: searchTag, $options: 'i' } },
        { title: { $regex: searchTag, $options: 'i' } }
      ]
    }).sort({ order: 1, createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(posts));
  } catch (e) {
    console.error("Error fetching posts by tag:", e);
    return [];
  }
}

export async function getAllPosts() {
  try {
    await connectToDatabase();
    const posts = await Post.find({}).sort({ order: 1, createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(posts));
  } catch (e) {
    console.error("Error fetching all posts:", e);
    return [];
  }
}

export async function getUniqueTags() {
  try {
    await connectToDatabase();
    const rawTags = await Post.distinct('tag') as string[];
    const rawSections = await Post.distinct('section') as string[];
    
    const structuralSections = ['main feed', 'main_feed', 'news flash', 'featured', 'ledger', 'visual', 'post'];
    
    return Array.from(new Set([...rawTags, ...rawSections]))
      .filter(Boolean)
      .filter(tag => !tag.startsWith('#'))
      .filter(tag => !structuralSections.includes(tag.toLowerCase()));
  } catch (e) {
    console.error("Error fetching unique tags:", e);
    return [];
  }
}

export async function searchPosts(query: string) {
  try {
    await connectToDatabase();
    const searchRegex = new RegExp(query, 'i');
    const posts = await Post.find({
      $or: [
        { title: searchRegex },
        { excerpt: searchRegex },
        { tag: searchRegex },
        { content: searchRegex }
      ]
    }).sort({ publishedAt: -1 }).lean();
    return JSON.parse(JSON.stringify(posts));
  } catch (e) {
    console.error("Error searching posts:", e);
    return [];
  }
}
