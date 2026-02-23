/**
 * Script pour configurer les images produits
 * Migre les images existantes vers le nouveau format multi-images
 * 
 * Usage: npm run setup:images
 */

import { query } from '../services/database';

interface ProductImage {
  url: string;
  alt: string;
  order: number;
}

async function migrateProductImages() {
  console.log('🖼️  Migration des images produits...\n');

  try {
    // 1. Récupérer tous les produits avec une image principale
    const result = await query(
      'SELECT id, name, image_url, images FROM products WHERE image_url IS NOT NULL'
    );

    console.log(`📦 ${result.rows.length} produits trouvés\n`);

    let migrated = 0;
    let skipped = 0;

    // 2. Pour chaque produit, créer le tableau d'images
    for (const product of result.rows) {
      const existingImages = product.images || [];
      
      // Si le produit a déjà des images, on skip
      if (existingImages.length > 0) {
        console.log(`⏭️  ${product.name} - Déjà migré`);
        skipped++;
        continue;
      }

      // Créer l'image principale dans le nouveau format
      const images: ProductImage[] = [
        {
          url: product.image_url,
          alt: `${product.name} - Vue principale`,
          order: 0
        }
      ];

      // Mettre à jour le produit
      await query(
        'UPDATE products SET images = $1 WHERE id = $2',
        [JSON.stringify(images), product.id]
      );

      console.log(`✅ ${product.name} - Migré`);
      migrated++;
    }

    console.log('\n📊 Résumé:');
    console.log(`   ✅ Migrés: ${migrated}`);
    console.log(`   ⏭️  Ignorés: ${skipped}`);
    console.log(`   📦 Total: ${result.rows.length}`);
    console.log('\n✨ Migration terminée!\n');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
}

async function addExampleImages() {
  console.log('📸 Ajout d\'exemples d\'images multiples...\n');

  try {
    // Exemple : Ajouter plusieurs images pour le premier produit
    const result = await query('SELECT id, name FROM products LIMIT 1');
    
    if (result.rows.length === 0) {
      console.log('⚠️  Aucun produit trouvé');
      return;
    }

    const product = result.rows[0];
    
    const exampleImages: ProductImage[] = [
      {
        url: '/products/example-main.jpg',
        alt: `${product.name} - Vue principale`,
        order: 0
      },
      {
        url: '/products/example-detail-1.jpg',
        alt: `${product.name} - Détail du logo`,
        order: 1
      },
      {
        url: '/products/example-detail-2.jpg',
        alt: `${product.name} - Vue arrière`,
        order: 2
      },
      {
        url: '/products/example-detail-3.jpg',
        alt: `${product.name} - Détail de la texture`,
        order: 3
      }
    ];

    await query(
      'UPDATE products SET images = $1 WHERE id = $2',
      [JSON.stringify(exampleImages), product.id]
    );

    console.log(`✅ Exemples ajoutés pour: ${product.name}`);
    console.log('\n📋 Structure des images:');
    exampleImages.forEach(img => {
      console.log(`   ${img.order}. ${img.alt}`);
      console.log(`      URL: ${img.url}`);
    });
    console.log('\n✨ Terminé!\n');

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

async function showImageStructure() {
  console.log('📋 Structure des images produits\n');
  console.log('Format JSON attendu:');
  console.log(`
{
  "images": [
    {
      "url": "/products/hoodies/product-1-main.jpg",
      "alt": "Hoodie Star Wars - Vue principale",
      "order": 0
    },
    {
      "url": "/products/hoodies/product-1-detail-1.jpg",
      "alt": "Hoodie Star Wars - Détail du logo",
      "order": 1
    },
    {
      "url": "/products/hoodies/product-1-detail-2.jpg",
      "alt": "Hoodie Star Wars - Vue arrière",
      "order": 2
    }
  ]
}
  `);

  console.log('\n📁 Organisation des fichiers recommandée:');
  console.log(`
public/
  products/
    hoodies/
      product-1-main.jpg       (1200x1200px, <200KB)
      product-1-detail-1.jpg   (1200x1200px, <200KB)
      product-1-detail-2.jpg   (1200x1200px, <200KB)
    tshirts/
      product-2-main.jpg
      product-2-detail-1.jpg
    accessories/
      product-3-main.jpg
  `);

  console.log('\n💡 Conseils:');
  console.log('   • Utiliser des images carrées (1200x1200px)');
  console.log('   • Optimiser pour < 200KB par image');
  console.log('   • Utiliser des noms descriptifs');
  console.log('   • Ajouter des alt text pertinents');
  console.log('   • Ordre: 0 = principale, 1+ = détails\n');
}

// Menu interactif
const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case 'migrate':
      await migrateProductImages();
      break;
    
    case 'example':
      await addExampleImages();
      break;
    
    case 'info':
      await showImageStructure();
      break;
    
    default:
      console.log('🖼️  Gestion des Images Produits\n');
      console.log('Usage:');
      console.log('  npm run setup:images migrate  - Migrer les images existantes');
      console.log('  npm run setup:images example  - Ajouter des exemples');
      console.log('  npm run setup:images info     - Voir la structure\n');
      process.exit(0);
  }

  process.exit(0);
}

main().catch(console.error);
