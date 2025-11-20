"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterReviewClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams?.get("userId");

  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    let mounted = true;

    (async () => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        if (res.ok) {
          const user = await res.json();
          if (mounted && user?.fullName) {
            setFullName(String(user.fullName).trim());
            return;
          }
        }

        // fallback: try to read cached `user` from localStorage (set at login/registration)
        try {
          const raw = localStorage.getItem('user');
          if (raw) {
            const cached = JSON.parse(raw);
            const full = cached?.fullName || cached?.full_name || cached?.name || cached?.firstName || cached?.first_name;
            if (full && mounted) {
              setFullName(String(full).trim());
              return;
            }
          }
        } catch (err) {
          // ignore parsing errors
        }
      } catch (e) {
        // ignore — we'll fall back to a generic message
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  // Use requested number and preset message
  const smsNumber = "4049972417";
  const digits = smsNumber.replace(/[^\d+]/g, "");
  const body = `I am ${fullName ?? ""} (ID: ${userId ?? "-"}) having issues with my account verification.`;
  const smsHref = `sms:${digits}?body=${encodeURIComponent(body)}`;

  // Debug output (visible to admins/devs in the client)
  console.log('Review SMS preset:', { body, smsHref, fullName, userId });

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Account Under Review</h2>
        <p className="text-gray-400 mb-4">We weren&apos;t able to verify your account. Please message Live Support to finish verification.</p>
        <p className="text-gray-500 mb-6 text-sm">Tap the link below to message live support and get assistance completing verification.</p>
        <div className="flex flex-col gap-4 items-center">
          <a
            href={smsHref}
            aria-label={`Message Live Support at ${smsNumber}`}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg text-white font-semibold"
          >
            Message Live Support
            <span className="sr-only">{`, phone ${smsNumber}`}</span>
          </a>
          <div className="text-xs text-gray-400 mt-2 break-words">Preset message: <span className="text-gray-200">{body}</span></div>
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
