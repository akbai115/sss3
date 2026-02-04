'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, Globe, Zap, ShieldCheck } from 'lucide-react';

export default function HeaderCreator() {
    const [title, setTitle] = useState("Share Your Story – Get Funded");
    const [tagline, setTagline] = useState("The community-driven token where memes meet impact.");
    const [website, setWebsite] = useState("www.givepump.fun");

    return (
        <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-10 font-sans">
            <div className="mb-10 text-center space-y-2">
                <h1 className="text-white text-2xl font-black italic tracking-tighter uppercase">X Header Creator</h1>
                <p className="text-zinc-500 text-sm">Edit the text below and take a screenshot (1500x500 aspect ratio)</p>
            </div>

            {/* The Header Canvas */}
            <div
                id="header-canvas"
                className="relative overflow-hidden bg-white w-[1500px] h-[500px] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex items-center px-20 select-none group"
                style={{ minWidth: '1500px', minHeight: '500px' }}
            >
                {/* Background Elements */}
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-mint-400/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-30%] left-[-5%] w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                {/* Content */}
                <div className="relative z-10 w-full flex justify-between items-center">
                    <div className="max-w-3xl space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-full bg-mint-50 px-4 py-2 text-xs font-black text-mint-600 border border-mint-200 uppercase tracking-widest">
                            <Heart size={14} className="fill-current" /> Community Led
                        </div>

                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-transparent text-7xl font-black tracking-tighter text-zinc-900 border-none outline-none focus:ring-0 placeholder:opacity-20"
                            placeholder="Header Title"
                        />

                        <input
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            className="w-full bg-transparent text-xl font-medium text-zinc-500 border-none outline-none focus:ring-0 placeholder:opacity-20"
                            placeholder="Tagline goes here..."
                        />

                        <div className="flex items-center gap-8 pt-6">
                            <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-tighter text-sm italic">
                                <Zap size={16} className="text-amber-500" /> Auto-Donation
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-tighter text-sm italic">
                                <ShieldCheck size={16} className="text-blue-500" /> Transparent
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-tighter text-sm italic">
                                <Globe size={16} className="text-mint-500" /> On-Chain
                            </div>
                        </div>
                    </div>

                    {/* Branding Side */}
                    <div className="flex flex-col items-center gap-8">
                        <div className="relative h-48 w-48">
                            <div className="absolute inset-0 bg-mint-500/20 blur-3xl rounded-full" />
                            <Image
                                src="/pgs.png"
                                alt="GivePump"
                                fill
                                className="object-contain drop-shadow-2xl brightness-105"
                            />
                        </div>
                        <div className="text-center">
                            <h2 className="text-3xl font-black italic tracking-tighter text-zinc-900">
                                Give<span className="text-mint-500 italic">Pump</span>
                            </h2>
                            <input
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                className="text-sm font-bold text-zinc-400 border-none outline-none text-center bg-transparent focus:ring-0"
                            />
                        </div>
                    </div>
                </div>

                {/* Decorative Pill */}
                <div className="absolute bottom-0 right-0 p-10">
                    <div className="h-1 w-40 bg-gradient-to-r from-transparent via-mint-500 to-transparent opacity-20" />
                </div>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl text-zinc-400">
                <div className="text-center p-4 border border-zinc-800 rounded-2xl bg-zinc-900/50">
                    <p className="text-xs font-bold uppercase mb-1">Step 1</p>
                    <p className="text-sm text-zinc-500">Edit the text fields directly on the canvas.</p>
                </div>
                <div className="text-center p-4 border border-zinc-800 rounded-2xl bg-zinc-900/50">
                    <p className="text-xs font-bold uppercase mb-1">Step 2</p>
                    <p className="text-sm text-zinc-500">Use browser zoom (Cmd/Ctrl -) to fit the 1500px canvas in view.</p>
                </div>
                <div className="text-center p-4 border border-zinc-800 rounded-2xl bg-zinc-900/50">
                    <p className="text-xs font-bold uppercase mb-1">Step 3</p>
                    <p className="text-sm text-zinc-500">Screenshot the white box (1500x500) for your X header.</p>
                </div>
            </div>
        </div>
    );
}
