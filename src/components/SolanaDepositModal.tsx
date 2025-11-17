"use client";
import { useState } from "react";
import SolanaLogo from "@/components/SolanaLogo";
import Image from "next/image";

const SOLANA_ADDRESS = "9GYVndh55JnCRcSBkZLfoTMFNFDuH1DR971CzgAauVnE";

export default function SolanaDepositModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-black rounded-2xl shadow-2xl p-8 w-full max-w-sm flex flex-col items-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-2xl">×</button>
        <SolanaLogo className="w-12 h-12 mb-4" />
        <h2 className="text-xl font-bold mb-2 text-white">Your Solana Address</h2>
        <Image src="/solana-qr.png" alt="Solana QR" width={160} height={160} className="mb-4 rounded" />
        <div className="bg-gray-900 rounded-lg px-4 py-2 mb-2 w-full text-center">
          <span className="font-mono text-sm text-purple-300 break-all">{SOLANA_ADDRESS}</span>
        </div>
        <button
          className="w-full bg-purple-400 text-black font-bold rounded-lg py-2 mb-2 flex items-center justify-center gap-2 hover:bg-purple-500 transition"
          onClick={() => navigator.clipboard.writeText(SOLANA_ADDRESS)}
        >
          <span>Copy</span>
        </button>
        <p className="text-xs text-gray-400 text-center mt-2">This address can only be used to receive compatible tokens. <a href="#" className="text-purple-400 underline">Learn more</a></p>
      </div>
    </div>
  );
}
