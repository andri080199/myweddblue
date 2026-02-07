-- Migration: Unified Theme System
-- Date: 2026-02-07
-- Description: Migrate from separated color+background themes to unified theme system
-- WARNING: This migration will DELETE all existing clients!

-- ==============================================================================
-- STEP 1: Create unified_themes table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS unified_themes (
  id SERIAL PRIMARY KEY,
  theme_id VARCHAR(255) UNIQUE NOT NULL,
  theme_name VARCHAR(255) NOT NULL,
  description TEXT,
  is_builtin BOOLEAN DEFAULT FALSE,

  -- Color palette (JSONB)
  colors JSONB NOT NULL DEFAULT '{}',

  -- Custom styles (JSONB)
  custom_styles JSONB DEFAULT '{}',

  -- Background images per section (JSONB)
  backgrounds JSONB NOT NULL DEFAULT '{}',

  -- Ornaments (JSONB)
  ornaments JSONB NOT NULL DEFAULT '{"ornaments": []}',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255)
);

-- Create indices
CREATE INDEX IF NOT EXISTS idx_unified_themes_theme_id ON unified_themes(theme_id);
CREATE INDEX IF NOT EXISTS idx_unified_themes_builtin ON unified_themes(is_builtin);

-- ==============================================================================
-- STEP 2: Insert built-in unified themes
-- ==============================================================================

-- Original Theme (Blue Wedding with Nature backgrounds)
INSERT INTO unified_themes (theme_id, theme_name, description, is_builtin, colors, custom_styles, backgrounds, ornaments)
VALUES (
  'original',
  'Original Blue',
  'Warna biru laut yang elegant dengan background alam',
  TRUE,
  '{
    "primary": "#9fd1ea",
    "primarylight": "#e5f1f9",
    "darkprimary": "#3295c5",
    "textprimary": "#1d6087",
    "gold": "#705a23",
    "lightblue": "#e5f1f9",
    "secondary": "#9fd1ea",
    "accent": "#705a23"
  }',
  '{
    "borderRadius": "1rem",
    "boxShadow": "0 4px 6px -1px rgba(61, 149, 197, 0.1)",
    "gradient": "linear-gradient(135deg, #9fd1ea 0%, #e5f1f9 100%)"
  }',
  '{
    "fullscreen": "/images/originaltheme/PohonPutih.jpg",
    "welcome": "/images/originaltheme/BangkuSalju.jpg",
    "event": "/images/originaltheme/BangkuSalju.jpg",
    "gallery": "/images/originaltheme/PohonPutih.jpg"
  }',
  '{"ornaments": []}'
);

-- City Modern Theme
INSERT INTO unified_themes (theme_id, theme_name, description, is_builtin, colors, custom_styles, backgrounds, ornaments)
VALUES (
  'city',
  'Urban City',
  'Warna kota modern dengan background metropolitan',
  TRUE,
  '{
    "primary": "#9fd1ea",
    "primarylight": "#e5f1f9",
    "darkprimary": "#3295c5",
    "textprimary": "#1d6087",
    "gold": "#705a23",
    "lightblue": "#e5f1f9",
    "secondary": "#9fd1ea",
    "accent": "#705a23"
  }',
  '{
    "borderRadius": "1rem",
    "boxShadow": "0 4px 6px -1px rgba(50, 149, 197, 0.1)",
    "gradient": "linear-gradient(135deg, #9fd1ea 0%, #e5f1f9 100%)"
  }',
  '{
    "fullscreen": "/images/citytheme/city1.jpeg",
    "welcome": "/images/citytheme/city2.jpeg",
    "event": "/images/citytheme/city3.jpeg",
    "gallery": "/images/citytheme/city4.jpeg"
  }',
  '{"ornaments": []}'
);

