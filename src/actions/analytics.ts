'use server';

import { headers } from 'next/headers';
import { supabaseAdmin, isAdminConfigured } from '@/lib/db';

/**
 * Server Action: Log a telemetry event
 */
export async function logTelemetry(
    eventType: string,
    metadata?: Record<string, unknown>
): Promise<void> {
    try {
        const headersList = await headers();
        const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 'unknown';
        const userAgent = headersList.get('user-agent') || 'unknown';
        const referer = headersList.get('referer') || null;

        console.log('[TELEMETRY]', eventType, metadata);

        if (isAdminConfigured() && supabaseAdmin) {
            await supabaseAdmin.from('telemetry').insert({
                event_type: eventType,
                ip_address: ip,
                user_agent: userAgent,
                referrer: referer,
                metadata: metadata || {},
            });
        }
    } catch (error) {
        // Never throw on telemetry
        console.error('[TELEMETRY] Error:', error);
    }
}

/**
 * Server Action: Log session start
 */
export async function logSessionStart(sessionId: string): Promise<void> {
    await logTelemetry('session_start', { sessionId });
}

/**
 * Server Action: Log page view
 */
export async function logPageView(pagePath: string, sessionId?: string): Promise<void> {
    await logTelemetry('page_view', { pagePath, sessionId });
}

/**
 * Server Action: Log button click
 */
export async function logButtonClick(
    buttonId: string,
    buttonLabel: string,
    pagePath?: string
): Promise<void> {
    await logTelemetry('button_click', { buttonId, buttonLabel, pagePath });
}
