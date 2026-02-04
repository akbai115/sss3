'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Globe, Zap, ShieldCheck, Heart } from 'lucide-react';

export default function HeaderCreator() {
    const [title, setTitle] = useState("SHARE YOUR STORY – GET FUNDED");
    const [tagline, setTagline] = useState("THE COMMUNITY-DRIVEN TOKEN WHERE TRADING IS GIVING.");
    const [website, setWebsite] = useState("WWW.GIVEPUMP.FUN");

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-10 font-sans">
            <div className="mb-10 text-center space-y-2">
                <h1 className="text-mint-500 text-2xl font-black italic tracking-tighter uppercase">X Header Studio</h1>
                <p className="text-zinc-500 text-sm font-medium">Professional 1500x500 Canvas • Click text to edit</p>
            </div>

            {/* The Header Canvas */}
            <div
                id="header-canvas"
                className="relative overflow-hidden bg-white w-[1500px] h-[500px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex items-center px-24 select-none group border border-white/10"
                style={{ minWidth: '1500px', minHeight: '500px' }}
            >
                {/* Background Mastery */}
                <div className="absolute top-[-40%] right-[-10%] w-[1000px] h-[1000px] bg-mint-400/15 rounded-full blur-[160px]" />
                <div className="absolute bottom-[-50%] left-[-10%] w-[800px] h-[800px] bg-blue-400/10 rounded-full blur-[140px]" />
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                {/* Subtle Sidebar Accent */}
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-mint-500 via-blue-500 to-transparent opacity-40" />

                {/* Content */}
                <div className="relative z-10 w-full flex justify-between items-center">
                    <div className="max-w-4xl space-y-8">
                        <div className="space-y-4">
                            <textarea
                                value={title}
                                onChange={(e) => setTitle(e.target.value.toUpperCase())}
                                rows={2}
                                className="w-full bg-transparent text-[84px] leading-[0.9] font-[1000] tracking-[-0.05em] text-zinc-900 border-none outline-none focus:ring-0 placeholder:opacity-20 resize-none overflow-hidden"
                                placeholder="HEADER TITLE"
                            />

                            <div className="h-1 w-32 bg-mint-500" />

                            <input
                                value={tagline}
                                onChange={(e) => setTagline(e.target.value.toUpperCase())}
                                className="w-full bg-transparent text-xl font-black tracking-widest text-zinc-400 border-none outline-none focus:ring-0 placeholder:opacity-20 mt-4"
                                placeholder="TAGLINE GOES HERE..."
                            />
                        </div>

                        <div className="flex items-center gap-12 pt-8">
                            {[
                                { icon: Zap, text: "Auto-Donation", color: "text-amber-500" },
                                { icon: ShieldCheck, text: "Direct Impact", color: "text-blue-500" },
                                { icon: Globe, text: "On-Chain Verified", color: "text-mint-500" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center shadow-sm">
                                        <item.icon size={16} className={item.color} />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-zinc-500">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Branding Side - Elevated */}
                    <div className="flex flex-col items-center gap-8 pr-12">
                        <div className="relative h-56 w-56">
                            <div className="absolute inset-x-0 bottom-0 h-8 w-full bg-black/5 blur-2xl rounded-full" />
                            <div className="absolute inset-0 bg-mint-500/10 blur-[60px] rounded-full animate-pulse" />
                            <Image
                                src="/pgs.png"
                                alt="GivePump"
                                fill
                                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] brightness-[1.02]"
                            />
                        </div>
                        <div className="text-center space-y-1">
                            <div className="flex items-center justify-center gap-2">
                                <Heart size={20} className="text-mint-500 fill-current" />
                                <h2 className="text-4xl font-[1000] italic tracking-tighter text-zinc-900">
                                    GIVE<span className="text-mint-500">PUMP</span>
                                </h2>
                            </div>
                            <input
                                value={website}
                                onChange={(e) => setWebsite(e.target.value.toUpperCase())}
                                className="text-xs font-black tracking-[0.3em] text-zinc-400 border-none outline-none text-center bg-transparent focus:ring-0 w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Decorative Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-zinc-100 to-transparent" />
            </div>

            {/* Instruction Footer */}
            <div className="mt-12 flex gap-10 items-center">
                <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-10 w-10 rounded-full border-2 border-[#050505] bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-500">
                            0{i}
                        </div>
                    ))}
                </div>
                <div className="h-px w-20 bg-zinc-800" />
                <p className="text-xs text-zinc-500 font-bold tracking-widest uppercase">
                    Refined • Editable • High-Resolution • Professional
                </p>
            </div>
        </div>
    );
}
