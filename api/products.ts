import { getAllProducts, getDisplayProducts, addProduct, updateProduct, deleteProduct, searchProducts, getCategories } from '../services/productService';
import { Product } from '../types';

/**
 * GET /api/products - Get all products or search with filters
 * GET /api/products/display - Get first 3 products for 3D display
 * GET /api/products/categories - Get all unique categories
 * POST /api/products - Create a new product
 * PUT /api/products/:id - Update a product
 * DELETE /api/products/:id - Delete a product
 * 
 * Query parameters for search:
 * - search: string (search in name and description)
 * - category: string (filter by category)
 * - minPrice: number (minimum price)
 * - maxPrice: number (maximum price)
 * - sortBy: 'name' | 'price' | 'created_at' (default: created_at)
 * - sortOrder: 'asc' | 'desc' (default: desc)
 */

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  try {
    // Get categories
    if (pathname.includes('/categories')) {
      const categories = await getCategories();
      return new Response(JSON.stringify(categories), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get display products (first 3)
    if (pathname.includes('/display')) {
      const products = await getDisplayProducts();
      return new Response(JSON.stringify(products), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if there are search/filter parameters
    const search = url.searchParams.get('search');
    const category = url.searchParams.get('category');
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const sortBy = url.searchParams.get('sortBy') as 'name' | 'price' | 'created_at' | null;
    const sortOrder = url.searchParams.get('sortOrder') as 'asc' | 'desc' | null;

    // If any filter is present, use search function
    if (search || category || minPrice || maxPrice || sortBy || sortOrder) {
      const products = await searchProducts({
        search: search || undefined,
        category: category || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder || undefined,
      });
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
