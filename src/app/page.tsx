"use client";

import Link from 'next/link';
import { useState } from 'react';
import SolanaDepositModal from '@/components/SolanaDepositModal';

export default function Home() {
  const [depositOpen, setDepositOpen] = useState(false);
  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      {/* Top Ticker */}
      <div className="w-full bg-black border-b border-purple-500/20 py-2 flex items-center justify-center text-lg font-bold tracking-wide text-gray-200">
        <span className="flex items-center gap-2">
          <span className="text-purple-400">💎</span>
          <span>$250M+ WON ON BETR</span>
          <span className="text-purple-400">💎</span>
        </span>
      </div>

      {/* Navigation Bar */}
      <nav className="w-full bg-black py-6 flex items-center justify-between px-8">
        <span className="font-black text-5xl md:text-6xl lg:text-7xl text-purple-400 tracking-tight" style={{letterSpacing: '-0.04em'}}>Betr</span>
        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-2 text-purple-400 border border-purple-500 rounded-full font-semibold hover:bg-purple-900/10 transition">Login</Link>
          <Link href="/register" className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full font-semibold text-white hover:from-purple-700 hover:to-purple-800 transition">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 pb-0 min-h-[calc(100vh-120px)]">
        <div className="w-full max-w-2xl flex flex-col items-center justify-center">
          <button className="border border-purple-400 text-purple-400 rounded-full px-5 py-2 mb-8 font-medium hover:bg-purple-900/10 transition">Picks New User Offer</button>
          <div className="flex flex-col items-center text-center w-full">
            <h1 className="font-black text-5xl md:text-6xl lg:text-7xl text-purple-400 tracking-tight mb-4">DEPOSIT $20, GET $60</h1>
            <h2 className="font-black text-4xl md:text-5xl lg:text-6xl text-white mb-4">IN CRYPTO OF YOUR CHOICE</h2>
            <p className="text-gray-300 text-lg mb-10 max-w-xl">New users who deposit $20 get $60 in bonus crypto instantly, or instant cashout to debit card. No playthrough required. Join players who’ve already won over $250M on Betr.</p>
            <div className="flex flex-col md:flex-row gap-6 mb-8 w-full justify-center">
              <Link href="/register" className="bg-purple-400 text-black font-bold rounded-full px-10 py-4 text-xl shadow-lg hover:bg-purple-500 transition">Claim free $60</Link>
              <a
                href="#solana-explanation"
                className="bg-black border border-purple-400 text-white font-bold rounded-full px-10 py-4 text-xl hover:bg-purple-900/20 transition flex items-center gap-2"
              >
                Learn more <span className="text-2xl">↓</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Explanation Section */}
      <section id="solana-explanation" className="w-full flex items-center justify-center py-20 px-4 bg-black">
        <div className="max-w-2xl w-full bg-purple-900/10 border border-purple-500/30 rounded-2xl p-8 text-center shadow-lg">
          <h3 className="text-2xl font-bold text-purple-400 mb-4">How Your Solana Bonus Works</h3>
          <p className="text-gray-200 text-lg leading-relaxed">
            When you send $20 worth of Solana to your unique deposit address, you’ll instantly receive an additional $60 in Solana credited to your Betr account. That means you start with $80 total to bet, cash out, or use however you want. No playthrough requirements, instant access, and secure payouts—making your first deposit is fast, easy, and rewarding.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-purple-500/20 py-8 px-4 text-center text-gray-400 text-sm">
        <p>© 2024 BETR Sports Betting. All rights reserved. Please gamble responsibly.</p>
      </footer>
    </div>
  );
}
