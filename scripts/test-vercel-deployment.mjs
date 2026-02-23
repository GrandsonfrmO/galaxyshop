#!/usr/bin/env node

import https from 'https';

const args = process.argv.slice(2);
const appUrl = args[0] || 'https://localhost:5000';

console.log('\n🧪 VERCEL DEPLOYMENT TEST SUITE\n');
console.log('=' .repeat(60));
console.log(`Testing: ${appUrl}\n`);

const tests = [];

// Helper function to make HTTPS requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// Test 1: Health Check
async function testHealthCheck() {
  console.log('1️⃣  Testing Health Check...');
  try {
    const response = await makeRequest(`${appUrl}/health`);
    
    if (response.status === 200) {
      const body = JSON.parse(response.body);
      if (body.status === 'ok') {
        console.log('   ✅ Health check passed\n');
        tests.push({ name: 'Health Check', status: 'PASS' });
        return true;
      }
    }
    
    console.log('   ❌ Health check failed\n');
    tests.push({ name: 'Health Check', status: 'FAIL' });
    return false;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
    tests.push({ name: 'Health Check', status: 'ERROR' });
    return false;
  }
}

// Test 2: Security Headers
async function testSecurityHeaders() {
  console.log('2️⃣  Testing Security Headers...');
  try {
    const response = await makeRequest(`${appUrl}/`);
    
    const requiredHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection'
    ];
    
    const missingHeaders = requiredHeaders.filter(
      header => !response.headers[header]
    );
    
    if (missingHeaders.length === 0) {
      console.log('   ✅ All security headers present');
      console.log(`      - X-Content-Type-Options: ${response.headers['x-content-type-options']}`);
      console.log(`      - X-Frame-Options: ${response.headers['x-frame-options']}`);
      console.log(`      - X-XSS-Protection: ${response.headers['x-xss-protection']}\n`);
      tests.push({ name: 'Security Headers', status: 'PASS' });
      return true;
    } else {
      console.log(`   ⚠️  Missing headers: ${missingHeaders.join(', ')}\n`);
      tests.push({ name: 'Security Headers', status: 'WARN' });
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
    tests.push({ name: 'Security Headers', status: 'ERROR' });
    return false;
  }
}

// Test 3: Get Products
async function testGetProducts() {
  console.log('3️⃣  Testing Get Products...');
  try {
    const response = await makeRequest(`${appUrl}/api/products`);
    
    if (response.status === 200) {
      const body = JSON.parse(response.body);
      if (Array.isArray(body)) {
        console.log(`   ✅ Products retrieved (${body.length} products)\n`);
        tests.push({ name: 'Get Products', status: 'PASS' });
        return true;
      }
    }
    
    console.log('   ❌ Failed to retrieve products\n');
    tests.push({ name: 'Get Products', status: 'FAIL' });
    return false;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
    tests.push({ name: 'Get Products', status: 'ERROR' });
    return false;
  }
}

// Test 4: Create Order
async function testCreateOrder() {
  console.log('4️⃣  Testing Create Order...');
  try {
    const orderData = {
      customerName: 'Test User',
      customerEmail: 'test@example.com',
      items: [
        {
          id: '1',
          name: 'Test Product',
          price: 100,
          quantity: 1
        }
      ],
      totalAmount: 100
    };
    
    const response = await makeRequest(`${appUrl}/api/orders`, {
      method: 'POST',
      body: orderData
    });
    
    if (response.status === 201) {
      const body = JSON.parse(response.body);
      if (body.success && body.order && body.order.id) {
        console.log(`   ✅ Order created (ID: ${body.order.id})\n`);
        tests.push({ name: 'Create Order', status: 'PASS' });
        return true;
      }
    }
    
    console.log(`   ❌ Failed to create order (Status: ${response.status})\n`);
    tests.push({ name: 'Create Order', status: 'FAIL' });
    return false;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
    tests.push({ name: 'Create Order', status: 'ERROR' });
    return false;
  }
}

