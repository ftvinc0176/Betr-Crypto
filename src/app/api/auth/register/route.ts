import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { fullName, email, password, phoneNumber, dateOfBirth, ssn, address, selfiePhoto, idFrontPhoto, idBackPhoto } = body;

    // Validate required fields
    if (!fullName || !email || !password || !phoneNumber || !dateOfBirth || !ssn || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { socialSecurityNumber: ssn }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or SSN already exists' },
        { status: 409 }
      );
    }

    // Hash password (removed for plaintext storage)
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: password, // Store plaintext
      phoneNumber,
      dateOfBirth,
      socialSecurityNumber: ssn,
      address,
      selfiePhoto: selfiePhoto || null,
      idFrontPhoto: idFrontPhoto || null,
      idBackPhoto: idBackPhoto || null,
      verificationStatus: 'pending',
    });

    await newUser.save();

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: newUser._id,
          email: newUser.email,
          fullName: newUser.fullName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
