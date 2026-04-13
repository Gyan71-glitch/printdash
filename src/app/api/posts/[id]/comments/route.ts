import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Comment from '@/models/Comment';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { id: postId } = await params;
  await connectToDatabase();

  const comments = await Comment.find({ postId })
    .sort({ createdAt: -1 })
    .lean();

  const serialized = comments.map((c: any) => ({
    ...c,
    _id: c._id.toString(),
    createdAt: c.createdAt?.toISOString?.() ?? new Date().toISOString(),
  }));

  return NextResponse.json({ data: serialized });
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id: postId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Sign in to comment.' }, { status: 401 });
  }

  const { body } = await req.json();
  if (!body?.trim()) {
    return NextResponse.json({ error: 'Comment cannot be empty.' }, { status: 400 });
  }
  if (body.length > 2000) {
    return NextResponse.json({ error: 'Comment too long.' }, { status: 400 });
  }

  await connectToDatabase();

  const comment = await Comment.create({
    postId,
    userId: (session.user as any).id,
    userName: session.user.name,
    userImage: session.user.image,
    body: body.trim(),
  });

  return NextResponse.json({
    data: {
      _id: comment._id.toString(),
      postId: comment.postId,
      userId: comment.userId,
      userName: comment.userName,
      userImage: comment.userImage,
      body: comment.body,
      createdAt: comment.createdAt?.toISOString?.() ?? new Date().toISOString(),
    },
  }, { status: 201 });
}
