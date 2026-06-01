import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || ((session.user as any)?.role !== 'admin' && session.user?.email !== 'raiyn1279@gmail.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    // Sort by most recently published
    const posts = await Post.find({}).sort({ publishedAt: -1 });

    return NextResponse.json(posts);
  } catch (error: any) {
    console.error('Error in GET /api/admin/posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || ((session.user as any)?.role !== 'admin' && session.user?.email !== 'raiyn1279@gmail.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();

    // Basic validation
    if (!body.title || !body.tag) {
      return NextResponse.json({ error: 'Title and Tag are required' }, { status: 400 });
    }

    // Auto-generate slug if not provided
    if (!body.slug) {
      body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const newPost = await Post.create({
      ...body,
      publishedAt: new Date(),
      timeAgo: 'Just now',
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/admin/posts:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
