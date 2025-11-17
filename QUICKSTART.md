# BETR Setup Checklist ✅

Follow these steps to get your sports betting platform up and running:

## Step 1: Install Dependencies (2 minutes)
- [ ] Open terminal in project directory
- [ ] Run: `npm install`
- [ ] Wait for installation to complete

## Step 2: MongoDB Setup (5 minutes)
- [ ] Go to https://www.mongodb.com/cloud/atlas
- [ ] Create a free account or sign in
- [ ] Create a new cluster (M0 free tier)
- [ ] Click "Connect" and select "Connect your application"
- [ ] Copy the connection string
- [ ] Replace `<password>` with your actual password

## Step 3: Configure Environment (2 minutes)
- [ ] Create `.env.local` file in root directory
- [ ] Add these two lines:
  ```
  MONGODB_URI=your_connection_string_here
  JWT_SECRET=your_secret_key_min_32_characters
  ```
- [ ] Save the file

## Step 4: Test Locally (5 minutes)
- [ ] Run: `npm run dev`
- [ ] Open browser to http://localhost:3000
- [ ] Test home page loads
- [ ] Test register page (all 5 steps)
- [ ] Create a test account
- [ ] Login with test account
- [ ] View dashboard

## Step 5: Optional - Migrate Existing Users (10 minutes)
- [ ] Prepare your 21 existing users data
- [ ] See SETUP.md for detailed migration steps
- [ ] Verify users appear in MongoDB Atlas

## Step 6: Deploy to Vercel (10 minutes)
- [ ] Push code to GitHub
- [ ] Go to https://vercel.com
- [ ] Click "New Project"
- [ ] Select your GitHub repository
- [ ] Add environment variables:
  - `MONGODB_URI`
  - `JWT_SECRET`
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Test live site

## File Locations Reference

| What | Where |
|------|-------|
| Home Page | `src/app/page.tsx` |
| Register Form | `src/app/register/page.tsx` |
| Login Page | `src/app/login/page.tsx` |
| Dashboard | `src/app/dashboard/page.tsx` |
| User Schema | `src/models/User.ts` |
| Registration API | `src/app/api/auth/register/route.ts` |
| Login API | `src/app/api/auth/login/route.ts` |
| Colors/Theme | `tailwind.config.ts` |
| Env Variables | `.env.local` |

## Important URLs After Deployment

- **Home**: `https://your-domain.vercel.app`
- **Register**: `https://your-domain.vercel.app/register`
- **Login**: `https://your-domain.vercel.app/login`
- **Dashboard**: `https://your-domain.vercel.app/dashboard` (after login)

## Troubleshooting

### Issue: "Cannot find module 'mongoose'"
- Solution: Run `npm install` again

### Issue: "MONGODB_URI is not defined"
- Solution: Create `.env.local` file with correct URI

### Issue: "Port 3000 already in use"
- Solution: Run `npm run dev -- -p 3001`

### Issue: "Connection to MongoDB failed"
- Solution: Check if IP is whitelisted in MongoDB Atlas settings

## Features Ready to Use

✅ Premium home page with $20→$60 promotion  
✅ 5-step registration form  
✅ All user data collection  
✅ ID photo upload  
✅ Password hashing & security  
✅ Login system with JWT  
✅ Protected dashboard  
✅ MongoDB integration  
✅ Responsive design  
✅ Vercel deployment ready  

## Next Steps After Launch

1. Customize promotion text if needed
2. Add payment processing integration
3. Set up email verification
4. Implement KYC verification for ID photos
5. Add sports betting functionality
6. Set up admin dashboard

## Support Resources

- README.md - Overview and features
- SETUP.md - Detailed setup guide
- .github/copilot-instructions.md - Project guidelines

---

**Estimated Total Time: 30-45 minutes**

Good luck with BETR! 🎉
