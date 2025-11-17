import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

// In-memory cache
let usersCache: any[] = [];
let cacheTimestamp = 0;
const CACHE_DURATION = 60000; // 60 seconds

export async function GET() {
  try {
    const startTime = Date.now();
    console.log(`[${new Date().toISOString()}] GET /api/users - Starting`);

    // Check cache first
    if (usersCache.length > 0 && Date.now() - cacheTimestamp < CACHE_DURATION) {
      console.log(`[${new Date().toISOString()}] Returning cached users (${usersCache.length} users)`);
      return NextResponse.json(usersCache, { status: 200 });
    }

    await connectToDatabase();
    console.log(`[${new Date().toISOString()}] Database connected (${Date.now() - startTime}ms)`);

    const queryStart = Date.now();
    console.log(`[${new Date().toISOString()}] Executing User.find() query...`);
    
    // Optimized query with specific fields only
    const users = await User.find(
      {},
      {
        password: 0,
        selfiePhoto: 0,
        idFrontPhoto: 0,
        idBackPhoto: 0,
      }
    )
      .sort({ createdAt: -1 })
      .maxTimeMS(30000)
      .lean()
      .exec();
    
    console.log(`[${new Date().toISOString()}] Query complete. Found ${users.length} users (${Date.now() - queryStart}ms)`);
    
    // Update cache
    usersCache = users;
    cacheTimestamp = Date.now();
    
    console.log(`[${new Date().toISOString()}] Total time: ${Date.now() - startTime}ms`);
    
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Fetch users error:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Error details:', errorMsg);
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: errorMsg,
      },
      { status: 500 }
    );
  }
}
