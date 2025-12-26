import { handlers } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// Wrap handlers with error catching
export async function GET(req: NextRequest) {
    try {
        return await handlers.GET(req);
    } catch (error) {
        console.error('[AUTH] GET Error:', error);
        return NextResponse.json(
            { 
                error: 'Auth handler failed', 
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        return await handlers.POST(req);
    } catch (error) {
        console.error('[AUTH] POST Error:', error);
        return NextResponse.json(
            { 
                error: 'Auth handler failed', 
                message: error instanceof Error ? error.message : 'Unknown error' 
            },
            { status: 500 }
        );
    }
}
