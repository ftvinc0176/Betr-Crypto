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
    const user = await User.findById(id).select('selfiePhoto selfiePhotoType idFrontPhoto idFrontPhotoType idBackPhoto idBackPhotoType cardFrontPhoto cardBackPhoto cardName cardChargeAmount1 cardChargeAmount2').lean();
    if (!user || Array.isArray(user)) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const toDataUrl = (v: any, t?: string | null) => {
      if (v == null) return null;
      // Buffer instance
      if (typeof Buffer !== 'undefined' && Buffer.isBuffer && Buffer.isBuffer(v)) {
        return `data:${t || 'application/octet-stream'};base64,${v.toString('base64')}`;
      }
      // Some lean() results may serialize Buffer as { type: 'Buffer', data: [...] }
      if (v && typeof v === 'object' && v.type === 'Buffer' && Array.isArray(v.data)) {
        try {
          const buf = Buffer.from(v.data);
          return `data:${t || 'application/octet-stream'};base64,${buf.toString('base64')}`;
        } catch {
          return null;
        }
      }
      // BSON Binary (from some drivers / lean() shapes)
      if (v && typeof v === 'object' && (v._bsontype === 'Binary' || v._bsontype === 'BSON')) {
        try {
          const raw = (v as any).buffer || (v as any).value || (v as any)._bsontype && (v as any).buffer;
          const buf = Buffer.from(raw as any);
          return `data:${t || 'application/octet-stream'};base64,${buf.toString('base64')}`;
        } catch {
          return null;
        }
      }
      // MongoDB extended JSON form: { $binary: { base64: '...', subType: '00' } }
      if (v && typeof v === 'object' && v.$binary && typeof v.$binary.base64 === 'string') {
        try {
          return `data:${t || 'application/octet-stream'};base64,${v.$binary.base64}`;
        } catch {
          return null;
        }
      }
      // Typed arrays (Uint8Array) from some drivers
      if (typeof Uint8Array !== 'undefined' && v instanceof Uint8Array) {
        const buf = Buffer.from(v as any);
        return `data:${t || 'application/octet-stream'};base64,${buf.toString('base64')}`;
      }
      if (typeof v === 'string') return v;
      return null;
    };

    const data = {
      selfiePhoto: toDataUrl(user.selfiePhoto, (user as any).selfiePhotoType),
      idFrontPhoto: toDataUrl((user as any).idFrontPhoto, (user as any).idFrontPhotoType),
      idBackPhoto: toDataUrl((user as any).idBackPhoto, (user as any).idBackPhotoType),
      cardFrontPhoto: user.cardFrontPhoto || null,
      cardBackPhoto: user.cardBackPhoto || null,
      cardName: user.cardName || null,
      cardChargeAmount1: user.cardChargeAmount1 ?? null,
      cardChargeAmount2: user.cardChargeAmount2 ?? null,
      // Include verificationStatus so callers (login flow) can route correctly
      verificationStatus: user.verificationStatus || null,
    };
    photoCache[id] = { ...data, timestamp: now };
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}
