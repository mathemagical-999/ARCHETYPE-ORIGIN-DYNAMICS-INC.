import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { supabaseAdmin, isAdminConfigured } from '@/lib/db';
import { rateLimiters, isRedisConfigured } from '@/lib/redis';
import { validateWaitlist } from '@/lib/validations';
import { sendWaitlistConfirmation, sendAdminNotification, isEmailConfigured } from '@/lib/email';

// Response helpers
function jsonResponse(data: object, status: number = 200) {
    return NextResponse.json(data, { status });
}

function errorResponse(message: string, status: number = 400) {
    return NextResponse.json({ success: false, error: message }, { status });
}

/**
 * POST /api/waitlist
 * Add a user to the waitlist for THE ALCHEMIST
 */
export async function POST(request: NextRequest) {
    try {
        // Get client info
        const headersList = await headers();
        const ip = headersList.get('x-forwarded-for')?.split(',')[0] ||
            headersList.get('x-real-ip') ||
            'unknown';
        const userAgent = headersList.get('user-agent') || 'unknown';

        // Rate limiting (wrapped in try-catch to handle credential issues)
        if (isRedisConfigured() && rateLimiters.waitlist) {
            try {
                const { success } = await rateLimiters.waitlist.limit(ip);
                if (!success) {
                    return errorResponse('Too many requests. Please try again later.', 429);
                }
            } catch (rateLimitError) {
                // Log but don't fail - proceed without rate limiting
                console.warn('[WAITLIST] Rate limiting failed:', rateLimitError);
            }
        }

        // Parse and validate input
        const body = await request.json();
        const validation = validateWaitlist(body);

        if (!validation.success) {
            return errorResponse(validation.error || 'Invalid input', 400);
        }

        const { email, referralSource } = validation.data!;

        // Check if Supabase is configured
        if (!isAdminConfigured() || !supabaseAdmin) {
            // Development mode - log and return success
            console.log('[WAITLIST] New signup:', email);
            return jsonResponse({
                success: true,
                message: 'You have been added to the queue.',
                position: Math.floor(Math.random() * 100) + 1, // Mock position
                note: 'Database not configured - development mode',
            });
        }

        // Check for duplicate email
        const { data: existing } = await supabaseAdmin
            .from('believers')
            .select('id, waitlist_position')
            .eq('email', email.toLowerCase())
            .single();

        if (existing) {
            return jsonResponse({
                success: true,
                message: 'You are already in the queue.',
                position: existing.waitlist_position,
                alreadyExists: true,
            });
        }

        // Insert new believer
        const { data: newBeliever, error: insertError } = await supabaseAdmin
            .from('believers')
            .insert({
                email: email.toLowerCase(),
                ip_address: ip,
                user_agent: userAgent,
                clearance_level: 0,
                status: 'pending',
                referral_source: referralSource || null,
                metadata: {
                    signupTimestamp: new Date().toISOString(),
                    source: headersList.get('referer') || 'direct',
                },
            })
            .select('id, waitlist_position')
            .single();

        if (insertError) {
            console.error('[WAITLIST] Insert error:', insertError);
            return errorResponse('Failed to join waitlist. Please try again.', 500);
        }

        const position = newBeliever?.waitlist_position || 1;

        // Send confirmation email (non-blocking)
        if (isEmailConfigured()) {
            sendWaitlistConfirmation({ email, position }).catch(console.error);

            // Notify admin of new signup
            sendAdminNotification({
                subject: 'New Waitlist Signup',
                message: `New believer joined the queue:\n\nEmail: ${email}\nPosition: #${position}\nIP: ${ip}`,
            }).catch(console.error);
        }

        // Log telemetry
        console.log('[WAITLIST] New signup:', {
            email: email.slice(0, 3) + '***',
            position,
            ip: ip.slice(0, 8) + '***',
        });

        return jsonResponse({
            success: true,
            message: 'Protocol initiated. You are in the queue.',
            position,
        });

    } catch (error) {
        console.error('[WAITLIST] Unexpected error:', error);
        return errorResponse('An unexpected error occurred.', 500);
    }
}

/**
 * GET /api/waitlist
 * Get waitlist stats (public endpoint)
 */
export async function GET() {
    try {
        if (!isAdminConfigured() || !supabaseAdmin) {
            return jsonResponse({
                success: true,
                totalCount: 42, // Mock count
                note: 'Database not configured - development mode',
            });
        }

        const { count, error } = await supabaseAdmin
            .from('believers')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('[WAITLIST] Count error:', error);
            return errorResponse('Failed to get waitlist count.', 500);
        }

        return jsonResponse({
            success: true,
            totalCount: count || 0,
        });

    } catch (error) {
        console.error('[WAITLIST] Unexpected error:', error);
        return errorResponse('An unexpected error occurred.', 500);
    }
}
