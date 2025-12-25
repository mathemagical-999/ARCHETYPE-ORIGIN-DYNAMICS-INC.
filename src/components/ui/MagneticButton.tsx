'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export default function MagneticButton({ children, onClick, className = '' }: MagneticButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const button = buttonRef.current;
        if (!button) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = button.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distX = e.clientX - centerX;
            const distY = e.clientY - centerY;

            const distance = Math.sqrt(distX * distX + distY * distY);
            const maxDistance = 120;

            if (distance < maxDistance) {
                setPosition({
                    x: distX * 0.4,
                    y: distY * 0.4,
                });
                setIsHovered(true);
            } else {
                setPosition({ x: 0, y: 0 });
                setIsHovered(false);
            }
        };

        const handleMouseLeave = () => {
            setPosition({ x: 0, y: 0 });
            setIsHovered(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        button.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            button.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <motion.button
            ref={buttonRef}
            onClick={onClick}
            className={`relative group ${className}`}
            animate={{
                x: position.x,
                y: position.y,
            }}
            transition={{
                type: 'spring',
                stiffness: 150,
                damping: 15,
                mass: 0.1,
            }}
        >
            {/* Glow effect */}
            <motion.div
                className="absolute inset-0 rounded-sm bg-reactor-green/20 blur-xl"
                animate={{
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 1.2 : 1,
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Button border */}
            <div className="relative px-8 py-4 border border-reactor-green/50 bg-void/80 backdrop-blur-sm overflow-hidden group-hover:border-reactor-green transition-colors duration-300">
                {/* Shine effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-reactor-green/20 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: isHovered ? '100%' : '-100%' }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                />

                {/* Text */}
                <span className="relative font-terminal text-xs tracking-widest text-reactor-green uppercase">
                    {children}
                </span>

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-reactor-green" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-reactor-green" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-reactor-green" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-reactor-green" />
            </div>
        </motion.button>
    );
}
