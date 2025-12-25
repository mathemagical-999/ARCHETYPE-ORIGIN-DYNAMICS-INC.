'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
    // Close on escape key
    const handleEscape = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, handleEscape]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-[9990] bg-void/90 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <motion.div
                        className="fixed inset-0 z-[9991] flex items-center justify-center p-4 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-tungsten border border-white/10 pointer-events-auto"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-starlight/50 hover:text-reactor-green transition-colors"
                                aria-label="Close modal"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Corner accents */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-reactor-green/50" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-reactor-green/50" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-reactor-green/50" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-reactor-green/50" />

                            {/* Header */}
                            {title && (
                                <div className="px-8 pt-8 pb-4 border-b border-white/10">
                                    <h2 className="text-2xl font-monolith font-bold tracking-tightest uppercase text-starlight">
                                        {title}
                                    </h2>
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-8">
                                {children}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
