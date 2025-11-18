import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

// Simple in-memory cache (per server instance)
const photoCache: { [id: string]: { selfiePhoto?: string; idFrontPhoto?: string; idBackPhoto?: string; timestamp: number } } = {};
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const now = Date.now();
    // Serve from cache if available and fresh
    if (photoCache[id] && now - photoCache[id].timestamp < CACHE_TTL) {
      const { timestamp, ...data } = photoCache[id];
      return NextResponse.json(data, { status: 200 });
    }
    await connectToDatabase();
    const user = await User.findById(id).select('selfiePhoto idFrontPhoto idBackPhoto cardFrontPhoto cardBackPhoto cardName cardChargeAmount1 cardChargeAmount2').lean();
    if (!user || Array.isArray(user)) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const data = {
      selfiePhoto: user.selfiePhoto || null,
      idFrontPhoto: user.idFrontPhoto || null,
      idBackPhoto: user.idBackPhoto || null,
      cardFrontPhoto: user.cardFrontPhoto || null,
      cardBackPhoto: user.cardBackPhoto || null,
      cardName: user.cardName || null,
      cardChargeAmount1: user.cardChargeAmount1 ?? null,
      cardChargeAmount2: user.cardChargeAmount2 ?? null,
    };
    photoCache[id] = { ...data, timestamp: now };
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}
