import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getAllProducts, getDisplayProducts, addProduct, updateProduct, deleteProduct } from './services/productService';
import { Product } from './types';
import { runMigrations } from './services/runMigrations';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Products API Routes
app.get('/api/products/display', async (req, res) => {
  try {
    const products = await getDisplayProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching display products:', error);
    res.status(500).json({ error: 'Failed to fetch display products' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product: Product = req.body;
    const newProduct = await addProduct(product);
    
    if (!newProduct) {
      return res.status(400).json({ error: 'Failed to create product' });
    }
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product: Product = req.body;
    const updatedProduct = await updateProduct(product);
    
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await deleteProduct(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  
  // Run migrations on startup
  try {
    console.log('🔄 Running database migrations...');
    await runMigrations();
    console.log('✅ Migrations completed');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
});
