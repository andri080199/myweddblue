# Unified Theme System Documentation

## Overview

Unified Theme System adalah solusi tema all-in-one yang menggabungkan **colors**, **backgrounds**, dan **ornaments** dalam satu paket tema.

### Key Features

✅ **All-in-One**: Satu tema berisi colors + backgrounds + ornaments
✅ **Built-in & Custom**: Support tema bawaan dan custom
✅ **Per-Section Backgrounds**: Setiap section punya background sendiri
✅ **Decorative Ornaments**: Editor drag & drop untuk ornaments
✅ **Live Preview**: Preview undangan lengkap dengan sample data
✅ **Client-Ready**: Client pilih satu tema, dapat semua

### System Components

```
Unified Theme
├── Colors (JSONB)
│   ├── primary, secondary, accent
│   ├── text colors
│   └── background colors
├── Backgrounds (JSONB)
│   ├── fullscreen, kutipan, welcome
│   ├── timeline, event, gift
│   ├── gallery, rsvp, guestbook
│   └── thankyou, footer
└── Ornaments (JSONB)
    └── Array of ornaments per section
```

### Keunggulan vs Old System

| Aspek | Old System | Unified System |
|-------|-----------|----------------|
| **Pilih Tema** | Pilih colors, backgrounds, template terpisah | Pilih SATU tema |
| **Storage** | 3 tabel terpisah | 1 tabel `unified_themes` |
| **Admin** | Buat colors → backgrounds → ornaments | Semua dalam 1 halaman |
| **Client** | Pilih multiple IDs | Pilih `unified_theme_id` |
| **Preview** | Preview terpisah | Preview undangan lengkap |

## Database Schema

### `unified_themes` Table

```sql
CREATE TABLE unified_themes (
  theme_id VARCHAR(100) PRIMARY KEY,          -- e.g., "ocean-breeze"
  theme_name VARCHAR(255) NOT NULL,           -- e.g., "Ocean Breeze"
  description TEXT,
  colors JSONB NOT NULL DEFAULT '{}',
  backgrounds JSONB NOT NULL DEFAULT '{}',
  ornaments JSONB NOT NULL DEFAULT '{"ornaments": []}',
  custom_styles JSONB DEFAULT '{}',
  is_builtin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Colors JSONB

```json
{
  "primary": "#3B82F6",
  "secondary": "#10B981",
  "accent": "#F59E0B",
  "primarylight": "#DBEAFE",
  "darkprimary": "#1E40AF",
  "gold": "#FFD700",
  "text": {
    "primary": "#1F2937",
    "secondary": "#6B7280"
  }
}
```

### Backgrounds JSONB

```json
{
  "fullscreen": "data:image/jpeg;base64,...",
  "kutipan": "data:image/jpeg;base64,...",
  "welcome": "data:image/jpeg;base64,...",
  "timeline": "data:image/jpeg;base64,...",
  "event": "data:image/jpeg;base64,...",
  "gift": "data:image/jpeg;base64,...",
  "gallery": "data:image/jpeg;base64,...",
  "rsvp": "data:image/jpeg;base64,...",
  "guestbook": "data:image/jpeg;base64,...",
  "thankyou": "data:image/jpeg;base64,...",
  "footer": "data:image/jpeg;base64,..."
}
```

### Ornaments JSONB

Lihat [Unified Theme Ornaments Documentation](./unified-theme-ornaments.md) untuk detail lengkap.

## Admin Workflow

### 1. Membuat Tema Baru

**Route:** `/admin/create-unified-theme`

**Langkah:**

1. **Basic Info**
   - Theme ID: `ocean-breeze` (slug, unique)
   - Theme Name: `Ocean Breeze`
   - Description: `Tema ocean yang tenang`

2. **Set Colors**
   - Primary, Secondary, Accent colors
   - Text colors (auto-filled dengan defaults)

3. **Upload Backgrounds** (11 sections)
   - Fullscreen, Kutipan, Welcome, Timeline, Event
   - Gift, Gallery, RSVP, Guestbook, Thankyou, Footer
   - Auto-compressed ke < 500KB
   - Converted ke base64

4. **Save**
   - Klik "Save Theme"
   - Tema tersimpan di `unified_themes`

### 2. Edit Tema

**Route:** `/admin/create-unified-theme?themeId={id}`

- Edit colors, backgrounds, description
- Built-in themes read-only
- Update saved dengan timestamp baru

### 3. Tambah Ornaments

**Route:** `/admin/unified-themes/[themeId]/ornaments`

**Workflow:**
1. Pilih section (dropdown)
2. Upload ornament image
3. Drag & drop untuk posisi
4. Resize, rotate, adjust opacity/scale/z-index
5. Save changes

Lihat [Unified Theme Ornaments Doc](./unified-theme-ornaments.md) untuk detail.

### 4. Preview Tema

**Route:** `/undangan/preview/[themeId]`

- Preview undangan lengkap dengan sample data
- Semua 11 sections ditampilkan
- Background dan ornaments applied
- Fully interactive

**Akses:**
- Theme list → "Preview Undangan" button
- Theme edit page → "Preview Undangan" button
- Ornament editor → "Preview Undangan" button

### 5. Manage Themes

**Route:** `/admin/theme-backgrounds`

**Actions:**
- **Edit Theme**: Ubah colors/backgrounds
- **Edit Ornaments**: Buka ornament editor
- **Preview Undangan**: Lihat full invitation
- **Delete**: Hapus tema (jika tidak dipakai)

## Client Integration

### Create Client dengan Unified Theme

**Route:** `/admin/create-client`

```tsx
<select name="unifiedThemeId">
  <option value="ocean-breeze">Ocean Breeze</option>
  <option value="romantic-pink">Romantic Pink</option>
  <option value="elegant-gold">Elegant Gold</option>
