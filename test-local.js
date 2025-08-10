const http = require('http');

// Test configuration
const HOST = 'localhost';
const PORT = 3000;
const BASE_URL = `http://${HOST}:${PORT}`;

// Helper function to make HTTP requests
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(120000); // 2 minutes timeout for scraping
  });
}

// Test functions
async function testHealthEndpoint() {
  console.log('🔍 Testing health endpoint...');
  try {
    const response = await makeRequest('/health');
    console.log(`✅ Health check: ${response.statusCode}`);
    console.log('📊 Response:', JSON.stringify(response.data, null, 2));
    return response.statusCode === 200;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function testRootEndpoint() {
  console.log('\n🔍 Testing root endpoint...');
  try {
    const response = await makeRequest('/');
    console.log(`✅ Root endpoint: ${response.statusCode}`);
    console.log('📊 API Documentation loaded successfully');
    return response.statusCode === 200;
  } catch (error) {
    console.error('❌ Root endpoint failed:', error.message);
    return false;
  }
}

async function testIndicatorsEndpoint() {
  console.log('\n🔍 Testing indicators endpoint...');
  console.log('⏳ This may take 30-60 seconds for scraping...');
  
  try {
    const response = await makeRequest('/api/indicators');
    console.log(`✅ Indicators endpoint: ${response.statusCode}`);
    
    if (response.data && response.data.success) {
      console.log('📈 Scraping successful!');
      console.log(`📊 Found ${response.data.count} indicators`);
      console.log('🕐 Scraped at:', response.data.date);
      
      // Show first few indicators as sample
      if (response.data.data && response.data.data.length > 0) {
        console.log('\n📋 Sample indicators:');
        response.data.data.slice(0, 3).forEach((indicator, index) => {
          console.log(`${index + 1}. ${indicator.title}`);
          console.log(`   Current: ${indicator.current}`);
          console.log(`   Reference: ${indicator.reference}`);
          console.log(`   Hit: ${indicator.hitted ? '🔴 YES' : '🟢 NO'}`);
          console.log(`   Progress: ${indicator.progress}%`);
          console.log('');
        });
      }
      
      return true;
    } else {
      console.error('❌ Scraping failed:', response.data);
      return false;
    }
  } catch (error) {
    console.error('❌ Indicators endpoint failed:', error.message);
    return false;
  }
}

async function test404Endpoint() {
  console.log('\n🔍 Testing 404 handling...');
  try {
    const response = await makeRequest('/nonexistent');
    console.log(`✅ 404 handling: ${response.statusCode}`);
    return response.statusCode === 404;
  } catch (error) {
    console.error('❌ 404 test failed:', error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting API tests...');
  console.log(`📡 Testing server at ${BASE_URL}`);
  console.log('=' .repeat(50));
  
  const results = {
    health: await testHealthEndpoint(),
    root: await testRootEndpoint(),
    indicators: await testIndicatorsEndpoint(),
    notFound: await test404Endpoint()
  };
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST RESULTS:');
  console.log('=' .repeat(50));
  
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const allPassed = Object.values(results).every(result => result);
  
  console.log('\n' + '='.repeat(50));
  console.log(`🎯 OVERALL: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  console.log('=' .repeat(50));
  
  if (allPassed) {
    console.log('\n🎉 Your API is ready for deployment!');
    console.log('🚀 Next steps:');
    console.log('   1. Push your code to GitHub');
    console.log('   2. Connect your repository to Railway');
    console.log('   3. Deploy and test in production');
  } else {
    console.log('\n⚠️  Please fix the failing tests before deployment.');
  }
  
  process.exit(allPassed ? 0 : 1);
}

// Check if server is running
console.log('🔍 Checking if server is running...');
makeRequest('/health')
  .then(() => {
    console.log('✅ Server is running, starting tests...\n');
    runTests();
  })
  .catch(() => {
    console.log('❌ Server is not running!');
    console.log('🚀 Please start the server first:');
    console.log('   npm start');
    console.log('   or');
    console.log('   npm run dev');
    process.exit(1);
  });