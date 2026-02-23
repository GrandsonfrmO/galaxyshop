#!/usr/bin/env node

/**
 * Test script to verify the complete order flow
 * Tests: Order creation, email sending, and dashboard display
 */

import fetch from 'node-fetch';

const API_URL = process.env.API_URL || 'http://localhost:5000';

console.log('🧪 Testing Order Flow...\n');
console.log(`📍 API URL: ${API_URL}\n`);

// Test data
const testOrder = {
  customerName: 'Test Client',
  customerEmail: 'test@example.com',
  customerPhone: '612345678',
  deliveryAddress: '123 Test Street, Conakry',
  deliveryZone: 'Conakry',
  deliveryFee: 5000,
  subtotal: 50000,
  totalAmount: 55000,
  items: [
    {
      productId: 13,  // Use a valid product ID from the database
      productName: 'Test Product',
      quantity: 1,
      selectedSize: 'M',
      selectedColor: 'Noir',
      priceAtPurchase: 50000
    }
  ]
};

async function testOrderCreation() {
  console.log('1️⃣  Testing Order Creation...');
  try {
    const response = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testOrder)
    });

    if (!response.ok) {
      console.error(`❌ Failed: ${response.status} ${response.statusText}`);
      const error = await response.json();
      console.error('Error:', error);
      return null;
    }

    const data = await response.json();
    console.log('✅ Order created successfully');
    console.log(`   Order ID: ${data.order?.id || data.id}`);
    console.log(`   Customer: ${data.order?.customerName || data.customer_name}`);
    console.log(`   Total: ${data.order?.totalAmount || data.total_amount} GNF\n`);
    
    return data.order?.id || data.id;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

async function testGetOrders() {
  console.log('2️⃣  Testing Get Orders (Admin)...');
  try {
    const response = await fetch(`${API_URL}/api/admin/orders`);

    if (!response.ok) {
      console.error(`❌ Failed: ${response.status} ${response.statusText}`);
      return;
    }

    const orders = await response.json();
    console.log(`✅ Retrieved ${orders.length} orders`);
    
    if (orders.length > 0) {
      const latestOrder = orders[0];
      console.log(`   Latest Order ID: ${latestOrder.id}`);
      console.log(`   Customer: ${latestOrder.customer_name}`);
      console.log(`   Status: ${latestOrder.status}`);
      console.log(`   Created: ${new Date(latestOrder.created_at).toLocaleString()}\n`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testEmailLogs() {
  console.log('3️⃣  Testing Email Logs...');
  try {
    const response = await fetch(`${API_URL}/api/test/email-logs`);

    if (!response.ok) {
      console.error(`❌ Failed: ${response.status} ${response.statusText}`);
      return;
    }

    const logs = await response.json();
    console.log(`✅ Retrieved ${logs.length} email logs`);
    
    if (logs.length > 0) {
      console.log('\n   Recent emails:');
      logs.slice(0, 5).forEach((log, idx) => {
        const status = log.status === 'sent' ? '✅' : '❌';
        console.log(`   ${status} ${log.email_type} to ${log.recipient_email}`);
        console.log(`      Status: ${log.status}`);
        if (log.error_message) {
          console.log(`      Error: ${log.error_message}`);
        }
      });
    }
    console.log();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testHealthCheck() {
  console.log('0️⃣  Testing Health Check...');
  try {
    const response = await fetch(`${API_URL}/health`);

    if (!response.ok) {
      console.error(`❌ Failed: ${response.status} ${response.statusText}`);
      return false;
    }

    const data = await response.json();
    console.log(`✅ Server is healthy: ${data.status}\n`);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('   Make sure the server is running on', API_URL);
    return false;
  }
}

async function runTests() {
  const isHealthy = await testHealthCheck();
  
  if (!isHealthy) {
    console.error('\n❌ Server is not responding. Please start the server first.');
    process.exit(1);
  }

  const orderId = await testOrderCreation();
  await testGetOrders();
  await testEmailLogs();

  console.log('✅ All tests completed!\n');
  console.log('📋 Summary:');
  console.log('   - Order creation: Check if order was created');
  console.log('   - Get orders: Check if orders are retrieved');
  console.log('   - Email logs: Check if emails were sent');
  console.log('\n💡 If emails are not being sent:');
  console.log('   1. Check RESEND_API_KEY in .env.local');
  console.log('   2. Check ADMIN_EMAIL in .env.local');
  console.log('   3. Check RESEND_EMAIL_FROM in .env.local');
  console.log('   4. Verify Resend account is active');
}

runTests().catch(console.error);
