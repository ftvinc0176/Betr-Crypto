import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { fullName, email, password, phoneNumber, dateOfBirth, ssn, address } = body;

    // Validate required fields (text only)
    if (!fullName || !email || !password || !phoneNumber || !dateOfBirth || !ssn || !address) {
      console.error('Registration validation error: Missing required fields', { body });
      return NextResponse.json(
        { error: 'Please fill in all required fields: Full Name, Email, Password, Phone Number, Date of Birth, SSN, and Address.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    let existingUser;
    try {
      existingUser = await User.findOne({
        $or: [{ email }, { socialSecurityNumber: ssn }],
      });
    } catch (dbFindError) {
      console.error('Database error during user existence check:', dbFindError, { body });
      return NextResponse.json(
        { error: 'Unable to check for existing users due to a database error. Please try again later.' },
        { status: 500 }
      );
    }

    if (existingUser) {
      console.error('Registration error: Duplicate user', { email, ssn });
      return NextResponse.json(
        { error: 'A user with this email or SSN already exists. Please use a different email or SSN.' },
        { status: 409 }
      );
    }

    // Hash password (removed for plaintext storage)
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    let newUser;
    try {
      newUser = new User({
        fullName,
        email,
        password: password, // Store plaintext
        phoneNumber,
        dateOfBirth,
        socialSecurityNumber: ssn,
        address,
        selfiePhoto: null,
        idFrontPhoto: null,
        idBackPhoto: null,
        verificationStatus: 'pending',
      });
      await newUser.save();
    } catch (dbSaveError) {
      console.error('Database error during user creation:', dbSaveError, { body });
      let errorMsg = 'Unable to create user due to a database error. Please try again later.';
      if ((dbSaveError as any)?.code === 11000) {
        errorMsg = 'A user with this email or SSN already exists. Please use a different email or SSN.';
      }
      return NextResponse.json(
        { error: errorMsg },
        { status: 500 }
      );
    }

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
    console.error('Registration unexpected error:', error);
    let errorMsg = 'An unexpected error occurred during registration. Please try again later.';
    if (error instanceof Error && error.message) {
      errorMsg += ` (${error.message})`;
    }
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
