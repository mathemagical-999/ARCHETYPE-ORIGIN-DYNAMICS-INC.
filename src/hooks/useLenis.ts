'use client';

import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

export function useLenis() {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Create Lenis instance with proper configuration
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        lenisRef.current = lenis;

        // Animation frame loop
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Make lenis available globally for scroll-to functionality
        (window as unknown as { lenis: Lenis }).lenis = lenis;

        return () => {
            lenis.destroy();
            delete (window as unknown as { lenis?: Lenis }).lenis;
        };
    }, []);

    return lenisRef;
}

// Hook to scroll to a specific element
export function useScrollTo() {
    const scrollTo = (target: string | HTMLElement, options?: { offset?: number; duration?: number }) => {
        const lenis = (window as unknown as { lenis?: Lenis }).lenis;
        if (lenis) {
            lenis.scrollTo(target, {
                offset: options?.offset ?? 0,
                duration: options?.duration ?? 1.2,
            });
        } else {
            // Fallback to native scroll
            if (typeof target === 'string') {
                const element = document.querySelector(target);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return scrollTo;
}
