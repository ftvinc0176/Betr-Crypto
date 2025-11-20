"use client";

import Link from 'next/link';
import { useState } from 'react';
import SolanaDepositModal from '@/components/SolanaDepositModal';

export default function Home() {
  const [depositOpen, setDepositOpen] = useState(false);
  return (
    <div className="premium-gradient text-white min-h-screen relative overflow-hidden">
      <div className="top-ticker">
        <div className="ticker-scroll px-6">
          <div className="ticker-marquee">
            {/* sequence: $250M message + payouts message; duplicated for seamless scroll */}
            <span className="ticker-item">💎 $250M+ WON ON BETR</span>
            <span className="ticker-item">10,000X PAYOUTS</span>
            <span className="ticker-item">💎 $250M+ WON ON BETR</span>
            <span className="ticker-item">10,000X PAYOUTS</span>
            <span className="ticker-item">💎 $250M+ WON ON BETR</span>
            <span className="ticker-item">10,000X PAYOUTS</span>
            {/* duplicate sequence to fill second half for continuous animation */}
            <span className="ticker-item">💎 $250M+ WON ON BETR</span>
            <span className="ticker-item">10,000X PAYOUTS</span>
            <span className="ticker-item">💎 $250M+ WON ON BETR</span>
            <span className="ticker-item">10,000X PAYOUTS</span>
            <span className="ticker-item">💎 $250M+ WON ON BETR</span>
            <span className="ticker-item">10,000X PAYOUTS</span>
          </div>
        </div>
      </div>

      <nav className="w-full flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-3xl bg-black/70 backdrop-blur-md glass-card rounded-full px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-extrabold text-2xl text-white tracking-tight">betr</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/login" className="px-4 py-2 rounded-full border border-purple-600 text-purple-300 hover:bg-purple-900/20 transition">Log in</Link>
            <Link href="/register" className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold">Sign up</Link>
          </div>
        </div>
      </nav>

      {/* Decorative blobs */}
      <div className="absolute -right-40 -top-40 w-96 h-96 rounded-full bg-gradient-to-r from-purple-700/30 to-purple-400/20 blur-3xl opacity-70 spin-slow"></div>
      <div className="absolute -left-32 bottom-40 w-72 h-72 rounded-full bg-gradient-to-r from-indigo-900/30 to-purple-600/20 blur-2xl opacity-60 float-2"></div>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <span className="inline-block mb-6 px-4 py-1 border border-purple-500 rounded-full text-purple-300 text-sm">Picks New User Offer</span>

            <h1 className="font-extrabold tracking-tight text-[6.5rem] leading-[0.86] text-purple-400">DEPOSIT $20,</h1>
            <h1 className="font-extrabold tracking-tight text-[6.5rem] leading-[0.86] text-white mb-4">GET $60</h1>

            <p className="text-gray-300 text-lg mb-8 max-w-2xl">New users who deposit $20 get $60 in bonus crypto instantly — join players who’ve already won over $250M on Betr.</p>

            <div className="flex items-center gap-6 mb-12">
              <Link href="/register" className="px-10 py-4 rounded-full bg-purple-500 text-black font-bold shadow-lg">Claim free $60</Link>
              <button onClick={() => setDepositOpen(true)} className="px-8 py-4 rounded-full bg-black border border-purple-500 text-purple-300 font-semibold">Deposit Now</button>
            </div>

            {/* Featured logos like in screenshot */}
            <div className="w-full mt-8 border-t border-purple-500/10 pt-10">
              <div className="max-w-4xl mx-auto flex items-center justify-center gap-8 opacity-60">
                <img src="/logos/sbju.png" alt="SBJ" className="h-6 opacity-80" />
                <img src="/logos/fox.png" alt="FOX" className="h-6" />
                <img src="/logos/bloomberg.png" alt="Bloomberg" className="h-6" />
                <img src="/logos/espn.png" alt="ESPN" className="h-6" />
                <img src="/logos/cnbc.png" alt="CNBC" className="h-6" />
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
