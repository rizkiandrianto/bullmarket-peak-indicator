# Bull Market Peak Indicator API

A Node.js REST API that scrapes real-time bull market peak indicators from [CoinGlass](https://www.coinglass.com/bull-market-peak-signals) to help identify potential market tops and optimize selling strategies.

## Overview

This API monitors various cryptocurrency market indicators that historically signal bull market peaks. It provides a RESTful interface to access indicator data including names, current values, reference values, hit status, and progress percentages for timing market exits.

## Features

- **REST API**: Clean HTTP endpoints for easy integration
- **Real-time Data**: Scrapes live bull market peak indicators from CoinGlass
- **Comprehensive Metrics**: Returns indicator titles, current values, reference thresholds, and progress
- **Hit Detection**: Identifies which indicators have reached their peak signal thresholds
- **JSON Responses**: Structured data with timestamps for easy consumption
- **Health Monitoring**: Built-in health check endpoint
- **Production Ready**: Optimized for cloud deployment with proper error handling

## Quick Start

### Local Development

1. **Clone and Install**:
```bash
git clone <repository-url>
cd bullmarket-peak-indicator
npm install
```

2. **Start the API**:
```bash
npm start
# or for development with auto-reload
npm run dev
```

3. **Test the API**:
```bash
npm test
```

### API Endpoints

- **GET `/`** - API documentation
- **GET `/health`** - Health check
- **GET `/api/indicators`** - Get bull market indicators

### Example Usage

```bash
# Health check
curl https://your-api-url.com/health

# Get indicators
curl https://your-api-url.com/api/indicators
```

## 🚀 Deployment

### Railway (Recommended - Free)

Railway offers the best free tier for Puppeteer applications:

1. **Push to GitHub**:
```bash
git add .
git commit -m "API ready for deployment"
git push origin main
```

2. **Deploy to Railway**:
   - Visit [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Deploy automatically!

3. **Get your API URL**:
   - `https://your-app-name.railway.app/api/indicators`

For detailed deployment instructions, see [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md).

### Other Free Options

- **Render**: Good alternative with 750 hours/month free
- **Fly.io**: Docker-based deployment with free allowance

## 📊 API Response Format

### Success Response
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

### Error Response
```json
{
  "success": false,
  "error": "Failed to fetch bull market indicators",
  "message": "Timeout waiting for page to load",
  "timestamp": "2025-01-10T02:49:32.393Z"
}
```

### Data Fields

- **success**: Boolean indicating if the request was successful
- **date**: ISO timestamp of when the data was collected
- **data**: Array of bull market indicators
- **count**: Number of indicators returned
- **title**: Name of the bull market indicator
- **current**: Current market value for the indicator
- **reference**: Reference threshold value that signals a peak
- **hitted**: Boolean indicating if the indicator has reached its peak signal
- **progress**: Percentage progress toward the peak threshold (0-100)

## 🔧 Technical Details

### Architecture
- **Express.js**: REST API framework
- **Puppeteer**: Headless Chrome for web scraping
- **Production-ready**: Optimized for cloud deployment

### How It Works
1. **API Request**: Client makes HTTP request to `/api/indicators`
2. **Browser Launch**: Puppeteer launches headless Chrome
3. **Page Navigation**: Navigates to CoinGlass bull market signals page
4. **Data Extraction**: Extracts indicator data from the page
5. **Response**: Returns structured JSON with indicators

### Bull Market Indicators
The API scrapes various market metrics including:
- Technical analysis indicators
- On-chain metrics
- Market sentiment indicators
- Valuation models
- Historical pattern recognition tools

## 📈 Use Cases

- **Trading Bots**: Integrate with automated trading systems
- **Portfolio Management**: Monitor indicators for exit timing
- **Market Analysis**: Track indicator progression over time
- **Mobile Apps**: Build crypto market timing applications
- **Research**: Analyze historical peak signal accuracy

## ⚠️ Important Notes

### Rate Limiting
- No caching by default (always fresh data)
- Scraping takes 30-60 seconds per request
- Be respectful to CoinGlass servers

### Production Considerations
- Monitor API usage and costs
- Consider adding caching for high traffic
- Implement rate limiting if needed
- Set up monitoring and alerts

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Scripts
- `npm start` - Start production server
- `npm run dev` - Development with auto-reload
- `npm test` - Run API tests

### Testing
The included test suite verifies:
- Health endpoint functionality
- API documentation endpoint
- Indicators scraping functionality
- Error handling and 404 responses

## 📄 License

This project is provided as-is for educational and research purposes.

## ⚠️ Disclaimer

This tool is for informational purposes only. The indicators are based on historical patterns and should not be considered financial advice. Always conduct your own research before making investment decisions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

- **Deployment Issues**: See [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md)
- **API Questions**: Check the `/` endpoint for documentation
- **Data Issues**: Verify CoinGlass website availability