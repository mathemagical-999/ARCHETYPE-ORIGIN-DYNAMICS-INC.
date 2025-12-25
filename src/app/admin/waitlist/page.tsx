'use client';

import { useState, useEffect, useTransition } from 'react';
import { getWaitlistStats, updateBelieverStatus } from '@/actions/waitlist';
import type { Believer } from '@/lib/db';

type BelieverSummary = Pick<Believer, 'id' | 'email' | 'waitlist_position' | 'status' | 'created_at'>;

export default function WaitlistPage() {
    const [believers, setBelievers] = useState<BelieverSummary[]>([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    // Fetch data
    useEffect(() => {
        async function fetchData() {
            const result = await getWaitlistStats();
            if (result.success && result.data) {
                setBelievers(result.data.recentSignups);
                setStats({
                    total: result.data.totalCount,
                    pending: result.data.pendingCount,
                    approved: result.data.approvedCount,
                });
            }
            setIsLoading(false);
        }
        fetchData();
    }, []);

    // Handle status update
    const handleStatusUpdate = (id: string, newStatus: 'pending' | 'approved' | 'rejected') => {
        startTransition(async () => {
            const result = await updateBelieverStatus(id, newStatus);
            if (result.success) {
                setBelievers((prev) =>
                    prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
                );
            }
        });
    };

    // Filter believers
    const filteredBelievers = believers.filter((b) => {
        if (filter === 'all') return true;
        return b.status === filter;
    });

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-8 bg-tungsten/30 rounded w-48" />
                <div className="h-12 bg-tungsten/30 rounded" />
                <div className="h-96 bg-tungsten/30 rounded-lg" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-monolith text-3xl font-bold text-starlight tracking-tighter">
                        WAITLIST
                    </h1>
                    <p className="font-mono text-sm text-starlight/40 mt-1">
                        Manage access requests for THE ALCHEMIST
                    </p>
                </div>
                <div className="font-mono text-sm text-reactor-green">
                    {stats.total} TOTAL • {stats.pending} PENDING
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg font-mono text-xs transition-all ${filter === f
                                ? 'bg-reactor-green text-void'
                                : 'bg-tungsten/30 text-starlight/60 hover:text-starlight'
                            }`}
                    >
                        {f.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-tungsten/30 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="px-6 py-4 text-left font-mono text-xs text-starlight/40 tracking-wider">
                                POSITION
                            </th>
                            <th className="px-6 py-4 text-left font-mono text-xs text-starlight/40 tracking-wider">
                                EMAIL
                            </th>
                            <th className="px-6 py-4 text-left font-mono text-xs text-starlight/40 tracking-wider">
                                JOINED
                            </th>
                            <th className="px-6 py-4 text-left font-mono text-xs text-starlight/40 tracking-wider">
                                STATUS
                            </th>
                            <th className="px-6 py-4 text-right font-mono text-xs text-starlight/40 tracking-wider">
                                ACTIONS
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredBelievers.length > 0 ? (
                            filteredBelievers.map((believer) => (
                                <tr key={believer.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 font-mono text-sm text-reactor-green">
                                        #{believer.waitlist_position}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm text-starlight">
                                        {believer.email}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-starlight/40">
                                        {new Date(believer.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-block font-mono text-[10px] px-2 py-1 rounded ${believer.status === 'approved'
                                                    ? 'bg-reactor-green/20 text-reactor-green'
                                                    : believer.status === 'rejected'
                                                        ? 'bg-red-500/20 text-red-400'
                                                        : 'bg-yellow-400/20 text-yellow-400'
                                                }`}
                                        >
                                            {believer.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {believer.status !== 'approved' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(believer.id, 'approved')}
                                                    disabled={isPending}
                                                    className="font-mono text-xs text-reactor-green hover:text-reactor-green/80 disabled:opacity-50"
                                                >
                                                    APPROVE
                                                </button>
                                            )}
                                            {believer.status !== 'rejected' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(believer.id, 'rejected')}
                                                    disabled={isPending}
                                                    className="font-mono text-xs text-red-400 hover:text-red-400/80 disabled:opacity-50"
                                                >
                                                    REJECT
                                                </button>
                                            )}
                                            {believer.status !== 'pending' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(believer.id, 'pending')}
                                                    disabled={isPending}
                                                    className="font-mono text-xs text-yellow-400 hover:text-yellow-400/80 disabled:opacity-50"
                                                >
                                                    RESET
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center">
                                    <div className="font-mono text-sm text-starlight/40">
                                        {filter === 'all'
                                            ? 'No signups yet. Share your site to start collecting believers.'
                                            : `No ${filter} requests found.`}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
