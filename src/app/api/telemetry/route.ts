import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { supabaseAdmin, isAdminConfigured } from '@/lib/db';
import { rateLimiters, isRedisConfigured } from '@/lib/redis';
import { validateTelemetry } from '@/lib/validations';

/**
 * POST /api/telemetry
 * Log analytics events from the frontend
 */
export async function POST(request: NextRequest) {
    try {
        // Get client info
        const headersList = await headers();
        const ip = headersList.get('x-forwarded-for')?.split(',')[0] ||
            headersList.get('x-real-ip') ||
            'unknown';
        const userAgent = headersList.get('user-agent') || 'unknown';

        // Rate limiting - be lenient with telemetry
        if (isRedisConfigured() && rateLimiters.telemetry) {
            const { success } = await rateLimiters.telemetry.limit(ip);
            if (!success) {
                // Silently drop the event - don't error on telemetry
                return NextResponse.json({ success: true, dropped: true }, { status: 200 });
            }
        }

        // Parse and validate input
        const body = await request.json();
        const validation = validateTelemetry(body);

        if (!validation.success) {
            // Silently ignore invalid telemetry
            return NextResponse.json({ success: true, ignored: true }, { status: 200 });
        }

        const { eventType, sessionId, pagePath, referrer, metadata } = validation.data!;

        // Log event
        console.log('[TELEMETRY]', {
            type: eventType,
            session: sessionId?.slice(0, 8),
            path: pagePath,
        });

        // Store in database if configured
        if (isAdminConfigured() && supabaseAdmin) {
            // Fire and forget - don't block response
            supabaseAdmin
                .from('telemetry')
                .insert({
                    event_type: eventType,
                    session_id: sessionId || null,
                    ip_address: ip,
                    user_agent: userAgent,
                    page_path: pagePath || null,
                    referrer: referrer || headersList.get('referer') || null,
                    metadata: metadata || {},
                })
                .then(({ error }) => {
                    if (error) {
                        console.error('[TELEMETRY] Insert error:', error);
                    }
                });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        // Never fail telemetry requests - just log
        console.error('[TELEMETRY] Error:', error);
        return NextResponse.json({ success: true, error: true }, { status: 200 });
    }
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
