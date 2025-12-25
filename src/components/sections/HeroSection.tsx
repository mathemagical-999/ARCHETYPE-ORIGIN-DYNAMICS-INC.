'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import the 3D scene to avoid SSR issues
const Scene = dynamic(() => import('../canvas/Scene'), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-void" />,
});

export default function HeroSection() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -(e.clientY / window.innerHeight) * 2 + 1,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section id="hero-section" className="relative h-screen w-full overflow-hidden bg-void">
            {/* 3D Canvas Background */}
            <div className="absolute inset-0">
                <Scene mousePosition={mousePosition} />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-void/50 via-transparent to-void pointer-events-none" />

            {/* Main Title - Layered behind black hole effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center relative z-10 w-full max-w-6xl"
                >
                    {/* Pre-title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="mb-4 md:mb-6"
                    >
                        <span className="font-terminal text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] text-reactor-green uppercase">
                            Intelligence. Distilled.
                        </span>
                    </motion.div>

                    {/* Main Title with blend mode for black hole interaction */}
                    <h1
                        className="font-monolith font-bold tracking-tightest uppercase text-starlight leading-[0.85] mix-blend-exclusion"
                        data-text="ARCHETYPE"
                    >
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1 }}
                            className="block text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[7rem] xl:text-[9rem]"
                        >
                            ARCHETYPE
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1.2 }}
                            className="block text-[1.5rem] sm:text-[2rem] md:text-[3rem] lg:text-[4rem] xl:text-[5rem] text-starlight/80 mt-1 sm:mt-2"
                        >
                            ORIGIN DYNAMICS
                        </motion.span>
                    </h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.4 }}
                        className="mt-6 md:mt-8 font-terminal text-xs sm:text-sm md:text-base text-starlight/50 tracking-wider sm:tracking-widest uppercase max-w-xl mx-auto px-2"
                    >
                        Mobile Architecture & Software Engineering
                    </motion.p>
                </motion.div>
            </div>

            {/* Corner Details - Positioned to avoid nav overlap */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Top Left - EST (positioned below nav) */}
                <motion.div
                    className="absolute top-24 md:top-28 left-4 sm:left-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.8 }}
                >
                    <span className="font-terminal text-[10px] sm:text-xs tracking-widest text-starlight/40">
                        EST. 2025 // TORONTO
                    </span>
                </motion.div>

                {/* Top Right - Status (positioned below nav) */}
                <motion.div
                    className="absolute top-24 md:top-28 right-4 sm:right-8"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.8 }}
                >
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-reactor-green animate-pulse" />
                        <span className="font-terminal text-[10px] sm:text-xs tracking-widest text-starlight/40">
                            STATUS: OPERATIONAL
                        </span>
                    </div>
                </motion.div>

                {/* Bottom Left - Coordinates */}
                <motion.div
                    className="absolute bottom-6 sm:bottom-8 left-4 sm:left-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 2 }}
                >
                    <span className="font-terminal text-[10px] sm:text-xs tracking-widest text-starlight/30">
                        43.6532° N, 79.3832° W
                    </span>
                </motion.div>

                {/* Bottom Right - Version */}
                <motion.div
                    className="absolute bottom-6 sm:bottom-8 right-4 sm:right-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 2 }}
                >
                    <span className="font-terminal text-[10px] sm:text-xs tracking-widest text-starlight/30">
                        SYS_VER: 1.0.0
                    </span>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-20 sm:bottom-24 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.2 }}
            >
                <motion.div
                    className="flex flex-col items-center gap-2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <span className="font-terminal text-[10px] sm:text-xs tracking-widest text-starlight/40">
                        SCROLL
                    </span>
                    <div className="w-px h-6 sm:h-8 bg-gradient-to-b from-reactor-green/50 to-transparent" />
                </motion.div>
            </motion.div>

            {/* Edge frame */}
            <div className="absolute inset-2 sm:inset-4 border border-tungsten/30 pointer-events-none" />
        </section>
    );
}
