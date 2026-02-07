-- Migration: Add Template Ornaments Support
-- Created: 2026-02-07
-- Purpose: Add template-level ornament system where ornaments are stored per catalog template
--          instead of per client, allowing all clients using a template to inherit the same ornaments

-- ===========================
-- 1. Create template_ornaments table
-- ===========================

CREATE TABLE IF NOT EXISTS template_ornaments (
  id SERIAL PRIMARY KEY,
  template_id INTEGER NOT NULL,
  ornaments_data JSONB NOT NULL DEFAULT '{"ornaments": []}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  UNIQUE(template_id)
);

-- Add index for fast lookups by template_id
CREATE INDEX IF NOT EXISTS idx_template_ornaments_template_id
  ON template_ornaments(template_id);

COMMENT ON TABLE template_ornaments IS 'Stores ornament configurations for catalog templates';
COMMENT ON COLUMN template_ornaments.template_id IS 'References catalog template ID from external API';
COMMENT ON COLUMN template_ornaments.ornaments_data IS 'JSONB array of ornament objects with positions, transforms, and styles';

-- ===========================
-- 2. Add template reference to clients table
-- ===========================

-- Add catalog_template_id column to clients table
-- This links a client to a catalog template so they can inherit ornaments
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS catalog_template_id INTEGER;

-- Add index for fast lookups
CREATE INDEX IF NOT EXISTS idx_clients_template_id
  ON clients(catalog_template_id);

COMMENT ON COLUMN clients.catalog_template_id IS 'References catalog template ID (from external API). Client inherits template ornaments.';

-- ===========================
-- 3. Example ornaments_data structure
-- ===========================

/*
Example JSONB structure for ornaments_data:

{
  "ornaments": [
    {
      "id": "orn-1707291234567",
      "section": "fullscreen",
      "name": "Flower Top Right",
      "image": "data:image/png;base64,iVBORw0KGgoAAAANS...",
      "position": {
        "top": "10%",
        "left": "85%",
        "right": null,
        "bottom": null
      },
      "transform": {
        "scale": 1.2,
        "rotate": 15
      },
      "style": {
        "width": "150px",
        "height": "auto",
        "opacity": 0.9,
        "zIndex": 15
      },
      "isVisible": true,
      "createdAt": "2026-02-07T10:30:00Z"
    }
  ]
}

Supported sections:
- fullscreen, kutipan, welcome, timeline, event, gift
- gallery, rsvp, guestbook, thankyou, footer
*/

-- ===========================
-- 4. Verification Queries
-- ===========================

-- Check if table was created successfully
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'template_ornaments'
ORDER BY ordinal_position;

-- Check if indexes were created
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'template_ornaments';

-- Check if clients table was updated
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'clients' AND column_name = 'catalog_template_id';
