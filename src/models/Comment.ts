import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  postId: string;
  userId: string;
  userName: string;
  userImage?: string;
  body: string;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  postId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userImage: { type: String },
  body: { type: String, required: true, maxlength: 2000 },
  createdAt: { type: Date, default: Date.now },
});

CommentSchema.index({ postId: 1, createdAt: -1 });

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
