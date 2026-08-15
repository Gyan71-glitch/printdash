import Post from '@/models/Post';

/**
 * Converts a title string into a URL-friendly slug.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/**
 * Generates a unique slug for a post title in MongoDB.
 * If a slug collision occurs, appends -2, -3, etc.
 */
export async function generateUniqueSlug(title: string, currentPostId?: string): Promise<string> {
  const baseSlug = slugify(title) || 'article';
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const query: any = { slug };
    if (currentPostId) {
      query._id = { $ne: currentPostId };
    }
    
    const existing = await Post.findOne(query).select('_id').lean();
    if (!existing) {
      return slug;
    }
    count++;
    slug = `${baseSlug}-${count}`;
  }
}
