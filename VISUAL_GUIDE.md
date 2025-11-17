# BETR Platform - Visual Overview

## 🎨 Design System

### Color Palette
- **Primary**: Black `#000000` - Main background
- **Secondary**: Purple `#8B5CF6` - CTA buttons, accents
- **Accent**: Light Purple `#A78BFA` - Hover effects, highlights
- **Text**: White `#FFFFFF` - Primary text
- **Muted**: Gray `#666666` - Secondary text

### Typography
- Headlines: Bold, large sizes (text-3xl to text-5xl)
- Body text: Regular weight
- Buttons: Semi-bold (font-semibold)
- Labels: Small and medium sizes

### Spacing
- Uses Tailwind's spacing system
- Padding: 4-8 units standard
- Margins: 4-16 units depending on context
- Border radius: lg (rounded-lg) for cards

## 📱 Page Layouts

### Home Page (`/`)
```
┌─────────────────────────────────┐
│ BETR          Login  Sign Up    │ <- Navigation
├─────────────────────────────────┤
│                                 │
│  Welcome to BETR                │
│  [Premium hero content]         │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 💰 Deposit $20 Get $60  │   │ <- Main Promotion
│  │ No Playthrough Required │   │
│  └─────────────────────────┘   │
│                                 │
│  [Start Betting] [Learn More]   │
│                                 │
│  ✓ Licensed & Regulated         │
│  ✓ Secure Payment               │
│  ✓ 24/7 Support                 │
│                                 │
├─────────────────────────────────┤
│ Why Choose BETR?                │
│ [Feature 1] [Feature 2] [...]   │
├─────────────────────────────────┤
│ © 2024 BETR Sports Betting      │
└─────────────────────────────────┘
```

### Registration Page (`/register`)
```
┌─────────────────────────────────┐
│                                 │
│          BETR                   │
│    Create Your Account          │
│    Step 1 of 5                  │
│                                 │
│ Progress: ██░░░░░░░░░░░░░░     │
│ Personal Info                   │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Full Name                   │ │
│ │ [________________________]   │ │
│ │ Date of Birth               │ │
│ │ [____/____/________]        │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Next] or [Back]                │
│                                 │
│ Already registered? Sign In >   │
│                                 │
│ 💰 Get $60 bonus on $20 deposit │
└─────────────────────────────────┘

(Steps repeat for each field group)
```

### Login Page (`/login`)
```
┌─────────────────────────────────┐
│                                 │
│          BETR                   │
│      Welcome Back               │
│   Sign in to your account       │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Email Address               │ │
│ │ [________________________]   │ │
│ │ Password                    │ │
│ │ [________________________]   │ │
│ └─────────────────────────────┘ │
│                                 │
│ ☑ Remember me                   │
│            Forgot password? >   │
│                                 │
│      [Sign In]                  │
│                                 │
│ Don't have account? Create >    │
│                                 │
│ 💰 New customers get $60 bonus  │
└─────────────────────────────────┘
```

### Dashboard (`/dashboard`)
```
┌─────────────────────────────────┐
│ BETR               Logout       │ <- Navigation
├─────────────────────────────────┤
│                                 │
│ Welcome, John!                  │
│ You've logged in successfully   │
│                                 │
│ ┌──────────────┐ ┌────────────┐│
│ │ Account Info │ │ Welcome    ││
│ │              │ │ Bonus      ││
│ │ Name: John   │ │            ││
│ │ Email: j@... │ │ Deposit    ││
│ │              │ │ $20 Get $60││
│ │              │ │            ││
│ │              │ │ [Deposit] ││
│ └──────────────┘ └────────────┘│
│                                 │
└─────────────────────────────────┘
```

## 🔄 User Data Flow

### Registration Flow
```
User Input (Frontend)
    ↓
Form Validation (Client-side)
    ↓
Submit to /api/auth/register
    ↓
Backend Validation (Server-side)
    ↓
Check Email Uniqueness
    ↓
Check SSN Uniqueness
    ↓
Hash Password with Bcryptjs
    ↓
Save to MongoDB
    ↓
Return Success + Redirect to Login
```

### Login Flow
```
Email + Password Input
    ↓
POST to /api/auth/login
    ↓
Find User by Email
    ↓
Compare Password Hash
    ↓
Generate JWT Token
    ↓
Store in localStorage
    ↓
Redirect to Dashboard
```

### Dashboard Access Flow
```
Visit /dashboard
    ↓
Check localStorage for user data
    ↓
User found? → Show Dashboard
    ↓
No user? → Redirect to /login
```

## 📊 Registration Form Structure

### Step 1: Personal Info
```
Fields:
- Full Name (text input, required)
- Date of Birth (date input, required)

Validation:
- Both fields required
- Allow special characters in names
```

