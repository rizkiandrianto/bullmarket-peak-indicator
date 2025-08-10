# Bull Market Peak Indicator Scraper

A Node.js application that scrapes real-time bull market peak indicators from [CoinGlass](https://www.coinglass.com/bull-market-peak-signals) to help identify potential market tops and optimize selling strategies.

## Overview

This project monitors various cryptocurrency market indicators that historically signal bull market peaks. It extracts data including indicator names, current values, reference values, hit status, and progress percentages to provide insights for timing market exits.

## Features

- **Real-time Data Extraction**: Scrapes live bull market peak indicators from CoinGlass
- **Comprehensive Metrics**: Captures indicator titles, current values, reference thresholds, and progress
- **Hit Detection**: Identifies which indicators have reached their peak signal thresholds
- **JSON Output**: Returns structured data with timestamps for easy integration
- **Headless Operation**: Runs efficiently in the background without GUI

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bullmarket-peak-indicator
```

2. Install dependencies:
```bash
npm install
```

## Usage

Run the scraper with:

```bash
node index.js
```

## Output Format

The application outputs a JSON object containing:

```json
{
  "date": "2025-01-10T02:49:32.393Z",
  "data": [
    {
      "title": "Indicator Name",
      "current": "Current Value",
      "reference": "Reference Threshold",
      "hitted": true/false,
      "progress": 75.5
    }
    // ... more indicators
  ]
}
```

### Data Fields

- **date**: ISO timestamp of when the data was collected
- **title**: Name of the bull market indicator
- **current**: Current market value for the indicator
- **reference**: Reference threshold value that signals a peak
- **hitted**: Boolean indicating if the indicator has reached its peak signal
- **progress**: Percentage progress toward the peak threshold (0-100)

## How It Works

1. **Browser Launch**: Puppeteer launches a headless Chrome browser
2. **Page Navigation**: Navigates to the CoinGlass bull market peak signals page
3. **Data Extraction**: Waits for content to load and extracts indicator data from the table
4. **Data Processing**: Processes and structures the scraped data
5. **Output**: Returns formatted JSON with timestamp and indicator data

## Bull Market Peak Indicators

The scraped indicators typically include various market metrics such as:
- Technical analysis indicators
- On-chain metrics
- Market sentiment indicators
- Valuation models
- Historical pattern recognition tools

These indicators help identify when the cryptocurrency market may be approaching a cyclical peak, providing valuable timing information for profit-taking strategies.

## Dependencies

- **puppeteer**: Web scraping and browser automation (v24.16.0)

## Configuration

The scraper is configured to:
- Run in headless mode for efficiency
- Wait up to 60 seconds for page load
- Target specific CSS selectors for data extraction
- Handle network timeouts gracefully

## Error Handling

The application includes basic error handling for:
- Page load timeouts
- Missing DOM elements
- Network connectivity issues

## Use Cases

- **Trading Strategy**: Integrate with trading bots for automated sell signals
- **Portfolio Management**: Monitor multiple indicators for exit timing
- **Market Analysis**: Track indicator progression over time
- **Research**: Analyze historical peak signal accuracy

## Disclaimer

This tool is for informational purposes only. The indicators provided are based on historical patterns and should not be considered as financial advice. Always conduct your own research and consider multiple factors before making investment decisions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is provided as-is for educational and research purposes.

## Support

For issues or questions, please check the CoinGlass website for the most up-to-date indicator information and methodology.