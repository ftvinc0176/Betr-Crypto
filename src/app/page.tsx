"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import SolanaDepositModal from '@/components/SolanaDepositModal';

export default function Home() {
  const [depositOpen, setDepositOpen] = useState(false);
  // 10 minute timer (600 seconds) that starts on each page load and counts down
  const [secondsLeft, setSecondsLeft] = useState<number>(600);

  function pad(n: number) {
    return n.toString().padStart(2, '0');
  }

  // Start countdown on mount; reset to 600 on refresh (mount)
  useEffect(() => {
    setSecondsLeft(600);
    const iv = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 0) {
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);
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

      
        <nav className="w-full">
          {/* Mobile compact nav */}
          <div className="sm:hidden w-full flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
              <div className="w-10 h-8 rounded-full bg-black/60 flex items-center justify-center border border-purple-800">
                <span className="text-white font-bold">⚡</span>
              </div>
              <span className="font-bold text-white">Betr</span>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/login" className="px-3 py-2 rounded-full border border-purple-600 text-purple-300 text-sm">Log in</Link>
              <Link href="/register" className="px-3 py-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm">Sign up</Link>
            </div>
          </div>

          {/* Desktop centered pill nav */}
          <div className="hidden sm:flex w-full items-center justify-center px-4 py-6">
            <div className="w-full max-w-3xl bg-black/70 backdrop-blur-md glass-card rounded-full px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-extrabold text-2xl text-white tracking-tight">Betr</span>
              </div>
            
              <div className="flex items-center gap-4">
                <Link href="/login" className="px-4 py-2 rounded-full border border-purple-600 text-purple-300 hover:bg-purple-900/20 transition">Log in</Link>
                <Link href="/register" className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold">Sign up</Link>
              </div>
            </div>
          </div>
        </nav>

      {/* Decorative blobs */}
      <div className="absolute -right-40 -top-40 w-96 h-96 rounded-full bg-gradient-to-r from-purple-700/30 to-purple-400/20 blur-3xl opacity-70 spin-slow"></div>
      <div className="absolute -left-32 bottom-40 w-72 h-72 rounded-full bg-gradient-to-r from-indigo-900/30 to-purple-600/20 blur-2xl opacity-60 float-2"></div>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <span className="inline-block mb-6 px-4 py-1 border border-purple-500 rounded-full text-purple-300 text-sm">Frank invited you to Betr!</span>

              <h1 className="promo-headline text-purple-400">DEPOSIT $20,</h1>
              <h2 className="promo-headline text-white mb-4">GET $60</h2>

            <p className="text-gray-300 text-lg mb-8 max-w-2xl">New users who deposit $20 receive $60 in bonus crypto instantly. Join players who&apos;ve already won more than $250M on Betr.</p>

              <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
                <Link href="/register" className="w-full sm:w-auto px-8 py-4 rounded-full bg-purple-500 text-black font-bold shadow-lg text-center">
                  {`Sign up (${Math.floor(secondsLeft / 60)}:${pad(secondsLeft % 60)})`}
                </Link>
              </div>

            {/* partner logos removed per request */}
          </div>
        </div>
      </main>

      {/* Bonus explanation removed per request */}

      <footer className="w-full border-t border-purple-500/10 py-8 px-4 text-center text-gray-400 text-sm">
        <div className="max-w-4xl mx-auto">
          <p>© 2025 BETR Sports Betting. All rights reserved. Please gamble responsibly.</p>
          <p className="text-xs text-gray-500 mt-2">Not available in all jurisdictions. Terms apply.</p>
        </div>
      </footer>
    </div>
  );
}
