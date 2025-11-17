# BETR Sports Betting Platform - Setup Guide

## 📋 Prerequisites

Before getting started, ensure you have:
- Node.js 18+ installed (download from https://nodejs.org)
- npm (comes with Node.js)
- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
- Git (optional but recommended)

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/betr?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
```

**To get your MongoDB URI:**
1. Go to MongoDB Atlas (https://cloud.mongodb.com)
2. Create a free account or sign in
3. Create a new cluster (M0 free tier)
4. Click "Connect" and select "Connect your application"
5. Copy the connection string and replace `<password>` with your password

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Features & Pages

### Home Page (`/`)
- Premium black/purple design
- $20 → $60 bonus promotion
- Login/Register navigation buttons
- Feature highlights

### Registration (`/register`)
**5-Step Form:**
1. **Personal Info** - Full Name, Date of Birth
2. **Contact Info** - Email, Phone Number  
3. **Address** - Street Address
4. **Security** - SSN, Password, Confirm Password
5. **ID Verification** - Front & Back ID Photos

**Validation:**
- All fields required
- Email uniqueness enforced
- SSN uniqueness enforced
- Password minimum 6 characters
- SSN must be 9 digits
- Passwords must match

### Login (`/login`)
- Email/Password authentication
- JWT token generation (24h expiry)
- Automatic redirect to dashboard

### Dashboard (`/dashboard`)
- Protected route (requires login)
- User account information
- Welcome bonus display
- Logout functionality

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  fullName: "John Zachary Scott Butler",
  email: "icpzak323@gmail.com",
  phoneNumber: "2486886946",
  password: "bcryptHash...", // Never stored plain
  dateOfBirth: "1998-03-23",
  ssn: "362231066",
  address: "26679 Alray st, CHESTERFIELD, MI 48051",
  idFrontPhoto: "data:image/jpeg;base64,...", // Base64 encoded
  idBackPhoto: "data:image/jpeg;base64,...",
  verificationStatus: "pending", // or "verified", "failed"
  createdAt: ISODate("2025-11-17..."),
  updatedAt: ISODate("2025-11-17...")
}
```

## 🔧 Available Scripts

### Development
```bash
npm run dev
```
Runs the development server with hot-reload on http://localhost:3000

### Build for Production
```bash
npm run build
```
Creates optimized production build

### Start Production Server
```bash
npm start
```
Runs the production server (requires `npm run build` first)

### Linting
```bash
npm run lint
```
Checks code quality with ESLint

## 🔐 Authentication Flow

1. **Registration**: 
   - User completes 5-step form
   - Data sent to `/api/auth/register`
   - Password hashed with bcryptjs (10 salt rounds)
   - User saved to MongoDB
   - Redirect to login with success message

2. **Login**:
   - User enters email/password
   - Credentials verified against database
   - JWT token generated (24h expiry)
   - Token stored in localStorage
   - Redirect to dashboard

3. **Protected Routes**:
   - Dashboard checks for user data in localStorage
   - No valid user → redirect to login
   - Valid user → display dashboard

## 📤 Migrating Existing Users (21 Users)

If you have existing users to migrate:

```bash
# Create a migration file: migrate-users.js
```

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';

const existingUsers = [
  // Your 21 users here
  {
    fullName: "Zachary Scott Butler",
    email: "icpzak323@gmail.com",
    phoneNumber: "2486886946",
    password: "Its12345", // Will be hashed
    dateOfBirth: "1998-03-23",
    ssn: "362231066",
    address: "26679 Alray st, CHESTERFIELD, MI 48051",
    idFrontPhoto: null,
    idBackPhoto: null,
    verificationStatus: "pending"
  }
  // ... 20 more users
];

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const hashedUsers = await Promise.all(
    existingUsers.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    }))
  );
  
  await User.insertMany(hashedUsers);
  console.log('✓ Users migrated successfully');
  
  await mongoose.disconnect();
}

migrate().catch(console.error);
```

Run migration:
```bash
node migrate-users.js
```

## 🌐 API Reference

### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+1-555-0000",
  "password": "SecurePass123",
  "dateOfBirth": "1990-01-15",
  "ssn": "123456789",
  "address": "123 Main St, City, State 12345",
  "idFrontPhoto": "data:image/jpeg;base64,...",
  "idBackPhoto": "data:image/jpeg;base64,..."
}

Response (201):
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "fullName": "John Doe"
  }
}
```

### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response (200):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "fullName": "John Doe"
  }
}
```

### Get All Users
```
GET /api/users

Response (200):
{
  "count": 21,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com",
      "verificationStatus": "pending",
      "createdAt": "2025-11-17T12:00:00Z"
      // password field excluded
    }
    // ... more users
  ]
}
```

## 🚀 Deployment on Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 2. Deploy to Vercel
1. Visit https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Click "Deploy"

### 3. Add Environment Variables
1. Go to project settings
2. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key

### 4. Redeploy
The site will automatically redeploy with environment variables.

## 🎨 Customization

### Change Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: '#000000',      // Black
  secondary: '#8B5CF6',    // Purple
  accent: '#A78BFA',       // Light Purple
}
```

### Add New Registration Fields
1. Update `STEPS` array in `src/app/register/page.tsx`
2. Add field to form rendering
3. Update User model in `src/models/User.ts`
4. Update registration API in `src/app/api/auth/register/route.ts`

### Modify Promotion Amount
Edit text in `src/app/page.tsx` and `src/app/register/page.tsx`

## 📊 Monitoring

### Check MongoDB Connection
```bash
npm run dev
# Look for: "MongoDB connected successfully"
```

### View Database
1. MongoDB Atlas Dashboard
2. Collections → betr → users
3. Browse user documents

## ❌ Troubleshooting

### Dependencies Not Installing
```bash
rm -rf node_modules package-lock.json
npm install
```

### MongoDB Connection Error
- Check `.env.local` has correct `MONGODB_URI`
- Verify IP address is whitelisted in MongoDB Atlas
- Ensure MongoDB cluster is running

### Port 3000 Already In Use
```bash
npm run dev -- -p 3001
```

### TypeScript Errors
```bash
npm run lint -- --fix
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Mongoose Guide](https://mongoosejs.com)
- [JWT.io](https://jwt.io)

## 🆘 Support

For issues:
1. Check this guide's troubleshooting section
2. Review `.github/copilot-instructions.md`
3. Check error messages in browser console (F12)
4. Review server logs in terminal

## ✅ Project Checklist

- [x] Next.js 14 with TypeScript
- [x] Tailwind CSS styling
- [x] MongoDB integration with Mongoose
- [x] User authentication (JWT)
- [x] Password hashing (bcryptjs)
- [x] 5-step registration form
- [x] Login system
- [x] Protected dashboard
- [x] API routes for auth
- [x] Responsive design
- [x] Black/purple premium theme
- [x] Vercel deployment ready

## 📝 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Configure `.env.local`
3. ✅ Run dev server: `npm run dev`
4. ✅ Test registration/login
5. ✅ Migrate existing users
6. ✅ Deploy to Vercel
