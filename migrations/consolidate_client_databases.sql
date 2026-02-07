-- Migration: Consolidate Client Databases to Single Database
-- Date: 2026-02-03
-- Purpose: Merge all per-client databases into master database with client_id foreign keys

-- =============================================================================
-- STEP 1: Create unified tables in master database
-- =============================================================================

-- RSVP Table (all clients)
CREATE TABLE IF NOT EXISTS rsvp (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  isattending BOOLEAN NOT NULL,
  responsedate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_rsvp_client_id ON rsvp(client_id);

-- Guestbook Table (all clients)
CREATE TABLE IF NOT EXISTS guestbook (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_guestbook_client_id ON guestbook(client_id);

-- Guest Names Table (all clients)
CREATE TABLE IF NOT EXISTS guest_names (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_guest_names_client_id ON guest_names(client_id);
CREATE INDEX IF NOT EXISTS idx_guest_names_url ON guest_names(url);

-- Client Content Table (all clients)
CREATE TABLE IF NOT EXISTS client_content (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL,
  content_type VARCHAR(100) NOT NULL,
  content_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  UNIQUE(client_id, content_type)
);

CREATE INDEX IF NOT EXISTS idx_client_content_client_id ON client_content(client_id);

-- Client Gallery Table (all clients)
CREATE TABLE IF NOT EXISTS client_gallery (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  image_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_client_gallery_client_id ON client_gallery(client_id);
CREATE INDEX IF NOT EXISTS idx_client_gallery_order ON client_gallery(client_id, image_order);

-- WhatsApp Template Table (all clients)
CREATE TABLE IF NOT EXISTS whatsapp_template (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL,
  template_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  UNIQUE(client_id)
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_template_client_id ON whatsapp_template(client_id);

-- =============================================================================
-- STEP 2: Migrate existing data from per-client databases
-- =============================================================================

-- Enable dblink extension for cross-database queries
CREATE EXTENSION IF NOT EXISTS dblink;

-- Migration function
DO $$
DECLARE
  client_record RECORD;
  db_conn TEXT;
  row_count INTEGER;
BEGIN
  FOR client_record IN SELECT id, slug, db_name FROM clients WHERE db_name IS NOT NULL
  LOOP
    RAISE NOTICE '=== Migrating client: % (ID: %) ===', client_record.slug, client_record.id;

    -- Build connection string
    db_conn := format('dbname=%s user=postgres password=password host=localhost', client_record.db_name);

    BEGIN
      -- Test connection
      PERFORM dblink_connect('client_conn', db_conn);

      -- 1. Migrate RSVP
      INSERT INTO rsvp (client_id, name, isattending, responsedate)
      SELECT
        client_record.id,
        name,
        isattending,
        responsedate
      FROM dblink('client_conn', 'SELECT name, isattending, responsedate FROM rsvp')
        AS t(name VARCHAR, isattending BOOLEAN, responsedate TIMESTAMP);

      GET DIAGNOSTICS row_count = ROW_COUNT;
      RAISE NOTICE '  → Migrated % RSVP entries', row_count;

      -- 2. Migrate Guestbook
      INSERT INTO guestbook (client_id, name, message, timestamp)
      SELECT
        client_record.id,
        name,
        message,
        timestamp
      FROM dblink('client_conn', 'SELECT name, message, timestamp FROM guestbook')
        AS t(name VARCHAR, message TEXT, timestamp TIMESTAMP);

      GET DIAGNOSTICS row_count = ROW_COUNT;
      RAISE NOTICE '  → Migrated % guestbook entries', row_count;

      -- 3. Migrate Guest Names
      INSERT INTO guest_names (client_id, name, phone, url, created_at)
      SELECT
        client_record.id,
        name,
        phone,
        url,
        created_at
      FROM dblink('client_conn', 'SELECT name, phone, url, created_at FROM guest_names')
        AS t(name VARCHAR, phone VARCHAR, url VARCHAR, created_at TIMESTAMP);

      GET DIAGNOSTICS row_count = ROW_COUNT;
      RAISE NOTICE '  → Migrated % guest names', row_count;

      -- 4. Migrate Client Content
      INSERT INTO client_content (client_id, content_type, content_data, created_at, updated_at)
      SELECT
        client_record.id,
        content_type,
        content_data,
        created_at,
        updated_at
      FROM dblink('client_conn', 'SELECT content_type, content_data, created_at, updated_at FROM client_content')
        AS t(content_type VARCHAR, content_data JSONB, created_at TIMESTAMP, updated_at TIMESTAMP)
      ON CONFLICT (client_id, content_type) DO UPDATE
        SET content_data = EXCLUDED.content_data,
            updated_at = EXCLUDED.updated_at;

      GET DIAGNOSTICS row_count = ROW_COUNT;
      RAISE NOTICE '  → Migrated % content entries', row_count;

      -- 5. Migrate Client Gallery
      INSERT INTO client_gallery (client_id, image_url, image_order, created_at)
      SELECT
        client_record.id,
        image_url,
        image_order,
        created_at
      FROM dblink('client_conn', 'SELECT image_url, image_order, created_at FROM client_gallery')
        AS t(image_url TEXT, image_order INTEGER, created_at TIMESTAMP);

      GET DIAGNOSTICS row_count = ROW_COUNT;
      RAISE NOTICE '  → Migrated % gallery images', row_count;

      -- 6. Migrate WhatsApp Template (if exists)
      BEGIN
        INSERT INTO whatsapp_template (client_id, template_text, created_at, updated_at)
        SELECT
          client_record.id,
          template_text,
          created_at,
          updated_at
        FROM dblink('client_conn', 'SELECT template_text, created_at, updated_at FROM whatsapp_template LIMIT 1')
          AS t(template_text TEXT, created_at TIMESTAMP, updated_at TIMESTAMP)
        ON CONFLICT (client_id) DO UPDATE
          SET template_text = EXCLUDED.template_text,
              updated_at = EXCLUDED.updated_at;

        GET DIAGNOSTICS row_count = ROW_COUNT;
        RAISE NOTICE '  → Migrated whatsapp template: % rows', row_count;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE NOTICE '  → WhatsApp template table not found (skipped)';
      END;

      -- Disconnect
      PERFORM dblink_disconnect('client_conn');

    EXCEPTION
      WHEN OTHERS THEN
        RAISE NOTICE '  ✗ Failed to migrate %: %', client_record.slug, SQLERRM;
        -- Try to disconnect if connection exists
        BEGIN
          PERFORM dblink_disconnect('client_conn');
        EXCEPTION WHEN OTHERS THEN
          NULL;
        END;
    END;

  END LOOP;

  RAISE NOTICE '=== Migration Summary ===';
  RAISE NOTICE 'Total RSVP entries: %', (SELECT COUNT(*) FROM rsvp);
  RAISE NOTICE 'Total guestbook entries: %', (SELECT COUNT(*) FROM guestbook);
  RAISE NOTICE 'Total guest names: %', (SELECT COUNT(*) FROM guest_names);
  RAISE NOTICE 'Total content entries: %', (SELECT COUNT(*) FROM client_content);
  RAISE NOTICE 'Total gallery images: %', (SELECT COUNT(*) FROM client_gallery);
  RAISE NOTICE '========================';
END $$;

-- =============================================================================
-- STEP 3: Verification queries
-- =============================================================================

-- Show migration results per client
SELECT
  c.id,
  c.slug,
  COUNT(DISTINCT r.id) as rsvp_count,
  COUNT(DISTINCT g.id) as guestbook_count,
  COUNT(DISTINCT gn.id) as guest_names_count,
  COUNT(DISTINCT cc.id) as content_count,
  COUNT(DISTINCT cg.id) as gallery_count
FROM clients c
LEFT JOIN rsvp r ON r.client_id = c.id
LEFT JOIN guestbook g ON g.client_id = c.id
LEFT JOIN guest_names gn ON gn.client_id = c.id
LEFT JOIN client_content cc ON cc.client_id = c.id
LEFT JOIN client_gallery cg ON cg.client_id = c.id
GROUP BY c.id, c.slug
ORDER BY c.id;

-- =============================================================================
-- STEP 4: Update clients table (make db_name nullable for new unified system)
-- =============================================================================

-- Make db_name nullable since new clients won't have separate databases
ALTER TABLE clients ALTER COLUMN db_name DROP NOT NULL;

-- NOTE: After confirming all clients work with unified system, you can drop db_name:
-- ALTER TABLE clients DROP COLUMN IF EXISTS db_name;

-- =============================================================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- =============================================================================

-- To rollback this migration:
-- 1. Drop new tables:
--    DROP TABLE IF EXISTS whatsapp_template CASCADE;
--    DROP TABLE IF EXISTS client_gallery CASCADE;
--    DROP TABLE IF EXISTS client_content CASCADE;
--    DROP TABLE IF EXISTS guest_names CASCADE;
--    DROP TABLE IF EXISTS guestbook CASCADE;
--    DROP TABLE IF EXISTS rsvp CASCADE;
--
-- 2. Re-run create-client for each client to recreate separate databases
