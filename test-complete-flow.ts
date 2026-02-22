/**
 * Test complet du flux :
 * 1. Ajouter des produits depuis l'admin
 * 2. Tester l'achat d'un produit
 * 3. Tester la confirmation avec email
 */

import { query, closePool } from './services/database';
import { addProduct, getAllProducts } from './services/productService';
import { sendOrderConfirmation } from './services/email';
import { Product } from './types';

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testAddProducts() {
  log('\n=== TEST 1: AJOUTER DES PRODUITS DEPUIS L\'ADMIN ===', 'blue');

  const testProducts: Product[] = [
    {
      id: '',
      name: 'Neon Jacket',
      description: 'Veste futuriste avec LED intégrées',
      price: 199.99,
      category: 'clothing',
      imageUrl: 'https://via.placeholder.com/300?text=Neon+Jacket',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['black', 'neon-blue', 'neon-pink'],
      position: [0, 0, 0],
    },
    {
      id: '',
      name: 'Holographic Sneakers',
      description: 'Baskets holographiques haute performance',
      price: 149.99,
      category: 'footwear',
      imageUrl: 'https://via.placeholder.com/300?text=Holographic+Sneakers',
      sizes: ['6', '7', '8', '9', '10', '11', '12'],
      colors: ['silver', 'gold', 'rainbow'],
      position: [1, 0, 0],
    },
    {
      id: '',
      name: 'Cyber Sunglasses',
      description: 'Lunettes de soleil cyberpunk avec affichage AR',
      price: 299.99,
      category: 'accessories',
      imageUrl: 'https://via.placeholder.com/300?text=Cyber+Sunglasses',
      sizes: ['one-size'],
      colors: ['black', 'chrome', 'neon-green'],
      position: [2, 0, 0],
    },
  ];

  const addedProducts: Product[] = [];

  for (const product of testProducts) {
    try {
      log(`\nAjout du produit: ${product.name}...`, 'cyan');
      const added = await addProduct(product);
      if (added) {
        addedProducts.push(added);
        log(`✓ Produit ajouté avec succès (ID: ${added.id})`, 'green');
      } else {
        log(`✗ Erreur lors de l'ajout du produit`, 'red');
      }
    } catch (error) {
      log(`✗ Exception: ${error}`, 'red');
    }
  }

  log(`\n✓ ${addedProducts.length}/${testProducts.length} produits ajoutés`, 'green');
  return addedProducts;
}

async function testPurchaseProduct(product: Product) {
  log('\n=== TEST 2: TESTER L\'ACHAT D\'UN PRODUIT ===', 'blue');

  try {
    // D'abord, créer un utilisateur
    log(`\nCréation d'un utilisateur client...`, 'cyan');
    
    const userResult = await query(
      `INSERT INTO users (email, name, role) VALUES ($1, $2, $3) 
       ON CONFLICT (email) DO UPDATE SET name = $2 RETURNING *`,
      ['test@example.com', 'Test Customer', 'customer']
    );

    if (userResult.rows.length === 0) {
      log(`✗ Erreur lors de la création de l'utilisateur`, 'red');
      return null;
    }

    const userId = userResult.rows[0].id;
    log(`✓ Utilisateur créé (ID: ${userId})`, 'green');

    // Créer une commande
    log(`\nCréation d'une commande pour: ${product.name}...`, 'cyan');

    const quantity = 2;
    const totalAmount = Math.round(product.price * quantity);

    const orderResult = await query(
      `INSERT INTO orders (user_id, total_amount, status, shipping_address)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, totalAmount, 'pending', 'Test Address, Test City']
    );

    if (orderResult.rows.length === 0) {
      log(`✗ Erreur lors de la création de la commande`, 'red');
      return null;
    }

    const order = orderResult.rows[0];
    log(`✓ Commande créée avec succès (ID: ${order.id})`, 'green');
    log(`  - Client ID: ${userId}`, 'cyan');
    log(`  - Produit: ${product.name}`, 'cyan');
    log(`  - Quantité: ${quantity}`, 'cyan');
    log(`  - Prix total: $${order.total_amount / 100}`, 'cyan');
    log(`  - Statut: ${order.status}`, 'cyan');

    // Créer un article de commande
    log(`\nAjout du produit à la commande...`, 'cyan');

    const itemResult = await query(
      `INSERT INTO order_items (order_id, product_id, quantity, selected_size, selected_color, price_at_purchase)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        order.id,
        parseInt(product.id),
        quantity,
        product.sizes[0],
        product.colors[0],
        Math.round(product.price),
      ]
    );

    if (itemResult.rows.length > 0) {
      const item = itemResult.rows[0];
      log(`✓ Article ajouté à la commande`, 'green');
      log(`  - Taille: ${item.selected_size}`, 'cyan');
      log(`  - Couleur: ${item.selected_color}`, 'cyan');
    }

    return { ...order, customer_email: 'test@example.com', customer_name: 'Test Customer' };
  } catch (error) {
    log(`✗ Exception: ${error}`, 'red');
    return null;
  }
}

