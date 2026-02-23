import pool from '../services/database';

/**
 * Script pour supprimer tous les produits
 */

async function clearProducts() {
  try {
    console.log('🧹 Suppression de tous les produits et commandes...\n');
    
    // Supprimer d'abord les items de commande
    const orderItemsResult = await pool.query('DELETE FROM order_items');
    console.log(`✅ ${orderItemsResult.rowCount} item(s) de commande supprimé(s)`);
    
    // Supprimer les commandes
    const ordersResult = await pool.query('DELETE FROM orders');
    console.log(`✅ ${ordersResult.rowCount} commande(s) supprimée(s)`);
    
    // Supprimer les images de produits
    const imagesResult = await pool.query('DELETE FROM product_images');
    console.log(`✅ ${imagesResult.rowCount} image(s) supprimée(s)`);
    
    // Supprimer tous les produits
    const productsResult = await pool.query('DELETE FROM products');
    console.log(`✅ ${productsResult.rowCount} produit(s) supprimé(s)`);
    
    console.log('\n✅ Tous les produits et commandes ont été supprimés!');
    console.log('💡 Vous pouvez maintenant ajouter vos propres produits via l\'interface admin.');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

clearProducts().then(() => {
  console.log('\n✅ Terminé!\n');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Erreur fatale:', error);
  process.exit(1);
});