</select>
```

Client created dengan `unified_theme_id`, tema otomatis applied.

### Fetch Theme di Invitation

```typescript
// /app/undangan/[clientSlug]/[guestSlug]/page.tsx

// 1. Fetch client
const client = await fetchClient(clientSlug);

// 2. Get theme ID
const themeId = client.unified_theme_id;

// 3. Fetch theme
const response = await fetch(`/api/unified-themes?themeId=${themeId}`);
const { theme } = await response.json();

// 4. Create legacy theme for ThemeProvider
const legacyTheme = {
  colors: theme.colors,
  images: {
    hero: theme.backgrounds.fullscreen,
    background: theme.backgrounds.welcome,
  },
  typography: { /* ... */ }
};

// 5. Render
<ThemeProvider theme={legacyTheme}>
  <FullScreenImage themeId={themeId} />
  <Welcome themeId={themeId} />
  {/* ... all sections dengan themeId */}
</ThemeProvider>
```

## Component Architecture

### useUnifiedTheme Hook

**Location:** `/src/hooks/useUnifiedTheme.ts`

**Usage:**

```typescript
import { useUnifiedTheme } from '@/hooks/useUnifiedTheme';

const MySection = ({ themeId }) => {
  const { getOrnaments, getBackground, loading } = useUnifiedTheme(themeId);

  if (loading) return <Loading />;

  return (
    <section className="relative">
      {/* Background */}
      <Image src={getBackground('welcome')} fill />

      {/* Content */}
      <div className="relative z-10">...</div>

      {/* Ornaments */}
      <OrnamentLayer ornaments={getOrnaments('welcome')} />
    </section>
  );
};
```

**Available Methods:**

| Method | Description | Return |
|--------|-------------|--------|
| `getOrnaments(section)` | Get ornaments untuk section | `Ornament[]` |
| `getBackground(section)` | Get background untuk section | `string \| undefined` |
| `getAllOrnaments()` | Get semua ornaments | `Ornament[]` |
| `getOrnamentCount(section)` | Hitung ornaments di section | `number` |
| `hasOrnaments(section)` | Cek ada ornaments atau tidak | `boolean` |
| `refetch()` | Reload theme dari API | `Promise<void>` |

### Component Pattern

Semua 11 wedding sections ikuti pattern ini:

```typescript
// 1. Props interface
interface SectionProps {
  clientSlug: string;
  themeId?: string;
}

