import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log(`GET /api/users/${id} - Starting`);

    await connectToDatabase();

    const user = await User.findById(id).exec();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user.toObject(), { status: 200 });
  } catch (error) {
    console.error('Fetch user error:', error);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log(`DELETE /api/users/${id} - Starting`);

    await connectToDatabase();

    const deletedUser = await User.findByIdAndDelete(id).exec();

    if (!deletedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete user error:', error);
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
