

"use client";
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyChargesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  // TODO: Fetch user and show charge verification UI

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-black rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4">Verify Card Charges</h2>
      <p className="mb-4">Please enter the two small charge amounts that appeared on your card statement to verify your card.</p>
      {/* Add form for charge amount verification here */}
      <form className="space-y-4">
        <div>
          <label>Charge Amount 1 ($):</label>
          <input type="number" step="0.01" min="0.01" max="1.00" className="input w-full" required />
        </div>
        <div>
          <label>Charge Amount 2 ($):</label>
          <input type="number" step="0.01" min="0.01" max="1.00" className="input w-full" required />
        </div>
        <button type="submit" className="btn btn-primary w-full">Submit</button>
      </form>
    </div>
  );
}

export default function VerifyChargesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyChargesContent />
    </Suspense>
  );
}
