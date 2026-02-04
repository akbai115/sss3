import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Globe, Heart } from 'lucide-react';

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
                                    src="/pgs.png"
                                    alt="GivePump Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-zinc-900 italic">
                                GIVE<span className="text-mint-600">PUMP</span>
                            </span>
                        </Link>
                        <p className="max-w-xs text-sm text-zinc-500 leading-relaxed">
                            The heart of community giving. Powered by the people, fueled by every trade. Let's make an impact together.
                        </p>
                    </div>
                </div>

                <div className="mt-16 border-t border-zinc-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex gap-4 items-center order-2 md:order-1">
                        <a
                            href="https://x.com/Givepump"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-full border border-zinc-100 bg-white px-5 py-2 text-sm font-bold text-zinc-600 hover:border-mint-500/50 hover:text-zinc-900 transition-all shadow-sm"
                        >
                            Follow on X <Twitter className="h-4 w-4 text-blue-400" />
                        </a>
                        <a
                            href="https://pump.fun/profile/givepump"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-full border border-zinc-100 bg-white px-5 py-2 text-sm font-bold text-zinc-600 hover:border-mint-500/50 hover:text-zinc-900 transition-all shadow-sm"
                        >
                            pump.fun <Globe className="h-4 w-4 text-zinc-400" />
                        </a>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 order-1 md:order-2">
                        Impact for All <span className="h-1 w-1 rounded-full bg-mint-500" /> Decentralized Love
                    </div>
                </div>
            </div>
        </footer>
    );
}
