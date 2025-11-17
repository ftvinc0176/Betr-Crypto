# 🚀 BETR Deployment Checklist - Vercel

## Pre-Deployment (Local)

### Code Quality
- [ ] Run linting: `npm run lint`
- [ ] Fix any lint errors
- [ ] Test all pages load without errors
- [ ] Test registration form (all 5 steps)
- [ ] Test login/logout flow
- [ ] Test dashboard access
- [ ] Verify responsive design on mobile

### Environment & Security
- [ ] Verify `.env.local` has both variables
- [ ] Check `MONGODB_URI` is correct
- [ ] Check `JWT_SECRET` is strong (>32 chars)
- [ ] `.env.local` is in `.gitignore` ✓ (already done)
- [ ] No API keys in source code
- [ ] No passwords in source code

### Database
- [ ] MongoDB Atlas cluster running
- [ ] Database user created with password
- [ ] IP whitelist includes your current IP
- [ ] Test database connection: `npm run dev` shows "MongoDB connected"

### Build Test
- [ ] Run: `npm run build`
- [ ] Check for build errors
- [ ] Build completes successfully
- [ ] All TypeScript checks pass

## GitHub Setup

### Repository
- [ ] Initialize git: `git init`
- [ ] Add all files: `git add .`
- [ ] Create initial commit: `git commit -m "Initial commit"`
- [ ] Add remote: `git remote add origin https://github.com/YOUR_USERNAME/betr-sports-betting`
- [ ] Push to GitHub: `git push -u origin main`
- [ ] Verify code appears on GitHub

### Repository Settings
- [ ] Mark repo as public or private
- [ ] Add description: "BETR - Premium Sports Betting Platform"
- [ ] Add topics: nextjs, mongodb, sports-betting
- [ ] Readme automatically displayed

## Vercel Deployment

### Create Vercel Account
- [ ] Go to https://vercel.com
- [ ] Sign up with GitHub
- [ ] Authorize Vercel to access GitHub

### Deploy Project
- [ ] Click "New Project"
- [ ] Select your GitHub repository
- [ ] Framework: "Next.js" (auto-detected)
- [ ] Root directory: "./" (default)
- [ ] Build command: `npm run build` (default)
- [ ] Click "Deploy"

### Environment Variables
- [ ] Wait for initial build/deployment
- [ ] Go to project Settings → Environment Variables
- [ ] Add `MONGODB_URI`:
  - Value: Your full MongoDB Atlas connection string
  - Environments: Production, Preview, Development
- [ ] Add `JWT_SECRET`:
  - Value: Your secret key (min 32 characters)
  - Environments: Production, Preview, Development
- [ ] Click "Add" for each variable
- [ ] Trigger redeploy to apply variables

### Redeploy with Variables
- [ ] Go to Deployments
- [ ] Click "Redeploy" on latest deployment
- [ ] Confirm redeploy

### Verify Deployment
- [ ] Wait for deployment to complete
- [ ] Click visit project link
- [ ] Test all pages load
- [ ] Test registration works
- [ ] Test login works
- [ ] Check MongoDB is connected
- [ ] Check responsive design

## Post-Deployment Testing

### Functionality Tests
- [ ] Home page loads with no errors
- [ ] Hero section displays correctly
- [ ] Promotion banner visible
- [ ] Navigation buttons work
- [ ] Register button works
- [ ] Login button works
- [ ] Registration form works (all 5 steps)
- [ ] Form validation works
- [ ] Password confirmation works
- [ ] Submit creates account
- [ ] Success redirects to login
- [ ] Login with new account works
- [ ] Dashboard displays correctly
- [ ] Logout works
- [ ] Logout redirects to home

### Data Tests
- [ ] New user appears in MongoDB
- [ ] Password is hashed (not plain text)
- [ ] Email is stored correctly
- [ ] All fields saved correctly
- [ ] JWT token working
- [ ] Dashboard shows correct user info

