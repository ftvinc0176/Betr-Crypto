import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await connectToDatabase();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });
    }

    const results = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $project: {
          _id: 1,
          fullName: 1,
          verificationStatus: 1,
          hasSelfie: { $cond: [{ $and: [{ $ne: ['$selfiePhoto', null] }, { $ne: ['$selfiePhoto', ''] }] }, true, false] },
          hasIdFront: { $cond: [{ $and: [{ $ne: ['$idFrontPhoto', null] }, { $ne: ['$idFrontPhoto', ''] }] }, true, false] },
          hasIdBack: { $cond: [{ $and: [{ $ne: ['$idBackPhoto', null] }, { $ne: ['$idBackPhoto', ''] }] }, true, false] },
        },
      },
    ]).exec();

    if (!results || results.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(results[0], { status: 200 });
  } catch (error) {
    console.error('Flags fetch error:', error);
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}
