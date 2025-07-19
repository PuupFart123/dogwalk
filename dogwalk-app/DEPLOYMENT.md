# DogWalk.com Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Node.js 18+ 
- npm or yarn
- A hosting provider (Vercel, Netlify, Railway, DigitalOcean, etc.)

### Quick Deploy Options

#### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Option 2: Railway
```bash
# Connect your GitHub repo to Railway
# Railway will auto-detect and deploy
```

#### Option 3: DigitalOcean App Platform
```bash
# Connect your GitHub repo
# Set build command: npm run build
# Set run command: npm run server
```

### Manual Deployment Steps

1. **Build the Application**
```bash
npm run build
```

2. **Set Environment Variables**
```bash
NODE_ENV=production
PORT=3001
REACT_APP_API_URL=/api
```

3. **Start Production Server**
```bash
npm run server
```

### File Structure for Production
```
dogwalk-app/
├── build/           # React build files
├── uploads/         # Video uploads directory
├── dogwalk.db       # SQLite database
├── server.js        # Express server
└── package.json
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3001` |
| `REACT_APP_API_URL` | API base URL | `/api` |

### Database Setup
- SQLite database is automatically created
- Database file: `dogwalk.db`
- Tables: `videos`, `likes`

### File Uploads
- Videos stored in `uploads/` directory
- Max file size: 50MB
- Supported formats: MP4, MOV, AVI

### AI Features
- Smart ranking algorithm
- Content quality analysis
- Engagement tracking
- Weekly winners selection

### Security Considerations
- CORS enabled for API
- File upload validation
- SQL injection protection
- Rate limiting (recommended)

### Monitoring
- Server logs in console
- Database file monitoring
- Upload directory size monitoring

### Scaling Considerations
- For high traffic: Consider PostgreSQL/MySQL
- For file storage: Consider AWS S3/Cloudinary
- For caching: Consider Redis
- For load balancing: Consider multiple instances

### Troubleshooting

**Port already in use:**
```bash
# Change PORT in .env or environment variable
PORT=3002 npm run server
```

**Database issues:**
```bash
# Remove and recreate database
rm dogwalk.db
npm run server
```

**Upload directory issues:**
```bash
# Create uploads directory manually
mkdir uploads
chmod 755 uploads
```

### Performance Tips
- Enable gzip compression
- Use CDN for static assets
- Implement caching headers
- Monitor database performance
- Regular database backups

### Backup Strategy
```bash
# Backup database
cp dogwalk.db backup/dogwalk-$(date +%Y%m%d).db

# Backup uploads
tar -czf uploads-$(date +%Y%m%d).tar.gz uploads/
``` 