import mongoose from 'mongoose';
import Post from '../src/models/Post';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/premium-news';

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503694978374-8a2fa686963a?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop"
];

async function fixMissingImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const posts = await Post.find({});
    let updatedCount = 0;

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      // If there's no image URL, or it's empty, or it's a wp-content local link that is broken
      if (!post.imageUrl || post.imageUrl.trim() === '' || post.imageUrl.includes('wp-content')) {
        // Assign a distinct image from the array using modulo to ensure variety
        const randomImg = FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
        post.imageUrl = randomImg;
        await post.save();
        updatedCount++;
      }
    }

    console.log(`✅ Successfully updated \${updatedCount} posts with diverse fallback images.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
}

fixMissingImages();
