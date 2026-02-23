import pool from '../services/database';
import { addProduct } from '../services/productService';
import { Product } from '../types';

/**
 * Script pour nettoyer les produits supprimés et ajouter de vrais produits
 */

async function cleanAndSeed() {
  try {
    console.log('🧹 Nettoyage des produits supprimés...\n');
    
    // Au lieu de supprimer, on va juste renommer pour enlever "(Supprimé)"
    const updateResult = await pool.query(`
      UPDATE products 
      SET name = REPLACE(name, ' (Supprimé)', '')
      WHERE name LIKE '%(Supprimé)%'
    `);
    
    console.log(`✅ ${updateResult.rowCount} produit(s) renommé(s)\n`);
    
    // Vérifier combien de produits il y a
    const countResult = await pool.query('SELECT COUNT(*) as count FROM products');
    const currentCount = parseInt(countResult.rows[0].count);
    
    console.log(`📦 Produits actuels: ${currentCount}\n`);
    
    if (currentCount < 5) {
      console.log('🌱 Ajout de produits supplémentaires...\n');
      
      const demoProducts: Partial<Product>[] = [
        {
          name: 'Grandson Hoodie V1',
          price: 350000,
          description: 'Hoodie en coton épais avec logo brodé. Confortable et stylé pour toutes les saisons.',
          category: 'Vêtements',
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Noir', 'Bleu Marine'],
          imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
          images: [
            { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop', alt: 'Grandson Hoodie V1', order: 0 }
          ],
          position: [-4.5, 0.8, 0]
        },
        {
          name: 'Orbit Cap',
          price: 120000,
          description: 'Casquette 5 panneaux structurée pour l\'exploration de l\'espace profond.',
          category: 'Accessoires',
          sizes: ['One Size'],
          colors: ['Beige', 'Olive'],
          imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop',
          images: [
            { url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop', alt: 'Orbit Cap', order: 0 }
          ],
          position: [0, 1.4, 0]
        },
        {
          name: 'Lunar Cargo Pants',
          price: 280000,
          description: 'Pantalon cargo technique avec plusieurs poches et coupe décontractée.',
          category: 'Pantalons',
          sizes: ['30', '32', '34', '36'],
          colors: ['Noir', 'Gris'],
          imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop',
          images: [
            { url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop', alt: 'Lunar Cargo Pants', order: 0 }
          ],
          position: [4.5, 0.8, 0]
        },
        {
          name: 'T-Shirt Graphique Space',
          price: 150000,
          description: 'T-shirt en coton avec impression graphique inspirée de l\'espace.',
          category: 'Vêtements',
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          colors: ['Noir', 'Blanc', 'Gris'],
          imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
          images: [
            { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', alt: 'T-Shirt Graphique Space', order: 0 }
          ],
          position: [-2, 0.5, 0]
        },
        {
          name: 'Sneakers Cosmic',
          price: 450000,
          description: 'Baskets confortables avec design futuriste et semelle amortissante.',
          category: 'Chaussures',
          sizes: ['39', '40', '41', '42', '43', '44'],
          colors: ['Blanc', 'Noir', 'Gris'],
          imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
          images: [
            { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', alt: 'Sneakers Cosmic', order: 0 }
          ],
          position: [2, 0.3, 0]
        }
      ];
      
      for (const product of demoProducts) {
        try {
          const newProduct = await addProduct(product as Product);
          if (newProduct) {
            console.log(`✅ Produit ajouté: ${newProduct.name} - ${newProduct.price} GNF`);
          } else {
            console.log(`❌ Échec de l'ajout: ${product.name}`);
          }
        } catch (error) {
          console.error(`❌ Erreur lors de l'ajout de ${product.name}:`, error);
        }
      }
      
      console.log('\n✅ Produits supplémentaires ajoutés avec succès!');
    } else {
      console.log('ℹ️  Nombre suffisant de produits. Aucun ajout nécessaire.');
    }
    
    // Afficher le résumé final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ FINAL');
    console.log('='.repeat(60));
    
    const finalCount = await pool.query('SELECT COUNT(*) as count FROM products');
    const finalProducts = await pool.query('SELECT id, name, price, category FROM products ORDER BY created_at DESC');
    
    console.log(`\n✅ Total de produits: ${finalCount.rows[0].count}\n`);
    console.log('📦 Liste des produits:');
    finalProducts.rows.forEach(p => {
      console.log(`   - [${p.id}] ${p.name} - ${p.price.toLocaleString()} GNF (${p.category})`);
    });
    
    console.log('\n💡 Prochaines étapes:');
    console.log('   1. Démarrez le serveur: npm run dev:full');
    console.log('   2. Ouvrez http://localhost:5173');
    console.log('   3. Connectez-vous en admin (mot de passe: grandson2024)');
    console.log('   4. Allez dans l\'onglet "Produits"');
    console.log('   5. Vous devriez voir tous les produits!');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  }
}

cleanAndSeed().then(() => {
  console.log('\n✅ Terminé!\n');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Erreur fatale:', error);
  process.exit(1);
});
