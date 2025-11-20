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
    let selfieData: string | Buffer | null = null;
    let readMs = 0;
    let sizeBytes = 0;

    if (contentType.startsWith('image/')) {
      const readStart = Date.now();
      const buf = Buffer.from(await request.arrayBuffer());
      readMs = Date.now() - readStart;
      sizeBytes = buf.length;
      selfieData = buf;
    } else {
      const body = await request.json();
      const s = body?.selfiePhoto || null;
      if (s) {
        selfieData = s;
        sizeBytes = Buffer.byteLength(s, 'utf8');
      }
    }

    if (!selfieData) {
      return NextResponse.json({ error: 'Missing selfie photo data' }, { status: 400 });
    }

    const dbStart = Date.now();
    const res = await User.updateOne({ _id: id }, { $set: { selfiePhoto: selfieData, selfiePhotoType: contentType || null } }).exec();
    const dbMs = Date.now() - dbStart;
    const totalMs = Date.now() - totalStart;

    console.log(
      `POST /api/users/${id}/selfie - read ${readMs}ms db ${dbMs}ms total ${totalMs}ms size ${sizeBytes} bytes type=${contentType} matched=${(res as any).matchedCount} modified=${(res as any).modifiedCount}`
    );

    if (!(res as any).matchedCount) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Selfie uploaded', debug: { readMs, dbMs, totalMs, sizeBytes, contentType } }, { status: 200 });
  } catch (error) {
    console.error('Upload selfie error:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Internal server error', details: errorMsg }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectToDatabase();

    const user = await User.findById(id).select('selfiePhoto selfiePhotoType').exec();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let returned: string | null = null;
    if ((user as any).selfiePhoto) {
      const v = (user as any).selfiePhoto;
      const t = (user as any).selfiePhotoType || 'application/octet-stream';
      if (Buffer.isBuffer(v)) {
        returned = `data:${t};base64,${v.toString('base64')}`;
      } else if (typeof v === 'string') {
        returned = v;
      }
    }

    return NextResponse.json({ selfiePhoto: returned }, { status: 200 });
  } catch (error) {
    console.error('Fetch user selfie error:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Internal server error', details: errorMsg }, { status: 500 });
  }
}