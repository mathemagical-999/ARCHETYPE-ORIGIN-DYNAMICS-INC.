'use client';

import { useEffect, useState, useRef } from 'react';

export function useMousePosition() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [normalizedPosition, setNormalizedPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            setNormalizedPosition({
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -(e.clientY / window.innerHeight) * 2 + 1,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return { position, normalizedPosition };
}

export function useMagneticEffect(strength: number = 0.3) {
    const ref = useRef<HTMLElement>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distX = e.clientX - centerX;
            const distY = e.clientY - centerY;

            const distance = Math.sqrt(distX * distX + distY * distY);
            const maxDistance = 150;

            if (distance < maxDistance) {
                setOffset({
                    x: distX * strength,
                    y: distY * strength,
                });
            } else {
                setOffset({ x: 0, y: 0 });
            }
        };

        const handleMouseLeave = () => {
            setOffset({ x: 0, y: 0 });
        };

        window.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [strength]);

    return { ref, offset };
}