### Step 2: Contact Info
```
Fields:
- Email (email input, required)
- Phone Number (tel input, required)

Validation:
- Email format validation
- Email must be unique
- Phone format flexible
```

### Step 3: Address
```
Fields:
- Street Address (textarea, required)

Validation:
- Field required
- Allow up to 500 characters
```

### Step 4: Security
```
Fields:
- SSN (password type, required)
- Password (password type, required)
- Confirm Password (password type, required)

Validation:
- SSN must be 9 digits (format: XXX-XX-XXXX)
- SSN must be unique
- Password min 6 characters
- Passwords must match
- Hidden input for security
```

### Step 5: ID Verification
```
Fields:
- ID Front Photo (file input)
- ID Back Photo (file input)

Validation:
- Files optional but shown in form
- Converted to base64 for storage
- Image format supported
```

## 🗄️ MongoDB Collection Structure

### Users Collection
```javascript
db.users = [
  {
    _id: ObjectId("507f1f77bcf86cd799439011"),
    fullName: "John Zachary Scott Butler",
    email: "icpzak323@gmail.com",
    phoneNumber: "2486886946",
    password: "$2a$10$N9qo8uLOickgxnYpL7...", // Bcrypt hash
    dateOfBirth: "1998-03-23",
    ssn: "362231066",
    address: "26679 Alray st, CHESTERFIELD, MI 48051",
    idFrontPhoto: "data:image/jpeg;base64,/9j/4AAQ...",
    idBackPhoto: "data:image/jpeg;base64,/9j/4AAQ...",
    verificationStatus: "pending",
    createdAt: ISODate("2025-11-17T12:00:00Z"),
    updatedAt: ISODate("2025-11-17T12:00:00Z")
  }
]
```

## 🔐 Security Layers

```
Frontend
├─ Client-side validation
├─ Password confirmation check
├─ File size validation
└─ HTTPS communication

Backend
├─ Server-side validation (re-validate all)
├─ Email format validation
├─ SSN format validation (9 digits)
├─ Unique email check (database query)
├─ Unique SSN check (database query)
├─ Password hashing (Bcryptjs 10 rounds)
└─ JWT token generation (24h expiry)

Database
├─ Unique indexes on email
├─ Unique indexes on ssn
├─ Password never stored plain
└─ All data encrypted in transit
```

## 📱 Responsive Breakpoints

### Mobile (< 768px)
- Single column layout
- Full-width inputs
- Hamburger menu for navigation
- Smaller text sizes
- Stacked buttons (full width)

### Tablet (768px - 1024px)
- 2-column layouts where appropriate
- Responsive grid
- Desktop navigation visible
- Optimized spacing

### Desktop (> 1024px)
- Full layouts
- 2-3 column grids
- Hero images visible
- Maximum width containers
- Hover effects active

## 🎯 User Journey Map

```
New Visitor
    ↓
[Home Page]
    ├─ Browse promotion
    ├─ Read features
    └─ Click "Sign Up"
    ↓
[Registration]
    ├─ Step 1: Name & DOB
    ├─ Step 2: Email & Phone
    ├─ Step 3: Address
    ├─ Step 4: SSN & Password
    ├─ Step 5: ID Photos
    └─ Submit → Account Created
    ↓
[Login] (Redirected)
    └─ Enter Email & Password
    ↓
[Dashboard]
    ├─ See Welcome Message
    ├─ View Account Info
    ├─ See Promotion
    └─ Ready to Deposit
    ↓
Existing User
    ↓
[Home Page]
    └─ Click "Login"
    ↓
[Login]
    └─ Enter Credentials
    ↓
[Dashboard]
    └─ Existing Account Loads
```

## 🎨 Component Hierarchy

```
App (layout.tsx)
├─ Home (page.tsx)
│  ├─ Navigation
│  ├─ Hero Section
│  ├─ Promotion Banner
│  ├─ Features Section
│  └─ Footer
├─ Register (register/page.tsx)
│  ├─ Step 1: Personal
│  ├─ Step 2: Contact
│  ├─ Step 3: Address
│  ├─ Step 4: Security
│  ├─ Step 5: ID Verification
│  ├─ Progress Bar
│  ├─ Navigation Buttons
│  └─ Promo Box
├─ Login (login/page.tsx)
│  ├─ Logo
│  ├─ Email Input
│  ├─ Password Input
│  ├─ Remember Me
│  ├─ Sign In Button
│  └─ Sign Up Link
└─ Dashboard (dashboard/page.tsx)
   ├─ Navigation
   ├─ Welcome Message
   ├─ Account Info Card
   └─ Promotion Card

API Routes
├─ /api/auth/register
├─ /api/auth/login
└─ /api/users
```

---

This visual guide shows how BETR is structured, styled, and how data flows through the system!
