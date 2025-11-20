import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

// This API route is dynamic (uses the incoming request URL for pagination)
// and should not be statically exported during `next build`.
export const dynamic = 'force-dynamic';

// In-memory cache
let usersCache: any[] = [];
let cacheTimestamp = 0;
const CACHE_DURATION = 60000; // 60 seconds

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    console.log(`[${new Date().toISOString()}] GET /api/users - Starting`);

    // Try to use cache if available
    if (usersCache.length > 0 && Date.now() - cacheTimestamp < CACHE_DURATION) {
      console.log(`[${new Date().toISOString()}] Returning cached users (${usersCache.length} users)`);
      return NextResponse.json(usersCache, { status: 200 });
    }

    await connectToDatabase();
    console.log(`[${new Date().toISOString()}] Database connected (${Date.now() - startTime}ms)`);

    const queryStart = Date.now();
    console.log(`[${new Date().toISOString()}] Executing lightweight aggregation for users...`);

    // Support pagination for admin grid to avoid fetching all users at once.
    const url = new URL(request.url);
    const page = Math.max(0, parseInt(url.searchParams.get('page') || '0', 10));
    const limit = Math.min(200, Math.max(10, parseInt(url.searchParams.get('limit') || '50', 10)));
    const skip = page * limit;

    // Aggregation projects boolean flags for photo presence without returning
    // the potentially large base64 strings themselves.
    const pipeline: any[] = [
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          fullName: 1,
          email: 1,
          phoneNumber: 1,
          dateOfBirth: 1,
          socialSecurityNumber: 1,
          address: 1,
          verificationStatus: 1,
          createdAt: 1,
          hasSelfie: { $cond: [{ $ne: ['$selfiePhoto', null] }, true, false] },
          hasIdFront: { $cond: [{ $ne: ['$idFrontPhoto', null] }, true, false] },
          hasIdBack: { $cond: [{ $ne: ['$idBackPhoto', null] }, true, false] },
        },
      },
    ];

    const users = await User.aggregate(pipeline).option({ maxTimeMS: 30000 }).exec();

    // Also get a total count for pagination
    const total = await User.countDocuments().exec();

    const lightweight = users.map((u: any) => ({
      _id: u._id,
      fullName: u.fullName,
      email: u.email,
      phoneNumber: u.phoneNumber,
      dateOfBirth: u.dateOfBirth,
      socialSecurityNumber: u.socialSecurityNumber,
      address: u.address,
      verificationStatus: u.verificationStatus,
      createdAt: u.createdAt,
      hasSelfie: !!u.hasSelfie,
      hasIdFront: !!u.hasIdFront,
      hasIdBack: !!u.hasIdBack,
    }));

    // Return the lightweight page
    usersCache = lightweight as any[];
    cacheTimestamp = Date.now();

    console.log(`[${new Date().toISOString()}] Returning lightweight users page=${page} limit=${limit} (${lightweight.length} users)`);
    console.log(`[${new Date().toISOString()}] Query complete. Retrieved ${users.length} users (${Date.now() - queryStart}ms)`);
    console.log(`[${new Date().toISOString()}] Total time: ${Date.now() - startTime}ms`);

    return NextResponse.json({ users: lightweight, page, limit, total }, { status: 200 });
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
