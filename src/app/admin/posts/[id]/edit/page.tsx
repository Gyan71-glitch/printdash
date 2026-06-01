import PostForm from '@/components/admin/PostForm';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  
  // Need lean() to serialize properly to pass to Client Component
  const post = await Post.findById(id).lean();

  if (!post) {
    notFound();
  }

  // Convert MongoDB ObjectId to string to prevent serialization errors
  const serializedPost = {
    ...post,
    _id: post._id.toString(),
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <PostForm initialData={serializedPost} isEdit={true} />
    </div>
  );
}
