'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';

interface FooterProps {
    onContactClick: () => void;
    onAboutClick: () => void;
}

export default function Footer({ onContactClick, onAboutClick }: FooterProps) {
    const currentYear = new Date().getFullYear();

    const scrollToSection = useCallback((sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }, []);

    const scrollToTop = useCallback(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    const handleNavClick = (section: string) => {
        if (section === 'about') {
            onAboutClick();
            return;
        }
        if (section === 'contact') {
            onContactClick();
            return;
        }

        const sectionMap: Record<string, string> = {
            'home': 'hero-section',
            'products': 'products-section',
            'research': 'research-section',
        };

        const targetId = sectionMap[section];
        if (targetId) {
            scrollToSection(targetId);
        }
    };

    return (
        <footer id="contact-section" className="relative py-16 md:py-24 bg-void border-t border-tungsten/30">
            {/* Background texture */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-t from-tungsten/10 to-transparent" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12 md:mb-16">
                    {/* Logo & Tagline */}
                    <div className="md:col-span-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-monolith font-bold tracking-tightest uppercase text-starlight mb-4 leading-tight">
                                ARCHETYPE<br />ORIGIN DYNAMICS
                            </h3>
                            <p className="font-terminal text-xs sm:text-sm text-starlight/50 tracking-wide max-w-md mb-6 md:mb-8">
                                Mobile Architecture & Software Engineering. Building the infrastructure for tomorrow&apos;s intelligence.
                            </p>

                            {/* Status */}
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-reactor-green animate-pulse" />
                                <span className="font-terminal text-[10px] sm:text-xs tracking-widest text-starlight/40">
                                    ALL SYSTEMS OPERATIONAL
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <h4 className="font-terminal text-[10px] sm:text-xs tracking-widest text-reactor-green mb-4 md:mb-6 uppercase">
                                {"// Navigation"}
                            </h4>
                            <ul className="space-y-2 sm:space-y-3">
                                {[
                                    { label: 'Home', section: 'home' },
                                    { label: 'Products', section: 'products' },
                                    { label: 'Research', section: 'research' },
                                    { label: 'About', section: 'about' },
                                    { label: 'Contact', section: 'contact' },
                                ].map((link) => (
                                    <li key={link.label}>
                                        <button
                                            onClick={() => handleNavClick(link.section)}
                                            className="font-terminal text-xs sm:text-sm text-starlight/60 hover:text-reactor-green transition-colors tracking-wide"
                                        >
                                            {link.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Contact */}
                    <div className="md:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h4 className="font-terminal text-[10px] sm:text-xs tracking-widest text-reactor-green mb-4 md:mb-6 uppercase">
                                {"// Headquarters"}
                            </h4>
                            <address className="not-italic font-terminal text-xs sm:text-sm text-starlight/60 leading-relaxed space-y-1 sm:space-y-2">
                                <p>236 Albion Road</p>
                                <p>Etobicoke, ON M9W 6A6</p>
                                <p>Canada</p>
                            </address>

                            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-tungsten/30">
                                <span className="font-terminal text-[10px] sm:text-xs tracking-widest text-starlight/30">
                                    43.6532° N, 79.3832° W
                                </span>
                            </div>

                            {/* Contact Button */}
                            <button
                                onClick={onContactClick}
                                className="mt-4 md:mt-6 px-4 sm:px-6 py-2 sm:py-3 border border-reactor-green/50 text-reactor-green font-terminal text-[10px] sm:text-xs tracking-widest uppercase hover:bg-reactor-green/10 hover:border-reactor-green transition-all"
                            >
                                Get in Touch
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="pt-6 md:pt-8 border-t border-tungsten/30"
                >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
                        {/* Copyright */}
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
                            <span className="font-terminal text-[10px] sm:text-xs text-starlight/40 tracking-wide">
                                © {currentYear} ARCHETYPE ORIGIN DYNAMICS INC.
                            </span>
                            <span className="hidden sm:inline text-starlight/20">|</span>
                            <span className="font-terminal text-[10px] sm:text-xs text-starlight/30 tracking-wide">
                                All rights reserved.
                            </span>
                        </div>

                        {/* Legal Links */}
                        <div className="flex items-center gap-4 sm:gap-6">
                            <button className="font-terminal text-[10px] sm:text-xs text-starlight/40 hover:text-reactor-green transition-colors tracking-wide">
                                Privacy
                            </button>
                            <button className="font-terminal text-[10px] sm:text-xs text-starlight/40 hover:text-reactor-green transition-colors tracking-wide">
                                Terms
                            </button>
                        </div>
                    </div>

                    {/* D-U-N-S Badge */}
                    <div className="mt-6 md:mt-8 flex justify-center">
                        <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-tungsten/20 border border-tungsten/30 rounded">
                            <span className="font-terminal text-[9px] sm:text-[10px] text-starlight/30 tracking-widest">
                                D-U-N-S® REGISTERED
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Back to Top Button */}
                <motion.button
                    onClick={scrollToTop}
                    className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 border border-tungsten/50 flex items-center justify-center hover:border-reactor-green hover:bg-reactor-green/10 transition-all group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-starlight/50 group-hover:text-reactor-green transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                </motion.button>
            </div>

            {/* Decorative Corner Elements */}
            <div className="absolute bottom-0 left-0 w-16 sm:w-32 h-16 sm:h-32 border-l-2 border-b-2 border-tungsten/20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-16 sm:w-32 h-16 sm:h-32 border-r-2 border-b-2 border-tungsten/20 pointer-events-none" />
        </footer>
    );
}