-- Flora Garden Theme (Romantic Pink + Flora backgrounds)
INSERT INTO unified_themes (theme_id, theme_name, description, is_builtin, colors, custom_styles, backgrounds, ornaments)
VALUES (
  'flora',
  'Flora Garden',
  'Warna pink romantis dengan background taman bunga',
  TRUE,
  '{
    "primary": "#F9A8D4",
    "primarylight": "#FDF2F8",
    "darkprimary": "#EC4899",
    "textprimary": "#BE185D",
    "gold": "#D97706",
    "lightblue": "#FDF2F8",
    "secondary": "#F9A8D4",
    "accent": "#D97706"
  }',
  '{
    "borderRadius": "1.2rem",
    "boxShadow": "0 4px 6px -1px rgba(236, 72, 153, 0.1)",
    "gradient": "linear-gradient(135deg, #F9A8D4 0%, #FDF2F8 100%)"
  }',
  '{
    "fullscreen": "/images/flora/flora1.jpeg",
    "welcome": "/images/flora/flora2.jpeg",
    "event": "/images/flora/flora3.jpeg",
    "gallery": "/images/flora/flora4.jpeg"
  }',
  '{"ornaments": []}'
);

-- Tropical Paradise Theme (Sunset colors + Tropical backgrounds)
INSERT INTO unified_themes (theme_id, theme_name, description, is_builtin, colors, custom_styles, backgrounds, ornaments)
VALUES (
  'tropical',
  'Tropical Paradise',
  'Tema sunset dengan background tropical eksotis',
  TRUE,
  '{
    "primary": "#FED7AA",
    "primarylight": "#FFF7ED",
    "darkprimary": "#EA580C",
    "textprimary": "#C2410C",
    "gold": "#F59E0B",
    "lightblue": "#FEF3C7",
    "secondary": "#FDBA74",
    "accent": "#F97316"
  }',
  '{
    "borderRadius": "1rem",
    "boxShadow": "0 4px 6px -1px rgba(234, 88, 12, 0.1)",
    "gradient": "linear-gradient(135deg, #FED7AA 0%, #FFF7ED 100%)"
  }',
  '{
    "fullscreen": "/images/tropicaltheme/tropical1.jpeg",
    "welcome": "/images/tropicaltheme/tropical2.jpeg",
    "event": "/images/tropicaltheme/tropical3.jpeg",
    "gallery": "/images/tropicaltheme/tropical1.jpeg"
  }',
  '{"ornaments": []}'
);

-- ==============================================================================
-- STEP 3: Delete all existing clients (CLEAN SLATE)
-- ==============================================================================

DELETE FROM clients;

-- ==============================================================================
-- STEP 4: Update clients table schema
-- ==============================================================================

-- Drop old theme columns
ALTER TABLE clients DROP COLUMN IF EXISTS theme;
ALTER TABLE clients DROP COLUMN IF EXISTS color_theme;
ALTER TABLE clients DROP COLUMN IF EXISTS background_theme;
ALTER TABLE clients DROP COLUMN IF EXISTS catalog_template_id;

-- Add new unified_theme_id column
ALTER TABLE clients ADD COLUMN IF NOT EXISTS unified_theme_id VARCHAR(255) REFERENCES unified_themes(theme_id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_clients_unified_theme ON clients(unified_theme_id);

-- ==============================================================================
-- STEP 5: Verification queries
-- ==============================================================================

-- Verify unified themes created
SELECT theme_id, theme_name, is_builtin,
       jsonb_object_keys(colors) as color_keys,
       jsonb_object_keys(backgrounds) as background_keys
FROM unified_themes
ORDER BY is_builtin DESC, theme_id;

-- Verify clients table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'clients' AND column_name = 'unified_theme_id';

-- Count clients (should be 0 after deletion)
SELECT COUNT(*) as client_count FROM clients;

-- ==============================================================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- ==============================================================================

-- WARNING: Rollback is destructive and will lose all unified themes!
-- Only use if you need to revert to old system.
--
-- To rollback:
-- 1. DROP TABLE unified_themes CASCADE;
-- 2. ALTER TABLE clients ADD COLUMN theme VARCHAR(255);
-- 3. ALTER TABLE clients ADD COLUMN color_theme VARCHAR(255);
-- 4. ALTER TABLE clients ADD COLUMN background_theme VARCHAR(255);
-- 5. ALTER TABLE clients ADD COLUMN catalog_template_id INTEGER;
-- 6. Manually recreate clients from backup if needed
