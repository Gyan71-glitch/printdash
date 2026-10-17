import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import { isCategory } from '@/lib/categories';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || ((session.user as any)?.role !== 'admin' && session.user?.email !== 'raiyn1279@gmail.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    // Sort by most recently published
    const posts = await Post.find({}).sort({ createdAt: -1 });

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
    if (!isCategory(body.tag)) {
      return NextResponse.json({ error: `Unknown category: ${body.tag}` }, { status: 400 });
    }

    // Clean / auto-generate slug
    if (body.slug) {
      body.slug = body.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    } else if (body.title) {
      body.slug = body.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const newPost = await Post.create(body);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/admin/posts:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
