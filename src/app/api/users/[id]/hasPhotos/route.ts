import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await connectToDatabase();
    const user = await User.findById(id).select('selfiePhoto idFrontPhoto idBackPhoto').lean().exec();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const hasAllPhotos = Boolean(
      user.selfiePhoto && user.selfiePhoto.trim() &&
      user.idFrontPhoto && user.idFrontPhoto.trim() &&
      user.idBackPhoto && user.idBackPhoto.trim()
    );
    return NextResponse.json({ hasAllPhotos }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}
