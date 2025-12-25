'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
    label: string;
    section: string;
}

const navItems: NavItem[] = [
    { label: 'Home', section: 'hero' },
    { label: 'Products', section: 'products' },
    { label: 'Research', section: 'research' },
    { label: 'About', section: 'about' },
    { label: 'Contact', section: 'contact' },
];

interface NavigationProps {
    onContactClick: () => void;
    onAboutClick: () => void;
}

export default function Navigation({ onContactClick, onAboutClick }: NavigationProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Direct scroll function that works without Lenis
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

    const handleNavClick = (item: NavItem) => {
        setIsMobileMenuOpen(false);

        if (item.section === 'contact') {
            onContactClick();
            return;
        }

        if (item.section === 'about') {
            onAboutClick();
            return;
        }

        // Map section names to actual IDs
        const sectionMap: Record<string, string> = {
            'hero': 'hero-section',
            'products': 'products-section',
            'research': 'research-section',
        };

        const targetId = sectionMap[item.section];
        if (targetId) {
            scrollToSection(targetId);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            {/* Main Navigation */}
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500 ${isScrolled ? 'bg-void/95 backdrop-blur-md border-b border-tungsten/30' : 'bg-transparent'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, delay: 2.5 }}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <button
                            onClick={scrollToTop}
                            className="flex items-center gap-3 group"
                        >
                            <div className="w-8 h-8 border border-reactor-green/50 flex items-center justify-center group-hover:border-reactor-green group-hover:bg-reactor-green/10 transition-all">
                                <div className="w-3 h-3 border border-reactor-green rotate-45" />
                            </div>
                            <span className="font-terminal text-xs tracking-widest text-starlight/70 group-hover:text-reactor-green transition-colors hidden sm:block">
                                ARCHETYPE
                            </span>
                        </button>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            {navItems.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => handleNavClick(item)}
                                    className="relative font-terminal text-xs tracking-widest text-starlight/60 hover:text-reactor-green transition-colors uppercase group"
                                >
                                    {item.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-reactor-green group-hover:w-full transition-all duration-300" />
                                </button>
                            ))}
                        </div>

                        {/* Status Indicator */}
                        <div className="hidden md:flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-reactor-green animate-pulse" />
                            <span className="font-terminal text-xs tracking-widest text-starlight/40">
                                ONLINE
                            </span>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
                            aria-label="Toggle menu"
                        >
                            <motion.span
                                className="w-6 h-0.5 bg-starlight/70"
                                animate={isMobileMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                            />
                            <motion.span
                                className="w-6 h-0.5 bg-starlight/70"
                                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                            />
                            <motion.span
                                className="w-6 h-0.5 bg-starlight/70"
                                animate={isMobileMenuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                            />
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 z-[998] bg-void/98 backdrop-blur-lg md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="flex flex-col items-center justify-center h-full gap-8">
                            {navItems.map((item, index) => (
                                <motion.button
                                    key={item.label}
                                    onClick={() => handleNavClick(item)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="font-monolith text-3xl tracking-tightest text-starlight hover:text-reactor-green transition-colors uppercase"
                                >
                                    {item.label}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
