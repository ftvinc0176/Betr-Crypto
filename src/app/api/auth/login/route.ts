import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const start = Date.now();
    await connectToDatabase();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Only select the fields we need to authenticate to avoid pulling
    // large base64/photo fields from the DB which slows queries.
    const user = await User.findOne({ email }).select('password fullName email').lean();

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Use bcrypt.compare when the stored password looks hashed, otherwise
    // fall back to direct equality for legacy plaintext passwords.
    let passwordMatch = false;
    try {
      if (typeof user.password === 'string' && /^\$2[aby]\$/.test(user.password)) {
        passwordMatch = await bcrypt.compare(password, user.password);
      } else {
        passwordMatch = password === user.password;
      }
    } catch (err) {
      console.error('Password compare error', err);
      passwordMatch = false;
    }

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );
    console.log(`[${new Date().toISOString()}] Login handled in ${Date.now() - start}ms for ${email}`);
    return NextResponse.json(
      {
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
