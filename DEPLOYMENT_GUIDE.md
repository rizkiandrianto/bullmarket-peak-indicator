# Bull Market Peak Indicator API - Deployment Guide

## 🚀 Railway Deployment (Recommended)

Railway is the recommended platform for deploying this Puppeteer-based API due to its excellent support for headless browsers and generous free tier.

### Prerequisites

1. **GitHub Account**: Your code needs to be in a GitHub repository
2. **Railway Account**: Sign up at [railway.app](https://railway.app)
3. **Node.js 18+**: For local testing

### Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Bull Market Peak Indicator API"
   ```

2. **Create GitHub Repository**:
   - Go to [github.com](https://github.com) and create a new repository
   - Name it `bullmarket-peak-indicator-api`
   - Push your code:
     ```bash
     git remote add origin https://github.com/YOUR_USERNAME/bullmarket-peak-indicator-api.git
     git branch -M main
     git push -u origin main
     ```

### Step 2: Deploy to Railway

1. **Sign up/Login to Railway**:
   - Visit [railway.app](https://railway.app)
   - Sign up with your GitHub account

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `bullmarket-peak-indicator-api` repository

3. **Configure Deployment**:
   - Railway will automatically detect your Node.js project
   - The `railway.toml` file will configure the deployment settings
   - No additional configuration needed!

4. **Wait for Deployment**:
   - Railway will install dependencies and start your server
   - This may take 2-3 minutes for the first deployment
   - You'll get a public URL like `https://your-app-name.railway.app`

### Step 3: Test Your Deployed API

Once deployed, test these endpoints:

1. **Health Check**:
   ```
   GET https://your-app-name.railway.app/health
   ```

2. **API Documentation**:
   ```
   GET https://your-app-name.railway.app/
   ```

3. **Bull Market Indicators**:
   ```
   GET https://your-app-name.railway.app/api/indicators
   ```

### Step 4: Monitor Your Deployment

1. **Railway Dashboard**:
   - View logs, metrics, and deployment status
   - Monitor resource usage

2. **Health Monitoring**:
   - Railway automatically monitors the `/health` endpoint
   - Automatic restarts on failures

## 🔧 Local Development

### Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Test API**:
   ```bash
   npm test
   ```

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run API tests

## 📊 API Endpoints

### GET `/`
Returns API documentation and usage information.

**Response:**
```json
{
  "name": "Bull Market Peak Indicator API",
  "version": "1.0.0",
  "description": "API for scraping real-time bull market peak indicators from CoinGlass",
  "endpoints": {
    "GET /": "API documentation",
    "GET /health": "Health check",
    "GET /api/indicators": "Get bull market peak indicators"
  }
}
```

### GET `/health`
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-10T02:49:32.393Z",
  "service": "Bull Market Peak Indicator API"
}
```

### GET `/api/indicators`
Scrapes and returns current bull market peak indicators.

**Response:**
```json
{
  "success": true,
  "date": "2025-01-10T02:49:32.393Z",
  "data": [
    {
      "title": "Bitcoin Fear & Greed Index",
      "current": "75",
      "reference": "90",
      "hitted": false,
      "progress": 83.3
    }
  ],
  "count": 15
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to fetch bull market indicators",
  "message": "Timeout waiting for page to load",
  "timestamp": "2025-01-10T02:49:32.393Z"
}
```

## 🔄 Alternative Deployment Options

### Render (Alternative)

1. **Sign up**: [render.com](https://render.com)
2. **Create Web Service**: Connect your GitHub repo
3. **Configure**:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `NODE_ENV=production`

### Fly.io (Alternative)

1. **Install Fly CLI**: `curl -L https://fly.io/install.sh | sh`
2. **Login**: `fly auth login`
3. **Initialize**: `fly launch`
4. **Deploy**: `fly deploy`

## ⚠️ Important Notes

### Puppeteer Considerations

1. **Memory Usage**: Puppeteer can use significant memory
2. **Timeout Handling**: Scraping may take 30-60 seconds
3. **Rate Limiting**: Don't abuse the CoinGlass website
4. **Browser Crashes**: The API includes automatic cleanup

### Production Best Practices

1. **Monitoring**: Set up uptime monitoring
2. **Logging**: Monitor Railway logs for errors
3. **Caching**: Consider adding caching for high traffic
4. **Rate Limiting**: Implement rate limiting if needed

### Free Tier Limits

**Railway Free Tier:**
- 500 hours/month
- 1GB RAM
- 1GB storage
- Automatic sleep after 30 minutes of inactivity

**Usage Tips:**
- API will auto-wake on requests
- Monitor usage in Railway dashboard
- Upgrade to paid plan if needed

## 🐛 Troubleshooting

### Common Issues

1. **Deployment Fails**:
   - Check Railway logs
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **Puppeteer Crashes**:
   - Memory limits exceeded
   - Website structure changed
   - Network timeouts

3. **API Timeouts**:
   - Increase timeout values
   - Check CoinGlass website availability
   - Monitor network connectivity

### Debug Commands

```bash
# Check logs locally
npm start

# Test specific endpoint
curl https://your-app-name.railway.app/health

# Test with verbose output
curl -v https://your-app-name.railway.app/api/indicators
```

## 📞 Support

- **Railway Support**: [railway.app/help](https://railway.app/help)
- **Puppeteer Docs**: [pptr.dev](https://pptr.dev)
- **Express.js Docs**: [expressjs.com](https://expressjs.com)

## 🎉 Success!

Your Bull Market Peak Indicator API is now deployed and ready to use! 

**Next Steps:**
1. Share your API URL with users
2. Monitor usage and performance
3. Consider adding authentication for production use
4. Set up monitoring and alerts