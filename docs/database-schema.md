# Database Schema Documentation

## Overview
- **Database Name**: `undangan_db`
- **System**: PostgreSQL
- **Connection**: Managed via `pg` library (`src/utils/db.ts`)
- **Model**: Single database, multi-tenant with `client_id` separation.

## Tables

### 1. `clients`
Core table storing client information. Each client represents a wedding couple.

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PRIMARY KEY | Unique ID |
| `slug` | VARCHAR/TEXT | URL slug for the client (e.g., `andri-dan-ayu`) |
| `db_name` | VARCHAR/TEXT | Legacy column for separate DBs (Nullable) |
| `theme` | VARCHAR/TEXT | Legacy theme identifier |
| `color_theme` | VARCHAR/TEXT | ID of the selected color theme |
| `background_theme` | VARCHAR/TEXT | ID of the selected background theme |
| `catalog_template_id` | INTEGER | FK to external catalog template (if applicable) |
| `created_at` | TIMESTAMP | Creation timestamp |

### 2. `client_content`
Stores dynamic content for the invitation pages in JSON format.

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PRIMARY KEY | Unique ID |
| `client_id` | INTEGER | FK -> `clients.id` (ON DELETE CASCADE) |
| `content_type` | VARCHAR(100) | Type key (e.g., `couple_info`, `wedding_event`) |
| `content_data` | JSONB | The content payload |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

**Common `content_type` values:**
- `couple_info`: Bride & Groom names, parents, etc.
- `wedding_event`: Date, time, venue for Akad & Reception.
- `love_story`: Timeline of the couple's story.
- `gift_address`: Gift delivery details.
- `gift_visibility`: Settings for showing/hiding gift sections.
- `gallery_video`: YouTube video URL.
- `music_config`: Background music settings.

### 3. `client_gallery`
Stores gallery photos for clients.

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PRIMARY KEY | Unique ID |
| `client_id` | INTEGER | FK -> `clients.id` (ON DELETE CASCADE) |
| `image_url` | TEXT | Base64 string or URL of the image |
| `image_order` | INTEGER | Display order |
| `created_at` | TIMESTAMP | |

### 4. `guestbook`
Stores messages/wishes from guests.

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PRIMARY KEY | Unique ID |
| `client_id` | INTEGER | FK -> `clients.id` (ON DELETE CASCADE) |
| `name` | VARCHAR(255) | Name of the guest |
| `message` | TEXT | The wish/message |
| `timestamp` | TIMESTAMP | Time of submission |

### 5. `rsvp`
Stores attendance confirmations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PRIMARY KEY | Unique ID |
| `client_id` | INTEGER | FK -> `clients.id` (ON DELETE CASCADE) |
| `name` | VARCHAR(255) | Name of the guest |
| `isattending` | BOOLEAN | True if attending, False otherwise |
| `responsedate` | TIMESTAMP | Time of response |

### 6. `guest_names`
Pre-registered guest list for generating personalized invitations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PRIMARY KEY | Unique ID |
| `client_id` | INTEGER | FK -> `clients.id` (ON DELETE CASCADE) |
| `name` | VARCHAR(255) | Name of the guest |
| `phone` | VARCHAR(50) | Phone number (for WhatsApp) |
| `url` | VARCHAR(500) | Specific URL slug for the guest |
| `created_at` | TIMESTAMP | |

### 7. `whatsapp_template`
Custom WhatsApp message templates for sharing invitations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PRIMARY KEY | Unique ID |
| `client_id` | INTEGER | FK -> `clients.id` (ON DELETE CASCADE) |
| `template_text` | TEXT | The message template |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

### 8. `custom_color_themes`
Defines custom color palettes available for selection.

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PRIMARY KEY | |
| `theme_id` | VARCHAR(100) UNIQUE | Unique identifier (e.g., `ocean-blue-color`) |
| `theme_name` | VARCHAR(255) | Display name |
| `description` | VARCHAR(500) | |
| `colors` | JSONB | Object containing color definitions (primary, secondary, etc.) |
| `custom_styles` | JSONB | Additional CSS variables or styles |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

### 9. `custom_background_themes`
Defines custom background image sets.

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PRIMARY KEY | |
| `theme_id` | VARCHAR(100) UNIQUE | Unique identifier (e.g., `nature-bg`) |
| `theme_name` | VARCHAR(255) | Display name |
| `description` | VARCHAR(500) | |
| `backgrounds` | JSONB | Object containing URLs for different sections (hero, footer, etc.) |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

### 10. `template_ornaments`
Stores ornament configurations linked to catalog templates.

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PRIMARY KEY | |
| `template_id` | INTEGER UNIQUE | ID matching the catalog template |
| `ornaments_data` | JSONB | Array of ornament objects (position, scale, image) |
| `created_by` | VARCHAR(255) | Creator identifier |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

## Relationships

- **One-to-Many**: `clients` -> `client_content`, `client_gallery`, `guestbook`, `rsvp`, `guest_names`, `whatsapp_template`.
- **Foreign Keys**: All client-related tables use `client_id` referencing `clients(id)` with `ON DELETE CASCADE`.

## content_data JSON Structure (Example)

**`couple_info`**:
```json
{
  "brideName": "Siti Nurhaliza",
  "groomName": "Ahmad Dani",
  "brideParent": "Bpk. X & Ibu Y",
  "groomParent": "Bpk. A & Ibu B"
}
```

**`wedding_event`**:
```json
{
  "akadDate": "2026-05-15",
  "akadTime": "08:00",
  "akadVenue": "Masjid Agung",
  "receptionDate": "2026-05-15",
  "receptionTime": "11:00",
  "receptionVenue": "Gedung Serbaguna"
}
```
