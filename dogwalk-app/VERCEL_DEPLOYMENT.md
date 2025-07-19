# Vercel Deployment Guide for DogWalk.com

## Current Setup
This project is configured for Vercel deployment with a static React frontend build.

## Deployment Steps

### 1. Frontend Deployment (Vercel)
The frontend is already configured for Vercel deployment:

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Vercel will automatically detect the React app

2. **Build Configuration:**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Environment Variables:**
   - Add `REACT_APP_API_URL` pointing to your backend API

### 2. Backend Deployment Options

#### Option A: Railway (Recommended)
Railway is perfect for Node.js backends with databases:

1. **Deploy to Railway:**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   ```

2. **Database Setup:**
   - Railway provides PostgreSQL
   - Update database connection in server.js
   - Add environment variables

#### Option B: DigitalOcean App Platform
1. **Create App:**
   - Select Node.js
   - Point to your repository
   - Set build command: `npm install`
   - Set run command: `npm run server`

#### Option C: Heroku
1. **Deploy to Heroku:**
   ```bash
   heroku create your-dogwalk-backend
   git push heroku main
   ```

### 3. Environment Variables

#### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

#### Backend (Railway/DigitalOcean/Heroku)
```
NODE_ENV=production
PORT=3001
```

### 4. Database Setup

For production, consider using:
- **Railway PostgreSQL** (free tier available)
- **Supabase** (free tier available)
- **PlanetScale** (free tier available)

Update the database connection in `server.js` to use the production database.

### 5. File Storage

For video uploads in production:
- **AWS S3** (recommended)
- **Cloudinary** (easy setup)
- **Railway Storage** (if using Railway)

Update the upload configuration in `server.js`.

## Current Vercel Configuration

The `vercel.json` file is configured to:
- Build the React app using `@vercel/static-build`
- Serve static files from the `build` directory
- Handle client-side routing

## Next Steps

1. Deploy the backend to Railway/DigitalOcean/Heroku
2. Update the frontend API URL to point to your backend
3. Set up a production database
4. Configure file storage for video uploads
5. Deploy the frontend to Vercel

## Testing

After deployment:
1. Test video uploads
2. Test the AI ranking system
3. Test user interactions (likes, comments)
4. Verify the weekly winners feature

## Support

If you encounter issues:
1. Check Vercel build logs
2. Verify environment variables
3. Test API endpoints directly
4. Check database connections 