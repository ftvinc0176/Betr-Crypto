import React, { Suspense } from "react";
import RegisterReviewClient from "./Client";

export default function RegisterReviewPage() {
  return (
    <Suspense fallback={<div className="bg-black text-white min-h-screen flex items-center justify-center px-4 py-8">Loading…</div>}>
      <RegisterReviewClient />
    </Suspense>
  );
}
