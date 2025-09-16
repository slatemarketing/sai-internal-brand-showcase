import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiting (replace with Redis in production if needed)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

// Allowed CDN domains for security
const ALLOWED_DOMAINS = [
  'cdn.slateai.org',
];

function getRateLimitKey(request: NextRequest): string {
  // Use IP address for rate limiting
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 
             request.headers.get('x-real-ip') || 
             'unknown';
  return ip;
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(key);

  if (!limit || now > limit.resetTime) {
    // Reset or create new limit
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (limit.count >= RATE_LIMIT) {
    return false;
  }

  limit.count++;
  return true;
}

function isAllowedDomain(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ALLOWED_DOMAINS.includes(parsedUrl.hostname);
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');
    const filename = searchParams.get('filename');

    // Validation
    if (!url || !filename) {
      return NextResponse.json(
        { error: 'Missing url or filename parameter' },
        { status: 400 }
      );
    }

    // Security check - only allow our CDN
    if (!isAllowedDomain(url)) {
      return NextResponse.json(
        { error: 'Invalid domain. Only SlateAI CDN assets are allowed.' },
        { status: 403 }
      );
    }

    // Filename validation
    if (!/^[a-zA-Z0-9\-_.]+\.(png|jpg|jpeg|svg|pdf)$/i.test(filename)) {
      return NextResponse.json(
        { error: 'Invalid filename format' },
        { status: 400 }
      );
    }

    // Fetch with timeout and proper error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'SlateAI-Brand-Showcase/1.0',
      },
    });

    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'File not found on CDN' },
          { status: 404 }
        );
      }
      throw new Error(`CDN responded with status: ${response.status}`);
    }

    // Check content type
    const contentType = response.headers.get('Content-Type');
    if (!contentType || !['image/', 'application/pdf'].some(type => contentType.startsWith(type))) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Check file size (max 50MB)
    const contentLength = response.headers.get('Content-Length');
    if (contentLength && parseInt(contentLength) > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large' },
        { status: 413 }
      );
    }

    const buffer = await response.arrayBuffer();
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600', // 1 hour cache
      },
    });

  } catch (error) {
    console.error('Download proxy error:', error);
    
    // Specific error handling
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Download timeout. Please try again.' },
          { status: 408 }
        );
      }
      
      if (error.message.includes('fetch')) {
        return NextResponse.json(
          { error: 'Unable to connect to CDN. Please check your connection.' },
          { status: 502 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}