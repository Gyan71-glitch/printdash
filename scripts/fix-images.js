const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function fixImages() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const Post = mongoose.model('Post', new mongoose.Schema({}, { strict: false }));

  // Collect all full-size images from 2026, 2025 uploads (exclude resized thumbnails)
  const uploadsRoot = path.join(__dirname, '..', 'public', 'uploads');
  const years = ['2026', '2025'];
  const images = [];

  for (const year of years) {
    const yearPath = path.join(uploadsRoot, year);
    if (!fs.existsSync(yearPath)) continue;
    const months = fs.readdirSync(yearPath);
    for (const month of months) {
      const monthPath = path.join(yearPath, month);
      if (!fs.statSync(monthPath).isDirectory()) continue;
      const files = fs.readdirSync(monthPath);
      for (const file of files) {
        // Skip resized thumbnails (e.g. -300x200.)
        if (/\-\d+x\d+\./i.test(file)) continue;
        // Skip placeholders
        if (file.includes('cropped') || file.includes('bk')) continue;
        
        if (/\.(jpg|jpeg|png|webp|gif)$/i.test(file)) {
          images.push(`/uploads/${year}/${month}/${file}`);
        }
      }
    }
  }

  console.log(`📸 Found ${images.length} real valid images from backup`);

  // Find all posts that use STABLE_IMG or unsplash or placeholders
  const postsToFix = await Post.find({
    $or: [
      { imageUrl: { $exists: false } }, 
      { imageUrl: null }, 
      { imageUrl: '' },
      { imageUrl: /unsplash\.com/ },
      { imageUrl: /cropped/ },
      { imageUrl: /bk/ }
    ]
  }).select('_id title');

  console.log(`🔧 Patching ${postsToFix.length} posts with bad images...`);

  let patched = 0;
  for (let i = 0; i < postsToFix.length; i++) {
    const img = images[i % images.length];
    await Post.updateOne({ _id: postsToFix[i]._id }, { $set: { imageUrl: img } });
    patched++;
  }

  console.log(`\n✅ Done! Patched ${patched} posts with unique backup images.`);
  await mongoose.disconnect();
}

fixImages().catch(console.error);