// 2. Component
const Section = ({ themeId }) => {
  const { theme } = useThemeContext();
  const { getOrnaments, getBackground } = useUnifiedTheme(themeId);

  // 3. Get background
  const backgroundImage = getBackground('section_name') || theme.images.background;

  // 4. Render
  return (
    <section className="relative">
      <div className="absolute inset-0">
        <Image src={backgroundImage} fill unoptimized={backgroundImage?.startsWith('data:')} />
      </div>
      <div className="relative z-10">{/* Content */}</div>
      <OrnamentLayer ornaments={getOrnaments('section_name')} />
    </section>
  );
};
```

### Supported Sections

| Component | Section ID | Background Key |
|-----------|-----------|----------------|
| FullScreenImage | `fullscreen` | `backgrounds.fullscreen` |
| KutipanAyat | `kutipan` | `backgrounds.kutipan` |
| Welcome | `welcome` | `backgrounds.welcome` |
| Timeline | `timeline` | `backgrounds.timeline` |
| WeddingEvent | `event` | `backgrounds.event` |
| WeddingGift | `gift` | `backgrounds.gift` |
| OurGallery | `gallery` | `backgrounds.gallery` |
| RSVPForm | `rsvp` | `backgrounds.rsvp` |
| GuestBookList | `guestbook` | `backgrounds.guestbook` |
| ThankYouMessage | `thankyou` | `backgrounds.thankyou` |
| Footer | `footer` | `backgrounds.footer` |

## API Reference

### GET `/api/unified-themes`

**Query:** `?themeId={id}` (optional)

**Response (single):**
```json
{
  "success": true,
  "theme": {
    "theme_id": "ocean-breeze",
    "theme_name": "Ocean Breeze",
    "colors": { /* ... */ },
    "backgrounds": { /* ... */ },
    "ornaments": { /* ... */ }
  }
}
```

**Response (all):**
```json
{
  "success": true,
  "themes": [{ /* ... */ }]
}
```

### POST `/api/unified-themes`

**Body:**
```json
{
  "themeId": "ocean-breeze",
  "themeName": "Ocean Breeze",
  "description": "Ocean theme",
  "colors": { /* ... */ },
  "backgrounds": { /* ... */ }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Theme 'ocean-breeze' saved successfully",
  "themeId": "ocean-breeze"
}
```

### POST `/api/unified-themes/ornaments`

**Body:**
```json
{
  "themeId": "ocean-breeze",
  "ornaments": [{ /* ... */ }]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully saved 5 ornament(s) for theme ocean-breeze"
}
```

### GET `/api/client-theme`

**Query:** `?clientSlug={slug}`

**Response:**
```json
{
  "success": true,
  "theme": { /* unified theme object */ }
}
```

## Migration dari Old System

### Old System → Unified System

**Old:**
```
custom_color_themes table
custom_background_themes table
template_ornaments table
```

**New:**
```
unified_themes table (all-in-one)
```

### Migration Code

**Update Components:**

```typescript
// BEFORE (Old System)
interface WelcomeProps {
  customBackground?: string;
  templateId?: number | null;
}

const Welcome = ({ customBackground, templateId }) => {
  const { getOrnaments } = useTemplateOrnaments(templateId);
  const backgroundImage = customBackground || theme.images.background;
  // ...
};

// AFTER (Unified System)
interface WelcomeProps {
  themeId?: string;
}

