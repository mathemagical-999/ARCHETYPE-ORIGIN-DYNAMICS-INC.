import { z } from 'zod';

// List of disposable email domains to block
const DISPOSABLE_EMAIL_DOMAINS = [
    'tempmail.com',
    'throwaway.email',
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'temp-mail.org',
    'fakeinbox.com',
    'sharklasers.com',
    'guerrillamail.info',
    'grr.la',
    'pokemail.net',
    'spam4.me',
    'yopmail.com',
    'maildrop.cc',
    'discard.email',
];

// Custom email validation that rejects disposable emails
const validEmail = z
    .string()
    .email('Invalid email format')
    .min(5, 'Email too short')
    .max(254, 'Email too long')
    .refine(
        (email) => {
            const domain = email.split('@')[1]?.toLowerCase();
            return !DISPOSABLE_EMAIL_DOMAINS.includes(domain);
        },
        { message: 'Temporary email addresses are not allowed' }
    );

// Waitlist signup schema
export const waitlistSchema = z.object({
    email: validEmail,
    referralSource: z.string().optional(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;

// Telemetry event schema
export const telemetrySchema = z.object({
    eventType: z.enum([
        'page_view',
        'session_start',
        'session_end',
        'button_click',
        'scroll_depth',
        'time_on_page',
        'error',
        'custom',
    ]),
    sessionId: z.string().optional(),
    pagePath: z.string().optional(),
    referrer: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
});

export type TelemetryInput = z.infer<typeof telemetrySchema>;

// Admin update believer schema
export const updateBelieverSchema = z.object({
    id: z.string().uuid(),
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
    clearanceLevel: z.number().int().min(0).max(10).optional(),
});

export type UpdateBelieverInput = z.infer<typeof updateBelieverSchema>;

// Contact form schema (for future use)
export const contactSchema = z.object({
    name: z.string().min(2, 'Name too short').max(100, 'Name too long'),
    email: validEmail,
    subject: z.string().min(5, 'Subject too short').max(200, 'Subject too long'),
    message: z.string().min(20, 'Message too short').max(5000, 'Message too long'),
});

export type ContactInput = z.infer<typeof contactSchema>;

// Validation helpers
export function validateWaitlist(data: unknown): {
    success: boolean;
    data?: WaitlistInput;
    error?: string;
} {
    const result = waitlistSchema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return {
        success: false,
        error: result.error.issues[0]?.message || 'Invalid input',
    };
}

export function validateTelemetry(data: unknown): {
    success: boolean;
    data?: TelemetryInput;
    error?: string;
} {
    const result = telemetrySchema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return {
        success: false,
        error: result.error.issues[0]?.message || 'Invalid input',
    };
}
