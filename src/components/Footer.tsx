import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Github, Globe, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-zinc-200 bg-white pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative h-8 w-8 transition-transform group-hover:scale-110">
                                <Image
                                    src="/de.png"
                                    alt="GivePump Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-zinc-900">
                                <span className="text-mint-600">Give</span>Pump
                            </span>
                        </Link>
                        <p className="max-w-xs text-sm text-zinc-500 leading-relaxed">
                            The community-driven token where memes meet impact. Driven by pump.fun's Creator Fee Sharing, $GIVE auto-funds charities chosen by you.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="rounded-full bg-zinc-100 p-2 text-zinc-500 hover:bg-mint-100 hover:text-mint-600 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="rounded-full bg-zinc-100 p-2 text-zinc-500 hover:bg-mint-100 hover:text-mint-600 transition-colors">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="#" className="rounded-full bg-zinc-100 p-2 text-zinc-500 hover:bg-mint-100 hover:text-mint-600 transition-colors">
                                <Globe className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-zinc-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-zinc-400">
                        &copy; 2026 GivePump Protocol. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-xs text-zinc-400">
                        <span>Built with</span>
                        <Heart className="h-3 w-3 text-red-500 fill-current" />
                        <span>on Solana</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
