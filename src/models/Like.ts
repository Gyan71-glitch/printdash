import mongoose, { Schema, Document } from 'mongoose';

export interface ILike extends Document {
  postId: string;
  userId: string;
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>({
  postId: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Compound unique index — one like per user per post
LikeSchema.index({ postId: 1, userId: 1 }, { unique: true });

export default mongoose.models.Like || mongoose.model<ILike>('Like', LikeSchema);
