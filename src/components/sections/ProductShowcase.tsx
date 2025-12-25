'use client';

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MagneticButton from '../ui/MagneticButton';
import RequestAccessModal from '../ui/RequestAccessModal';

export default function ProductShowcase() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    // Rotation value for the phone model
    const rotateY = useTransform(scrollYProgress, [0, 1], [0, 360]);
    const translateY = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <>
            <section ref={sectionRef} id="products-section" className="relative min-h-screen py-32 bg-void overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-void via-tungsten/10 to-void pointer-events-none" />

                {/* Decorative lines */}
                <div className="absolute top-0 left-1/2 w-px h-32 bg-gradient-to-b from-transparent via-reactor-green/30 to-transparent" />

                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
                        {/* Left: Device Showcase */}
                        <motion.div
                            className="relative order-2 lg:order-1 flex items-center justify-center"
                            style={{ opacity }}
                        >
                            <motion.div
                                className="relative w-72 md:w-80 lg:w-96"
                                style={{
                                    rotateY,
                                    translateY,
                                    transformStyle: 'preserve-3d',
                                    perspective: 1000,
                                }}
                            >
                                {/* Phone Frame - Stylized representation */}
                                <div className="relative aspect-[9/19] bg-gradient-to-br from-tungsten to-void rounded-[3rem] p-2 shadow-2xl shadow-reactor-green/10">
                                    {/* Phone bezel */}
                                    <div className="relative w-full h-full bg-void rounded-[2.5rem] overflow-hidden border border-tungsten">
                                        {/* Dynamic Island */}
                                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-void rounded-full border border-tungsten" />

                                        {/* Screen Content - App Preview */}
                                        <div className="absolute inset-0 pt-12 px-4">
                                            {/* App Header */}
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-reactor-green/20 flex items-center justify-center">
                                                        <div className="w-4 h-4 border-2 border-reactor-green rounded-sm rotate-45" />
                                                    </div>
                                                    <span className="font-terminal text-xs text-reactor-green tracking-widest">ALCHEMIST</span>
                                                </div>
                                                <div className="flex gap-1">
                                                    <div className="w-1 h-1 rounded-full bg-starlight/50" />
                                                    <div className="w-1 h-1 rounded-full bg-starlight/50" />
                                                    <div className="w-1 h-1 rounded-full bg-starlight/50" />
                                                </div>
                                            </div>

                                            {/* Content Cards */}
                                            <div className="space-y-3">
                                                <motion.div
                                                    className="p-4 bg-tungsten/30 rounded-lg border border-white/5"
                                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                                    transition={{ duration: 3, repeat: Infinity }}
                                                >
                                                    <div className="w-full h-2 bg-reactor-green/30 rounded mb-2" />
                                                    <div className="w-3/4 h-2 bg-starlight/10 rounded mb-2" />
                                                    <div className="w-1/2 h-2 bg-starlight/10 rounded" />
                                                </motion.div>

                                                <motion.div
                                                    className="p-4 bg-tungsten/30 rounded-lg border border-white/5"
                                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                                                >
                                                    <div className="w-full h-2 bg-reactor-blue/30 rounded mb-2" />
                                                    <div className="w-2/3 h-2 bg-starlight/10 rounded" />
                                                </motion.div>

                                                <motion.div
                                                    className="p-4 bg-tungsten/30 rounded-lg border border-white/5"
                                                    animate={{ opacity: [0.6, 1, 0.6] }}
                                                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                                >
                                                    <div className="w-3/4 h-2 bg-reactor-yellow/30 rounded mb-2" />
                                                    <div className="w-full h-2 bg-starlight/10 rounded mb-2" />
                                                    <div className="w-1/2 h-2 bg-starlight/10 rounded" />
                                                </motion.div>
                                            </div>

                                            {/* Bottom Nav */}
                                            <div className="absolute bottom-8 left-4 right-4 flex justify-around py-3 bg-tungsten/20 rounded-xl border border-white/5">
                                                {[1, 2, 3, 4].map((i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-5 h-5 rounded-md ${i === 1 ? 'bg-reactor-green' : 'bg-starlight/20'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Side buttons */}
                                    <div className="absolute -right-0.5 top-32 w-1 h-12 bg-tungsten rounded-l" />
                                    <div className="absolute -right-0.5 top-48 w-1 h-8 bg-tungsten rounded-l" />
                                    <div className="absolute -left-0.5 top-36 w-1 h-16 bg-tungsten rounded-r" />
                                </div>

                                {/* Glow effect */}
                                <div className="absolute -inset-4 bg-reactor-green/10 blur-3xl rounded-full pointer-events-none" />
                            </motion.div>
                        </motion.div>

                        {/* Right: Manifesto */}
                        <div className="order-1 lg:order-2 lg:sticky lg:top-32">
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                {/* Section Label */}
                                <span className="font-terminal text-xs tracking-widest text-reactor-green mb-4 block">
                  // FLAGSHIP
                                </span>

                                {/* Title */}
                                <h2 className="text-5xl md:text-6xl lg:text-7xl font-monolith font-bold tracking-tightest uppercase text-starlight mb-4">
                                    THE<br />ALCHEMIST
                                </h2>

                                {/* Subtitle */}
                                <p className="text-xl md:text-2xl font-monolith tracking-wide text-starlight/70 mb-8 uppercase">
                                    Intelligence. Distilled.
                                </p>

                                {/* Description */}
                                <div className="space-y-6 mb-12">
                                    <p className="font-terminal text-sm md:text-base leading-relaxed text-starlight/60">
                                        We engineered a second brain. The Alchemist uses proprietary algorithms to compress human wisdom into high-potency insights.
                                    </p>
                                    <p className="font-terminal text-sm md:text-base leading-relaxed text-starlight/60">
                                        Transform raw data into actionable intelligence. Distill centuries of knowledge into moments of clarity.
                                    </p>
                                </div>

                                {/* Features */}
                                <div className="grid grid-cols-2 gap-4 mb-12">
                                    {[
                                        { label: 'Neural Interface', value: 'ACTIVE' },
                                        { label: 'Response Time', value: '<100ms' },
                                        { label: 'Accuracy Rate', value: '99.7%' },
                                        { label: 'Data Points', value: '10M+' },
                                    ].map((stat) => (
                                        <div key={stat.label} className="p-4 bg-tungsten/20 border border-white/5">
                                            <span className="font-terminal text-xs text-starlight/40 tracking-widest block mb-1">
                                                {stat.label}
                                            </span>
                                            <span className="font-monolith text-lg text-reactor-green">
                                                {stat.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA */}
                                <MagneticButton onClick={() => setIsRequestModalOpen(true)}>
                                    Request Access
                                </MagneticButton>

                                {/* Disclaimer */}
                                <p className="mt-8 font-terminal text-xs text-starlight/30 tracking-wide">
                                    * Available on iOS. Clearance required.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Background decorations */}
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-reactor-green/5 blur-[150px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-reactor-blue/5 blur-[150px] pointer-events-none" />
            </section>

            {/* Request Access Modal */}
            <RequestAccessModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
            />
        </>
    );
}
