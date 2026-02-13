-- Migration: Create Ornament Library Table
-- Date: 2026-02-08
-- Purpose: Create reusable ornament library for themes

-- Create ornament_library table
CREATE TABLE IF NOT EXISTS ornament_library (
  id SERIAL PRIMARY KEY,
  ornament_name VARCHAR(255) NOT NULL,
  ornament_image TEXT NOT NULL,  -- Base64 encoded image
  category VARCHAR(100) DEFAULT 'general',  -- Category for grouping (flowers, borders, decorations, etc.)
  file_size INTEGER,  -- Size in bytes for tracking
  image_width INTEGER,  -- Original width
  image_height INTEGER,  -- Original height
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ornament_library_category ON ornament_library(category);
CREATE INDEX IF NOT EXISTS idx_ornament_library_name ON ornament_library(ornament_name);

-- Add comments
COMMENT ON TABLE ornament_library IS 'Reusable ornament library - upload once, use multiple times';
COMMENT ON COLUMN ornament_library.ornament_name IS 'Display name of the ornament';
COMMENT ON COLUMN ornament_library.ornament_image IS 'Base64 encoded image (compressed, max 500KB)';
COMMENT ON COLUMN ornament_library.category IS 'Category: flowers, borders, decorations, corners, dividers, etc.';

-- Insert some default ornaments if needed (optional)
-- You can add default ornaments here if you have some

-- Verification query
SELECT
  id,
  ornament_name,
  category,
  LENGTH(ornament_image) as image_size_bytes,
  created_at
FROM ornament_library
ORDER BY created_at DESC;
