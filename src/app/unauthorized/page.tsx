'use client';

import { motion } from 'framer-motion';

export default function UnauthorizedPage() {
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
                <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-8">
                    <svg
                        className="w-12 h-12 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                    </svg>
                </div>

                {/* Content */}
                <div className="font-mono text-xs text-red-500/60 tracking-widest mb-4">
                    &gt; ACCESS_DENIED
                </div>

                <h1 className="font-monolith text-4xl font-bold tracking-tighter text-starlight mb-4">
                    CLEARANCE INSUFFICIENT
                </h1>

                <p className="text-starlight/60 font-mono text-sm mb-8 leading-relaxed">
                    You do not have the required clearance level<br />
                    to access this restricted area.
                </p>

                {/* Classification Box */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-8">
                    <div className="font-mono text-xs text-red-500 tracking-wider mb-2">
                        REQUIRED CLEARANCE
                    </div>
                    <div className="font-monolith text-2xl text-starlight font-bold">
                        LEVEL 10 — OVERLORD
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <a
                        href="/"
                        className="bg-tungsten hover:bg-tungsten/80 border border-white/10 text-starlight font-mono font-bold py-3 px-6 rounded-lg transition-colors inline-block"
                    >
                        ← RETURN TO MAIN SITE
                    </a>
                    <a
                        href="/auth/signin"
                        className="text-starlight/40 hover:text-reactor-green font-mono text-xs transition-colors"
                    >
                        SIGN IN WITH DIFFERENT ACCOUNT
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
