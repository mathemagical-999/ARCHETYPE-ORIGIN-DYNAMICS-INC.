'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

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

        if (!formState.email || !formState.name || !formState.message) {
            setError('Name, email, and message are required.');
            return;
        }

        if (!validateEmail(formState.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setIsSubmitting(false);
        setIsSubmitted(true);

        setTimeout(() => {
            setIsSubmitted(false);
            setFormState({ name: '', email: '', subject: '', message: '' });
            onClose();
        }, 3000);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Contact">
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
                        MESSAGE TRANSMITTED
                    </h3>
                    <p className="font-terminal text-sm text-starlight/60">
                        Your message has been received. We will respond shortly.
                    </p>
                </motion.div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h3 className="font-terminal text-xs tracking-widest text-reactor-green uppercase">
                // Direct Line
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <svg className="w-4 h-4 text-reactor-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="font-terminal text-sm text-starlight/60">
                                        236 Albion Road, Toronto
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <svg className="w-4 h-4 text-reactor-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-terminal text-sm text-starlight/60">
                                        contact@archetype.io
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Hours */}
                        <div className="space-y-4">
                            <h3 className="font-terminal text-xs tracking-widest text-reactor-green uppercase">
                // Response Time
                            </h3>
                            <p className="font-terminal text-sm text-starlight/60">
                                24-48 hours for general inquiries<br />
                                Priority support for partners
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                        <h3 className="font-terminal text-xs tracking-widest text-reactor-green mb-4 uppercase">
              // Send Message
                        </h3>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 mb-4 bg-reactor-red/10 border border-reactor-red/30 text-reactor-red font-terminal text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block font-terminal text-xs tracking-widest text-starlight/50 mb-2 uppercase">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formState.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-void border border-white/10 text-starlight font-terminal text-sm focus:border-reactor-green focus:outline-none transition-colors"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label className="block font-terminal text-xs tracking-widest text-starlight/50 mb-2 uppercase">
                                    Email *
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
                        </div>

                        <div className="mb-4">
                            <label className="block font-terminal text-xs tracking-widest text-starlight/50 mb-2 uppercase">
                                Subject
                            </label>
                            <select
                                name="subject"
                                value={formState.subject}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-void border border-white/10 text-starlight font-terminal text-sm focus:border-reactor-green focus:outline-none transition-colors appearance-none cursor-pointer"
                            >
                                <option value="">Select subject...</option>
                                <option value="general">General Inquiry</option>
                                <option value="partnership">Partnership Opportunity</option>
                                <option value="investment">Investment Relations</option>
                                <option value="press">Press & Media</option>
                                <option value="support">Technical Support</option>
                                <option value="careers">Careers</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block font-terminal text-xs tracking-widest text-starlight/50 mb-2 uppercase">
                                Message *
                            </label>
                            <textarea
                                name="message"
                                value={formState.message}
                                onChange={handleChange}
                                rows={5}
                                className="w-full px-4 py-3 bg-void border border-white/10 text-starlight font-terminal text-sm focus:border-reactor-green focus:outline-none transition-colors resize-none"
                                placeholder="Your message..."
                            />
                        </div>

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
                                        TRANSMITTING...
                                    </span>
                                ) : (
                                    '[ SEND MESSAGE ]'
                                )}
                            </span>
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
}