async function testOrderConfirmationEmail(order: any, product: Product) {
  log('\n=== TEST 3: TESTER LA CONFIRMATION AVEC EMAIL ===', 'blue');

  try {
    log(`\nEnvoi de l'email de confirmation...`, 'cyan');

    const orderData = {
      orderId: order.id,
      customerName: order.customer_name,
      items: [
        {
          name: product.name,
          quantity: 2,
          price: Math.round(product.price),
        },
      ],
      total: Math.round(order.total_amount),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
    };

    const result = await sendOrderConfirmation(order.customer_email, orderData);

    if (result) {
      log(`✓ Email de confirmation envoyé avec succès`, 'green');
      log(`  - À: ${order.customer_email}`, 'cyan');
      log(`  - Commande ID: ${order.id}`, 'cyan');
      log(`  - Produit: ${product.name}`, 'cyan');
      log(`  - Montant: $${order.total_amount / 100}`, 'cyan');
      return true;
    } else {
      log(`✗ Erreur lors de l'envoi de l'email`, 'red');
      return false;
    }
  } catch (error) {
    log(`✗ Exception: ${error}`, 'red');
    return false;
  }
}

async function testUpdateOrderStatus(orderId: number) {
  log('\n=== TEST 4: METTRE À JOUR LE STATUT DE LA COMMANDE ===', 'blue');

  try {
    log(`\nMise à jour du statut de la commande ${orderId}...`, 'cyan');

    const result = await query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      ['confirmed', orderId]
    );

    if (result.rows.length > 0) {
      const order = result.rows[0];
      log(`✓ Statut mis à jour avec succès`, 'green');
      log(`  - Nouveau statut: ${order.status}`, 'cyan');
      log(`  - Mis à jour à: ${order.updated_at}`, 'cyan');
      return true;
    } else {
      log(`✗ Commande non trouvée`, 'red');
      return false;
    }
  } catch (error) {
    log(`✗ Exception: ${error}`, 'red');
    return false;
  }
}

async function testGetAllOrders() {
  log('\n=== TEST 5: RÉCUPÉRER TOUTES LES COMMANDES ===', 'blue');

  try {
    const result = await query(
      `SELECT o.*, u.email, u.name FROM orders o 
       LEFT JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC LIMIT 10`
    );

    if (result.rows.length > 0) {
      log(`✓ ${result.rows.length} commande(s) trouvée(s)`, 'green');
      result.rows.forEach((order, index) => {
        log(`\n  Commande ${index + 1}:`, 'cyan');
        log(`    - ID: ${order.id}`, 'cyan');
        log(`    - Client: ${order.name}`, 'cyan');
        log(`    - Email: ${order.email}`, 'cyan');
        log(`    - Montant: $${order.total_amount / 100}`, 'cyan');
        log(`    - Statut: ${order.status}`, 'cyan');
        log(`    - Créée: ${order.created_at}`, 'cyan');
      });
    } else {
      log(`✗ Aucune commande trouvée`, 'red');
    }
  } catch (error) {
    log(`✗ Exception: ${error}`, 'red');
  }
}

async function runAllTests() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'yellow');
  log('║     TEST COMPLET DU FLUX E-COMMERCE                        ║', 'yellow');
  log('║  1. Ajouter des produits depuis l\'admin                   ║', 'yellow');
  log('║  2. Tester l\'achat d\'un produit                           ║', 'yellow');
  log('║  3. Tester la confirmation avec email                      ║', 'yellow');
  log('║  4. Mettre à jour le statut de la commande                 ║', 'yellow');
  log('║  5. Récupérer toutes les commandes                         ║', 'yellow');
  log('╚════════════════════════════════════════════════════════════╝', 'yellow');

  try {
    // Test 1: Ajouter des produits
    const addedProducts = await testAddProducts();

    if (addedProducts.length === 0) {
      log('\n✗ Aucun produit n\'a pu être ajouté. Arrêt des tests.', 'red');
      await closePool();
      return;
    }

    // Test 2: Acheter un produit
    const order = await testPurchaseProduct(addedProducts[0]);

    if (!order) {
      log('\n✗ La commande n\'a pas pu être créée. Arrêt des tests.', 'red');
      await closePool();
      return;
    }

    // Test 3: Envoyer l'email de confirmation
    await testOrderConfirmationEmail(order, addedProducts[0]);

    // Test 4: Mettre à jour le statut
    await testUpdateOrderStatus(order.id);

    // Test 5: Récupérer toutes les commandes
    await testGetAllOrders();

    log('\n╔════════════════════════════════════════════════════════════╗', 'green');
    log('║                  ✓ TOUS LES TESTS COMPLÉTÉS                ║', 'green');
    log('╚════════════════════════════════════════════════════════════╝', 'green');
  } catch (error) {
    log(`\n✗ Erreur générale: ${error}`, 'red');
  } finally {
    await closePool();
  }
}

// Lancer les tests
runAllTests().catch(console.error);
