-- Migration: Add Sample Gallery Fields to Unified Themes
-- Date: 2026-02-08
-- Purpose: Add template gallery system for storage efficiency

-- Add sample gallery columns to unified_themes table
ALTER TABLE unified_themes
  ADD COLUMN IF NOT EXISTS sample_gallery_source VARCHAR(20) DEFAULT 'template',
  ADD COLUMN IF NOT EXISTS sample_gallery_template VARCHAR(100) DEFAULT 'wedding-classic',
  ADD COLUMN IF NOT EXISTS sample_gallery_photos JSONB DEFAULT '{"photos": []}';

-- Add comments for documentation
COMMENT ON COLUMN unified_themes.sample_gallery_source IS 'Source of sample gallery photos: "template" (reusable) or "custom" (theme-specific)';
COMMENT ON COLUMN unified_themes.sample_gallery_template IS 'Gallery template ID when source is "template" (e.g., "wedding-classic")';
COMMENT ON COLUMN unified_themes.sample_gallery_photos IS 'Custom gallery photos JSONB when source is "custom": {"photos": [{"image_url": "...", "order": 1}]}';

-- Create index for template lookups
CREATE INDEX IF NOT EXISTS idx_unified_themes_gallery_template ON unified_themes(sample_gallery_template);

-- Update existing themes to use default template
UPDATE unified_themes
SET sample_gallery_source = 'template',
    sample_gallery_template = 'wedding-classic'
WHERE sample_gallery_source IS NULL;

-- Verification query
SELECT theme_id, theme_name, sample_gallery_source, sample_gallery_template
FROM unified_themes
ORDER BY is_builtin DESC, theme_id;
