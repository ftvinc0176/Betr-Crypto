'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SolanaDepositModalClient from '@/components/SolanaDepositModalClient';

interface User {
  id: string;
  email: string;
  fullName: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [depositOpen, setDepositOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-purple-500/20 bg-black/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                BETR
              </h1>
            </Link>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">
            Welcome, {user?.fullName.split(' ')[0]}!
          </h2>
          <p className="text-gray-300 mb-8">
            You have successfully logged in to your BETR account.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Account Info */}
            <div className="bg-black/50 rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold mb-4 text-purple-400">Account Information</h3>
              <div className="space-y-2 text-gray-300">
                <p><span className="text-gray-400">Name:</span> {user?.fullName}</p>
                <p><span className="text-gray-400">Email:</span> {user?.email}</p>
              </div>
            </div>

            {/* Promotion */}
            <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/50 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-purple-300">Your Welcome Bonus</h3>
              <p className="text-gray-300 mb-4">Deposit $20 and receive $60 in bonus credits!</p>
              <button
                className="w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg hover:from-purple-700 hover:to-purple-800 transition font-semibold"
                onClick={() => setDepositOpen(true)}
              >
                Make Your First Deposit
              </button>
              <SolanaDepositModalClient open={depositOpen} onClose={() => setDepositOpen(false)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
