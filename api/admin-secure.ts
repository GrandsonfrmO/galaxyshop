/**
 * Secure Admin API Routes
 * All routes require admin authentication via Bearer token
 */

import { validateAdminAuth, unauthorizedResponse } from '../services/auth';
import { 
  getAllProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct 
} from '../services/productService';
import { 
  getAllOrders, 
  getOrderById, 
  updateOrderStatus,
  getDashboardStats,
  getRecentOrders,
  getEmailLogs
} from '../services/orderService';
import { query } from '../services/database';
import { validateProductData, validateDeliveryZoneData } from '../services/validation';

/**
 * Admin API Router
 * Handles all admin operations with authentication
 */
export async function handleAdminRequest(request: Request): Promise<Response> {
  // Validate admin authentication
  if (!validateAdminAuth(request)) {
    return unauthorizedResponse();
  }

  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;

  try {
    // ============================================
    // PRODUCTS ADMIN ROUTES
    // ============================================

    if (pathname.includes('/admin/products')) {
      if (method === 'GET') {
        const products = await getAllProducts();
        return new Response(JSON.stringify(products), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (method === 'POST') {
        const product = await request.json();
        validateProductData(product);
        const newProduct = await addProduct(product);
        
        if (!newProduct) {
          return new Response(
            JSON.stringify({ error: 'Failed to create product' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(JSON.stringify(newProduct), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (method === 'PUT') {
        const product = await request.json();
        validateProductData(product);
        const updatedProduct = await updateProduct(product);
        
        if (!updatedProduct) {
          return new Response(
            JSON.stringify({ error: 'Product not found' }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(JSON.stringify(updatedProduct), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (method === 'DELETE') {
        const id = pathname.split('/').pop();
        const success = await deleteProduct(id);
        
        if (!success) {
          return new Response(
            JSON.stringify({ error: 'Product not found' }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // ============================================
    // ORDERS ADMIN ROUTES
    // ============================================

    if (pathname.includes('/admin/orders')) {
      if (method === 'GET') {
        // Get specific order or all orders
        const id = pathname.split('/').pop();
        
        if (id && id !== 'orders' && !pathname.includes('/status')) {
          const order = await getOrderById(parseInt(id));
          
          if (!order) {
            return new Response(
              JSON.stringify({ error: 'Order not found' }),
              { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
          }
          
          return new Response(JSON.stringify(order), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const orders = await getAllOrders();
        return new Response(JSON.stringify(orders), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (method === 'PATCH' && pathname.includes('/status')) {
        const id = pathname.split('/')[pathname.split('/').length - 2];
        const { status } = await request.json();

        if (!status) {
          return new Response(
            JSON.stringify({ error: 'Status is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        const order = await updateOrderStatus(parseInt(id), status);
        
        if (!order) {
          return new Response(
            JSON.stringify({ error: 'Order not found' }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(JSON.stringify(order), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // ============================================
    // DASHBOARD ADMIN ROUTES
    // ============================================

    if (pathname.includes('/admin/dashboard')) {
      if (pathname.includes('/stats')) {
        const stats = await getDashboardStats();
        return new Response(JSON.stringify(stats), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (pathname.includes('/recent-orders')) {
        const url = new URL(request.url);
        const limit = parseInt(url.searchParams.get('limit') || '10');
        const orders = await getRecentOrders(Math.min(limit, 100)); // Cap at 100
        return new Response(JSON.stringify(orders), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // ============================================
    // EMAIL LOGS ADMIN ROUTES
    // ============================================

    if (pathname.includes('/admin/email-logs')) {
      const url = new URL(request.url);
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const logs = await getEmailLogs(Math.min(limit, 500)); // Cap at 500
      return new Response(JSON.stringify(logs), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ============================================
    // DELIVERY ZONES ADMIN ROUTES
    // ============================================

    if (pathname.includes('/admin/delivery-zones')) {
      if (method === 'GET') {
        const result = await query('SELECT * FROM delivery_zones ORDER BY name ASC');
        return new Response(JSON.stringify(result.rows), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (method === 'POST') {
        const { name, price } = await request.json();
        validateDeliveryZoneData({ name, price });
        
        const result = await query(
          'INSERT INTO delivery_zones (name, price) VALUES ($1, $2) RETURNING *',
          [name, price]
        );
        
        return new Response(JSON.stringify(result.rows[0]), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (method === 'PUT') {
        const id = pathname.split('/').pop();
        const { name, price } = await request.json();
        validateDeliveryZoneData({ name, price });
        
        const result = await query(
          'UPDATE delivery_zones SET name = $1, price = $2 WHERE id = $3 RETURNING *',
          [name, price, id]
        );
        
        if (result.rows.length === 0) {
          return new Response(
            JSON.stringify({ error: 'Delivery zone not found' }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(JSON.stringify(result.rows[0]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (method === 'DELETE') {
        const id = pathname.split('/').pop();
        
        const result = await query(
          'DELETE FROM delivery_zones WHERE id = $1 RETURNING *',
          [id]
        );
        
        if (result.rows.length === 0) {
          return new Response(
            JSON.stringify({ error: 'Delivery zone not found' }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // ============================================
    // PWA ADMIN ROUTES
    // ============================================

    if (pathname.includes('/admin/pwa')) {
      if (pathname.includes('/settings')) {
        if (method === 'GET') {
          const result = await query('SELECT * FROM pwa_settings ORDER BY id DESC LIMIT 1');
          if (result.rows.length === 0) {
            return new Response(JSON.stringify({
              appName: 'The Boutique',
              shortName: 'Boutique',
              description: 'Immersive fashion store with 3D experience',
              themeColor: '#a855f7',
              backgroundColor: '#050505',
              icons: {}
            }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          
          const settings = result.rows[0];
          return new Response(JSON.stringify({
            appName: settings.app_name,
            shortName: settings.short_name,
            description: settings.description,
            themeColor: settings.theme_color,
            backgroundColor: settings.background_color,
            icons: {
              icon16: settings.icon_16,
              icon32: settings.icon_32,
              icon72: settings.icon_72,
              icon96: settings.icon_96,
              icon120: settings.icon_120,
              icon128: settings.icon_128,
              icon144: settings.icon_144,
              icon152: settings.icon_152,
              icon167: settings.icon_167,
              icon180: settings.icon_180,
              icon192: settings.icon_192,
              icon384: settings.icon_384,
              icon512: settings.icon_512,
              icon192Maskable: settings.icon_192_maskable,
              icon512Maskable: settings.icon_512_maskable
            }
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        if (method === 'POST') {
          const { appName, shortName, description, themeColor, backgroundColor } = await request.json();
          
          await query(`
            UPDATE pwa_settings 
            SET app_name = $1, 
                short_name = $2, 
                description = $3, 
                theme_color = $4, 
                background_color = $5,
                updated_at = NOW()
            WHERE id = (SELECT id FROM pwa_settings ORDER BY id DESC LIMIT 1)
          `, [appName, shortName, description, themeColor, backgroundColor]);
          
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      if (pathname.includes('/icons')) {
        if (method === 'GET') {
          const result = await query('SELECT * FROM pwa_settings ORDER BY id DESC LIMIT 1');
          if (result.rows.length === 0) {
            return new Response(JSON.stringify({}), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          
          const settings = result.rows[0];
          return new Response(JSON.stringify({
            icon16: settings.icon_16,
            icon32: settings.icon_32,
            icon72: settings.icon_72,
            icon96: settings.icon_96,
            icon120: settings.icon_120,
            icon128: settings.icon_128,
            icon144: settings.icon_144,
            icon152: settings.icon_152,
            icon167: settings.icon_167,
            icon180: settings.icon_180,
            icon192: settings.icon_192,
            icon384: settings.icon_384,
            icon512: settings.icon_512,
            icon192Maskable: settings.icon_192_maskable,
            icon512Maskable: settings.icon_512_maskable
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        if (method === 'POST') {
          const icons = await request.json();
          
          await query(`
            UPDATE pwa_settings 
            SET icon_16 = $1,
                icon_32 = $2,
                icon_72 = $3,
                icon_96 = $4,
                icon_120 = $5,
                icon_128 = $6,
                icon_144 = $7,
                icon_152 = $8,
                icon_167 = $9,
                icon_180 = $10,
                icon_192 = $11,
                icon_384 = $12,
                icon_512 = $13,
                icon_192_maskable = $14,
                icon_512_maskable = $15,
                updated_at = NOW()
            WHERE id = (SELECT id FROM pwa_settings ORDER BY id DESC LIMIT 1)
          `, [
            icons.icon16, icons.icon32, icons.icon72, icons.icon96, icons.icon120,
            icons.icon128, icons.icon144, icons.icon152, icons.icon167, icons.icon180,
            icons.icon192, icons.icon384, icons.icon512, icons.icon192Maskable, icons.icon512Maskable
          ]);
          
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
    }

    return new Response(
      JSON.stringify({ error: 'Admin endpoint not found' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in admin API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
