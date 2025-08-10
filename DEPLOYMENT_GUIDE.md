# Deployment Guide for Bull Market Peak Indicator API

## Quick Start Deployment

Follow these steps to deploy your Bitcoin bull market peak indicator API to Vercel:

### 1. Prerequisites

- Node.js 18+ installed
- Vercel account (free tier works)
- Git repository for your project

### 2. Project Setup

```bash
# Clone or navigate to your project directory
cd bullmarket-peak-indicator

# Install dependencies
npm install

# Install Vercel CLI globally
npm install -g vercel
```

### 3. Local Testing

Before deploying, test the API locally:

```bash
# Start local development server
vercel dev

# Test the endpoints
curl http://localhost:3000/api/indicators
curl http://localhost:3000/api/health
```

### 4. Environment Configuration

Create a `.env.local` file for local development:

```env
CACHE_DURATION=10
SCRAPE_TIMEOUT=30
MAX_RETRIES=3
NODE_ENV=development
```

### 5. Deploy to Vercel

```bash
# Login to Vercel (first time only)
vercel login

# Deploy to preview environment
vercel

# Deploy to production
vercel --prod
```

### 6. Set Production Environment Variables

```bash
# Set environment variables for production
vercel env add CACHE_DURATION production
# Enter: 10

vercel env add SCRAPE_TIMEOUT production
# Enter: 30

vercel env add MAX_RETRIES production
# Enter: 3
```

### 7. Verify Deployment

After deployment, test your live API:

```bash
# Replace YOUR_PROJECT_URL with your actual Vercel URL
curl https://YOUR_PROJECT_URL.vercel.app/api/health
curl https://YOUR_PROJECT_URL.vercel.app/api/indicators
```

## Testing Checklist

Before going live, verify these endpoints work correctly:

- [ ] `GET /api/indicators` - Returns bull market data
- [ ] `GET /api/indicators?refresh=true` - Forces fresh scrape
- [ ] `GET /api/health` - Returns health status
- [ ] `POST /api/cache/clear` - Clears cache (optional)

## Performance Monitoring

Monitor these metrics after deployment:

1. **Response Times**: Should be <5s for cached responses, <30s for fresh scrapes
2. **Error Rates**: Should be <5% under normal conditions
3. **Cache Hit Ratio**: Should be >80% for optimal performance
4. **Memory Usage**: Monitor for memory leaks in Vercel dashboard

## Troubleshooting Common Issues

### Issue: Puppeteer fails to launch
**Solution**: Ensure `chrome-aws-lambda` is properly installed and configured

### Issue: Timeout errors
**Solution**: Increase `SCRAPE_TIMEOUT` environment variable

### Issue: High memory usage
**Solution**: Ensure browser instances are properly closed in error cases

### Issue: Rate limiting from CoinGlass
**Solution**: Increase `CACHE_DURATION` to reduce scraping frequency

## Production Recommendations

1. **Monitoring**: Set up Vercel Analytics and monitoring
2. **Alerts**: Configure alerts for high error rates
3. **Caching**: Consider using Vercel KV for persistent caching
4. **Rate Limiting**: Implement API rate limiting for public APIs
5. **Documentation**: Keep API documentation updated

## API Endpoints Summary

| Endpoint | Method | Description | Cache |
|----------|--------|-------------|-------|
| `/api/indicators` | GET | Get bull market indicators | Yes (10min) |
| `/api/indicators?refresh=true` | GET | Force fresh data | No |
| `/api/health` | GET | Health check | No |
| `/api/cache/clear` | POST | Clear cache | No |

## Cost Optimization

- **Function Duration**: Optimize scraping logic to reduce execution time
- **Memory Usage**: Use 1024MB memory allocation for Puppeteer
- **Caching**: Implement aggressive caching to reduce function invocations
- **Error Handling**: Proper error handling prevents unnecessary retries

Your Bitcoin bull market peak indicator API is now ready for production use on Vercel!