### Performance Tests
- [ ] Pages load quickly (< 3 seconds)
- [ ] Images load properly
- [ ] CSS loads correctly
- [ ] No console errors in browser (F12)
- [ ] No network errors

### Security Tests
- [ ] Can't access /dashboard without login
- [ ] Can't access /register/protected routes
- [ ] Passwords hidden in inputs
- [ ] SSN hidden in inputs
- [ ] HTTPS enabled
- [ ] No API keys exposed

### Responsive Tests (Mobile)
- [ ] Home page on mobile
- [ ] Register form on mobile
- [ ] Login page on mobile
- [ ] Dashboard on mobile
- [ ] Navigation works on mobile
- [ ] Buttons clickable on mobile

## Custom Domain (Optional)

- [ ] Purchase domain or use existing
- [ ] Go to project Settings → Domains
- [ ] Click "Add" and enter domain
- [ ] Follow DNS configuration
- [ ] Wait for DNS propagation (24-48 hours)
- [ ] Verify domain works

## Monitoring

### Set Up Alerts
- [ ] Enable deployment notifications
- [ ] Add Vercel monitoring
- [ ] Monitor MongoDB Atlas metrics
- [ ] Set up error tracking (optional)

### Regular Checks
- [ ] Check deployment logs weekly
- [ ] Review MongoDB usage
- [ ] Check for errors in logs
- [ ] Monitor user registrations

## Backup & Security

### Data Backup
- [ ] Enable MongoDB Atlas backup
- [ ] Schedule automatic backups
- [ ] Test restore procedure

### Security Hardening
- [ ] Review `.env.local` variables
- [ ] Ensure no sensitive data in code
- [ ] Enable MongoDB Atlas IP whitelist
- [ ] Use strong JWT_SECRET
- [ ] Consider adding rate limiting
- [ ] Plan for DDoS protection

## Documentation

### Deploy Info
- [ ] Save production URL
- [ ] Document deployment date
- [ ] Note any custom configuration
- [ ] Save MongoDB connection details securely

### Team Handoff (if applicable)
- [ ] Share GitHub repository access
- [ ] Share Vercel project access
- [ ] Document environment variables
- [ ] Create runbook for common tasks
- [ ] Document admin procedures

## Final Checklist

- [ ] Production deployment working
- [ ] All features tested
- [ ] Database connected
- [ ] Security verified
- [ ] Performance acceptable
- [ ] Monitoring in place
- [ ] Documentation complete
- [ ] Team notified

## Quick Links

| Service | Link |
|---------|------|
| Deployed Site | https://your-domain.vercel.app |
| Vercel Dashboard | https://vercel.com/dashboard |
| MongoDB Atlas | https://cloud.mongodb.com |
| GitHub Repository | https://github.com/YOUR_USERNAME/betr-sports-betting |

## Troubleshooting Deployment

### Build Fails
- Check logs in Vercel dashboard
- Ensure all dependencies in `package.json`
- Run `npm install` locally and test build
- Check for TypeScript errors: `npm run lint`

### Environment Variables Not Working
- Verify variable names match exactly
- Check in Production environment
- Trigger manual redeploy
- Clear Vercel cache if needed

### Database Connection Fails
- Check `MONGODB_URI` format
- Verify IP whitelist in MongoDB Atlas
- Test connection locally first
- Check for typos in credentials

### Pages Not Loading
- Check browser console (F12)
- Check Vercel deployment logs
- Verify all API routes working
- Check if MongoDB is running

### Slow Performance
- Check MongoDB query optimization
- Verify images are optimized
- Check network tab in DevTools
- Consider CDN caching

## Success Criteria

✅ Production site live and accessible  
✅ All pages working correctly  
✅ Database connected and data persisting  
✅ User registration functional  
✅ User login functional  
✅ Authentication secure  
✅ Mobile responsive  
✅ No console errors  
✅ Performance acceptable  
✅ Ready for users  

---

**Estimated Deployment Time: 15-20 minutes**

Once complete, your BETR platform will be live and accessible worldwide! 🌍
