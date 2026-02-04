'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ShieldCheck, Heart, AlertCircle, CheckCircle2, Send, Wallet, ArrowRight, User, FileText, LayoutList } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type RequestType = 'Personal Need' | 'Medical/Emergency' | 'Family/Hardship' | 'Charity/Nonprofit' | 'Community Project' | 'Other';

interface FormData {
    name: string;
    type: RequestType;
    title: string;
    description: string;
    amount: string;
    agreement: boolean;
}

export default function SubmitRequest() {
    const [mounted, setMounted] = useState(false);
    const { connected, publicKey } = useWallet();
    const { setVisible } = useWalletModal();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        type: 'Personal Need',
        title: '',
        description: '',
        amount: '',
        agreement: false,
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!connected || !publicKey) {
            setVisible(true);
            return;
        }

        if (!formData.agreement) {
            setError("Please agree to the terms.");
            return;
        }

        if (formData.description.length < 100) {
            setError("Description must be at least 100 characters.");
            return;
        }

        setIsSubmitting(true);

        try {
            const { error: submitError } = await supabase
                .from('donation_requests')
                .insert([
                    {
                        wallet_address: publicKey.toBase58(),
                        name: formData.name,
                        request_type: formData.type,
                        title: formData.title,
                        description: formData.description,
                        requested_amount: formData.amount,
                        status: 'pending' // Moderation required
                    }
                ]);

            if (submitError) throw submitError;

            setIsSuccess(true);
            setFormData({
                name: '',
                type: 'Personal Need',
                title: '',
                description: '',
                amount: '',
                agreement: false,
            });
        } catch (err: any) {
            console.error("Submission Error:", err);
            setError(err.message || "Failed to submit request. Please ensure the 'donation_requests' table exists in your Supabase.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-mint-500 selection:text-white">
            <Navbar />

            <main className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-mint-50/50 blur-[100px]" />
                    <div className="absolute bottom-[20%] left-[-10%] h-[400px] w-[400px] rounded-full bg-blue-50/40 blur-[80px]" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-6">
                    {/* Hero Section */}
                    <div className="text-center mb-16 space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 rounded-full bg-mint-50 px-4 py-1.5 text-xs font-bold text-mint-600 border border-mint-100 uppercase tracking-widest"
                        >
                            <Heart size={14} /> Ask for Support
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-black tracking-tight"
                        >
                            Share Your Story – Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint-600 to-mint-500">Funded</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed"
                        >
                            Got a cause? Need a hand? Share your story with the GivePump circle. If the vibe checks out, you’ll hit the community board where everyone votes to send support straight to your wallet.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        {/* Information Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200"
                            >
                                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-6 px-1">How it works</h3>
                                <div className="space-y-6">
                                    {[
                                        { icon: Wallet, title: "Connect Wallet", desc: "Link your Solana address so we know where to send the support." },
                                        { icon: Send, title: "Share Your Story", desc: "Speak from the heart. Proof of need helps the community trust your cause." },
                                        { icon: ShieldCheck, title: "The Vibe Check", desc: "Our circle reviews every request for safety and legitimacy." },
                                        { icon: LayoutList, title: "Community Board", desc: "If approved, you’ll go live for the community to vote on." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="h-10 w-10 shrink-0 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-mint-500 shadow-sm">
                                                <item.icon size={18} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-zinc-900 text-sm">{item.title}</h4>
                                                <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="p-6 rounded-3xl bg-mint-500 text-white shadow-lg shadow-mint-500/20"
                            >
                                <AlertCircle className="mb-4 h-8 w-8 text-white/80" />
                                <h3 className="text-lg font-bold mb-2">Important Note</h3>
                                <p className="text-xs text-mint-50 leading-relaxed">
                                    Personal emergencies, charities, and community projects are welcome. Requests must be legitimate. Providing false information will lead to a permanent ban. No guarantees—the community decides.
                                </p>
                            </motion.div>
                        </div>

                        {/* Submission Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-8"
                        >
                            <div className="p-8 md:p-10 rounded-[2.5rem] bg-white border border-zinc-200 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
                                {isSuccess ? (
                                    <div className="text-center py-10 space-y-6">
                                        <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
                                            <CheckCircle2 size={48} />
                                        </div>
                                        <h2 className="text-3xl font-black">Request Received!</h2>
                                        <p className="text-zinc-500 leading-relaxed max-w-sm mx-auto">
                                            Your story is in our hands now. We're performing a quick vibe check to ensure everything is legit—check The Hub soon to see if you've hit the community board!
                                        </p>
                                        <button
                                            onClick={() => setIsSuccess(false)}
                                            className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition"
                                        >
                                            Submit Another
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {!connected && (
                                            <div onClick={() => setVisible(true)} className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-center gap-3 text-amber-700 cursor-pointer hover:bg-amber-100 transition mb-6">
                                                <Wallet size={20} />
                                                <span className="text-sm font-bold">Please connect your wallet to start your request.</span>
                                                <ArrowRight size={16} className="ml-auto" />
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs border-zinc-200 font-black uppercase tracking-widest text-zinc-400 px-1">Your Name / Organization</label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="e.g., John Doe"
                                                        value={formData.name}
                                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-12 py-4 text-sm outline-none focus:border-mint-500 focus:ring-4 focus:ring-mint-500/5 transition"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">Type of Request</label>
                                                <select
                                                    value={formData.type}
                                                    onChange={e => setFormData({ ...formData, type: e.target.value as RequestType })}
                                                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-4 text-sm outline-none focus:border-mint-500 focus:ring-4 focus:ring-mint-500/5 transition appearance-none"
                                                >
                                                    <option value="Personal Need">Personal Need</option>
                                                    <option value="Medical/Emergency">Medical/Emergency</option>
                                                    <option value="Family/Hardship">Family/Hardship</option>
                                                    <option value="Charity/Nonprofit">Charity/Nonprofit</option>
                                                    <option value="Community Project">Community Project</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">Request Title</label>
                                            <div className="relative">
                                                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Short, descriptive title"
                                                    value={formData.title}
                                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-12 py-4 text-sm outline-none focus:border-mint-500 focus:ring-4 focus:ring-mint-500/5 transition"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">Full Description (Min 100 chars)</label>
                                            <textarea
                                                required
                                                placeholder="Explain your situation clearly. Who needs help, why, and how will funds be used?"
                                                rows={5}
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-4 text-sm outline-none focus:border-mint-500 focus:ring-4 focus:ring-mint-500/5 transition resize-none"
                                            />
                                            <p className="text-[10px] text-zinc-400 text-right">{formData.description.length} characters</p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">Requested Amount (SOL)</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-mint-600">SOL</span>
                                                <input
                                                    required
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="e.g., 2.5"
                                                    value={formData.amount}
                                                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-14 py-4 text-sm font-bold outline-none focus:border-mint-500 focus:ring-4 focus:ring-mint-500/5 transition"
                                                />
                                            </div>
                                            <p className="text-[10px] text-zinc-400">Suggestion only — community votes on final amount.</p>
                                        </div>

                                        <div className="pt-4">
                                            <label className="flex items-start gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.agreement}
                                                    onChange={e => setFormData({ ...formData, agreement: e.target.checked })}
                                                    className="mt-1 h-5 w-5 rounded-lg border-zinc-300 text-mint-500 focus:ring-mint-500"
                                                />
                                                <span className="text-xs text-zinc-500 leading-relaxed group-hover:text-zinc-700 transition">
                                                    I confirm this is a genuine request and agree to public listing. Funds will go directly to my auto-detected SOL address if approved and funded.
                                                </span>
                                            </label>
                                        </div>

                                        <AnimatePresence>
                                            {error && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm font-semibold"
                                                >
                                                    <AlertCircle size={18} />
                                                    {error}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <button
                                            disabled={isSubmitting || !connected}
                                            type="submit"
                                            className="w-full relative overflow-hidden group rounded-2xl bg-zinc-900 py-5 text-center font-black text-white shadow-xl hover:bg-zinc-800 transition disabled:opacity-50 disabled:bg-zinc-400 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? "Submitting Request..." : "Submit to Community Board"}
                                            <div className="absolute inset-0 bg-gradient-to-r from-mint-500/0 via-white/10 to-mint-500/0 -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
                                        </button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
