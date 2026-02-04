'use client';

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { motion } from "framer-motion";
import { Rocket, Zap, Vote, ShieldCheck, BarChart3, CheckCircle2, TrendingUp, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { CHARITY_WALLET_ADDRESS, SOL_PRICE_USD } from "@/lib/constants";

export default function Home() {
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
    const channel = supabase.channel('realtime_landing_stats')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'proposals' }, () => {
        fetchStats();
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

  return (
    <main className="relative min-h-screen bg-white text-zinc-900 selection:bg-mint-500 selection:text-white font-sans overflow-x-hidden">
      <Navbar />
      <Hero />

      {/* How It Works / The Cycle */}
      <section className="relative z-10 py-32 bg-zinc-50/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-black text-zinc-900 mb-4"
            >
              The GivePump Cycle
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-zinc-500 max-w-2xl mx-auto text-lg"
            >
              We've engineered a way to turn viral meme energy into real-world impact using pump.fun's Creator Fee Sharing.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-zinc-200 -translate-y-1/2 z-0" />

            {[
              {
                icon: Rocket,
                title: "Fair Launch",
                desc: "$GIVE launched on pump.fun with zero pre-sale and total transparency.",
                color: "blue"
              },
              {
                icon: Zap,
                title: "Auto-Donation",
                desc: "The built-in creator fee is sent directly to our community treasury.",
                color: "amber"
              },
              {
                icon: Vote,
                title: "Community Vote",
                desc: "$GIVE holders vote on-chain for the verified charities they support.",
                color: "mint"
              },
              {
                icon: Heart,
                title: "Pump Good",
                desc: "Treasury funds are sent to winners, making every trade a donation.",
                color: "red"
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative flex flex-col items-center text-center group z-10"
              >
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center bg-white border border-zinc-200 shadow-sm mb-6 group-hover:scale-110 group-hover:border-mint-500/50 transition-all duration-300`}>
                  <step.icon className={`h-8 w-8 ${step.color === 'blue' ? 'text-blue-500' : step.color === 'amber' ? 'text-amber-500' : step.color === 'mint' ? 'text-mint-500' : 'text-red-500'}`} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">{step.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency Stats */}
      <section className="relative z-10 py-32 bg-white border-t border-zinc-100">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black text-zinc-900 mb-6">Real-Time Transparency</h2>
              <p className="text-zinc-500 text-lg">
                Using Solana's low fees and pump.fun's multi-wallet creator fee distribution, every $GIVE trade contributes to the treasury.
                Everything is verifiable 100% on-chain.
              </p>
            </div>
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-8 rounded-3xl bg-zinc-50 border border-zinc-200">
                <TrendingUp className="h-6 w-6 text-mint-600 mb-4" />
                <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-1">Total Impacted</p>
                <p className="text-3xl font-black text-zinc-900 tracking-tighter">
                  {CHARITY_WALLET_ADDRESS
                    ? `$${(charityBalance * solPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : "Not updated yet"}
                </p>
              </div>
              <div className="p-8 rounded-3xl bg-zinc-50 border border-zinc-200">
                <ShieldCheck className="h-6 w-6 text-blue-600 mb-4" />
                <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-1">Donation Treasury</p>
                <p className="text-3xl font-black text-zinc-900 tracking-tighter">
                  {CHARITY_WALLET_ADDRESS
                    ? `${charityBalance.toLocaleString()} SOL`
                    : "Not updated yet"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: "Proposals Passed", value: "0", icon: CheckCircle2 },
              { label: "Active Voters", value: totalVotes.toLocaleString(), icon: BarChart3 },
              { label: "Charities Funded", value: "0", icon: Heart }
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-4 p-6 rounded-2xl bg-white border border-zinc-100 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400">
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-xl font-bold text-zinc-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
