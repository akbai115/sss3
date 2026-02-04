'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Activity, ShieldCheck, ArrowRight } from 'lucide-react';
import Heart3D from './Heart3D';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from "react";

import { supabase } from "@/lib/supabaseClient";
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { CHARITY_WALLET_ADDRESS, SOL_PRICE_USD } from "@/lib/constants";

export default function Hero() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const { connected } = useWallet();
    const { setVisible } = useWalletModal();
    const router = useRouter();
    const [totalVotes, setTotalVotes] = useState(0);
    const [charityBalance, setCharityBalance] = useState<number>(0);
    const [solPrice, setSolPrice] = useState<number>(SOL_PRICE_USD);

    useEffect(() => {
        const fetchStats = async () => {
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
            const { data } = await supabase.from('proposals').select('votes');
            if (data) {
                const total = data.reduce((acc, curr) => acc + (curr.votes || 0), 0);
                setTotalVotes(total);
            }
        };
        fetchStats();

        // Realtime Subscription
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
        const channel = supabase.channel('realtime_hero_stats')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'proposals' }, (payload) => {
                fetchStats(); // Re-fetch total when any proposal changes
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); }
    }, []);

    useEffect(() => {
        const fetchBalance = async () => {
            if (!CHARITY_WALLET_ADDRESS) {
                setCharityBalance(0);
                return;
            }
            try {
                const connection = new Connection(clusterApiUrl('mainnet-beta'));
                const balance = await connection.getBalance(new PublicKey(CHARITY_WALLET_ADDRESS));
                setCharityBalance(balance / LAMPORTS_PER_SOL);
            } catch (err) {
                console.error("Failed to fetch balance:", err);
            }
        };
        fetchBalance();
    }, []);

    if (!mounted) return null;

    const handleConnect = () => {
        if (connected) {
            router.push('/dashboard');
        } else {
            setVisible(true);
        }
    };

    return (
        <section className="relative z-20 flex min-h-screen w-full items-center justify-center pt-20 bg-white">
            {/* Abstract Background Elements (No Image) */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute -top-[30%] -right-[10%] h-[700px] w-[700px] rounded-full bg-mint-100/50 blur-[100px]" />
                <div className="absolute top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-blue-50/50 blur-[80px]" />
                <div className="absolute bottom-0 right-20 h-[300px] w-[300px] rounded-full bg-mint-50/60 blur-[60px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto grid max-w-7xl w-full gap-12 px-6 lg:grid-cols-2 lg:items-center mt-10">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-8 text-center lg:text-left"
                >

                    <h1 className="text-5xl font-extrabold leading-[1.1] text-zinc-900 md:text-6xl lg:text-7xl">
                        <span className="relative inline-block">
                            Pump
                            {/* Happy Character above 'P' */}
                            <div className="absolute -top-14 -left-4 w-20 h-20 animate-bounce duration-[2000ms] hover:scale-110 transition-transform cursor-pointer">
                                <Image
                                    src="/pgs.png"
                                    alt="Happy Character"
                                    fill
                                    className="object-contain drop-shadow-md"
                                />
                            </div>
                        </span> for <br className="hidden lg:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint-600 to-mint-500">Good Causes</span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg font-medium text-zinc-600 lg:mx-0 lg:text-xl leading-relaxed">
                        The revolution where <strong>trading is giving</strong>.
                        <span className="block mt-2 text-zinc-500 text-base font-normal">
                            Every trade you make feeds our sharing pool. This is the heart of our community—built for global charities, local dreams, and hands that need a lift. You decide where the love goes.
                        </span>
                    </p>

                    <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start pt-4">
                        <button
                            onClick={handleConnect}
                            className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-mint-500 px-8 py-4 text-base font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,204,0.4)] cursor-pointer"
                        >
                            <span className="relative z-10">{connected ? 'Lend a Helping Hand' : 'Join the Vote'}</span>
                            <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0" />
                        </button>
                        <Link href="/submit-request" className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-8 py-4 text-base font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:border-mint-500/50 cursor-pointer shadow-sm">
                            Apply for Funding
                        </Link>
                    </div>

                    {/* How It Works Mini-Flow */}
                    <div className="pt-8 flex items-center gap-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                            <span className="p-2 rounded-full bg-blue-50 text-blue-500"><Activity size={16} /></span>
                            <span>Trade</span>
                        </div>
                        <ArrowRight size={14} className="text-zinc-300" />
                        <div className="flex items-center gap-2">
                            <span className="p-2 rounded-full bg-amber-50 text-amber-500"><Heart size={16} /></span>
                            <span>Treasury</span>
                        </div>
                        <ArrowRight size={14} className="text-zinc-300" />
                        <div className="flex items-center gap-2">
                            <span className="p-2 rounded-full bg-mint-50 text-mint-600"><ShieldCheck size={16} /></span>
                            <span>Impact</span>
                        </div>
                    </div>

                    <div className="relative mt-8 flex items-center gap-3 rounded-2xl border border-mint-100 bg-mint-50/50 px-5 py-4 text-sm text-zinc-600 backdrop-blur-sm max-w-xl mx-auto lg:mx-0 pr-24 overflow-visible">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-mint-500 shadow-sm border border-mint-100">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                        <span className="leading-relaxed text-left">
                            $GIVE is only deployed from{' '}
                            <a href="https://pump.fun/profile/givepump" target="_blank" rel="noopener noreferrer" className="font-bold text-mint-700 underline decoration-mint-300 underline-offset-2 hover:text-mint-800 transition-colors">
                                pump.fun/profile/givepump
                            </a>{' '}
                            and the official X.
                        </span>

                        {/* Angry Character Overlay */}
                        <div className="absolute -right-8 -bottom-8 w-28 h-28 transform -rotate-12 hover:scale-110 transition-transform duration-300">
                            <Image
                                src="/NO.png"
                                alt="Security Guard"
                                fill
                                className="object-contain drop-shadow-lg"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Floating Stats - Visual Decoration */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="relative hidden h-[600px] w-full lg:block"
                >
                    {/* 3D Model Centered */}
                    <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                        <div className="w-full h-full">
                            <Heart3D />
                        </div>
                    </div>

                    <div className="absolute top-10 right-10 animate-float glass-panel rounded-2xl p-5 border border-zinc-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] bg-white/60 backdrop-blur-xl z-10">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500 border border-red-100">
                                <Heart className="h-6 w-6 fill-current animate-heartbeat" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Total Donated</p>
                                <p className="text-2xl font-black text-zinc-900">
                                    {CHARITY_WALLET_ADDRESS
                                        ? `$${(charityBalance * solPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                        : "Not updated yet"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-20 left-0 animate-float-delayed glass-panel rounded-2xl p-5 border border-zinc-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] bg-white/60 backdrop-blur-xl z-10">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500 border border-amber-100">
                                <Activity className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Active Voters</p>
                                <p className="text-2xl font-black text-zinc-900">{totalVotes.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
