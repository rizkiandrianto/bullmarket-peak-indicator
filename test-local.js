// Simple test script to verify the API works locally
const { scrapeBullMarketIndicators } = require('./lib/scraper');

async function testScraper() {
  console.log('🚀 Testing Bull Market Peak Indicator Scraper...\n');
  
  try {
    console.log('📊 Scraping bull market indicators...');
    const startTime = Date.now();
    
    const result = await scrapeBullMarketIndicators();
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log('✅ Scraping completed successfully!');
    console.log(`⏱️  Duration: ${duration.toFixed(2)} seconds`);
    console.log(`📈 Found ${result.data.length} indicators`);
    console.log(`🎯 Hit indicators: ${result.summary.hit}/${result.summary.total} (${result.summary.hitRate}%)`);
    
    console.log('\n📋 Sample indicators:');
    result.data.slice(0, 3).forEach((indicator, index) => {
      console.log(`${index + 1}. ${indicator.title}`);
      console.log(`   Current: ${indicator.current} | Reference: ${indicator.reference}`);
      console.log(`   Hit: ${indicator.hitted ? '✅' : '❌'} | Progress: ${indicator.progress}%`);
    });
    
    console.log('\n🎉 Test completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Run "npm install" to install dependencies');
    console.log('2. Run "vercel dev" to start local development server');
    console.log('3. Test endpoints:');
    console.log('   - GET http://localhost:3000/api/indicators');
    console.log('   - GET http://localhost:3000/api/health');
    console.log('4. Deploy with "vercel --prod"');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure you have Node.js 18+ installed');
    console.log('2. Run "npm install" to install dependencies');
    console.log('3. Check your internet connection');
    console.log('4. Verify CoinGlass website is accessible');
    
    process.exit(1);
  }
}

// Run the test
testScraper();