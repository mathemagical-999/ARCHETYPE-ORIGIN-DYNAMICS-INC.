import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Redirect if not authenticated
    if (!session?.user) {
        redirect('/auth/signin');
    }

    // Redirect if not admin
    if (!session.user.isAdmin) {
        redirect('/unauthorized');
    }

    return (
        <div className="min-h-screen bg-void">
            {/* Noise overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50"
                style={{ backgroundImage: 'url(/noise.png)', backgroundRepeat: 'repeat' }}
            />

            {/* Admin Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-void/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <a href="/" className="font-monolith text-lg font-bold text-starlight tracking-tighter">
                            ARCHETYPE
                        </a>
                        <span className="text-starlight/20">|</span>
                        <span className="font-mono text-xs text-reactor-green tracking-wider">
                            COMMAND CENTER
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Nav Links */}
                        <nav className="flex items-center gap-6">
                            <a
                                href="/admin/dashboard"
                                className="font-mono text-xs text-starlight/60 hover:text-reactor-green transition-colors tracking-wider"
                            >
                                DASHBOARD
                            </a>
                            <a
                                href="/admin/waitlist"
                                className="font-mono text-xs text-starlight/60 hover:text-reactor-green transition-colors tracking-wider"
                            >
                                WAITLIST
                            </a>
                        </nav>

                        {/* User Info */}
                        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                            {session.user.image ? (
                                <img
                                    src={session.user.image}
                                    alt=""
                                    className="w-8 h-8 rounded-full border border-white/10"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-reactor-green/20 flex items-center justify-center">
                                    <span className="text-reactor-green text-sm font-bold">
                                        {session.user.name?.[0] || session.user.email?.[0] || 'A'}
                                    </span>
                                </div>
                            )}
                            <div className="hidden sm:block">
                                <div className="font-mono text-xs text-starlight">
                                    {session.user.name || session.user.email}
                                </div>
                                <div className="font-mono text-[10px] text-reactor-green">
                                    CLEARANCE: {session.user.clearanceLevel || 0}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-20 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
