# BETR - Premium Sports Betting Platform

A modern, premium sports betting website built with Next.js, TypeScript, Tailwind CSS, and MongoDB.

## 🎯 Features

### Home Page
- **Premium Black & Purple Theme**: Modern gradient designs and sleek UI
- **Hero Section**: Eye-catching welcome message with BETR branding
- **Main Promotion**: "$20 Deposit → $60 Bonus (No Playthrough Required)"
- **Navigation**: Responsive menu with Login/Sign Up buttons
- **Feature Highlights**: Trust badges and key benefits
- **Mobile Responsive**: Fully optimized for all devices

### User Authentication
- **Registration Form**: 5-step process collecting all user data:
  1. Personal Info (Full Name, Date of Birth)
  2. Contact Info (Email, Phone Number)
  3. Address (Street Address)
  4. Security (SSN, Password & Confirmation)
  5. ID Verification (Front & Back Photos)
- **Login System**: Email/password authentication with JWT tokens
- **Password Security**: Bcryptjs hashing for secure password storage
- **ID Verification**: Base64 encoded image upload for ID documents

### User Dashboard
- Personalized welcome message with user's first name
- Account information display (name & email)
- Promotion highlights with deposit CTA
- Secure logout functionality

### API Routes
- `POST /api/auth/register` - User registration with full data validation
- `POST /api/auth/login` - User login with JWT token generation
- `GET /api/users` - Retrieve all users (excluding passwords)

### Database
- MongoDB integration with Mongoose
- Comprehensive User model with all required fields
- Support for existing user migration (21 users ready to import)
- Automatic timestamping (createdAt, updatedAt)

## 📋 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── login/route.ts
│   │       └── register/route.ts
│   │   └── users/route.ts
│   ├── dashboard/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── page.tsx (Home)
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   └── mongodb.ts (Database connection)
└── models/
    └── User.ts (User schema)
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create `.env.local` in the root directory:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/betr?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_change_in_production_min_32_chars
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

```bash
# Development with hot-reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS 3
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Bcryptjs for password hashing
- **API**: Next.js App Router API routes
- **Linting**: ESLint

## 🔐 Security Features

- **Password Hashing**: Bcryptjs with 10 salt rounds
- **JWT Authentication**: 24-hour token expiry
- **Email Uniqueness**: Prevents duplicate registrations
- **SSN Uniqueness**: Ensures unique social security numbers
- **Server-side Validation**: All inputs validated on backend
- **Protected Routes**: Dashboard requires authentication via localStorage
- **Secure Token Storage**: JWT stored in localStorage with expiry

## 📱 Responsive Design

- Mobile-first approach
- Fully responsive breakpoints
- Touch-friendly interface
- Optimized performance for all devices
- Adaptive navigation menu

## 🎨 Theme Customization

Colors can be customized in `tailwind.config.ts`:
```typescript
colors: {
  primary: '#000000',      // Black
  secondary: '#8B5CF6',    // Purple
  accent: '#A78BFA',       // Light Purple
}
```

## 📊 Database Schema

### User Model
```typescript
{
  _id: ObjectId
  fullName: String (required)
  email: String (required, unique)
  password: String (required, hashed)
  dateOfBirth: String (required)
  phoneNumber: String (required)
  ssn: String (required, unique) // 9 digits
  address: String (required)
  idFrontPhoto: String (base64 image data)
  idBackPhoto: String (base64 image data)
  verificationStatus: String (enum: 'pending', 'verified', 'failed')
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

## 🚀 Deployment on Vercel

### Setup
1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Click "New Project" and import your GitHub repository
4. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret key
5. Click "Deploy"

### Notes
- No additional configuration needed - Next.js is fully supported
- Automatic optimizations applied by Vercel
- Deployments triggered on every push to main branch
- Free tier includes generous monthly credits

## 📝 User Migration (21 Existing Users)

To migrate your existing 21 users to the new system:

```javascript
// migrate-users.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';

const existingUsers = [ /* your 21 users */ ];

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const hashedUsers = await Promise.all(
    existingUsers.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    }))
  );
  
  await User.insertMany(hashedUsers);
  console.log('✓ Migration complete');
}

migrate().catch(console.error);
```

See `SETUP.md` for detailed migration instructions.

## 📞 API Reference

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1-555-0000",
    "password": "SecurePass123",
    "dateOfBirth": "1990-01-15",
    "ssn": "123456789",
    "address": "123 Main St, City",
    "idFrontPhoto": "data:image/jpeg;base64,...",
    "idBackPhoto": "data:image/jpeg;base64,..."
  }'
```

### Login User
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Get All Users
```bash
curl http://localhost:3000/api/users
```

## 📚 Documentation

- [SETUP.md](./SETUP.md) - Detailed setup and deployment guide
- [.github/copilot-instructions.md](./.github/copilot-instructions.md) - Project guidelines
- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Docs](https://docs.mongodb.com)
- [Tailwind CSS](https://tailwindcss.com)

## 🆘 Troubleshooting

### MongoDB Connection Error
- Verify `MONGODB_URI` in `.env.local`
- Check IP whitelist in MongoDB Atlas
- Ensure cluster is running

### Port 3000 Already In Use
```bash
npm run dev -- -p 3001
```

### Dependencies Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

## ✅ Checklist

- [x] Premium home page with promotion
- [x] 5-step registration form
- [x] Login system with JWT
- [x] Protected dashboard
- [x] MongoDB integration
- [x] Password hashing
- [x] ID photo upload
- [x] Email/SSN uniqueness
- [x] Responsive design
- [x] Vercel deployment ready

## 📄 License

This project is licensed under the MIT License.

---

**Note**: Please gamble responsibly and comply with all local gaming regulations.

For detailed setup instructions, see [SETUP.md](./SETUP.md)

