# Betr Sports Betting Platform - Project Instructions

## Project Overview
BETR is a premium sports betting website featuring a black and purple theme with a deposit promotion ($20 get $60, no playthrough required), user authentication system, and comprehensive multi-step registration form. The platform connects to MongoDB with support for existing users.

## Tech Stack
- Frontend: Next.js 14, React 18, TypeScript
- Styling: Tailwind CSS
- Database: MongoDB with Mongoose
- Authentication: JWT + bcryptjs
- Deployment: Ready for Vercel

## Key Features Implemented
1. Premium home page with hero section and promotion display
2. 5-step registration form (one field group per step) collecting:
   - Step 1: Full Name, Date of Birth
   - Step 2: Email, Phone Number
   - Step 3: Street Address
   - Step 4: SSN, Password (with confirmation)
   - Step 5: ID Front & Back Photos
3. Login system with JWT authentication
4. Protected dashboard showing user info
5. MongoDB integration with full user management
6. Responsive black/purple premium theme

## Environment Setup
Create `.env.local` with:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/betr?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars_recommended
```

## User Schema
```typescript
{
  fullName: String (required)
  email: String (required, unique)
  phoneNumber: String (required)
  password: String (required, hashed with bcryptjs)
  dateOfBirth: String (required)
  ssn: String (required, unique)
  address: String (required)
  idFrontPhoto: String (base64 image data)
  idBackPhoto: String (base64 image data)
  verificationStatus: String (enum: 'pending', 'verified', 'failed')
  createdAt: Date
  updatedAt: Date
}
```

## Common Tasks
- **Add new fields to registration**: Update STEPS array and field rendering in `src/app/register/page.tsx`, update User model, and update API validation
- **Modify theme colors**: Edit `tailwind.config.ts` color values (primary: black, secondary: purple #8B5CF6, accent: #A78BFA)
- **Deploy to Vercel**: Push to GitHub, connect repo to Vercel, add MONGODB_URI and JWT_SECRET env vars, deploy
- **Migrate existing users**: Use MongoDB bulk insert with password hashing:
  ```javascript
  const bcrypt = require('bcryptjs');
  const hashedUsers = await Promise.all(users.map(u => ({
    ...u,
    password: await bcrypt.hash(u.password, 10)
  })));
  await User.insertMany(hashedUsers);
  ```
- **View all users**: GET `/api/users` (returns all users without passwords)

## Important Files
- `src/app/page.tsx` - Premium home page with promotion
- `src/app/register/page.tsx` - 5-step registration form
- `src/app/login/page.tsx` - Login form
- `src/app/dashboard/page.tsx` - Protected user dashboard
- `src/app/api/auth/register/route.ts` - Registration endpoint
- `src/app/api/auth/login/route.ts` - Login endpoint with JWT
- `src/app/api/users/route.ts` - Get all users
- `src/models/User.ts` - Database schema
- `src/lib/mongodb.ts` - Database connection
- `tailwind.config.ts` - Theme configuration
- `package.json` - Dependencies and scripts

## API Routes
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/users` - Fetch all users (for admin purposes)

## Database Fields Reference
Match the MongoDB user document structure:
- fullName: User's complete name
- email: Unique email address
- phoneNumber: Contact number
- password: Hashed password (never stored plain)
- dateOfBirth: User's birth date (string format YYYY-MM-DD)
- ssn: Social Security Number (unique, 9 digits)
- address: Full address
- idFrontPhoto: Base64 encoded image
- idBackPhoto: Base64 encoded image
- verificationStatus: KYC verification status
