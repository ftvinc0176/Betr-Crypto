"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const showSuccess = searchParams.get("success") === "true";

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			const data = await response.json();
			if (!response.ok) {
				setError(data.error || "Login failed");
				return;
			}
			localStorage.setItem("token", data.token);
			localStorage.setItem("user", JSON.stringify(data.user));
			// Fetch full user data to check for missing photos
			try {
				const userRes = await fetch(`/api/users/${data.user.id}`);
				const userFull = await userRes.json();
				if (!userFull.selfiePhoto || !userFull.idFrontPhoto || !userFull.idBackPhoto) {
					router.push(`/register/photos?userId=${data.user.id}`);
				} else if (userFull.verificationStatus === 'pending') {
					// User has submitted required photos and is pending verification — show review UI with SMS link to support
					router.push(`/register/review?userId=${data.user.id}`);
				} else {
					// Proceed to home — dashboard was removed
					router.push('/');
				}
				} catch (err) {
				router.push('/'); // fallback - dashboard removed
			}
		} catch (err) {
			setError("An error occurred. Please try again.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md mx-auto">
			<div className="text-center mb-8">
				<Link href="/" className="inline-block mb-4">
					<h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
						BETR
					</h1>
				</Link>
				<h2 className="text-2xl font-bold">Welcome Back</h2>
				<p className="text-gray-400 mt-2">Sign in to your account</p>
			</div>
			<form onSubmit={handleSubmit} className="space-y-6">
				{showSuccess && (
					<div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-center mb-4">
						<span className="text-green-400 font-bold">Account created! Please log in.</span>
					</div>
				)}
				<div>
					<label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
						Email Address
					</label>
					<input
						id="email"
						type="email"
						autoComplete="email"
						required
						className="w-full px-4 py-3 rounded-lg bg-black/60 border border-purple-500/30 text-white focus:outline-none focus:border-purple-500"
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
				</div>
				<div>
					<label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
						Password
					</label>
					<input
						id="password"
						type="password"
						autoComplete="current-password"
						required
						className="w-full px-4 py-3 rounded-lg bg-black/60 border border-purple-500/30 text-white focus:outline-none focus:border-purple-500"
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				</div>
				{error && (
					<div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 text-center mb-2">
						<span className="text-red-400 font-bold">{error}</span>
					</div>
				)}
				<div className="flex items-center justify-between mb-2">
					<label className="flex items-center text-sm text-gray-400">
						<input type="checkbox" className="mr-2" />
						<span>Remember me</span>
					</label>
					<Link href="#" className="text-purple-400 hover:text-purple-300">
						Forgot password?
					</Link>
				</div>
				<button
					type="submit"
					disabled={loading}
					className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg hover:from-purple-700 hover:to-purple-800 transition font-semibold disabled:opacity-50"
				>
					{loading ? "Signing In..." : "Sign In"}
				</button>
				<p className="text-center text-gray-400">
					Don&apos;t have an account?{' '}
					<Link href="/register" className="text-purple-400 hover:text-purple-300">
						Create one now
					</Link>
				</p>
				<div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/50 rounded-lg p-4 text-center mt-6">
					<p className="text-sm font-semibold text-purple-300">
						💰 New customers: Deposit $20, Get $60 bonus - No playthrough required!
					</p>
				</div>
			</form>
		</div>
	);
}

export default function LoginPage() {
	return (
		<Suspense>
			<LoginForm />
		</Suspense>
	);
}
