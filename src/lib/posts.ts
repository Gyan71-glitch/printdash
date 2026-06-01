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

export async function getPostsByTag(tag: string) {
  try {
    await connectToDatabase();
    const searchTag = tag.replace(/_/g, ' ');
    const posts = await Post.find({ 
      $or: [
        { tag: { $regex: searchTag, $options: 'i' } },
        { section: { $regex: searchTag, $options: 'i' } }
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
