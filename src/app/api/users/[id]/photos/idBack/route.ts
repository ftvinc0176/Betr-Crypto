import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

const CACHE_TTL = 1000 * 60 * 5; // 5 minutes
const photoCache: { [id: string]: { data?: string; timestamp: number } } = {};

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const now = Date.now();
    if (photoCache[id] && now - photoCache[id].timestamp < CACHE_TTL && photoCache[id].data) {
      const raw = photoCache[id].data!;
      const base = raw.startsWith('data:') ? raw.split(',')[1] : raw;
      const buffer = Buffer.from(base, 'base64');
      return new Response(buffer, {
        headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=300' },
      });
    }

    await connectToDatabase();
    const user = await User.findById(id).select('idBackPhoto').lean();
    // Guard against unexpected shapes from `lean()` (arrays/null)
    if (!user || Array.isArray(user)) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const raw = (user as any).idBackPhoto || '';
    photoCache[id] = { data: raw, timestamp: now };
    if (!raw) return NextResponse.json({ error: 'No photo' }, { status: 204 });
    const base = raw.startsWith('data:') ? raw.split(',')[1] : raw;
    const buffer = Buffer.from(base, 'base64');
    return new Response(buffer, {
      headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=300' },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
