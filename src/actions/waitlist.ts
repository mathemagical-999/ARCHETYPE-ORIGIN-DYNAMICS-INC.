'use server';

import { headers } from 'next/headers';
import { supabaseAdmin, isAdminConfigured, type Believer } from '@/lib/db';
import { rateLimiters, isRedisConfigured } from '@/lib/redis';
import { validateWaitlist } from '@/lib/validations';
import { sendWaitlistConfirmation, sendAdminNotification, isEmailConfigured } from '@/lib/email';
import { auth } from '@/lib/auth';

/**
 * Server Action: Join the waitlist
 * Called from the "REQUEST ACCESS" button
 */
export async function joinWaitlist(formData: FormData): Promise<{
    success: boolean;
    message: string;
    position?: number;
    error?: string;
}> {
    try {
        // Get client info
        const headersList = await headers();
        const ip = headersList.get('x-forwarded-for')?.split(',')[0] ||
            headersList.get('x-real-ip') ||
            'unknown';
        const userAgent = headersList.get('user-agent') || 'unknown';

        // Rate limiting
        if (isRedisConfigured() && rateLimiters.waitlist) {
            const { success } = await rateLimiters.waitlist.limit(ip);
            if (!success) {
                return {
                    success: false,
                    message: 'Too many requests. Please try again later.',
                    error: 'RATE_LIMITED',
                };
            }
        }

        // Extract and validate email
        const email = formData.get('email');
        const referralSource = formData.get('referralSource');

        const validation = validateWaitlist({
            email,
            referralSource: typeof referralSource === 'string' ? referralSource : undefined,
        });

        if (!validation.success) {
            return {
                success: false,
                message: validation.error || 'Invalid email address.',
                error: 'VALIDATION_ERROR',
            };
        }

        const { email: validEmail, referralSource: validReferral } = validation.data!;

        // Development mode fallback
        if (!isAdminConfigured() || !supabaseAdmin) {
            console.log('[ACTION] Waitlist signup:', validEmail);
            const mockPosition = Math.floor(Math.random() * 100) + 1;
            return {
                success: true,
                message: 'Protocol initiated. You are in the queue.',
                position: mockPosition,
            };
        }

        // Check for existing signup
        const { data: existing } = await supabaseAdmin
            .from('believers')
            .select('id, waitlist_position')
            .eq('email', validEmail.toLowerCase())
            .single();

        if (existing) {
            return {
                success: true,
                message: 'You are already in the queue.',
                position: existing.waitlist_position,
            };
        }

        // Insert new believer
        const { data: newBeliever, error: insertError } = await supabaseAdmin
            .from('believers')
            .insert({
                email: validEmail.toLowerCase(),
                ip_address: ip,
                user_agent: userAgent,
                clearance_level: 0,
                status: 'pending',
                referral_source: validReferral || null,
                metadata: {
                    signupTimestamp: new Date().toISOString(),
                    source: headersList.get('referer') || 'direct',
                    action: 'server_action',
                },
            })
            .select('id, waitlist_position')
            .single();

        if (insertError) {
            console.error('[ACTION] Insert error:', insertError);
            return {
                success: false,
                message: 'Failed to join waitlist. Please try again.',
                error: 'DATABASE_ERROR',
            };
        }

        const position = newBeliever?.waitlist_position || 1;

        // Send emails (non-blocking)
        if (isEmailConfigured()) {
            sendWaitlistConfirmation({ email: validEmail, position }).catch(console.error);
            sendAdminNotification({
                subject: 'New Waitlist Signup',
                message: `New believer joined:\n\nEmail: ${validEmail}\nPosition: #${position}`,
            }).catch(console.error);
        }

        return {
            success: true,
            message: 'Protocol initiated. You are in the queue.',
            position,
        };

    } catch (error) {
        console.error('[ACTION] Unexpected error:', error);
        return {
            success: false,
            message: 'An unexpected error occurred.',
            error: 'UNKNOWN_ERROR',
        };
    }
}

/**
 * Server Action: Get waitlist stats (admin only)
 */
export async function getWaitlistStats(): Promise<{
    success: boolean;
    data?: {
        totalCount: number;
        pendingCount: number;
        approvedCount: number;
        recentSignups: Array<Pick<Believer, 'id' | 'email' | 'waitlist_position' | 'status' | 'created_at'>>;
    };
    error?: string;
}> {
    try {
        // Check authentication
        const session = await auth();
        if (!session?.user?.isAdmin) {
            return { success: false, error: 'Unauthorized' };
        }

        if (!isAdminConfigured() || !supabaseAdmin) {
            return {
                success: true,
                data: {
                    totalCount: 42,
                    pendingCount: 35,
                    approvedCount: 7,
                    recentSignups: [],
                },
            };
        }

        // Get counts
        const [totalResult, pendingResult, approvedResult, recentResult] = await Promise.all([
            supabaseAdmin.from('believers').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('believers').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
            supabaseAdmin.from('believers').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
            supabaseAdmin.from('believers')
                .select('id, email, waitlist_position, status, created_at')
                .order('created_at', { ascending: false })
                .limit(10),
        ]);

        return {
            success: true,
            data: {
                totalCount: totalResult.count || 0,
                pendingCount: pendingResult.count || 0,
                approvedCount: approvedResult.count || 0,
                recentSignups: recentResult.data || [],
            },
        };

    } catch (error) {
        console.error('[ACTION] Stats error:', error);
        return { success: false, error: 'Failed to get stats' };
    }
}

/**
 * Server Action: Update believer status (admin only)
 */
export async function updateBelieverStatus(
    believerId: string,
    status: 'pending' | 'approved' | 'rejected'
): Promise<{ success: boolean; error?: string }> {
    try {
        // Check authentication
        const session = await auth();
        if (!session?.user?.isAdmin) {
            return { success: false, error: 'Unauthorized' };
        }

        if (!isAdminConfigured() || !supabaseAdmin) {
            return { success: true };
        }

        const { error } = await supabaseAdmin
            .from('believers')
            .update({ status })
            .eq('id', believerId);

        if (error) {
            console.error('[ACTION] Update error:', error);
            return { success: false, error: 'Failed to update status' };
        }

        return { success: true };

    } catch (error) {
        console.error('[ACTION] Update error:', error);
        return { success: false, error: 'Unknown error' };
    }
}
