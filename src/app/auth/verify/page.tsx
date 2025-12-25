'use client';

import { motion } from 'framer-motion';

export default function VerifyPage() {
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
                <div className="w-20 h-20 rounded-full bg-reactor-green/20 flex items-center justify-center mx-auto mb-8">
                    <svg
                        className="w-10 h-10 text-reactor-green"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                </div>

                {/* Content */}
                <div className="font-mono text-xs text-reactor-green/60 tracking-widest mb-4">
                    &gt; TRANSMISSION SENT
                </div>

                <h1 className="font-monolith text-3xl font-bold tracking-tighter text-starlight mb-4">
                    CHECK YOUR EMAIL
                </h1>

                <p className="text-starlight/60 font-mono text-sm mb-8 leading-relaxed">
                    A magic link has been sent to your email address.<br />
                    Click the link to complete authentication.
                </p>

                {/* Status Box */}
                <div className="bg-tungsten/30 backdrop-blur-xl border border-white/10 rounded-lg p-6 mb-8">
                    <div className="flex items-center justify-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-reactor-green animate-pulse" />
                        <span className="font-mono text-xs text-starlight/80 tracking-wider">
                            AWAITING CONFIRMATION
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <a
                    href="/"
                    className="text-starlight/40 hover:text-reactor-green font-mono text-xs transition-colors"
                >
                    ← RETURN TO MAIN SITE
                </a>
            </motion.div>
        </div>
    );
}
