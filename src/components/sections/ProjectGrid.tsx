'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import StatusIndicator from '../ui/StatusIndicator';
import ProjectDetailModal from '../ui/ProjectDetailModal';

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

const projects: Project[] = [
    {
        codename: 'ALCHEMIST',
        name: 'The Alchemist',
        status: 'deployed',
        description: 'Neural interface for distilling human wisdom into high-potency insights. Proprietary AI architecture.',
        fullDescription: 'The Alchemist is our flagship neural interface designed to transform how humans interact with knowledge. By leveraging proprietary machine learning algorithms, it compresses centuries of human wisdom into instantly accessible insights. The system uses advanced natural language processing to understand context, intent, and nuance, delivering personalized intelligence that adapts to each user\'s unique cognitive patterns.',
        clearanceLevel: 1,
        features: [
            'Advanced Neural Language Processing',
            'Real-time Insight Generation',
            'Personalized Learning Algorithms',
            'Cross-platform Synchronization',
            'End-to-end Encryption',
            'Offline Intelligence Mode',
        ],
        techStack: ['Swift', 'Core ML', 'PostgreSQL', 'Redis', 'Kubernetes', 'TensorFlow'],
        timeline: 'Q4 2025',
        team: '12 Engineers',
    },
    {
        codename: 'CHIMERA',
        name: 'Project Chimera',
        status: 'development',
        description: 'Hybrid consciousness framework. Multi-modal perception layer for enhanced situational awareness.',
        fullDescription: 'Project Chimera represents the next evolution in human-machine consciousness integration. This hybrid framework combines multiple perception modalities—visual, auditory, and contextual—into a unified awareness layer. By fusing sensor data with AI interpretation, Chimera enables unprecedented situational awareness for decision-makers in high-stakes environments.',
        clearanceLevel: 2,
        features: [
            'Multi-modal Perception Fusion',
            'Real-time Environmental Analysis',
            'Predictive Threat Assessment',
            'Augmented Decision Support',
            'Adaptive Interface Layer',
            'Quantum-resistant Security',
        ],
        techStack: ['Rust', 'WebGL', 'CUDA', 'gRPC', 'Kafka', 'PyTorch'],
        timeline: 'Q2 2026',
        team: '8 Engineers',
    },
    {
        codename: 'OMEGA',
        name: 'Project Omega',
        status: 'classified',
        description: '██████████ ███████ ████████████ ██████ ████ ██████████████ ███████.',
        fullDescription: '██████████ ███████████ ████████ ██████ ███████████ ████████████ ████ ██████ ███████████ ███████████ █████ ██████████ █████ ██████████.',
        clearanceLevel: 5,
        features: [],
        techStack: [],
        timeline: '████████',
        team: '██',
    },
];

export default function ProjectGrid() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    return (
        <>
            <section id="research-section" className="relative py-32 px-6 bg-void">
                {/* Section Header */}
                <div className="max-w-7xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="font-terminal text-xs tracking-widest text-reactor-green mb-4 block">
              // PIPELINE
                        </span>
                        <h2 className="text-5xl md:text-6xl font-monolith font-bold tracking-tightest uppercase text-starlight mb-4">
                            Skunkworks
                        </h2>
                        <p className="font-terminal text-sm text-starlight/50 max-w-xl">
                            Active research and development projects. Clearance level required for full access. Click on a project to learn more.
                        </p>
                    </motion.div>
                </div>

                {/* Project Grid */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.codename}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            className="group relative cursor-pointer"
                            onClick={() => handleProjectClick(project)}
                        >
                            {/* Card */}
                            <div className="relative p-8 bg-tungsten/30 backdrop-blur-xl border border-white/10 hover:border-reactor-green/50 transition-all duration-500 overflow-hidden">
                                {/* Hover glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-reactor-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Corner accents */}
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-reactor-green/30 group-hover:border-reactor-green transition-colors duration-300" />
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-reactor-green/30 group-hover:border-reactor-green transition-colors duration-300" />

                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <span className="font-terminal text-xs text-starlight/40 tracking-widest">
                                                PROJECT
                                            </span>
                                            <h3 className="text-2xl font-monolith font-bold tracking-tightest text-starlight uppercase mt-1">
                                                {project.codename}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-void/50 border border-white/10">
                                            <span className="font-terminal text-[10px] text-starlight/50">LVL</span>
                                            <span className="font-terminal text-xs text-reactor-green">{project.clearanceLevel}</span>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="mb-6">
                                        <StatusIndicator status={project.status} />
                                    </div>

                                    {/* Description */}
                                    <p className={`font-terminal text-sm leading-relaxed ${project.status === 'classified'
                                            ? 'text-reactor-red/70 blur-[2px] select-none'
                                            : 'text-starlight/60'
                                        }`}>
                                        {project.description}
                                    </p>

                                    {/* Access Button */}
                                    <div className="mt-8 pt-6 border-t border-white/10">
                                        <span
                                            className={`font-terminal text-xs tracking-widest transition-colors ${project.status === 'classified'
                                                    ? 'text-reactor-red/50'
                                                    : 'text-reactor-green group-hover:text-starlight'
                                                }`}
                                        >
                                            {project.status === 'classified' ? '[ ACCESS DENIED ]' : '[ VIEW DETAILS ]'}
                                        </span>
                                    </div>
                                </div>

                                {/* Scan line effect on hover */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-b from-transparent via-reactor-green/5 to-transparent pointer-events-none"
                                    initial={{ y: '-100%' }}
                                    whileHover={{ y: '100%' }}
                                    transition={{ duration: 1.5, ease: 'linear' }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Background decoration */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-reactor-green/5 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-reactor-blue/5 blur-[120px] pointer-events-none" />
            </section>

            {/* Project Detail Modal */}
            <ProjectDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                project={selectedProject}
            />
        </>
    );
}
