import mongoose from 'mongoose';
import Post from '../src/models/Post';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/premium-news';

async function findPost() {
  await mongoose.connect(MONGODB_URI);
  const posts = await Post.find({ $or: [{ title: /WallahIPO/i }, { section: 'news flash' }] });
  console.log(posts.map(p => ({ title: p.title, section: p.section })));
  process.exit(0);
}
findPost();
