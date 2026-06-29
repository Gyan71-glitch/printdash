import mysql from 'mysql2/promise';
import mongoose from 'mongoose';
import Post from '../src/models/Post';

async function updateContent() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error("No MONGODB_URI");
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'indianberg_old',
  });
  console.log('✅ Connected to MySQL');

  const [posts] = await connection.execute<any[]>(`
    SELECT post_title, post_content 
    FROM wp_posts 
    WHERE post_type = 'post' AND post_status = 'publish'
  `);

  console.log(`📰 Found ${posts.length} published posts in MySQL to update content for.`);

  let updated = 0;
  for (const post of posts) {
    const content = post.post_content;
    const title = post.post_title;
    
    // Format content: convert newlines to <p> tags if it's not already HTML formatted
    let formattedContent = content;
    if (content && !content.includes('<p>')) {
      formattedContent = content.split('\n\n').map((p: string) => `<p>${p.trim()}</p>`).join('');
    }

    const result = await Post.updateOne({ title }, { $set: { content: formattedContent } });
    if (result.modifiedCount > 0) {
      updated++;
    }
  }

  console.log(`🎉 Successfully updated content for ${updated} posts!`);

  await connection.end();
  await mongoose.disconnect();
}

updateContent().catch(console.error);
