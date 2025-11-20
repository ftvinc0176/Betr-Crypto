import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ error: 'Card photo uploads are no longer supported.' }, { status: 410 });
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ error: 'Card photo uploads are no longer supported.' }, { status: 410 });
}
