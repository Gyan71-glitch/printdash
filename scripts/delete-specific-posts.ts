import mongoose from 'mongoose';
import Post from '../src/models/Post';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/premium-news';

async function fix() {
  await mongoose.connect(MONGODB_URI);
  
  const posts = await Post.find({});
  const matches = posts.filter(p => JSON.stringify(p).includes('EdTechRevolution') || JSON.stringify(p).includes('ysicsWallahIPO'));
  
  if (matches.length > 0) {
    console.log('Found posts to delete:', matches.map(m => m.title));
    await Post.deleteMany({ _id: { $in: matches.map(m => m._id) } });
    console.log('Deleted successfully.');
  } else {
    console.log('No posts found matching ysicsWallahIPO or EdTechRevolution.');
  }
  
  // Also check if there is an article titled "news flash"
  const nf = await Post.find({ title: /news flash/i });
  if (nf.length > 0) {
      console.log('Found article titled news flash:', nf.map(m => m.title));
      await Post.deleteMany({ _id: { $in: nf.map(m => m._id) } });
      console.log('Deleted successfully.');
  }
  
  process.exit(0);
}
fix();
