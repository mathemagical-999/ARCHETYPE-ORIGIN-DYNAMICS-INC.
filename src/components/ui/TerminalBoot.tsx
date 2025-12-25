'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

const bootSequence = [
    { text: '> INITIALIZING ARCHETYPE_CORE...', delay: 0 },
    { text: '> LOADING NEURAL_MATRIX: ████████████ 100%', delay: 400 },
    { text: '> ESTABLISHING SECURE CONNECTION...', delay: 800 },
    { text: '> QUANTUM_ENCRYPTION: ENABLED', delay: 1200 },
    { text: '> ARCHETYPE_CORE: VERIFIED', delay: 1600 },
    { text: '> RENDER_ENGINE: ONLINE', delay: 2000 },
    { text: '', delay: 2400 },
];

export default function TerminalBoot() {
    const [lines, setLines] = useState<string[]>([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const { setBooted, isBooted } = useAppStore();

    // Check if we should skip the boot sequence
    useEffect(() => {
        const hasBooted = sessionStorage.getItem('archetype-booted');
        if (hasBooted) {
            setBooted(true);
        }
    }, [setBooted]);

    // Typewriter effect
    const typeText = useCallback((text: string, callback: () => void) => {
        let index = 0;
        const typingSpeed = 15;

        const typeChar = () => {
            if (index < text.length) {
                setCurrentText(text.substring(0, index + 1));
                index++;
                setTimeout(typeChar, typingSpeed);
            } else {
                callback();
            }
        };

        typeChar();
    }, []);

    useEffect(() => {
        if (isBooted) return;

        if (currentLineIndex < bootSequence.length) {
            const { text, delay } = bootSequence[currentLineIndex];

            const timer = setTimeout(() => {
                if (text === '') {
                    // Final line - trigger completion
                    setIsComplete(true);
                    setTimeout(() => {
                        sessionStorage.setItem('archetype-booted', 'true');
                        setBooted(true);
                    }, 800);
                } else {
                    typeText(text, () => {
                        setLines((prev) => [...prev, text]);
                        setCurrentText('');
                        setCurrentLineIndex((prev) => prev + 1);
                    });
                }
            }, currentLineIndex === 0 ? 300 : 200);

            return () => clearTimeout(timer);
        }
    }, [currentLineIndex, isBooted, setBooted, typeText]);

    if (isBooted) return null;

    return (
        <AnimatePresence>
            {!isBooted && (
                <motion.div
                    className="fixed inset-0 z-[9999] bg-void flex items-center justify-center overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{
                        scaleY: 0,
                        transition: {
                            duration: 0.8,
                            ease: [0.22, 1, 0.36, 1],
                        },
                    }}
                >
                    {/* CRT Screen Effect */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-reactor-green/5 to-transparent animate-scan" />
                    </div>

                    {/* Scan Lines */}
                    <div className="crt-overlay" />

                    {/* Terminal Container */}
                    <motion.div
                        className="relative w-full max-w-3xl mx-4 p-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Terminal Header */}
                        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-tungsten">
                            <div className="w-3 h-3 rounded-full bg-reactor-red" />
                            <div className="w-3 h-3 rounded-full bg-reactor-yellow" />
                            <div className="w-3 h-3 rounded-full bg-reactor-green" />
                            <span className="ml-4 font-terminal text-xs text-starlight/40 uppercase tracking-widest">
                                ARCHETYPE_TERMINAL v1.0.0
                            </span>
                        </div>

                        {/* Terminal Lines */}
                        <div className="font-terminal text-sm text-reactor-green space-y-2 min-h-[200px]">
                            {lines.map((line, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`${line.includes('VERIFIED') || line.includes('ONLINE')
                                            ? 'text-reactor-green'
                                            : line.includes('ENABLED')
                                                ? 'text-reactor-blue'
                                                : 'text-starlight/70'
                                        }`}
                                >
                                    {line}
                                </motion.div>
                            ))}

                            {/* Currently typing line */}
                            {currentText && (
                                <div className="text-reactor-green">
                                    {currentText}
                                    <span className="terminal-cursor" />
                                </div>
                            )}
                        </div>

                        {/* Status Bar */}
                        <motion.div
                            className="mt-8 pt-4 border-t border-tungsten flex justify-between items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isComplete ? 1 : 0.3 }}
                        >
                            <span className="font-terminal text-xs text-starlight/40 uppercase tracking-widest">
                                {isComplete ? 'SYSTEM READY' : 'INITIALIZING...'}
                            </span>
                            <div className="flex items-center gap-2">
                                <motion.div
                                    className={`w-2 h-2 rounded-full ${isComplete ? 'bg-reactor-green' : 'bg-reactor-yellow'
                                        }`}
                                    animate={{
                                        scale: isComplete ? 1 : [1, 1.2, 1],
                                        opacity: isComplete ? 1 : [1, 0.5, 1],
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: isComplete ? 0 : Infinity,
                                    }}
                                />
                                <span className="font-terminal text-xs text-starlight/40 uppercase">
                                    {isComplete ? 'ONLINE' : 'LOADING'}
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Corner decorations */}
                    <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-tungsten/30" />
                    <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-tungsten/30" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-tungsten/30" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-tungsten/30" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
