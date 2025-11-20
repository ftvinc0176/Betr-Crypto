"use client";
import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const smsNumber = "404-997-4217";
  const smsHref = `sms:${smsNumber.replace(/[^\d+]/g, "")}`;

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Account Under Review</h2>
        <p className="text-gray-400 mb-4">Thanks — your ID and selfie have been submitted for review. Our team will verify your account shortly.</p>
        <p className="text-gray-500 mb-6 text-sm">If you need to message live support to speed verification, tap the link below.</p>
        <div className="flex flex-col gap-4 items-center">
          <a
            href={smsHref}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg text-white font-semibold"
          >
            Message Live Support: {smsNumber}
          </a>
          <button
            className="px-6 py-3 bg-transparent border border-purple-500/30 rounded-lg text-purple-300 font-semibold"
            onClick={() => router.push('/login')}
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
}
