import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';

export const dynamic = "force-dynamic";


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    await connectToDatabase();

    const query = section ? { section } : {};
    const posts = await Post.find(query).sort({ order: 1, createdAt: -1 });

    return NextResponse.json({ success: true, data: posts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const post = await Post.create(body);
    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    if (!_id) {
       return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    const post = await Post.findByIdAndUpdate(_id, updateData, { new: true });
    if (!post) {
       return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: post });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    await connectToDatabase();
    await Post.findByIdAndDelete(id);

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
