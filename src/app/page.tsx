"use client";

import Link from 'next/link';
import { useState } from 'react';
import SolanaDepositModal from '@/components/SolanaDepositModal';

export default function Home() {
  const [depositOpen, setDepositOpen] = useState(false);
  return (
    <div className="premium-gradient text-white min-h-screen relative overflow-hidden">
      <div className="top-ticker">
        <div className="ticker-scroll ticker-marquee px-6">
          <span className="ticker-item">💎 $250M+ WON ON BETR</span>
          <span className="ticker-item">⚡ Fast Payouts</span>
          <span className="ticker-item">🎉 $20 → $60 New User Bonus</span>
          <span className="ticker-item">💎 Join the winners</span>
        </div>
      </div>

      <nav className="w-full flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-6">
          <span className="font-black text-4xl md:text-5xl text-purple-300 tracking-tight">Betr</span>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
            <Link href="#features" className="hover:text-white transition">Features</Link>
            <Link href="#how" className="hover:text-white transition">How it works</Link>
            <Link href="/register" className="hover:text-white transition">Sign Up</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="px-5 py-2 rounded-full border border-purple-600 text-purple-300 hover:bg-purple-900/20 transition">Login</Link>
          <Link href="/register" className="promo-btn-primary tilt-hover">Create Account</Link>
        </div>
      </nav>

      {/* Decorative blobs */}
      <div className="absolute -right-40 -top-40 w-96 h-96 rounded-full bg-gradient-to-r from-purple-700/30 to-purple-400/20 blur-3xl opacity-70 spin-slow"></div>
      <div className="absolute -left-32 bottom-40 w-72 h-72 rounded-full bg-gradient-to-r from-indigo-900/30 to-purple-600/20 blur-2xl opacity-60 float-2"></div>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="promo-headline text-purple-100 mb-4">Premium Sports Betting, Reimagined</h1>
            <p className="promo-subheadline text-white/90 mb-6">Deposit $20, get $60 — instant bonus in crypto or cashout. Fast payouts, elite odds, and a premium experience built for serious players.</p>
            <p className="promo-desc mb-8 max-w-lg">Join players who’ve already won over $250M on Betr. Our platform offers fast on-chain deposits, instant bonuses, and secure payouts — all wrapped in a premium black & purple design with smooth animations.</p>

            <div className="flex flex-wrap gap-4">
              <Link href="/register" className="promo-btn-primary">Claim $60</Link>
              <button onClick={() => setDepositOpen(true)} className="promo-btn-secondary">Deposit Now</button>
              <a href="#how" className="text-purple-300 underline ml-2 self-center">Learn how it works</a>
            </div>
          </div>

          <div className="glass-card p-8 rounded-2xl shadow-lg tilt-hover purple-glow">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-purple-200">Why BettR Feels Premium</h3>
              <p className="text-gray-300">Smooth animations, elevated UI, and performance focused—designed to make placing bets enjoyable and fast.</p>
            </div>

            <div id="features" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border border-purple-500/10 rounded-lg">
                <h4 className="font-bold text-purple-100">Instant Bonus</h4>
                <p className="text-gray-300 text-sm">Deposit $20, receive $60 instantly — no playthrough.</p>
              </div>
              <div className="p-4 border border-purple-500/10 rounded-lg">
                <h4 className="font-bold text-purple-100">Fast Payouts</h4>
                <p className="text-gray-300 text-sm">Fast, reliable payouts to your crypto wallet or card.</p>
              </div>
              <div className="p-4 border border-purple-500/10 rounded-lg">
                <h4 className="font-bold text-purple-100">Secure</h4>
                <p className="text-gray-300 text-sm">Industry-standard security and encrypted accounts.</p>
              </div>
              <div className="p-4 border border-purple-500/10 rounded-lg">
                <h4 className="font-bold text-purple-100">Elite Odds</h4>
                <p className="text-gray-300 text-sm">Competitive odds and market coverage for major sports.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section id="how" className="w-full py-14 px-6">
        <div className="max-w-4xl mx-auto text-center glass-card p-8 rounded-2xl">
          <h3 className="text-2xl font-bold text-purple-200 mb-4">How the $20 → $60 Bonus Works</h3>
          <p className="text-gray-300">Send $20 worth of supported crypto to your unique deposit address and receive an additional $60 credited to your account instantly. Use it to bet, or withdraw where supported. No playthrough required.</p>
        </div>
      </section>

      <footer className="w-full border-t border-purple-500/10 py-8 px-4 text-center text-gray-400 text-sm">
        <div className="max-w-4xl mx-auto">
          <p>© 2024 BETR Sports Betting. All rights reserved. Please gamble responsibly.</p>
          <p className="text-xs text-gray-500 mt-2">Not available in all jurisdictions. Terms apply.</p>
        </div>
      </footer>
    </div>
  );
}
