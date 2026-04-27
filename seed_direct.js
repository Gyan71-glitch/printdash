require("mongoose").connect("mongodb://localhost:27017/indianberg").then(async () => {
  const Post = require("./src/models/Post").default || require("./src/models/Post");
  const data = [
    {
      title: "The TikTok Ban: What it means for India's digital creators",
      section: "main_feed",
      tag: "Social",
      timeAgo: "12 hrs ago",
      imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&auto=format&fit=crop",
      excerpt: "Five years after the initial ban, we look at the long-term impact on the creator economy and the rise of local alternatives.",
      content: "Full article text here...",
      author: "Tech Desk",
      order: 0
    },
    {
      title: "Quantum Supremacy: How India is preparing for the post-encryption era",
      section: "main_feed",
      tag: "Future",
      timeAgo: "1 day ago",
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop",
      excerpt: "Government labs in Delhi are racing to develop quantum-resistant algorithms to protect national secrets.",
      content: "Full article text here...",
      author: "Science Desk",
      order: 0
    }
  ];
  for (const post of data) {
    await Post.findOneAndUpdate({ title: post.title }, post, { upsert: true, new: true });
  }
  console.log("Updated images.");
  process.exit(0);
});
