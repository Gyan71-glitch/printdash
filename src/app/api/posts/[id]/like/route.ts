import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Like from '@/models/Like';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { id: postId } = await params;
  const session = await getServerSession(authOptions);

  await connectToDatabase();
  const count = await Like.countDocuments({ postId });
  const liked = session?.user
    ? !!(await Like.findOne({ postId, userId: (session.user as any).id }))
    : false;

  return NextResponse.json({ count, liked });
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id: postId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'You must be signed in to like posts.' }, { status: 401 });
  }

  const userId = (session.user as any).id;
  await connectToDatabase();

  const existing = await Like.findOne({ postId, userId });

  if (existing) {
    // Toggle off
    await Like.deleteOne({ postId, userId });
    const count = await Like.countDocuments({ postId });
    return NextResponse.json({ liked: false, count });
  } else {
    // Toggle on
    await Like.create({ postId, userId });
    const count = await Like.countDocuments({ postId });
    return NextResponse.json({ liked: true, count });
  }
}
