#!/usr/bin/env node

/**
 * Complete Order Flow Test
 * Tests: Product creation → Order creation → Email sending → Order retrieval
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const API_BASE = 'http://localhost:5000';
const ADMIN_API = `${API_BASE}/api/admin`;

console.log('🚀 Starting Complete Order Flow Test...\n');

// Test 1: Check database connection
async function testDatabaseConnection() {
  console.log('📊 Test 1: Database Connection');
  try {
    const response = await fetch(`${API_BASE}/health`);
    if (response.ok) {
      console.log('✅ Server is running\n');
      return true;
    }
  } catch (error) {
    console.error('❌ Server is not running:', error.message);
    console.log('   Start the server with: npm run dev\n');
    return false;
  }
}

// Test 2: Get all products
async function testGetProducts() {
  console.log('📦 Test 2: Get All Products');
  try {
    const response = await fetch(`${ADMIN_API}/products`);
    const products = await response.json();
    console.log(`✅ Found ${products.length} products`);
    if (products.length > 0) {
      console.log(`   First product: ${products[0].name} (ID: ${products[0].id})\n`);
      return products[0];
    }
    console.log('   ⚠️ No products found. Create one first.\n');
    return null;
  } catch (error) {
    console.error('❌ Error fetching products:', error.message, '\n');
    return null;
  }
}

// Test 3: Get delivery zones
async function testGetDeliveryZones() {
  console.log('🚚 Test 3: Get Delivery Zones');
  try {
    const response = await fetch(`${ADMIN_API}/delivery-zones`);
    const zones = await response.json();
    console.log(`✅ Found ${zones.length} delivery zones`);
    if (zones.length > 0) {
      console.log(`   First zone: ${zones[0].name} - ${zones[0].price} GNF\n`);
      return zones[0];
    }
    console.log('   ⚠️ No delivery zones found.\n');
    return null;
  } catch (error) {
    console.error('❌ Error fetching delivery zones:', error.message, '\n');
    return null;
  }
}

// Test 4: Create an order
async function testCreateOrder(product, zone) {
  console.log('📝 Test 4: Create Order');
  
  if (!product || !zone) {
    console.log('❌ Cannot create order: missing product or zone\n');
    return null;
  }

  const orderData = {
    customerName: 'Test Customer',
    customerEmail: 'test@example.com',
    customerPhone: '6xx xx xx xx',
    deliveryAddress: 'Test Address, Conakry',
    deliveryZone: zone.name,
    deliveryFee: zone.price,
    subtotal: product.price,
    totalAmount: product.price + zone.price,
    items: [
      {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        selectedSize: product.sizes?.[0] || 'M',
        selectedColor: product.colors?.[0] || 'Black',
        priceAtPurchase: product.price
      }
    ]
  };

  try {
    const response = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    if (response.ok) {
      const order = await response.json();
      console.log(`✅ Order created successfully`);
      console.log(`   Order ID: ${order.order?.id}`);
      console.log(`   Customer: ${order.order?.customerName}`);
      console.log(`   Total: ${order.order?.totalAmount} GNF\n`);
      return order.order;
    } else {
      const error = await response.json();
      console.error('❌ Failed to create order:', error.error);
      console.log(`   Status: ${response.status}\n`);
      return null;
    }
  } catch (error) {
    console.error('❌ Error creating order:', error.message, '\n');
    return null;
  }
}

// Test 5: Get all orders
async function testGetOrders() {
  console.log('📋 Test 5: Get All Orders');
  try {
    const response = await fetch(`${ADMIN_API}/orders`);
    const orders = await response.json();
    console.log(`✅ Found ${orders.length} orders`);
    if (orders.length > 0) {
      console.log(`   Latest order: #${orders[0].id} - ${orders[0].customer_name}`);
      console.log(`   Status: ${orders[0].status}`);
      console.log(`   Items: ${orders[0].items?.length || 0}\n`);
    }
    return orders;
  } catch (error) {
    console.error('❌ Error fetching orders:', error.message, '\n');
    return [];
  }
}

// Test 6: Get email logs
async function testGetEmailLogs() {
  console.log('📧 Test 6: Get Email Logs');
  try {
    const response = await fetch(`${ADMIN_API}/email-logs`);
    const logs = await response.json();
    console.log(`✅ Found ${logs.length} email logs`);
    if (logs.length > 0) {
      const sent = logs.filter(l => l.status === 'sent').length;
      const failed = logs.filter(l => l.status === 'failed').length;
      console.log(`   Sent: ${sent}, Failed: ${failed}`);
      if (failed > 0) {
        console.log(`   ⚠️ Some emails failed to send`);
        logs.filter(l => l.status === 'failed').slice(0, 3).forEach(log => {
          console.log(`      - ${log.email_type}: ${log.error_message?.substring(0, 50)}`);
        });
      }
    }
    console.log();
    return logs;
  } catch (error) {
    console.error('❌ Error fetching email logs:', error.message, '\n');
    return [];
  }
}

// Test 7: Get dashboard stats
async function testGetDashboardStats() {
  console.log('📊 Test 7: Get Dashboard Stats');
  try {
    const response = await fetch(`${ADMIN_API}/dashboard/stats`);
    const stats = await response.json();
    console.log('✅ Dashboard stats:');
    console.log(`   Total Orders: ${stats.total_orders}`);
    console.log(`   Pending: ${stats.pending_orders}`);
    console.log(`   Delivered: ${stats.delivered_orders}`);
    console.log(`   Revenue: ${stats.total_revenue} GNF`);
    console.log(`   Total Products: ${stats.total_products}`);
    console.log(`   Total Users: ${stats.total_users}\n`);
    return stats;
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error.message, '\n');
    return null;
  }
}

// Main test runner
async function runTests() {
  const connected = await testDatabaseConnection();
  if (!connected) return;

  const product = await testGetProducts();
  const zone = await testGetDeliveryZones();
  
  const order = await testCreateOrder(product, zone);
  
  await testGetOrders();
  await testGetEmailLogs();
  await testGetDashboardStats();

  console.log('✨ Test Complete!\n');
  console.log('Summary:');
  console.log('- If all tests passed, your order system is working correctly');
  console.log('- If emails failed, check your RESEND_API_KEY and ADMIN_EMAIL in .env.local');
  console.log('- If orders are not showing, check the database migrations\n');
}

runTests().catch(console.error);
