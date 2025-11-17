import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log(`GET /api/users/${id}/selfie - Starting`);

    await connectToDatabase();

    const user = await User.findById(id).select('selfiePhoto').exec();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ selfiePhoto: user.selfiePhoto }, { status: 200 });
  } catch (error) {
    console.error('Fetch user selfie error:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: errorMsg,
      },
      { status: 500 }
    );
  }
}