'use client';

import { motion } from 'framer-motion';
import Modal from './Modal';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
    const stats = [
        { label: 'Founded', value: '2025' },
        { label: 'Headquarters', value: 'Toronto' },
        { label: 'Focus', value: 'AI & Mobile' },
        { label: 'Status', value: 'Active' },
    ];

    const values = [
        {
            title: 'Precision Engineering',
            description: 'Every line of code is crafted with intention. We build systems that scale to billions while maintaining microsecond response times.',
        },
        {
            title: 'Intelligence Distilled',
            description: 'We compress centuries of human wisdom into algorithms that deliver insights in moments, not months.',
        },
        {
            title: 'Sovereign Architecture',
            description: 'Our infrastructure is designed for independence. No single point of failure. No compromises on security.',
        },
        {
            title: 'Relentless Innovation',
            description: 'We operate at the edge of what\'s possible. Today\'s science fiction is tomorrow\'s deployment.',
        },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="About">
            <div className="space-y-8">
                {/* Hero Statement */}
                <div className="pb-8 border-b border-white/10">
                    <p className="text-lg font-monolith text-starlight/90 leading-relaxed">
                        ARCHETYPE ORIGIN DYNAMICS is a mobile architecture and software engineering company building the infrastructure for tomorrow's intelligence.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-void border border-white/10 text-center"
                        >
                            <span className="font-terminal text-xs text-starlight/40 tracking-widest block mb-1">
                                {stat.label}
                            </span>
                            <span className="font-monolith text-xl text-reactor-green">
                                {stat.value}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Mission */}
                <div>
                    <h3 className="font-terminal text-xs tracking-widest text-reactor-green mb-4 uppercase">
            // Mission
                    </h3>
                    <p className="font-terminal text-sm text-starlight/70 leading-relaxed">
                        To architect systems that amplify human potential. We believe intelligence should be accessible, instantaneous, and infinitely scalable. Our mission is to bridge the gap between human insight and machine precision.
                    </p>
                </div>

                {/* Core Values */}
                <div>
                    <h3 className="font-terminal text-xs tracking-widest text-reactor-green mb-4 uppercase">
            // Core Principles
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="p-4 bg-tungsten/20 border border-white/5"
                            >
                                <h4 className="font-monolith text-sm text-starlight font-bold mb-2">
                                    {value.title}
                                </h4>
                                <p className="font-terminal text-xs text-starlight/60 leading-relaxed">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Leadership */}
                <div>
                    <h3 className="font-terminal text-xs tracking-widest text-reactor-green mb-4 uppercase">
            // Leadership
                    </h3>
                    <p className="font-terminal text-sm text-starlight/70 leading-relaxed mb-4">
                        Founded by engineers and visionaries who have built systems serving billions of users. Our team combines deep technical expertise with a relentless focus on user experience.
                    </p>
                    <div className="flex items-center gap-4 p-4 bg-void border border-white/10">
                        <div className="w-12 h-12 bg-reactor-green/20 border border-reactor-green/30 flex items-center justify-center">
                            <span className="font-monolith text-xl text-reactor-green">A</span>
                        </div>
                        <div>
                            <span className="font-terminal text-sm text-starlight block">
                                Founding Team
                            </span>
                            <span className="font-terminal text-xs text-starlight/50">
                                Toronto, Canada
                            </span>
                        </div>
                    </div>
                </div>

                {/* Legal */}
                <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-reactor-green" />
                        <span className="font-terminal text-xs text-starlight/50 tracking-widest">
                            D-U-N-S® REGISTERED • INCORPORATED IN CANADA
                        </span>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
