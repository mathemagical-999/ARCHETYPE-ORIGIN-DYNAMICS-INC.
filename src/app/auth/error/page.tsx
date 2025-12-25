'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Suspense } from 'react';

function ErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    const errorMessages: Record<string, string> = {
        Configuration: 'There is a problem with the server configuration.',
        AccessDenied: 'Access denied. You do not have permission to sign in.',
        Verification: 'The verification link may have expired or already been used.',
        Default: 'An authentication error occurred.',
    };

    const message = errorMessages[error || 'Default'] || errorMessages.Default;

    return (
        <div className="min-h-screen bg-void flex items-center justify-center p-8">
            {/* Noise overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50"
                style={{ backgroundImage: 'url(/noise.png)', backgroundRepeat: 'repeat' }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md text-center"
            >
                {/* Icon */}
                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-8">
                    <svg
                        className="w-10 h-10 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                {/* Content */}
                <div className="font-mono text-xs text-red-500/60 tracking-widest mb-4">
                    &gt; AUTHENTICATION_ERROR
                </div>

                <h1 className="font-monolith text-3xl font-bold tracking-tighter text-starlight mb-4">
                    ACCESS DENIED
                </h1>

                <p className="text-starlight/60 font-mono text-sm mb-8 leading-relaxed">
                    {message}
                </p>

                {/* Error Code Box */}
                {error && (
                    <div className="bg-tungsten/30 backdrop-blur-xl border border-red-500/20 rounded-lg p-4 mb-8">
                        <span className="font-mono text-xs text-red-500/80 tracking-wider">
                            ERROR_CODE: {error}
                        </span>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <a
                        href="/auth/signin"
                        className="bg-reactor-green text-void font-mono font-bold py-3 px-6 rounded-lg hover:bg-reactor-green/90 transition-colors inline-block"
                    >
                        TRY AGAIN
                    </a>
                    <a
                        href="/"
                        className="text-starlight/40 hover:text-reactor-green font-mono text-xs transition-colors"
                    >
                        ← RETURN TO MAIN SITE
                    </a>
                </div>
            </motion.div>
        </div>
    );
}

export default function ErrorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-void flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-reactor-green/30 border-t-reactor-green rounded-full animate-spin" />
            </div>
        }>
            <ErrorContent />
        </Suspense>
    );
}
