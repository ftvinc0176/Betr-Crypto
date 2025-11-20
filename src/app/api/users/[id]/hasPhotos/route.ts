import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await connectToDatabase();
    const user = await User.findById(id).select('selfiePhoto idFrontPhoto idBackPhoto').lean();
    if (!user || Array.isArray(user)) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const hasData = (v: any) => {
      if (v == null) return false;
      if (typeof v === 'string') return v.trim() !== '';
      if (Buffer.isBuffer(v)) return v.length > 0;
      return true;
    };
    const hasAllPhotos = Boolean(hasData(user.selfiePhoto) && hasData((user as any).idFrontPhoto) && hasData((user as any).idBackPhoto));
    return NextResponse.json({ hasAllPhotos }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}
