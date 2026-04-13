import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';

export const dynamic = 'force-dynamic';

const dummyData = [
  // LATEST NEWS FLASH STRIP
  {
    title: "Breaking: Major Indian bank reports breach affecting 50 million accounts",
    section: "news_flash",
    isLive: true,
  },
  
  // LEFT COLUMN: Main News Feed
  {
    title: "The Pegasus Files: New evidence of spyware targeting Indian journalists",
    section: "main_feed",
    subType: "top",
    excerpt: "A joint forensic investigation by The Indianberg and Citizen Lab reveals active traces of military-grade spyware on mobile devices of key reporting members.",
    author: "Arjun Mehta",
    timeAgo: "30 mins ago"
  },
  {
    title: "Delhi Police Cyber Cell busts ₹500 Cr international extortion racket",
    section: "main_feed",
    subType: "sub",
    tag: "Cyber Crime",
    timeAgo: "2 hours ago"
  },
  {
    title: "North Korean hackers suspected in recent power grid failure in Mumbai",
    section: "main_feed",
    subType: "sub",
    tag: "Security",
    timeAgo: "4 hours ago"
  },
  {
    title: "India's data protection bill: A shield or a sieve for privacy?",
    section: "main_feed",
    subType: "sub",
    tag: "Policy",
    timeAgo: "6 hours ago"
  },
  
  // CENTER COLUMN: Big Featured Media
  {
    title: "The Deepfake Economy: Inside the underground factories of disinformation",
    section: "featured",
    subType: "main",
    tag: "Forensics",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Code Red: How a single bug nearly crashed the UPI system",
    section: "featured",
    subType: "secondary",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Crypto-Heist: Tracking ₹2000 Cr stolen from Indian exchanges",
    section: "featured",
    subType: "secondary",
    imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=800&auto=format&fit=crop"
  },

  // RIGHT COLUMN: Opinions
  {
    title: "Why digital literacy is India's only defense against cyber warfare",
    section: "opinions",
    author: "Rohan Das",
    authorImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
  },
  {
    title: "The ethics of AI in investigative journalism",
    section: "opinions",
    author: "Priya Sharma",
    authorImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
  },
  {
    title: "The Dark Web's Indian marketplaces are growing, and we are not ready",
    section: "opinions",
    author: "Vikram Singh",
    authorImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
  },

  // MORE FROM THE INDIANBERG
  {
    title: "Ransomware: The invisible threat bringing Indian hospitals to a standstill",
    section: "ledger",
    tag: "Cyber Crime",
    timeAgo: "6 hrs ago",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Tracking the source: How illicit data is sold on Telegram channels",
    section: "ledger",
    tag: "Investigations",
    timeAgo: "8 hrs ago",
    imageUrl: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "The rise of KYC fraud: Protecting your identity in a digital India",
    section: "ledger",
    tag: "Privacy",
    timeAgo: "10 hrs ago",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
  },

  // VISUAL INVESTIGATIONS
  {
    title: "Mapping the Cyber Warfare: How state-sponsored actors infiltrate Indian networks.",
    section: "visual",
    description: "Using packet analysis and geolocation data, The Indianberg visualizes the sophisticated infrastructure used to target critical national agencies.",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop"
  },

  // FORENSICS FOCUS
  {
    title: "Inside the Lab: How forensic experts recover 'deleted' evidence",
    section: "politics",
    subType: "main",
    excerpt: "We visit a top digital forensics lab in Bengaluru to see how a simple USB stick can hold the key to a billion-dollar scam.",
    author: "Anjali Gupta",
    timeAgo: "5 hrs ago",
    imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "New AI tools for identifying deepfake video content",
    section: "politics",
    subType: "sub",
    timeAgo: "2 hrs ago"
  },
  {
    title: "The anatomy of a Phishing email: What to look for",
    section: "politics",
    subType: "sub",
    timeAgo: "6 hrs ago"
  },

  // CRIME SECTION (Reusing Style section for now)
  {
    title: "The Rise of Organized Cyber Crime in Tier-2 Indian Cities",
    section: "style",
    imageUrl: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Cyber-Forensics: The future of criminal investigations in India",
    section: "style",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c89eecaaad8e?q=80&w=800&auto=format&fit=crop"
  }
];

export async function GET() {
  try {
    await connectToDatabase();
    
    // Clear old data
    await Post.deleteMany({});
    
    // Insert new dummy data
    await Post.insertMany(dummyData);
    
    return NextResponse.json({ success: true, message: "The Indianberg database flooded with cyber-crime news!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
