import mongoose, { Schema, Document, models } from 'mongoose';

export interface IPost extends Document {
  title: string;
  section: 'news_flash' | 'main_feed' | 'featured' | 'opinions' | 'ledger' | 'visual' | 'politics' | 'style';
  subType?: 'top' | 'sub' | 'main' | 'secondary' | 'side';
  excerpt?: string;
  author?: string;
  authorImageUrl?: string;
  timeAgo?: string;
  tag?: string;
  imageUrl?: string;
  url?: string;
  isLive?: boolean;
  description?: string;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    section: {
      type: String,
      required: true,
      enum: ['news_flash', 'main_feed', 'featured', 'opinions', 'ledger', 'visual', 'politics', 'style'],
    },
    subType: { type: String },
    excerpt: { type: String },
    author: { type: String },
    authorImageUrl: { type: String },
    timeAgo: { type: String },
    tag: { type: String },
    imageUrl: { type: String },
    url: { type: String, default: '#' },
    isLive: { type: Boolean, default: false },
    description: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Post = models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
