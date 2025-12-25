import { Resend } from 'resend';

// Environment validation
const resendApiKey = process.env.RESEND_API_KEY;

// Resend client
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Check if email is configured
export function isEmailConfigured(): boolean {
    return !!resendApiKey;
}

// Email template types
interface WaitlistConfirmationData {
    email: string;
    position: number;
}

interface AccessGrantedData {
    email: string;
    accessCode?: string;
}

interface AdminNotificationData {
    subject: string;
    message: string;
}

// Sender configuration
const FROM_EMAIL = 'ARCHETYPE ORIGIN DYNAMICS <noreply@archetypeorigininc.com>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'archetype.origin.dynamics@gmail.com';

/**
 * Send waitlist confirmation email
 * "Protocol Initiated. You are in the queue."
 */
export async function sendWaitlistConfirmation(
    data: WaitlistConfirmationData
): Promise<{ success: boolean; error?: string }> {
    if (!resend) {
        console.warn('[EMAIL] Resend not configured, skipping email');
        return { success: true };
    }

    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: data.email,
            subject: 'PROTOCOL INITIATED // ARCHETYPE ORIGIN DYNAMICS',
            html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      background-color: #050505;
      color: #F8FAFC;
      font-family: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
      padding: 40px;
      margin: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
    }
    .header {
      color: #00FF41;
      font-size: 12px;
      letter-spacing: 2px;
      margin-bottom: 40px;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
      letter-spacing: -1px;
    }
    .body-text {
      font-size: 14px;
      line-height: 1.8;
      color: #A0A0A0;
    }
    .position {
      background: linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%);
      border: 1px solid #333;
      border-radius: 8px;
      padding: 24px;
      margin: 30px 0;
      text-align: center;
    }
    .position-label {
      font-size: 11px;
      color: #666;
      letter-spacing: 2px;
      margin-bottom: 8px;
    }
    .position-number {
      font-size: 48px;
      font-weight: bold;
      color: #00FF41;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #222;
      font-size: 11px;
      color: #444;
    }
    .status {
      display: inline-block;
      background: #0A2A0A;
      color: #00FF41;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 11px;
      letter-spacing: 1px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">&gt; ARCHETYPE_CORE: TRANSMISSION</div>
    
    <div class="title">PROTOCOL INITIATED</div>
    
    <div class="body-text">
      Your request has been received and logged.<br><br>
      You have been added to the access queue for THE ALCHEMIST.<br>
      Stand by for further instructions.
    </div>
    
    <div class="position">
      <div class="position-label">YOUR QUEUE POSITION</div>
      <div class="position-number">#${data.position}</div>
    </div>
    
    <div class="body-text">
      <span class="status">STATUS: PENDING</span><br><br>
      You will be notified when access is granted.<br>
      Do not reply to this transmission.
    </div>
    
    <div class="footer">
      ARCHETYPE ORIGIN DYNAMICS INC.<br>
      236 Albion Road, Etobicoke, ON M9W 6A6<br>
      D-U-N-S® Registered
    </div>
  </div>
</body>
</html>
      `,
            text: `
ARCHETYPE ORIGIN DYNAMICS
> PROTOCOL INITIATED

Your request has been received and logged.
You have been added to the access queue for THE ALCHEMIST.

YOUR QUEUE POSITION: #${data.position}

STATUS: PENDING
You will be notified when access is granted.
Do not reply to this transmission.

---
ARCHETYPE ORIGIN DYNAMICS INC.
236 Albion Road, Etobicoke, ON M9W 6A6
D-U-N-S® Registered
      `,
        });

        return { success: true };
    } catch (error) {
        console.error('[EMAIL] Failed to send waitlist confirmation:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Send access granted email
 * "The gates have opened."
 */
export async function sendAccessGranted(
    data: AccessGrantedData
): Promise<{ success: boolean; error?: string }> {
    if (!resend) {
        console.warn('[EMAIL] Resend not configured, skipping email');
        return { success: true };
    }

    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: data.email,
            subject: 'ACCESS GRANTED // THE ALCHEMIST',
            html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      background-color: #050505;
      color: #F8FAFC;
      font-family: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
      padding: 40px;
      margin: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
    }
    .header {
      color: #00FF41;
      font-size: 12px;
      letter-spacing: 2px;
      margin-bottom: 40px;
    }
    .title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 20px;
      letter-spacing: -1px;
      color: #00FF41;
    }
    .body-text {
      font-size: 14px;
      line-height: 1.8;
      color: #A0A0A0;
    }
    .code-box {
      background: linear-gradient(135deg, #0A2A0A 0%, #050505 100%);
      border: 2px solid #00FF41;
      border-radius: 8px;
      padding: 24px;
      margin: 30px 0;
      text-align: center;
    }
    .code-label {
      font-size: 11px;
      color: #00FF41;
      letter-spacing: 2px;
      margin-bottom: 8px;
    }
    .access-code {
      font-size: 32px;
      font-weight: bold;
      color: #F8FAFC;
      letter-spacing: 4px;
    }
    .cta {
      display: inline-block;
      background: #00FF41;
      color: #050505;
      padding: 16px 32px;
      text-decoration: none;
      font-weight: bold;
      font-size: 14px;
      letter-spacing: 1px;
      margin-top: 20px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #222;
      font-size: 11px;
      color: #444;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">&gt; ARCHETYPE_CORE: PRIORITY TRANSMISSION</div>
    
    <div class="title">ACCESS GRANTED</div>
    
    <div class="body-text">
      The gates have opened.<br><br>
      You have been cleared for access to THE ALCHEMIST.<br>
      Welcome to the inner circle.
    </div>
    
    ${data.accessCode ? `
    <div class="code-box">
      <div class="code-label">YOUR ACCESS CODE</div>
      <div class="access-code">${data.accessCode}</div>
    </div>
    ` : ''}
    
    <div class="body-text">
      <a href="https://archetypeorigininc.com/alchemist" class="cta">ENTER THE ALCHEMIST →</a>
    </div>
    
    <div class="footer">
      ARCHETYPE ORIGIN DYNAMICS INC.<br>
      236 Albion Road, Etobicoke, ON M9W 6A6<br>
      D-U-N-S® Registered
    </div>
  </div>
</body>
</html>
      `,
        });

        return { success: true };
    } catch (error) {
        console.error('[EMAIL] Failed to send access granted:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Send notification to admin
 */
export async function sendAdminNotification(
    data: AdminNotificationData
): Promise<{ success: boolean; error?: string }> {
    if (!resend) {
        console.warn('[EMAIL] Resend not configured, skipping email');
        return { success: true };
    }

    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: ADMIN_EMAIL,
            subject: `[ADMIN] ${data.subject}`,
            text: `
ARCHETYPE ORIGIN DYNAMICS
ADMIN NOTIFICATION

${data.message}

---
Timestamp: ${new Date().toISOString()}
      `,
        });

        return { success: true };
    } catch (error) {
        console.error('[EMAIL] Failed to send admin notification:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
