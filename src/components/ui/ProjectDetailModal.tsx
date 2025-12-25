'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';
import StatusIndicator from './StatusIndicator';
import RequestAccessModal from './RequestAccessModal';

interface Project {
    codename: string;
    name: string;
    status: 'deployed' | 'development' | 'classified';
    description: string;
    fullDescription: string;
    clearanceLevel: number;
    features: string[];
    techStack: string[];
    timeline: string;
    team: string;
}

interface ProjectDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project | null;
}

export default function ProjectDetailModal({ isOpen, onClose, project }: ProjectDetailModalProps) {
    const [showRequestAccess, setShowRequestAccess] = useState(false);

    if (!project) return null;

    const isClassified = project.status === 'classified';

    const handleLearnMore = () => {
        // For deployed projects, scroll to products section and close modal
        onClose();
        setTimeout(() => {
            const element = document.getElementById('products-section');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 300);
    };

    const handleJoinBeta = () => {
        // Open request access modal
        setShowRequestAccess(true);
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <div className="space-y-8">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <span className="font-terminal text-xs text-starlight/40 tracking-widest block">
                                PROJECT
                            </span>
                            <h2 className="text-3xl md:text-4xl font-monolith font-bold tracking-tightest text-starlight uppercase mt-1 break-words">
                                {project.codename}
                            </h2>
                            <p className="font-terminal text-sm text-starlight/60 mt-2">
                                {project.name}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <div className="flex items-center gap-2 px-3 py-1 bg-void border border-white/10">
                                <span className="font-terminal text-[10px] text-starlight/50">CLEARANCE LVL</span>
                                <span className="font-terminal text-xs text-reactor-green">{project.clearanceLevel}</span>
                            </div>
                            <StatusIndicator status={project.status} />
                        </div>
                    </div>

                    {/* Classified Warning */}
                    {isClassified && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 bg-reactor-red/10 border border-reactor-red/30"
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-reactor-red flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                    <span className="font-terminal text-sm text-reactor-red font-bold">
                                        ACCESS DENIED
                                    </span>
                                    <p className="font-terminal text-xs text-reactor-red/70 mt-1">
                                        This project requires Level 5 clearance. Information is restricted.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Description */}
                    <div>
                        <h3 className="font-terminal text-xs tracking-widest text-reactor-green mb-3 uppercase">
                            {"// Overview"}
                        </h3>
                        <p className={`font-terminal text-sm leading-relaxed ${isClassified ? 'blur-sm select-none text-reactor-red/50' : 'text-starlight/70'}`}>
                            {isClassified ? '██████████ ███████████ ████████ ██████ ███████████ ████████████ ████ ██████ ███████████ ███████████ █████ ██████████ █████ ██████████.' : project.fullDescription}
                        </p>
                    </div>

                    {/* Features */}
                    {!isClassified && project.features.length > 0 && (
                        <div>
                            <h3 className="font-terminal text-xs tracking-widest text-reactor-green mb-3 uppercase">
                                {"// Core Features"}
                            </h3>
                            <ul className="space-y-2">
                                {project.features.map((feature, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-start gap-3 font-terminal text-sm text-starlight/70"
                                    >
                                        <span className="w-1.5 h-1.5 bg-reactor-green mt-1.5 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Tech Stack */}
                    {!isClassified && project.techStack.length > 0 && (
                        <div>
                            <h3 className="font-terminal text-xs tracking-widest text-reactor-green mb-3 uppercase">
                                {"// Technology Stack"}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {project.techStack.map((tech, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-void border border-white/10 font-terminal text-xs text-starlight/60"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-void border border-white/10">
                            <span className="font-terminal text-xs text-starlight/40 tracking-widest block mb-1">
                                TIMELINE
                            </span>
                            <span className={`font-monolith text-lg ${isClassified ? 'blur-sm text-reactor-red/50' : 'text-reactor-green'}`}>
                                {isClassified ? '████████' : project.timeline}
                            </span>
                        </div>
                        <div className="p-4 bg-void border border-white/10">
                            <span className="font-terminal text-xs text-starlight/40 tracking-widest block mb-1">
                                TEAM SIZE
                            </span>
                            <span className={`font-monolith text-lg ${isClassified ? 'blur-sm text-reactor-red/50' : 'text-reactor-blue'}`}>
                                {isClassified ? '██' : project.team}
                            </span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-white/10">
                        {isClassified ? (
                            <button
                                disabled
                                className="w-full py-4 border border-reactor-red/30 text-reactor-red/50 font-terminal text-sm tracking-widest uppercase cursor-not-allowed"
                            >
                                [ INSUFFICIENT CLEARANCE ]
                            </button>
                        ) : project.status === 'deployed' ? (
                            <button
                                onClick={handleLearnMore}
                                className="w-full py-4 border border-reactor-green/50 text-reactor-green font-terminal text-sm tracking-widest uppercase hover:bg-reactor-green/10 hover:border-reactor-green transition-all"
                            >
                                [ LEARN MORE ]
                            </button>
                        ) : (
                            <button
                                onClick={handleJoinBeta}
                                className="w-full py-4 border border-reactor-yellow/50 text-reactor-yellow font-terminal text-sm tracking-widest uppercase hover:bg-reactor-yellow/10 hover:border-reactor-yellow transition-all"
                            >
                                [ JOIN BETA ]
                            </button>
                        )}
                    </div>
                </div>
            </Modal>

            {/* Request Access Modal for Join Beta */}
            <RequestAccessModal
                isOpen={showRequestAccess}
                onClose={() => setShowRequestAccess(false)}
            />
        </>
    );
}
