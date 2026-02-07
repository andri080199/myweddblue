import { NextRequest, NextResponse } from 'next/server';
import masterDB from '@/utils/db';

/**
 * API endpoint untuk menjalankan migration split custom themes
 * CAUTION: Endpoint ini seharusnya hanya dijalankan SEKALI
 * Gunakan dengan hati-hati!
 */
export async function POST(req: NextRequest) {
  try {
    console.log('🚀 Starting custom themes split migration...');

    // Step 1: Create custom_color_themes table
    console.log('📋 Step 1: Creating custom_color_themes table...');
    await masterDB.query(`
      CREATE TABLE IF NOT EXISTS custom_color_themes (
        id SERIAL PRIMARY KEY,
        theme_id VARCHAR(100) UNIQUE NOT NULL,
        theme_name VARCHAR(255) NOT NULL,
        description VARCHAR(500),
        colors JSONB NOT NULL,
        custom_styles JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await masterDB.query(`
      CREATE INDEX IF NOT EXISTS idx_custom_color_themes_theme_id
      ON custom_color_themes(theme_id)
    `);

    console.log('✅ custom_color_themes table created');

    // Step 2: Create custom_background_themes table
    console.log('📋 Step 2: Creating custom_background_themes table...');
    await masterDB.query(`
      CREATE TABLE IF NOT EXISTS custom_background_themes (
        id SERIAL PRIMARY KEY,
        theme_id VARCHAR(100) UNIQUE NOT NULL,
        theme_name VARCHAR(255) NOT NULL,
        description VARCHAR(500),
        backgrounds JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await masterDB.query(`
      CREATE INDEX IF NOT EXISTS idx_custom_background_themes_theme_id
      ON custom_background_themes(theme_id)
    `);

    console.log('✅ custom_background_themes table created');

    // Step 3: Check if custom_themes table exists
    const tableCheck = await masterDB.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'custom_themes'
      );
    `);

    const customThemesExists = tableCheck.rows[0].exists;

    if (!customThemesExists) {
      return NextResponse.json({
        success: true,
        message: 'Tables created successfully. No custom_themes table to migrate.',
        stats: {
          colorThemesCreated: 0,
          backgroundThemesCreated: 0,
          clientsUpdated: 0
        }
      });
    }

    // Step 4: Migrate color themes
    console.log('📋 Step 3: Migrating color themes from custom_themes...');
    const colorMigration = await masterDB.query(`
      INSERT INTO custom_color_themes (theme_id, theme_name, description, colors, custom_styles, created_at, updated_at)
      SELECT
        theme_id || '-color' AS theme_id,
        theme_name,
        description,
        colors,
        jsonb_build_object(
          'borderRadius', '1rem',
          'boxShadow', CASE
            WHEN colors->>'primary' IS NOT NULL
            THEN '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            ELSE ''
          END,
          'gradient', CASE
            WHEN colors->>'primary' IS NOT NULL AND colors->>'primarylight' IS NOT NULL
            THEN 'linear-gradient(135deg, ' || (colors->>'primary') || ' 0%, ' || (colors->>'primarylight') || ' 100%)'
            ELSE ''
          END
        ) AS custom_styles,
        created_at,
        updated_at
      FROM custom_themes
      WHERE NOT EXISTS (
        SELECT 1 FROM custom_color_themes WHERE custom_color_themes.theme_id = custom_themes.theme_id || '-color'
      )
    `);

    console.log(`✅ Migrated ${colorMigration.rowCount} color themes`);

    // Step 5: Migrate background themes (only if backgrounds exist)
    console.log('📋 Step 4: Migrating background themes from custom_themes...');
    const bgMigration = await masterDB.query(`
      INSERT INTO custom_background_themes (theme_id, theme_name, description, backgrounds, created_at, updated_at)
      SELECT
        theme_id || '-bg' AS theme_id,
        theme_name || ' Backgrounds' AS theme_name,
        'Background pack for ' || theme_name AS description,
        backgrounds,
        created_at,
        updated_at
      FROM custom_themes
      WHERE backgrounds IS NOT NULL
        AND backgrounds != '{}'::jsonb
        AND jsonb_typeof(backgrounds) = 'object'
        AND NOT EXISTS (
          SELECT 1 FROM custom_background_themes WHERE custom_background_themes.theme_id = custom_themes.theme_id || '-bg'
        )
    `);

    console.log(`✅ Migrated ${bgMigration.rowCount} background themes`);

    // Step 6: Update client references
    console.log('📋 Step 5: Updating client references...');
    const clientUpdate = await masterDB.query(`
      UPDATE clients
      SET
        color_theme = theme || '-color',
        background_theme = CASE
          WHEN EXISTS (
            SELECT 1 FROM custom_background_themes
            WHERE theme_id = theme || '-bg'
          )
          THEN theme || '-bg'
          ELSE 'original'
        END,
        theme = NULL
      WHERE theme IN (SELECT theme_id FROM custom_themes)
        AND color_theme IS NULL
    `);

    console.log(`✅ Updated ${clientUpdate.rowCount} clients`);

    // Step 7: Rename old table to backup
    console.log('📋 Step 6: Backing up custom_themes table...');
    await masterDB.query(`
      ALTER TABLE IF EXISTS custom_themes RENAME TO custom_themes_backup
    `);

    console.log('✅ custom_themes renamed to custom_themes_backup');

    // Get final stats
    const colorCount = await masterDB.query('SELECT COUNT(*) FROM custom_color_themes');
    const bgCount = await masterDB.query('SELECT COUNT(*) FROM custom_background_themes');
    const clientCount = await masterDB.query(`SELECT COUNT(*) FROM clients WHERE color_theme LIKE '%-color'`);

    console.log('🎉 Migration completed successfully!');

    return NextResponse.json({
      success: true,
      message: 'Custom themes split migration completed successfully',
      stats: {
        colorThemesCreated: parseInt(colorCount.rows[0].count),
        backgroundThemesCreated: parseInt(bgCount.rows[0].count),
        clientsUpdated: parseInt(clientCount.rows[0].count)
      },
      note: 'custom_themes table has been renamed to custom_themes_backup for safety'
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Migration failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * GET endpoint untuk cek status migration
 */
export async function GET(req: NextRequest) {
  try {
    // Check if new tables exist
    const colorTableExists = await masterDB.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'custom_color_themes'
      );
    `);

    const bgTableExists = await masterDB.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'custom_background_themes'
      );
    `);

    const oldTableExists = await masterDB.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'custom_themes'
      );
    `);

    const backupTableExists = await masterDB.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'custom_themes_backup'
      );
    `);

    let colorCount = 0;
    let bgCount = 0;
    let clientsWithNewSystem = 0;

    if (colorTableExists.rows[0].exists) {
      const result = await masterDB.query('SELECT COUNT(*) FROM custom_color_themes');
      colorCount = parseInt(result.rows[0].count);
    }

    if (bgTableExists.rows[0].exists) {
      const result = await masterDB.query('SELECT COUNT(*) FROM custom_background_themes');
      bgCount = parseInt(result.rows[0].count);
    }

    const clientResult = await masterDB.query(`SELECT COUNT(*) FROM clients WHERE color_theme LIKE '%-color'`);
    clientsWithNewSystem = parseInt(clientResult.rows[0].count);

    const isMigrated = colorTableExists.rows[0].exists &&
                       bgTableExists.rows[0].exists &&
                       backupTableExists.rows[0].exists;

    return NextResponse.json({
      success: true,
      migrationStatus: {
        isMigrated,
        colorThemesTableExists: colorTableExists.rows[0].exists,
        backgroundThemesTableExists: bgTableExists.rows[0].exists,
        oldTableExists: oldTableExists.rows[0].exists,
        backupTableExists: backupTableExists.rows[0].exists,
        stats: {
          colorThemes: colorCount,
          backgroundThemes: bgCount,
          clientsWithNewSystem
        }
      }
    });

  } catch (error) {
    console.error('Error checking migration status:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to check migration status',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
