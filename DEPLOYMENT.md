# 🚀 Deploying to Vercel

This guide will help you deploy your College Management System to Vercel.

## Prerequisites

- A GitHub account
- A Vercel account (free) - [Sign up here](https://vercel.com/signup)
- Git installed on your machine

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended for First Time)

1. **Push your code to GitHub**
   ```bash
   # If not already initialized
   git init
   git add .
   git commit -m "Prepare for Vercel deployment"
   
   # Create a new repository on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it as a Vite project

3. **Configure Build Settings** (Should be auto-detected)
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `https://your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # For production deployment
   vercel --prod
   
   # For preview deployment
   vercel
   ```

## Post-Deployment

### Custom Domain (Optional)
1. Go to your project settings on Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

### Environment Variables (For Future API Integration)
1. Go to Project Settings → Environment Variables
2. Add any necessary variables (e.g., `VITE_API_URL`)
3. Redeploy for changes to take effect

### Automatic Deployments
- Every push to `main` branch triggers a production deployment
- Every push to other branches creates a preview deployment
- Pull requests get their own preview URLs

## Troubleshooting

### Build Fails
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Test build locally: `npm run build`

### 404 on Routes
- The `vercel.json` is configured to handle SPA routing
- All routes should redirect to `index.html`

### Performance Issues
- Assets are cached for 1 year (configured in `vercel.json`)
- Consider using Vercel's Image Optimization for images

## Useful Commands

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod

# Check deployment logs
vercel logs YOUR_DEPLOYMENT_URL

# Remove deployment
vercel remove YOUR_PROJECT_NAME
```

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite on Vercel Guide](https://vercel.com/docs/frameworks/vite)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

---

**Your app is now ready to deploy! 🎉**

For any issues, check the [Vercel Support](https://vercel.com/support) or the build logs in your dashboard.
