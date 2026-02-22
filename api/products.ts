import { getAllProducts, getDisplayProducts, addProduct, updateProduct, deleteProduct } from '../services/productService';
import { Product } from '../types';

/**
 * GET /api/products - Get all products
 * GET /api/products/display - Get first 3 products for 3D display
 * POST /api/products - Create a new product
 * PUT /api/products/:id - Update a product
 * DELETE /api/products/:id - Delete a product
 */

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  try {
    // Get display products (first 3)
    if (pathname.includes('/display')) {
      const products = await getDisplayProducts();
      return new Response(JSON.stringify(products), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get all products
    const products = await getAllProducts();
    return new Response(JSON.stringify(products), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request) {
  try {
    const product: Product = await request.json();
    const newProduct = await addProduct(product);

    if (!newProduct) {
      return new Response(JSON.stringify({ error: 'Failed to create product' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(newProduct), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    return new Response(JSON.stringify({ error: 'Failed to create product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(request: Request) {
  try {
    const product: Product = await request.json();
    const updatedProduct = await updateProduct(product);

    if (!updatedProduct) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(updatedProduct), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in PUT /api/products:', error);
    return new Response(JSON.stringify({ error: 'Failed to update product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return new Response(JSON.stringify({ error: 'Product ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const success = await deleteProduct(id);

    if (!success) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in DELETE /api/products:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
