import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Github, Globe, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-zinc-200 bg-white pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
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
                            The first decentralized charity exchange. Trade memecoins, earn yield, and auto-donate transaction fees to verified causes.
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

                    {/* Links Columns */}
                    <div>
                        <h3 className="font-semibold text-zinc-900 mb-6">Platform</h3>
                        <ul className="space-y-3 text-sm text-zinc-500">
                            <li><Link href="/dashboard" className="hover:text-mint-600 transition-colors">Dashboard</Link></li>
                            <li><Link href="#" className="hover:text-mint-600 transition-colors">Governance</Link></li>
                            <li><Link href="#" className="hover:text-mint-600 transition-colors">Staking</Link></li>
                            <li><Link href="#" className="hover:text-mint-600 transition-colors">Charity Verification</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-zinc-900 mb-6">Resources</h3>
                        <ul className="space-y-3 text-sm text-zinc-500">
                            <li><Link href="#" className="hover:text-mint-600 transition-colors">Documentation</Link></li>
                            <li><Link href="#" className="hover:text-mint-600 transition-colors">Smart Contracts</Link></li>
                            <li><Link href="#" className="hover:text-mint-600 transition-colors">Brand Assets</Link></li>
                            <li><Link href="#" className="hover:text-mint-600 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter / CTA */}
                    <div>
                        <h3 className="font-semibold text-zinc-900 mb-6">Stay Updated</h3>
                        <p className="text-sm text-zinc-500 mb-4">
                            Subscribe to get the latest charity reports and governance updates.
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-mint-500 focus:ring-1 focus:ring-mint-500"
                            />
                            <button className="rounded-lg bg-mint-500 px-4 py-2 text-sm font-bold text-white hover:bg-mint-400 transition-colors">
                                Join
                            </button>
                        </form>
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
