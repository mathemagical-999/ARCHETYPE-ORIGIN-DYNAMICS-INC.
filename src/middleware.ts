import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Security headers for all responses
const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// Rate limit store (in-memory for edge, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Simple rate limiter for edge
function checkRateLimit(ip: string, limit: number = 60, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = rateLimitStore.get(ip);

    if (!record || now > record.resetTime) {
        rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
        return true;
    }

    if (record.count >= limit) {
        return false;
    }

    record.count++;
    return true;
}

// Bot/Scraper detection patterns
const suspiciousUserAgents = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /headless/i,
    /phantom/i,
    /selenium/i,
    /puppeteer/i,
];

function isBot(userAgent: string | null): boolean {
    if (!userAgent) return false;
    // Allow legitimate bots (Googlebot, etc.)
    if (/googlebot|bingbot|slurp|duckduckbot|facebookexternalhit|linkedinbot/i.test(userAgent)) {
        return false;
    }
    return suspiciousUserAgents.some((pattern) => pattern.test(userAgent));
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Skip auth routes entirely - let NextAuth handle them
    if (pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }
    
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        'unknown';
    const userAgent = request.headers.get('user-agent');

    // Block suspicious bots from API routes
    if (pathname.startsWith('/api/') && isBot(userAgent)) {
        return new NextResponse(JSON.stringify({ error: 'Access denied' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Rate limit API routes (excluding auth)
    if (pathname.startsWith('/api/')) {
        // Stricter limit for sensitive endpoints
        const limit = pathname.includes('/auth/') ? 10 :
            pathname.includes('/waitlist') ? 5 : 60;

        if (!checkRateLimit(`${ip}:${pathname}`, limit)) {
            return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': '60',
                },
            });
        }
    }

    // Create response with security headers
    const response = NextResponse.next();

    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    // Add CSP header (more permissive for WebGL and OAuth)
    response.headers.set(
        'Content-Security-Policy',
        [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Required for Next.js and Three.js
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob: https:",
            "font-src 'self' data:",
            "connect-src 'self' https://*.supabase.co https://*.upstash.io https://api.resend.com https://github.com https://api.github.com https://accounts.google.com https://*.googleapis.com",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self' https://github.com https://accounts.google.com",
        ].join('; ')
    );

    // Add HSTS for production
    if (process.env.NODE_ENV === 'production') {
        response.headers.set(
            'Strict-Transport-Security',
            'max-age=31536000; includeSubDomains; preload'
        );
    }

    return response;
}

// Configure which routes the middleware runs on
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
    ],
};
