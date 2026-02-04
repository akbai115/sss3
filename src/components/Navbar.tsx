'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, Copy, Check } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex w-[94%] max-w-5xl items-center justify-between rounded-full border border-white/40 bg-white/70 px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-md"
        >
            <Link href="/" className="flex items-center gap-2 group">
                <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white/50 shadow-sm transition-transform duration-300 group-hover:scale-110">
                    <Image
                        src="/pgs.png"
                        alt="GivePump Logo"
                        fill
                        className="object-cover"
                    />
                </div>
                <span className="text-xl font-bold tracking-tight text-zinc-900 italic group-hover:text-mint-600 transition-colors uppercase">
                    GIVE<span className="text-mint-500">PUMP</span>
                </span>
            </Link>

            <div className="hidden items-center gap-1 md:flex">
                {[
                    { name: 'Give Back', href: '/dashboard' },
                    { name: 'Request Support', href: '/submit-request' },
                    { name: 'Stats', href: '/' }
                ].map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="relative rounded-full px-5 py-2 text-sm font-medium text-zinc-600 transition-all hover:bg-white hover:text-zinc-900 hover:shadow-sm"
                    >
                        {item.name}
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-3">
                {/* Desktop CA Pill */}
                <div className="hidden lg:flex items-center">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText("8z3oAbrzteXsRXUC97qKWaBy3BtXvDq3bLDTXssJpump");
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }}
                        className="group relative flex items-center gap-2 rounded-full border border-white/40 bg-white/50 px-3 py-1.5 text-[10px] font-mono text-zinc-600 transition-all hover:border-mint-500/50 hover:bg-white hover:shadow-sm"
                    >
                        <span className="text-mint-600 font-bold uppercase tracking-tight">CA:</span>
                        <span className="opacity-70 group-hover:opacity-100 transition-opacity">8z3o...pump</span>
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-white border border-zinc-100 group-hover:border-mint-100 transition-colors">
                            {copied ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                        </div>

                        <AnimatePresence>
                            {copied && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1, y: -30 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="absolute left-1/2 -translate-x-1/2 px-2 py-0.5 bg-zinc-900 text-white text-[8px] font-bold rounded-md pointer-events-none whitespace-nowrap"
                                >
                                    COPIED!
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>

                <div className="hidden md:block scale-90 origin-right">
                    <WalletMultiButton />
                </div>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200 md:hidden">
                    <Menu className="h-5 w-5" />
                </button>
            </div>
        </motion.nav>
    );
}


