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

    const totalStart = Date.now();
    const contentType = request.headers.get('content-type') || '';
    let idFrontData: string | Buffer | null = null;
    let readMs = 0;
    let sizeBytes = 0;
    if (contentType.startsWith('image/')) {
      const readStart = Date.now();
      const buf = Buffer.from(await request.arrayBuffer());
      readMs = Date.now() - readStart;
      sizeBytes = buf.length;
      idFrontData = buf;
    } else {
      const body = await request.json();
      const s = body?.idFrontPhoto || null;
      if (s) {
        idFrontData = s;
        sizeBytes = Buffer.byteLength(s, 'utf8');
      }
    }

    if (!idFrontData) {
      return NextResponse.json({ error: 'Missing ID front photo data' }, { status: 400 });
    }

    const dbStart = Date.now();
    const res = await User.updateOne({ _id: id }, { $set: { idFrontPhoto: idFrontData, idFrontPhotoType: contentType || null } }).exec();
    const dbMs = Date.now() - dbStart;
    const totalMs = Date.now() - totalStart;
    console.log(`POST /api/users/${id}/idFront - read ${readMs}ms db ${dbMs}ms total ${totalMs}ms size ${sizeBytes} bytes type=${contentType} matched=${(res as any).matchedCount} modified=${(res as any).modifiedCount}`);
    if (!(res as any).matchedCount) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'ID front uploaded', debug: { readMs, dbMs, totalMs, sizeBytes, contentType } }, { status: 200 });
  } catch (error) {
    console.error('Upload ID front error:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Internal server error', details: errorMsg },
      { status: 500 }
    );
  }
}