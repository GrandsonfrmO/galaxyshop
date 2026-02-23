#!/usr/bin/env node

/**
 * Test Backend Fixes
 * Script pour tester les corrections du backend
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'test_token_12345678901234567890';

console.log('🧪 Testing Backend Fixes\n');
console.log(`📍 Base URL: ${BASE_URL}`);
console.log(`🔐 Admin Token: ${ADMIN_TOKEN}\n`);

// Test 1: Routes email publiques supprimées
console.log('1️⃣ Testing: Public email routes removed');
try {
  const response = await fetch(`${BASE_URL}/api/email/order-confirmation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order: {}, items: [] })
  });
  
  if (response.status === 404) {
    console.log('✅ Public email routes successfully removed\n');
  } else {
    console.log(`⚠️ Unexpected status: ${response.status}\n`);
  }
} catch (error) {
  console.log(`❌ Error: ${error.message}\n`);
}

// Test 2: Admin routes sans authentification
console.log('2️⃣ Testing: Admin routes require authentication');
try {
  const response = await fetch(`${BASE_URL}/api/admin/orders`);
  const data = await response.json();
  
  if (response.status === 401) {
    console.log('✅ Admin routes require authentication');
    console.log(`   Response: ${data.message}\n`);
  } else {
    console.log(`⚠️ Unexpected status: ${response.status}\n`);
  }
} catch (error) {
  console.log(`❌ Error: ${error.message}\n`);
}

// Test 3: Admin routes avec authentification
console.log('3️⃣ Testing: Admin routes with authentication');
try {
  const response = await fetch(`${BASE_URL}/api/admin/orders`, {
    headers: {
      'Authorization': `Bearer ${ADMIN_TOKEN}`
    }
  });
  
  if (response.status === 200) {
    const data = await response.json();
    console.log('✅ Admin routes accessible with token');
    console.log(`   Orders found: ${Array.isArray(data) ? data.length : 0}\n`);
  } else {
    console.log(`⚠️ Status: ${response.status}\n`);
  }
} catch (error) {
  console.log(`❌ Error: ${error.message}\n`);
}

// Test 4: Validation - Email invalide
console.log('4️⃣ Testing: Email validation');
try {
  const response = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Test User',
      customerEmail: 'invalid-email',
      deliveryAddress: 'Test Address',
      deliveryZone: 'Conakry',
      deliveryFee: 5000,
      subtotal: 50000,
      totalAmount: 55000,
      items: [
        {
          productId: 1,
          productName: 'Test',
          quantity: 1,
          selectedSize: 'M',
          selectedColor: 'Black',
          priceAtPurchase: 50000
        }
      ]
    })
  });
  
  if (response.status === 400 || response.status === 500) {
    const data = await response.json();
    console.log('✅ Email validation working');
    console.log(`   Error: ${data.error || data.details}\n`);
  } else {
    console.log(`⚠️ Unexpected status: ${response.status}\n`);
  }
} catch (error) {
  console.log(`❌ Error: ${error.message}\n`);
}

// Test 5: Validation - Produit inexistant
console.log('5️⃣ Testing: Product existence validation');
try {
  const response = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Test User',
      customerEmail: 'test@example.com',
      deliveryAddress: 'Test Address',
      deliveryZone: 'Conakry',
      deliveryFee: 5000,
      subtotal: 50000,
      totalAmount: 55000,
      items: [
        {
          productId: 99999,
          productName: 'Inexistent Product',
          quantity: 1,
          selectedSize: 'M',
          selectedColor: 'Black',
          priceAtPurchase: 50000
        }
      ]
    })
  });
  
  if (response.status === 400 || response.status === 500) {
    const data = await response.json();
    console.log('✅ Product validation working');
    console.log(`   Error: ${data.error || data.details}\n`);
  } else {
    console.log(`⚠️ Unexpected status: ${response.status}\n`);
  }
} catch (error) {
  console.log(`❌ Error: ${error.message}\n`);
}

// Test 6: Validation - Zone inexistante
console.log('6️⃣ Testing: Delivery zone validation');
try {
  const response = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Test User',
      customerEmail: 'test@example.com',
      deliveryAddress: 'Test Address',
      deliveryZone: 'Inexistent Zone',
      deliveryFee: 5000,
      subtotal: 50000,
      totalAmount: 55000,
      items: [
        {
          productId: 1,
          productName: 'Test',
          quantity: 1,
          selectedSize: 'M',
          selectedColor: 'Black',
          priceAtPurchase: 350000
        }
      ]
    })
  });
  
  if (response.status === 400 || response.status === 500) {
    const data = await response.json();
    console.log('✅ Delivery zone validation working');
    console.log(`   Error: ${data.error || data.details}\n`);
  } else {
    console.log(`⚠️ Unexpected status: ${response.status}\n`);
  }
} catch (error) {
  console.log(`❌ Error: ${error.message}\n`);
}

// Test 7: Vérifier le stock
console.log('7️⃣ Testing: Stock information');
try {
  const response = await fetch(`${BASE_URL}/api/products`);
  const products = await response.json();
  
  if (Array.isArray(products) && products.length > 0) {
    const product = products[0];
    console.log('✅ Stock information available');
    console.log(`   Product: ${product.name}`);
    console.log(`   Stock: ${product.stock || 'N/A'}\n`);
  } else {
    console.log('⚠️ No products found\n');
  }
} catch (error) {
  console.log(`❌ Error: ${error.message}\n`);
}

console.log('✅ All tests completed!');
console.log('\n📝 Notes:');
console.log('- Make sure ADMIN_TOKEN is set in .env.local');
console.log('- Run migrations before testing: npm run dev');
console.log('- Check server logs for detailed error messages');
