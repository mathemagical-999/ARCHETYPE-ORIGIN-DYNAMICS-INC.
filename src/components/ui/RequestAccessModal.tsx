'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';

interface RequestAccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RequestAccessModal({ isOpen, onClose }: RequestAccessModalProps) {
    const [formState, setFormState] = useState({
        email: '',
        name: '',
        company: '',
        role: '',
        interest: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [queuePosition, setQueuePosition] = useState<number | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormState((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        setError('');
    };

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formState.email || !formState.name) {
            setError('Name and email are required.');
            return;
        }

        if (!validateEmail(formState.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Call the actual waitlist API
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formState.email,
                    referralSource: formState.role || 'website',
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to join waitlist');
            }

            setQueuePosition(data.position || null);
            setIsSubmitted(true);

            // Reset after showing success
            setTimeout(() => {
                setIsSubmitted(false);
                setQueuePosition(null);
                setFormState({ email: '', name: '', company: '', role: '', interest: '' });
                onClose();
            }, 4000);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred. Please try again.';
            // Show user-friendly message for common errors
            if (errorMessage.includes('Failed to join waitlist') || errorMessage.includes('unexpected')) {
                setError('Unable to process request. The system is temporarily unavailable. Please try again later.');
            } else {
                setError(errorMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Request Access">
            {isSubmitted ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 15, delay: 0.2 }}
                        className="w-20 h-20 mx-auto mb-6 rounded-full bg-reactor-green/20 flex items-center justify-center"
                    >
                        <svg className="w-10 h-10 text-reactor-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </motion.div>
                    <h3 className="text-2xl font-monolith font-bold text-starlight mb-3">
                        PROTOCOL INITIATED
                    </h3>
                    <p className="font-terminal text-sm text-starlight/60">
                        You have been added to the queue. Stand by for further instructions.
                    </p>
                    {queuePosition && (
                        <div className="mt-6 p-4 bg-reactor-green/10 border border-reactor-green/30 rounded-lg">
                            <span className="font-terminal text-xs text-starlight/60 block mb-1">
                                YOUR QUEUE POSITION
                            </span>
                            <span className="font-monolith text-3xl text-reactor-green font-bold">
                                #{queuePosition}
                            </span>
                        </div>
                    )}
                    <div className="mt-6 flex items-center justify-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-reactor-green animate-pulse" />
                        <span className="font-terminal text-xs text-reactor-green tracking-widest">
                            {queuePosition ? `POSITION #${queuePosition} CONFIRMED` : 'POSITION CONFIRMED'}
                        </span>
                    </div>
                </motion.div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="mb-8">
                        <p className="font-terminal text-sm text-starlight/60 leading-relaxed">
                            Access to The Alchemist is currently by invitation only. Submit your credentials for review.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-reactor-red/10 border border-reactor-red/30 text-reactor-red font-terminal text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Name Field */}
                    <div>
                        <label className="block font-terminal text-xs tracking-widest text-starlight/50 mb-2 uppercase">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formState.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-void border border-white/10 text-starlight font-terminal text-sm focus:border-reactor-green focus:outline-none transition-colors"
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block font-terminal text-xs tracking-widest text-starlight/50 mb-2 uppercase">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formState.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-void border border-white/10 text-starlight font-terminal text-sm focus:border-reactor-green focus:outline-none transition-colors"
                            placeholder="your@email.com"
                        />
                    </div>

                    {/* Company Field */}
                    <div>
                        <label className="block font-terminal text-xs tracking-widest text-starlight/50 mb-2 uppercase">
                            Company / Organization
                        </label>
                        <input
                            type="text"
                            name="company"
                            value={formState.company}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-void border border-white/10 text-starlight font-terminal text-sm focus:border-reactor-green focus:outline-none transition-colors"
                            placeholder="Optional"
                        />
                    </div>

                    {/* Role Field */}
                    <div>
                        <label className="block font-terminal text-xs tracking-widest text-starlight/50 mb-2 uppercase">
                            Your Role
                        </label>
                        <select
                            name="role"
                            value={formState.role}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-void border border-white/10 text-starlight font-terminal text-sm focus:border-reactor-green focus:outline-none transition-colors appearance-none cursor-pointer"
                        >
                            <option value="">Select your role...</option>
                            <option value="founder">Founder / CEO</option>
                            <option value="investor">Investor / VC</option>
                            <option value="developer">Developer / Engineer</option>
                            <option value="researcher">Researcher / Academic</option>
                            <option value="executive">Executive / Director</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Interest Field */}
                    <div>
                        <label className="block font-terminal text-xs tracking-widest text-starlight/50 mb-2 uppercase">
                            Why are you interested?
                        </label>
                        <textarea
                            name="interest"
                            value={formState.interest}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 bg-void border border-white/10 text-starlight font-terminal text-sm focus:border-reactor-green focus:outline-none transition-colors resize-none"
                            placeholder="Tell us about your interest in The Alchemist..."
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full relative py-4 border border-reactor-green/50 text-reactor-green font-terminal text-sm tracking-widest uppercase hover:bg-reactor-green/10 hover:border-reactor-green transition-all disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
                    >
                        <span className="relative z-10">
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-3">
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        className="inline-block w-4 h-4 border-2 border-reactor-green border-t-transparent rounded-full"
                                    />
                                    PROCESSING...
                                </span>
                            ) : (
                                '[ SUBMIT REQUEST ]'
                            )}
                        </span>

                        {/* Hover shine effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-reactor-green/10 to-transparent"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 0.6 }}
                        />
                    </button>

                    <p className="font-terminal text-xs text-starlight/30 text-center">
                        By submitting, you agree to our terms and privacy policy.
                    </p>
                </form>
            )}
        </Modal>
    );
}
