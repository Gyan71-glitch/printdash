import Post from '@/models/Post';
import connectToDatabase from './mongodb';
import { categoryFromSlug, LATEST_COUNT } from './categories';

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

// The homepage "Latest" section: the newest uploads, skipping posts an editor opted out
export async function getLatestPosts() {
  try {
    await connectToDatabase();
    const posts = await Post.find({ showInLatest: { $ne: false } }).sort({ createdAt: -1 }).limit(LATEST_COUNT).lean();
    return JSON.parse(JSON.stringify(posts));
  } catch (e) {
    console.error("Error fetching latest posts:", e);
    return [];
  }
}

// Posts for a category page: every post tagged with that category, newest first.
// Returns null for a slug that isn't a category.
export async function getPostsByCategory(slug: string) {
  const name = categoryFromSlug(slug);
  if (!name) return null;

  try {
    await connectToDatabase();
    // Tolerates case/whitespace variants of older free-text tags, e.g. "politics", "Economy "
    const query = { tag: { $regex: `^\\s*${name}\\s*$`, $options: 'i' } };
    const posts = await Post.find(query).sort({ createdAt: -1 }).lean();
    return { name, posts: JSON.parse(JSON.stringify(posts)) };
  } catch (e) {
    console.error("Error fetching posts by category:", e);
    return { name, posts: [] };
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
    }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(posts));
  } catch (e) {
    console.error("Error searching posts:", e);
    return [];
  }
}
