import fs from 'fs';
import path from 'path';
import pool from './database';

/**
 * Initialize the database with schema and initial data
 */
export const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');

    // Read migration SQL file
    const migrationPath = path.join(__dirname, 'migrations.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    for (const statement of statements) {
      try {
        await pool.query(statement);
        console.log('✅ Executed:', statement.substring(0, 50) + '...');
      } catch (error: any) {
        // Ignore "already exists" errors
        if (!error.message.includes('already exists')) {
          console.error('❌ Error executing statement:', error.message);
        }
      }
    }

    console.log('✅ Database initialized successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
};

/**
 * Test database connection
 */
export const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

/**
 * Get database statistics
 */
export const getDatabaseStats = async () => {
  try {
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    const stats: any = {};

    for (const table of tables.rows) {
      const result = await pool.query(
        `SELECT COUNT(*) as count FROM ${table.table_name}`
      );
      stats[table.table_name] = result.rows[0].count;
    }

    return stats;
  } catch (error) {
    console.error('❌ Error getting database stats:', error);
    return null;
  }
};

// Run initialization if this file is executed directly
if (require.main === module) {
  (async () => {
    const connected = await testConnection();
    if (connected) {
      await initializeDatabase();
      const stats = await getDatabaseStats();
      console.log('📊 Database Statistics:', stats);
    }
    process.exit(0);
  })();
}
