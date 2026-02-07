-- Migration Script: Split Custom Themes into Color and Background Themes
-- Date: 2026-02-01
-- Purpose: Separate bundled custom themes into custom_color_themes and custom_background_themes
--          to enable mix-and-match flexibility like legacy themes

-- =============================================================================
-- STEP 1: Create new tables
-- =============================================================================

-- Custom Color Themes (colors only, no backgrounds)
CREATE TABLE IF NOT EXISTS custom_color_themes (
  id SERIAL PRIMARY KEY,
  theme_id VARCHAR(100) UNIQUE NOT NULL,
  theme_name VARCHAR(255) NOT NULL,
  description VARCHAR(500),
  colors JSONB NOT NULL,
  custom_styles JSONB DEFAULT '{"borderRadius":"1rem","boxShadow":"","gradient":""}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_custom_color_themes_theme_id ON custom_color_themes(theme_id);

-- Custom Background Themes (backgrounds only, no colors)
CREATE TABLE IF NOT EXISTS custom_background_themes (
  id SERIAL PRIMARY KEY,
  theme_id VARCHAR(100) UNIQUE NOT NULL,
  theme_name VARCHAR(255) NOT NULL,
  description VARCHAR(500),
  backgrounds JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_custom_background_themes_theme_id ON custom_background_themes(theme_id);

-- =============================================================================
-- STEP 2: Migrate data from custom_themes to new tables
-- =============================================================================

-- Extract color themes (all custom themes → custom_color_themes)
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
      THEN '0 4px 6px -1px rgba(' || colors->>'primary' || ', 0.1)'
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
);

-- Extract background themes (only if backgrounds exist)
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
  );

-- =============================================================================
-- STEP 3: Update client references
-- =============================================================================

-- Update clients table to use new color_theme and background_theme columns
-- For clients using custom themes
UPDATE clients
SET
  color_theme = theme || '-color',
  background_theme = CASE
    WHEN EXISTS (
      SELECT 1 FROM custom_background_themes
      WHERE theme_id = theme || '-bg'
    )
    THEN theme || '-bg'
    ELSE 'original'  -- Fallback to original background if no custom backgrounds
  END,
  theme = NULL  -- Clear old theme column
WHERE theme IN (SELECT theme_id FROM custom_themes)
  AND color_theme IS NULL;  -- Only update if not already migrated

-- =============================================================================
-- STEP 4: Backup old table
-- =============================================================================

-- Rename custom_themes to custom_themes_backup for safety
-- Keep for 30 days, then can be dropped
ALTER TABLE IF EXISTS custom_themes RENAME TO custom_themes_backup;

-- =============================================================================
-- STEP 5: Verify migration
-- =============================================================================

-- Show migration results
DO $$
DECLARE
  color_count INTEGER;
  bg_count INTEGER;
  client_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO color_count FROM custom_color_themes;
  SELECT COUNT(*) INTO bg_count FROM custom_background_themes;
  SELECT COUNT(*) INTO client_count FROM clients WHERE color_theme LIKE '%-color';

  RAISE NOTICE '=== Migration Summary ===';
  RAISE NOTICE 'Custom color themes created: %', color_count;
  RAISE NOTICE 'Custom background themes created: %', bg_count;
  RAISE NOTICE 'Clients migrated to new system: %', client_count;
  RAISE NOTICE '========================';
END $$;

-- =============================================================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- =============================================================================

-- To rollback this migration:
-- 1. Restore custom_themes from backup:
--    ALTER TABLE custom_themes_backup RENAME TO custom_themes;
--
-- 2. Restore client references:
--    UPDATE clients
--    SET theme = REPLACE(color_theme, '-color', ''),
--        color_theme = NULL,
--        background_theme = NULL
--    WHERE color_theme LIKE '%-color';
--
-- 3. Drop new tables:
--    DROP TABLE custom_color_themes;
--    DROP TABLE custom_background_themes;
