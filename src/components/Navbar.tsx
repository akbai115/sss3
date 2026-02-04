'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const [mounted, setMounted] = useState(false);

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


