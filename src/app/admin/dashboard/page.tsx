import { getWaitlistStats } from '@/actions/waitlist';
import { Suspense } from 'react';

// Force dynamic rendering - this page uses headers/session
export const dynamic = 'force-dynamic';

// Stats Card Component
function StatsCard({
    label,
    value,
    change,
    color = 'green',
}: {
    label: string;
    value: number | string;
    change?: string;
    color?: 'green' | 'yellow' | 'red' | 'blue';
}) {
    const colorClasses = {
        green: 'text-reactor-green border-reactor-green/20 bg-reactor-green/5',
        yellow: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5',
        red: 'text-red-400 border-red-400/20 bg-red-400/5',
        blue: 'text-reactor-blue border-reactor-blue/20 bg-reactor-blue/5',
    };

    return (
        <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
            <div className="font-mono text-xs tracking-wider opacity-60 mb-2">
                {label}
            </div>
            <div className="text-4xl font-bold font-monolith tracking-tight">
                {value}
            </div>
            {change && (
                <div className="font-mono text-xs mt-2 opacity-60">
                    {change}
                </div>
            )}
        </div>
    );
}

// Loading skeleton
function DashboardSkeleton() {
    return (
        <div className="animate-pulse space-y-8">
            <div className="h-8 bg-tungsten/30 rounded w-48" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-tungsten/30 rounded-lg" />
                ))}
            </div>
            <div className="h-96 bg-tungsten/30 rounded-lg" />
        </div>
    );
}

// Dashboard Content
async function DashboardContent() {
    const stats = await getWaitlistStats();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="font-monolith text-3xl font-bold text-starlight tracking-tighter">
                    MISSION CONTROL
                </h1>
                <p className="font-mono text-sm text-starlight/40 mt-1">
                    Real-time overview of ARCHETYPE ORIGIN DYNAMICS operations
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    label="TOTAL BELIEVERS"
                    value={stats.data?.totalCount || 0}
                    change="All time signups"
                    color="green"
                />
                <StatsCard
                    label="PENDING ACCESS"
                    value={stats.data?.pendingCount || 0}
                    change="Awaiting approval"
                    color="yellow"
                />
                <StatsCard
                    label="GRANTED ACCESS"
                    value={stats.data?.approvedCount || 0}
                    change="Full access members"
                    color="blue"
                />
                <StatsCard
                    label="SYSTEM STATUS"
                    value="ONLINE"
                    change="All systems nominal"
                    color="green"
                />
            </div>

            {/* Recent Signups */}
            <div className="bg-tungsten/30 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5">
                    <h2 className="font-mono text-sm text-starlight tracking-wider">
                        RECENT SIGNUPS
                    </h2>
                </div>
                <div className="divide-y divide-white/5">
                    {stats.data?.recentSignups && stats.data.recentSignups.length > 0 ? (
                        stats.data.recentSignups.map((believer) => (
                            <div key={believer.id} className="px-6 py-4 flex items-center justify-between">
                                <div>
                                    <div className="font-mono text-sm text-starlight">
                                        {believer.email}
                                    </div>
                                    <div className="font-mono text-xs text-starlight/40 mt-1">
                                        Position #{believer.waitlist_position} • {new Date(believer.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`font-mono text-[10px] px-2 py-1 rounded ${believer.status === 'approved'
                                            ? 'bg-reactor-green/20 text-reactor-green'
                                            : believer.status === 'rejected'
                                                ? 'bg-red-500/20 text-red-400'
                                                : 'bg-yellow-400/20 text-yellow-400'
                                            }`}
                                    >
                                        {believer.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-6 py-12 text-center">
                            <div className="font-mono text-sm text-starlight/40">
                                No signups yet. Share your site to start collecting believers.
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <a
                    href="/admin/waitlist"
                    className="bg-tungsten/30 backdrop-blur-xl border border-white/10 hover:border-reactor-green/50 rounded-lg p-6 transition-all group"
                >
                    <div className="font-mono text-xs text-reactor-green tracking-wider mb-2">
                        ACTION
                    </div>
                    <div className="font-monolith text-lg text-starlight group-hover:text-reactor-green transition-colors">
                        Manage Waitlist →
                    </div>
                </a>
                <a
                    href="/"
                    target="_blank"
                    className="bg-tungsten/30 backdrop-blur-xl border border-white/10 hover:border-reactor-green/50 rounded-lg p-6 transition-all group"
                >
                    <div className="font-mono text-xs text-reactor-green tracking-wider mb-2">
                        VIEW
                    </div>
                    <div className="font-monolith text-lg text-starlight group-hover:text-reactor-green transition-colors">
                        View Public Site →
                    </div>
                </a>
                <div className="bg-tungsten/30 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                    <div className="font-mono text-xs text-starlight/40 tracking-wider mb-2">
                        UPTIME
                    </div>
                    <div className="font-monolith text-lg text-reactor-green">
                        99.99%
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <DashboardContent />
        </Suspense>
    );
}
