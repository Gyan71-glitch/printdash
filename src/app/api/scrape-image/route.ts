import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });

    if (!res.ok) {
       return NextResponse.json({ error: 'Failed to fetch URL' }, { status: res.status });
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    let imageUrl = 
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[itemprop="image"]').attr('content') ||
      $('link[rel="image_src"]').attr('href');

    if (!imageUrl) {
      // fallback to the first large image
      const img = $('img').first();
      imageUrl = img.attr('src');
    }

    if (imageUrl && !imageUrl.startsWith('http')) {
      const parsedUrl = new URL(url);
      imageUrl = `${parsedUrl.protocol}//${parsedUrl.host}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }

    if (imageUrl) {
      return NextResponse.json({ imageUrl });
    }

    return NextResponse.json({ error: 'No image found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
