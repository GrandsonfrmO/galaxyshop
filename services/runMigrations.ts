import { query } from './database';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Run all migrations from the migrations folder
 */
export const runMigrations = async () => {
  try {
    console.log('🚀 Starting database migrations...');

    // Create migrations tracking table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Get all migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`📁 Found ${migrationFiles.length} migration files`);

    // Execute each migration
    for (const file of migrationFiles) {
      try {
        // Check if migration already executed
        const result = await query(
          'SELECT * FROM migrations WHERE name = $1',
          [file]
        );

        if (result.rows.length > 0) {
          console.log(`✅ Migration already executed: ${file}`);
          continue;
        }

        // Read migration file
        const filePath = path.join(migrationsDir, file);
        const migrationSQL = fs.readFileSync(filePath, 'utf-8');

        // Execute migration
        console.log(`⏳ Executing migration: ${file}`);
        await query(migrationSQL);

        // Record migration
        await query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [file]
        );

        console.log(`✅ Migration completed: ${file}`);
      } catch (error) {
        console.error(`❌ Migration failed: ${file}`, error);
        throw error;
      }
    }

    console.log('✨ All migrations completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Migration process failed:', error);
    throw error;
  }
};

// Run migrations if this file is executed directly
const isMainModule = import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));
if (isMainModule || process.argv[1].includes('runMigrations')) {
  runMigrations()
    .then(() => {
      console.log('✅ Database is ready!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database migration failed:', error);
      process.exit(1);
    });
}

export default runMigrations;
