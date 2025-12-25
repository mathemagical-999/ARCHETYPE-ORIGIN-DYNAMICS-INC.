'use client';

import { motion } from 'framer-motion';

interface StatusIndicatorProps {
    status: 'deployed' | 'development' | 'classified';
}

export default function StatusIndicator({ status }: StatusIndicatorProps) {
    const statusConfig = {
        deployed: {
            color: 'bg-reactor-green',
            text: 'DEPLOYED',
            textColor: 'text-reactor-green',
            glow: 'shadow-[0_0_10px_rgba(0,255,65,0.5)]',
        },
        development: {
            color: 'bg-reactor-yellow',
            text: 'IN DEVELOPMENT',
            textColor: 'text-reactor-yellow',
            glow: 'shadow-[0_0_10px_rgba(250,204,21,0.5)]',
        },
        classified: {
            color: 'bg-reactor-red',
            text: 'CLASSIFIED',
            textColor: 'text-reactor-red',
            glow: 'shadow-[0_0_10px_rgba(239,68,68,0.5)]',
        },
    };

    const config = statusConfig[status];

    return (
        <div className="flex items-center gap-2">
            <motion.div
                className={`w-2 h-2 rounded-full ${config.color} ${config.glow}`}
                animate={status === 'development' ? {
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.6, 1],
                } : status === 'classified' ? {
                    opacity: [1, 0.3, 1],
                } : {}}
                transition={{
                    duration: status === 'development' ? 1.5 : 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <span className={`font-terminal text-xs tracking-widest ${config.textColor}`}>
                {config.text}
            </span>
        </div>
    );
}
