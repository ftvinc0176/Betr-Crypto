import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectToDatabase();
    const body = await request.json();
    const { idBackPhoto } = body;
    if (!idBackPhoto) {
      return NextResponse.json(
        { error: 'Missing ID back photo data' },
        { status: 400 }
      );
    }
    const user = await User.findByIdAndUpdate(
      id,
      { idBackPhoto },
      { new: true }
    ).exec();
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: 'ID back photo uploaded', idBackPhoto: user.idBackPhoto },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload ID back error:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Internal server error', details: errorMsg },
      { status: 500 }
    );
  }
}