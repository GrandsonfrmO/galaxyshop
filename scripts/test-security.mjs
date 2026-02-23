#!/usr/bin/env node

/**
 * Test Security Implementation
 * Tests all security endpoints to verify authentication is working
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'dev-admin-key-change-in-production-12345';
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || 'dev-internal-key-change-in-production-67890';

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    failed++;
  }
}

async function testEmailAPI() {
  console.log('\n📧 Testing Email API...\n');

  // Test without key (should fail)
  await test('Email API rejects request without key', async () => {
    const response = await fetch(`${BASE_URL}/api/email/welcome`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', name: 'Test' })
    });

    if (response.status !== 401) {
      throw new Error(`Expected 401, got ${response.status}`);
    }
  });

  // Test with key (should succeed or fail with validation error, not auth error)
  await test('Email API accepts request with valid key', async () => {
    const response = await fetch(`${BASE_URL}/api/email/welcome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-key': INTERNAL_API_KEY
      },
      body: JSON.stringify({ email: 'test@example.com', name: 'Test' })
    });

    if (response.status === 401) {
      throw new Error('Request was rejected as unauthorized');
    }
    // 200, 400, 500 are all acceptable (means auth passed)
  });

  // Test with wrong key (should fail)
  await test('Email API rejects request with wrong key', async () => {
    const response = await fetch(`${BASE_URL}/api/email/welcome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-key': 'wrong-key'
      },
      body: JSON.stringify({ email: 'test@example.com', name: 'Test' })
    });

    if (response.status !== 401) {
      throw new Error(`Expected 401, got ${response.status}`);
    }
  });
}

async function testAdminAPI() {
  console.log('\n👨‍💼 Testing Admin API...\n');

  // Test without key (should fail)
  await test('Admin API rejects request without key', async () => {
    const response = await fetch(`${BASE_URL}/api/admin/products`, {
      method: 'GET'
    });

    if (response.status !== 401) {
      throw new Error(`Expected 401, got ${response.status}`);
    }
  });

  // Test with key (should succeed or fail with other error, not auth error)
  await test('Admin API accepts request with valid key', async () => {
    const response = await fetch(`${BASE_URL}/api/admin/products`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ADMIN_API_KEY}`
      }
    });

    if (response.status === 401) {
      throw new Error('Request was rejected as unauthorized');
    }
    // 200, 400, 500 are all acceptable (means auth passed)
  });

  // Test with wrong key (should fail)
  await test('Admin API rejects request with wrong key', async () => {
    const response = await fetch(`${BASE_URL}/api/admin/products`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer wrong-key'
      }
    });

    if (response.status !== 401) {
      throw new Error(`Expected 401, got ${response.status}`);
    }
  });
}

async function testEmailValidation() {
  console.log('\n✔️  Testing Email Validation...\n');

  // Test invalid email format
  await test('Email API rejects invalid email format', async () => {
    const response = await fetch(`${BASE_URL}/api/email/welcome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-key': INTERNAL_API_KEY
      },
      body: JSON.stringify({ email: 'not-an-email', name: 'Test' })
    });

    if (response.status !== 400) {
      throw new Error(`Expected 400, got ${response.status}`);
    }

    const data = await response.json();
    if (!data.error.includes('Invalid email')) {
      throw new Error(`Expected email validation error, got: ${data.error}`);
    }
  });

  // Test missing required fields
  await test('Email API rejects missing required fields', async () => {
    const response = await fetch(`${BASE_URL}/api/email/welcome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-key': INTERNAL_API_KEY
      },
      body: JSON.stringify({ email: 'test@example.com' })
    });

    if (response.status !== 400) {
      throw new Error(`Expected 400, got ${response.status}`);
    }
  });

  // Test empty name
  await test('Email API rejects empty name', async () => {
    const response = await fetch(`${BASE_URL}/api/email/welcome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-key': INTERNAL_API_KEY
      },
      body: JSON.stringify({ email: 'test@example.com', name: '' })
    });

    if (response.status !== 400) {
      throw new Error(`Expected 400, got ${response.status}`);
    }
  });
}

async function runTests() {
  console.log('🔐 Security Implementation Tests\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Admin Key: ${ADMIN_API_KEY.substring(0, 10)}...`);
  console.log(`Internal Key: ${INTERNAL_API_KEY.substring(0, 10)}...\n`);

  try {
    await testEmailAPI();
    await testAdminAPI();
    await testEmailValidation();

    console.log(`\n${'='.repeat(50)}`);
    console.log(`\n✅ Tests Passed: ${passed}`);
    console.log(`❌ Tests Failed: ${failed}`);
    console.log(`\nTotal: ${passed + failed} tests\n`);

    if (failed === 0) {
      console.log('🎉 All security tests passed!');
      process.exit(0);
    } else {
      console.log('⚠️  Some tests failed. Check the errors above.');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Test suite error:', error.message);
    process.exit(1);
  }
}

runTests();