const Welcome = ({ themeId }) => {
  const { getOrnaments, getBackground } = useUnifiedTheme(themeId);
  const backgroundImage = getBackground('welcome') || theme.images.background;
  // ...
};
```

**Changes Required:**
1. ✅ Replace `templateId` prop → `themeId`
2. ✅ Replace `customBackground` prop → remove, use `getBackground()`
3. ✅ Replace `useTemplateOrnaments` → `useUnifiedTheme`
4. ✅ Update `getOrnaments()` call (same signature)
5. ✅ Add `getBackground('section_name')` call

## Best Practices

### Theme Creation

1. **Naming**
   - Theme ID: kebab-case (`ocean-breeze`, `romantic-pink`)
   - Theme Name: Title Case ("Ocean Breeze", "Romantic Pink")

2. **Colors**
   - Pilih palette yang harmonis
   - Test contrast untuk readability
   - Gunakan color picker yang baik

3. **Backgrounds**
   - Upload gambar high-quality (1920x1080+)
   - Compress sebelum upload (< 2MB)
   - Test readability content di atas background

4. **Ornaments**
   - Limit 5-10 ornaments per section
   - Gunakan PNG dengan transparency
   - Test di mobile

### Performance

1. **Images**
   - Auto-compressed ke < 500KB
   - Use JPEG untuk photos, PNG untuk transparency
   - Use `unoptimized` prop untuk base64

2. **API Calls**
   - Cache theme data
   - Single query untuk complete theme
   - Minimize re-fetches

3. **Rendering**
   - Implement loading states
   - Optimize z-index
   - Lazy load jika perlu

## Troubleshooting

### Background Tidak Muncul

**Penyebab:**
- Background tidak di-upload untuk section tersebut
- `getBackground()` tidak dipanggil
- Base64 data corrupt

**Solusi:**
```typescript
// Check background
const background = getBackground('welcome');
console.log('Background:', background);

// Verify theme data
const { theme } = useUnifiedTheme(themeId);
console.log('Backgrounds:', theme?.backgrounds);
```

### Ornaments Tidak Muncul

**Penyebab:**
- `themeId` null/undefined
- `isVisible` false
- Z-index terlalu rendah

**Solusi:**
```typescript
// Check theme ID
console.log('Theme ID:', themeId);

// Check ornaments
const ornaments = getOrnaments('welcome');
console.log('Ornaments:', ornaments);
ornaments.forEach(orn => {
  console.log(`${orn.name}: visible=${orn.isVisible}, z=${orn.style.zIndex}`);
});
```

### Colors Tidak Applied

**Penyebab:**
- ThemeProvider tidak wrapping components
- Colors JSONB incomplete
- CSS variables tidak generated

**Solusi:**
- Pastikan ThemeProvider di root
- Check colors object punya semua required fields
- Inspect CSS variables di browser DevTools

## Related Documentation

- **[Unified Theme Ornaments](./unified-theme-ornaments.md)** - Detail ornament system
- **[Database Schema](./database-schema.md)** - Database structure lengkap
- **[Themes (Legacy)](./themes.md)** - Old system reference

## Quick Reference

### File Locations

```
/src/hooks/useUnifiedTheme.ts          - Main hook
/src/types/unified-theme.ts            - TypeScript types
/src/app/api/unified-themes/route.ts   - Theme API
/src/app/api/unified-themes/ornaments/route.ts - Ornament API
/src/app/admin/create-unified-theme/page.tsx   - Theme editor
/src/app/admin/unified-themes/[id]/ornaments/page.tsx - Ornament editor
/src/app/undangan/preview/[themeId]/page.tsx   - Preview page
```

### Common Commands

```bash
# Check themes
psql -d mydb -c "SELECT theme_id, theme_name FROM unified_themes;"

# Check client theme
psql -d mydb -c "SELECT client_slug, unified_theme_id FROM clients WHERE client_slug='john-jane';"

# Count ornaments per theme
psql -d mydb -c "SELECT theme_id, jsonb_array_length(ornaments->'ornaments') FROM unified_themes;"
```

---

**Last Updated:** February 8, 2026
**Version:** 2.0.0
**Status:** Production Ready
**System:** Unified Theme System (menggantikan template-ornaments)
