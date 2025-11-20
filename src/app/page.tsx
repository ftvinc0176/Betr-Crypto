"use client";

import React from "react";

export default function TestDeployHome() {
	return (
		<main className="min-h-screen flex items-center justify-center bg-black text-white">
			<div className="text-center px-6">
				<h1 className="text-6xl font-extrabold text-purple-400 tracking-tight">TEST DEPLOY HOME</h1>
				<p className="mt-4 text-lg text-gray-300">This is a temporary test homepage. If you see this, the test deploy succeeded.</p>
				<p className="mt-2 text-sm text-gray-400">Commit will be reverted after verification.</p>
			</div>
		</main>
	);
}