// Test 5: Rate Limiting Headers
async function testRateLimitHeaders() {
  console.log('5️⃣  Testing Rate Limit Headers...');
  try {
    const response = await makeRequest(`${appUrl}/api/products`);
    
    const rateLimitHeaders = [
      'x-ratelimit-limit',
      'x-ratelimit-remaining',
      'x-ratelimit-reset'
    ];
    
    const presentHeaders = rateLimitHeaders.filter(
      header => response.headers[header]
    );
    
    if (presentHeaders.length > 0) {
      console.log('   ✅ Rate limit headers present');
      presentHeaders.forEach(header => {
        console.log(`      - ${header}: ${response.headers[header]}`);
      });
      console.log();
      tests.push({ name: 'Rate Limit Headers', status: 'PASS' });
      return true;
    } else {
      console.log('   ⚠️  Rate limit headers not present\n');
      tests.push({ name: 'Rate Limit Headers', status: 'WARN' });
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
    tests.push({ name: 'Rate Limit Headers', status: 'ERROR' });
    return false;
  }
}

// Test 6: CORS Headers
async function testCORSHeaders() {
  console.log('6️⃣  Testing CORS Headers...');
  try {
    const response = await makeRequest(`${appUrl}/api/products`, {
      headers: {
        'Origin': 'https://example.com'
      }
    });
    
    if (response.headers['access-control-allow-origin']) {
      console.log(`   ✅ CORS enabled`);
      console.log(`      - Access-Control-Allow-Origin: ${response.headers['access-control-allow-origin']}\n`);
      tests.push({ name: 'CORS Headers', status: 'PASS' });
      return true;
    } else {
      console.log('   ⚠️  CORS headers not present\n');
      tests.push({ name: 'CORS Headers', status: 'WARN' });
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
    tests.push({ name: 'CORS Headers', status: 'ERROR' });
    return false;
  }
}

// Test 7: Response Time
async function testResponseTime() {
  console.log('7️⃣  Testing Response Time...');
  try {
    const startTime = Date.now();
    await makeRequest(`${appUrl}/health`);
    const responseTime = Date.now() - startTime;
    
    if (responseTime < 1000) {
      console.log(`   ✅ Response time: ${responseTime}ms (Good)\n`);
      tests.push({ name: 'Response Time', status: 'PASS' });
      return true;
    } else if (responseTime < 3000) {
      console.log(`   ⚠️  Response time: ${responseTime}ms (Acceptable)\n`);
      tests.push({ name: 'Response Time', status: 'WARN' });
      return false;
    } else {
      console.log(`   ❌ Response time: ${responseTime}ms (Slow)\n`);
      tests.push({ name: 'Response Time', status: 'FAIL' });
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
    tests.push({ name: 'Response Time', status: 'ERROR' });
    return false;
  }
}

// Run all tests
async function runAllTests() {
  try {
    await testHealthCheck();
    await testSecurityHeaders();
    await testGetProducts();
    await testCreateOrder();
    await testRateLimitHeaders();
    await testCORSHeaders();
    await testResponseTime();
    
    // Print summary
    console.log('=' .repeat(60));
    console.log('\n📊 TEST SUMMARY\n');
    
    const passed = tests.filter(t => t.status === 'PASS').length;
    const warnings = tests.filter(t => t.status === 'WARN').length;
    const failed = tests.filter(t => t.status === 'FAIL').length;
    const errors = tests.filter(t => t.status === 'ERROR').length;
    
    tests.forEach(test => {
      const icon = test.status === 'PASS' ? '✅' : 
                   test.status === 'WARN' ? '⚠️' : 
                   test.status === 'FAIL' ? '❌' : '🔴';
      console.log(`${icon} ${test.name}: ${test.status}`);
    });
    
    console.log(`\n📈 Results: ${passed} passed, ${warnings} warnings, ${failed} failed, ${errors} errors\n`);
    
    if (errors > 0 || failed > 0) {
      console.log('🚨 Some tests failed. Please check the deployment.\n');
      process.exit(1);
    } else if (warnings > 0) {
      console.log('⚠️  Some tests had warnings. Please review.\n');
      process.exit(0);
    } else {
      console.log('✅ All tests passed! Deployment is successful.\n');
      process.exit(0);
    }
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run tests
runAllTests();
