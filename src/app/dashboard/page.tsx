'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, TrendingUp, CheckCircle2, ShieldPlus, Home, X } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { supabase } from "@/lib/supabaseClient";
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { CHARITY_WALLET_ADDRESS, SOL_PRICE_USD } from "@/lib/constants";

export default function Dashboard() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const { connected, publicKey } = useWallet();
    const { setVisible } = useWalletModal();
    const [selectedProposal, setSelectedProposal] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'proposals' | 'donations'>('proposals');
    const [charityBalance, setCharityBalance] = useState<number>(0);
    const [solPrice, setSolPrice] = useState<number>(SOL_PRICE_USD);



    const [proposals, setProposals] = useState([
        {
            id: 1,
            title: "Humane Society of Tampa Bay Inc",
            description: "The Humane Society of Tampa Bay was established in 1912 and is dedicated to ending animal homelessness and providing care and comfort to companion animals in need.",
            fullBio: "The Humane Society of Tampa Bay was established in 1912 and is dedicated to ending animal homelessness and providing care and comfort to companion animals in need. Our core programs include shelter and adoption of homeless dogs, cats, rabbits, and pockets pets, providing affordable veterinary care and sterilization for owned pets in our community, Trap/Neuter/Vaccinate/Return (TNVR) of free roaming cats, providing safety net programs to keep pets in their homes and providing numerous community outreach programs and services.",
            votes: 0,
            targetVotes: 8000,
            progress: 0,
            hasVoted: false,
            type: "Animals",
            icon: Heart,
            color: "orange",
            imageUrl: "/Charities/Humane Society of Tampa Bay Inc/Icon.jpg",
            link: "https://humanesocietytampabay.org"
        },
        {
            id: 2,
            title: "The Colorectal Cancer Alliance",
            description: "Fiercely determined to end colon and rectal cancers within our lifetime. Advocating for prevention, magnifying support, and accelerating research.",
            fullBio: "The Colorectal Cancer Alliance is fiercely determined to end colon and rectal cancers within our lifetime. Together with a nation of passionate allies, we advocate for prevention, magnify support, and accelerate research to stop this disease. Your contribution helps bring us closer to a world free from colorectal cancer.",
            votes: 0,
            targetVotes: 5000,
            progress: 0,
            hasVoted: false,
            type: "Health",
            icon: ShieldPlus,
            color: "blue",
            imageUrl: "/Charities/The Colorectal Cancer Alliance/Icon.webp",
            link: "https://colorectalcancer.org"
        },
        {
            id: 3,
            title: "Senior Concerns",
            description: "Providing programs and services for seniors and their family caregivers which support and improve their quality of life.",
            fullBio: "The mission of Senior Concerns is to provide programs and services for seniors and their family caregivers which support and improve their quality of life. Our vision: To be the premier resource for an aging population, their families, caregivers and the community.",
            votes: 0,
            targetVotes: 4000,
            progress: 0,
            hasVoted: false,
            type: "Community",
            icon: Home,
            color: "green",
            imageUrl: "/Charities/Senior Concerns/Icon.jpg",
            link: "https://www.seniorconcerns.org"
        }
    ]);

    // REAL-TIME DB SYNC
    useEffect(() => {
        // 1. Fetch Initial State
        const fetchVotes = async () => {
            // Only try to fetch if keys might exist (avoids crash loops in empty local env)
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

            const { data, error } = await supabase.from('proposals').select('id, votes');
            if (data) {
                setProposals(prev => prev.map(p => {
                    const row = data.find((d: any) => d.id === p.id);
                    if (row) {
                        return {
                            ...p,
                            votes: row.votes,
                            progress: Math.min((row.votes / p.targetVotes) * 100, 100)
                        };
                    }
                    return p;
                }));
            }
        };
        fetchVotes();

        // 2. Realtime Subscription
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
        const channel = supabase.channel('realtime_proposals')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'proposals' }, (payload: any) => {
                const newVote = payload.new;
                setProposals(prev => prev.map(p => {
                    if (p.id === newVote.id) {
                        return {
                            ...p,
                            votes: newVote.votes,
                            progress: Math.min((newVote.votes / p.targetVotes) * 100, 100)
                        };
                    }
                    return p;
                }));
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); }
    }, []);

    // FETCH CHARITY WALLET BALANCE
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

                // Optional: Fetch real SOL price from CoinGecko or Similar
                // For now use the constant from lib/constants.ts
            } catch (err) {
                console.error("Failed to fetch balance:", err);
            }
        };

        fetchBalance();
        const interval = setInterval(fetchBalance, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, []);

    // Load voting state from local storage on mount

    // Load voting state from local storage when wallet changes
    useEffect(() => {
        // Reset hasVoted first (important when switching wallets)
        setProposals(prev => prev.map(p => ({ ...p, hasVoted: false })));

        if (!publicKey) return;

        const walletAddress = publicKey.toBase58();
        const storageKey = `user_votes_${walletAddress}`;
        const savedVotes = JSON.parse(localStorage.getItem(storageKey) || '[]');

        if (savedVotes.length > 0) {
            setProposals(prev => prev.map(p => {
                if (savedVotes.includes(p.id)) {
                    return {
                        ...p,
                        hasVoted: true
                    };
                }
                return p;
            }));
        }
    }, [publicKey]);

    if (!mounted) return null;

    const handleVote = async (id: number) => {
        if (!connected || !publicKey) {
            setVisible(true);
            return;
        }

        // Find the proposal to vote for
        const proposal = proposals.find(p => p.id === id);
        if (!proposal || proposal.hasVoted) return;

        const newVotes = proposal.votes + 1;
        const newProgress = Math.min((newVotes / proposal.targetVotes) * 100, 100);

        // 1. OPTIMISTIC UPDATE (Update UI immediately)
        setProposals(prev => prev.map(p =>
            p.id === id ? { ...p, votes: newVotes, progress: newProgress, hasVoted: true } : p
        ));

        // 2. SIDE EFFECTS (Local Storage - Wallet Specific)
        const walletAddress = publicKey.toBase58();
        const storageKey = `user_votes_${walletAddress}`;
        const savedVotes = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (!savedVotes.includes(id)) {
            localStorage.setItem(storageKey, JSON.stringify([...savedVotes, id]));
        }

        // 3. DB UPDATE
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
            console.log("Syncing vote to Supabase. ID:", id, "New Total:", newVotes);
            const { error } = await supabase.from('proposals').update({ votes: newVotes }).eq('id', id);
            if (error) {
                console.error("Supabase Sync Error:", error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-mint-500 selection:text-white">
            <Navbar />
            <main className="max-w-7xl mx-auto px-6 py-28 animate-in fade-in duration-700">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Voting Dashboard</h1>
                    <div className="text-sm text-zinc-500 flex items-center gap-2">
                        {connected && (
                            <>
                                <span className="h-2 w-2 rounded-full animate-pulse bg-mint-500"></span>
                                Wallet Connected
                            </>
                        )}
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-8 border-b border-zinc-200 mb-8">
                    <button
                        onClick={() => setActiveTab('proposals')}
                        className={`pb-3 text-sm font-bold transition border-b-2 ${activeTab === 'proposals' ? 'text-zinc-900 border-mint-500' : 'text-zinc-400 border-transparent hover:text-zinc-700'}`}
                    >
                        Active Proposals
                    </button>
                    <button
                        onClick={() => setActiveTab('donations')}
                        className={`pb-3 text-sm font-bold transition border-b-2 ${activeTab === 'donations' ? 'text-zinc-900 border-mint-500' : 'text-zinc-400 border-transparent hover:text-zinc-700'}`}
                    >
                        Recent Donations
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm transition-all hover:border-mint-500/30">
                            <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Your Holdings</p>
                            <p className="text-2xl font-bold mt-2 text-zinc-900">{connected ? "12,500" : "0"} GIVE</p>
                            <div className="mt-4 pt-4 border-t border-zinc-100">
                                <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Active Voters</p>
                                <p className="text-xl font-bold text-mint-600 mt-1">
                                    {proposals.reduce((acc, curr) => acc + curr.votes, 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        {/* Charity Wallet */}
                        <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-5">
                                <Heart size={64} className="text-zinc-900" />
                            </div>
                            <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Charity Wallet</p>
                            <p className="text-2xl font-bold mt-2 text-yellow-500 flex items-center gap-2">
                                {charityBalance.toLocaleString()} SOL
                            </p>
                            <p className="text-xs text-zinc-500 mt-1">≈ ${(charityBalance * solPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</p>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3 space-y-6">
                        {activeTab === 'proposals' ? (
                            <>
                                <h2 className="text-xl font-semibold text-zinc-700 border-b border-zinc-200 pb-4">Active Proposals</h2>

                                {proposals.map((proposal, index) => (
                                    <motion.div
                                        key={proposal.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-mint-500/50 hover:shadow-lg hover:shadow-mint-500/5"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                                            <div className="flex gap-4">
                                                {/* Charity Icon */}
                                                <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden border border-zinc-100 shadow-sm bg-zinc-50">
                                                    <Image
                                                        src={proposal.imageUrl}
                                                        alt={proposal.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-xl font-bold text-zinc-900 group-hover:text-mint-600 transition">{proposal.title}</h3>
                                                        <a
                                                            href={proposal.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center justify-center rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500 hover:bg-zinc-200"
                                                        >
                                                            {new URL(proposal.link).hostname.replace('www.', '')}
                                                        </a>
                                                    </div>
                                                    <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl">{proposal.description}</p>
                                                </div>
                                            </div>
                                            <span className="self-start rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 border border-green-500/20 flex items-center gap-1">
                                                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> Active
                                            </span>
                                        </div>

                                        <div className="mt-8">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-zinc-600 font-medium">Progress</span>
                                                <span className="text-mint-600 font-bold">{proposal.progress}%</span>
                                            </div>
                                            <div className="h-3 w-full rounded-full bg-zinc-100 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-mint-500 to-mint-400 shadow-[0_0_15px_rgba(0,255,204,0.4)] transition-all duration-1000 ease-out"
                                                    style={{ width: `${proposal.progress}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between mt-2 text-xs text-zinc-400">
                                                <span>{proposal.votes.toLocaleString()} Votes</span>
                                                <span>Target: {proposal.targetVotes.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-zinc-100">
                                            <button
                                                onClick={() => setSelectedProposal(proposal)}
                                                className="rounded-full px-6 py-2 text-sm font-bold bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition cursor-pointer"
                                            >
                                                Details
                                            </button>

                                            <button
                                                onClick={() => handleVote(proposal.id)}
                                                disabled={proposal.hasVoted}
                                                className={`rounded-full px-6 py-2 text-sm font-bold transition shadow-lg transform active:scale-95 flex items-center gap-2 cursor-pointer
                                                    ${proposal.hasVoted
                                                        ? 'bg-zinc-100 text-zinc-400 shadow-none cursor-default'
                                                        : 'bg-mint-500 text-white hover:bg-mint-400 shadow-mint-500/30'
                                                    }`}
                                            >
                                                {proposal.hasVoted ? (
                                                    <>
                                                        <CheckCircle2 className="h-4 w-4" /> Voted
                                                    </>
                                                ) : (
                                                    'Vote Now'
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-zinc-200 rounded-3xl bg-zinc-50/50"
                            >
                                <div className="h-20 w-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6 text-zinc-400 shadow-sm border border-zinc-200">
                                    <TrendingUp className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900">No Donations Yet</h3>
                                <p className="text-zinc-500 max-w-sm mt-3 leading-relaxed">
                                    The protocol is currently accumulating fees in the Charity Wallet. The first round of execution will happen once target thresholds are met.
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>
                {/* Proposal Details Modal */}
                <AnimatePresence>
                    {selectedProposal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] flex items-center justify-center p-4 px-4 bg-black/40 backdrop-blur-sm"
                            onClick={() => setSelectedProposal(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-zinc-200"
                                onClick={e => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button onClick={() => setSelectedProposal(null)} className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition"><X size={20} /></button>

                                {/* Header */}
                                <div className="flex items-start gap-6 mb-6">
                                    <div className="relative h-24 w-24 shrink-0 rounded-2xl overflow-hidden border border-zinc-100 shadow-sm">
                                        <Image src={selectedProposal.imageUrl} alt={selectedProposal.title} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-zinc-900">{selectedProposal.title}</h2>
                                        <a href={selectedProposal.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-mint-600 hover:underline mt-1 inline-block">Visit Official Website</a>
                                        <div className="flex gap-2 mt-3">
                                            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">{selectedProposal.type}</span>
                                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Verified Charity</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="prose prose-zinc max-w-none mb-8">
                                    <h3 className="text-lg font-semibold mb-2">About this Cause</h3>
                                    <p className="text-zinc-600 leading-relaxed text-base">{selectedProposal.fullBio}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4 pt-6 border-t border-zinc-100">
                                    <button
                                        onClick={() => { handleVote(selectedProposal.id); setSelectedProposal(null); }}
                                        disabled={selectedProposal.hasVoted}
                                        className="flex-1 rounded-full bg-mint-500 py-3.5 text-center font-bold text-white shadow-lg shadow-mint-500/20 transition hover:bg-mint-400 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {selectedProposal.hasVoted ? 'Already Voted' : 'Vote for this Cause'}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            <Footer />
        </div>
    );
}
