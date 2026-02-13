# Unified Theme Ornaments Documentation

## Overview

The Unified Theme system integrates decorative elements (flowers, stars, ribbons, etc.) directly into themes. These ornaments are part of the theme configuration and are displayed on all invitations using that theme.

**Key Features:**
- **Theme-Integrated**: Ornaments are part of unified themes, not separate templates
- **Inline Editing**: Drag, resize, and rotate ornaments directly on the theme preview
- **Multi-Section Support**: Add ornaments to any section (fullscreen, welcome, timeline, etc.)
- **Automatic Inheritance**: All clients using a theme automatically get its ornaments
- **Responsive Design**: Percentage-based positioning ensures mobile compatibility
- **Built-in Support**: Works with both built-in and custom themes

## Architecture

### System Overview

```
Unified Themes (PostgreSQL)
├── unified_themes table
│   ├── Theme metadata (name, colors, backgrounds)
│   └── Ornaments (JSONB array)
    ↓ Selected by clients
Clients
├── clients.unified_theme_id
    ↓ Fetches complete theme
Client Invitations
├── Fetch theme via themeId
├── Get ornaments from theme.ornaments
└── OrnamentLayer component displays them
```

### Data Flow

1. Admin creates/edits unified theme
2. Admin opens ornament editor (`/admin/unified-themes/[themeId]/ornaments`)
3. Admin uploads images and positions ornaments using drag & drop
4. Ornaments saved to `unified_themes.ornaments` JSONB field
5. Clients select this theme during creation
6. Invitations fetch theme and display ornaments via `OrnamentLayer` component

## Database Schema

### `unified_themes` Table

See [Database Schema Documentation](./database-schema.md#unified_themes) for full details.

**Key Fields:**
- `theme_id`: Unique theme identifier (slug)
- `theme_name`: Display name
- `colors`: Color palette (JSONB)
- `backgrounds`: Background images per section (JSONB)
- `ornaments`: Ornaments configuration (JSONB)
- `is_builtin`: Whether theme is built-in

### JSONB Structure (`ornaments`)

```json
{
  "ornaments": [
    {
      "id": "orn-1707321600000",
      "section": "welcome",
      "name": "Flower Top Right",
      "image": "data:image/png;base64,...",
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
```

**Field Descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (format: `orn-{timestamp}`) |
| `section` | SectionId | Target section (see Section IDs below) |
| `name` | string | Ornament display name |
| `image` | string | Base64-encoded image data URI |
| `position.top/left/right/bottom` | string \| null | CSS position values (percentages recommended) |
| `transform.scale` | number | Scaling factor (0.5 to 3.0) |
| `transform.rotate` | number | Rotation in degrees (-180 to 180) |
| `style.width` | string | Base width (e.g., "150px") |
| `style.height` | string | Height (use "auto" to maintain aspect ratio) |
| `style.opacity` | number | Opacity (0 to 1) |
| `style.zIndex` | number | Layer order (5 to 20) |
| `isVisible` | boolean | Whether ornament is displayed |
| `createdAt` | string | ISO timestamp |

### Section IDs

Valid values for the `section` field:

- `fullscreen` - Hero/landing section
- `kutipan` - Quote/verse section
- `welcome` - Welcome message section
- `timeline` - Love story timeline
- `event` - Wedding event details
- `gift` - Gift registry section
- `gallery` - Photo gallery
- `rsvp` - RSVP form
- `guestbook` - Guest messages
- `thankyou` - Thank you message
- `footer` - Footer section

## API Endpoints

### GET `/api/unified-themes`

Fetch unified theme(s) including ornaments.

**Query Parameters:**
- `themeId` (optional): Specific theme ID to fetch

**Response (single theme):**
```json
{
  "success": true,
  "theme": {
    "theme_id": "ocean-breeze",
    "theme_name": "Ocean Breeze",
    "colors": { /* ... */ },
    "backgrounds": { /* ... */ },
    "ornaments": {
      "ornaments": [
        { /* ornament object */ }
      ]
    }
  }
}
```

**Response (all themes):**
```json
{
  "success": true,
  "themes": [
    { /* theme object */ }
  ]
}
```

### POST `/api/unified-themes/ornaments`

Save/update ornaments for a unified theme.

**Request Body:**
```json
{
  "themeId": "ocean-breeze",
  "ornaments": [
    { /* ornament object */ }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully saved 3 ornament(s) for theme ocean-breeze"
}
```

**Validation:**
- `themeId` must be a valid theme_id
- `ornaments` must be an array
- Each ornament must have `id`, `section`, and `image` fields

## Admin Workflow

### Accessing the Ornament Editor

1. Navigate to **Admin → Unified Themes** (`/admin/theme-backgrounds`)
2. Find the theme you want to edit
3. Click **"Edit Ornaments"** button
4. Editor opens at `/admin/unified-themes/[themeId]/ornaments`

### Editor Interface

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│ [← Back] Editing Ornaments: Ocean Breeze Theme           │
├──────────────────────────────────────────────────────────┤
│ [Edit Mode: ON] [Section: Welcome ▼] [Add] [Save]        │
├────────────┬─────────────────────────────────────────────┤
│ Left Panel │  Main Canvas (Theme Preview)                │
│            │                                              │
│ Ornaments: │  ┌─────────────────────────────────┐        │
│            │  │ [Theme colors & background]     │        │
│ • Flower 1 │  │    🌸 ← Draggable ornament     │        │
│   [Edit]   │  │                                 │        │
│   [Del]    │  │         (Live preview)          │        │
│ • Star     │  └─────────────────────────────────┘        │
│   [Edit]   │                                              │
│   [Del]    │  Properties Panel:                          │
│            │  ┌─────────────────────────────────┐        │
│ [Upload]   │  │ Name: [Flower 1____________]    │        │
│            │  │ Section: [Welcome ▼]            │        │
│ Selected:  │  │ Scale: [====|====] 1.2x         │        │
│ Flower 1   │  │ Rotate: [====|====] 15°         │        │
│            │  │ Opacity: [========|==] 90%      │        │
│ Position:  │  │ Z-Index: [======|====] 15       │        │
│ Top: 10%   │  └─────────────────────────────────┘        │
│ Left: 85%  │                                              │
│            │                                              │
│ [Delete]   │                                              │
└────────────┴─────────────────────────────────────────────┘
```

### Adding Ornaments

1. **Select Section**: Choose target section from dropdown (e.g., "Welcome")
2. **Upload Image**: Click "Add Ornament" button
3. **Choose File**: Select PNG, JPG, or SVG (max 5MB)
4. **Automatic Processing**:
   - Image compressed to max 500KB
   - Converted to base64 data URI
   - Added to selected section at default position (10%, 10%)
5. **Position Ornament**: Drag to desired location on preview
6. **Save Changes**: Click "Save" button

### Editing Ornaments

**Drag to Move:**
- Click and hold ornament on preview
- Drag to new position
- Release to drop

**Resize:**
- Click ornament to select (blue ring appears)
- Drag corner/edge handles to resize
- Aspect ratio maintained

**Rotate:**
- Click ornament to select
- Click and drag the rotation handle (circular icon at top)
- Rotate around center point

**Adjust Properties:**
- Select ornament
- Use sliders in properties panel:
  - **Scale**: 0.5 to 3.0
  - **Rotation**: -180° to 180°
  - **Opacity**: 0 to 1
  - **Z-Index**: 5 to 20

**Delete:**
- Select ornament in library list
- Click "Delete" button
- Confirm deletion

### Best Practices

1. **Image Format**:
   - Use PNG for images with transparency
   - Use JPG for photos without transparency
   - SVG works but will be converted to base64

2. **Image Size**:
   - Upload images under 2MB for faster compression
   - Recommended dimensions: 300-800px width

3. **Positioning**:
   - Use percentage-based positioning for responsiveness
   - Test preview on different section backgrounds

4. **Z-Index Strategy**:
   - **5-9**: Background decorations (behind content)
   - **10-14**: Mixed with content
   - **15-20**: Foreground decorations (in front of content)

5. **Performance**:
   - Limit to 5-10 ornaments per section
   - Use lower opacity for subtle effects
   - Compress images before upload

## Technical Implementation

### Hook: `useUnifiedTheme`

Custom React hook for fetching and managing unified themes.

**Location:** `/src/hooks/useUnifiedTheme.ts`

**Usage:**
```typescript
import { useUnifiedTheme } from '@/hooks/useUnifiedTheme';

function MyComponent({ themeId }: { themeId: string | null }) {
  const { theme, loading, getOrnaments, getBackground } =
    useUnifiedTheme(themeId);

  // Get ornaments for specific section
  const welcomeOrnaments = getOrnaments('welcome');

  // Get background for specific section
  const welcomeBackground = getBackground('welcome');

  return (
    <section>
      {/* Background */}
      <Image src={welcomeBackground} alt="Background" fill />

      {/* Your content */}

      {/* Ornaments */}
      <OrnamentLayer ornaments={welcomeOrnaments} />
    </section>
  );
}
```

**Available Methods:**

| Method | Description | Return Type |
|--------|-------------|-------------|
| `getOrnaments(sectionId)` | Get ornaments for a specific section | `Ornament[]` |
| `getAllOrnaments()` | Get all ornaments | `Ornament[]` |
| `getOrnamentCount(sectionId)` | Count ornaments in section | `number` |
| `hasOrnaments(sectionId)` | Check if section has ornaments | `boolean` |
| `getBackground(sectionId)` | Get background for section | `string \| undefined` |
| `refetch()` | Reload theme from API | `Promise<void>` |

### Component: `OrnamentLayer`

Renders ornaments on invitation sections.

**Location:** `/src/components/wedding/OrnamentLayer.tsx`

**Usage:**
```typescript
import OrnamentLayer from '@/components/wedding/OrnamentLayer';
import { useUnifiedTheme } from '@/hooks/useUnifiedTheme';

function WelcomeSection({ themeId }: { themeId?: string }) {
  const { getOrnaments, getBackground } = useUnifiedTheme(themeId);

  return (
    <section className="relative min-h-screen">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={getBackground('welcome') || '/default.jpg'}
          alt="Background"
          fill
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <h1>Welcome!</h1>
      </div>

      {/* Ornaments Layer */}
      <OrnamentLayer ornaments={getOrnaments('welcome')} />
    </section>
  );
}
```

**Rendering Behavior:**
- Ornaments positioned absolutely within parent section
- `pointer-events: none` prevents blocking clicks
- Transforms applied via CSS (scale, rotate)
- Smooth transitions on property changes

### Integration into Wedding Components

All wedding components support ornaments via this pattern:

**Step 1:** Add `themeId` to props interface
```typescript
interface WelcomeProps {
  clientSlug: string;
  themeId?: string;  // Added
  // ... other props
}
```

**Step 2:** Import hook and layer
```typescript
import { useUnifiedTheme } from '@/hooks/useUnifiedTheme';
import OrnamentLayer from '../wedding/OrnamentLayer';
```

**Step 3:** Use hook in component
```typescript
const { getOrnaments, getBackground } = useUnifiedTheme(themeId);
const backgroundImage = getBackground('welcome') || theme.images.hero;
```

**Step 4:** Add layer to JSX (at end, after content)
```typescript
<OrnamentLayer ornaments={getOrnaments('welcome')} />
```

**Components with Ornament Support:**
1. `/src/components/media/FullScreenImage.tsx` → `fullscreen`
2. `/src/components/wedding/KutipanAyat.tsx` → `kutipan`
3. `/src/components/wedding/Welcome.tsx` → `welcome`
4. `/src/components/wedding/Timeline.tsx` → `timeline`
5. `/src/components/wedding/WeddingEvent.tsx` → `event`
6. `/src/components/wedding/WeddingGift.tsx` → `gift`
7. `/src/components/media/OurGallery.tsx` → `gallery`
8. `/src/components/forms/RSVPForm.tsx` → `rsvp`
9. `/src/components/interactive/GuestBookList.tsx` → `guestbook`
10. `/src/components/wedding/ThankYouMessage.tsx` → `thankyou`
11. `/src/components/layout/Footer.tsx` → `footer`

## Preview System

### Admin Theme Preview

**Route:** `/undangan/preview/[themeId]`

**Purpose:** Preview complete wedding invitation with theme styling + sample data

**Features:**
- Shows all 11 sections with theme colors and backgrounds
- Displays ornaments in correct sections
- Uses hardcoded sample data (no client dependency)
- Opens in new tab from theme management page

**Access:**
1. Admin → Unified Themes
2. Click "Preview Undangan" on any theme card
3. Preview opens in new tab

## Mobile Responsiveness

### Percentage-Based Positioning

All ornament positions use percentages instead of fixed pixels:

```typescript
// Desktop position
position: { top: "10%", left: "80%" }

// Automatically scales on mobile
// No additional CSS needed
```

### Editor Limitations

The drag-and-drop editor is **desktop-only**. Mobile users see a notice to edit on desktop.

**Rationale:**
- Drag handles require precise mouse control
- Touch gestures conflict with scroll behavior
- Small screens make positioning difficult

**Client View (Mobile):**
- Ornaments display perfectly on mobile
- Responsive positioning maintained
- No editing functionality (view-only)

## Z-Index Layering

### Layer Structure

```
z-0    : Section background images
z-5-9  : Background ornaments (subtle decorations)
z-10   : Main content (text, cards, buttons)
z-15-20: Foreground ornaments (prominent decorations)
z-30   : Navbar
z-40   : Music player
z-50+  : Modals, overlays
```

### Choosing Z-Index

**For Background Decorations:**
- Use z-index 5-9
- Ornaments appear behind text
- Good for subtle patterns, corner decorations

**For Mixed Decorations:**
- Use z-index 10-14
- Ornaments blend with content
- Good for accent elements

**For Foreground Decorations:**
- Use z-index 15-20
- Ornaments appear in front of content
- Good for bold statement pieces

## Image Processing

### Compression

Ornament images are automatically compressed using the existing utility:

**Location:** `/src/utils/imageCompression.ts`

**Settings:**
- **Max width:** 500px (ornaments are smaller than photos)
- **Max file size:** 500KB
- **Quality:** 0.85
- **Format:** Auto-detect (PNG for transparency, JPG otherwise)

**Benefits:**
- Faster page load times
- Reduced storage usage
- Maintained visual quality

### Upload Validation

**File Type Check:**
```typescript
if (!file.type.startsWith('image/')) {
  throw new Error('Please select an image file');
}
```

**Size Check:**
```typescript
if (file.size > 5 * 1024 * 1024) {
  throw new Error('Image must be less than 5MB');
}
```

**Supported Formats:**
- PNG (recommended for transparency)
- JPG/JPEG
- SVG (converted to base64)
- WebP

## Troubleshooting

### Issue: Ornaments not displaying

**Possible Causes:**
1. `themeId` is null or undefined
2. Ornament `isVisible` is false
3. Z-index too low (behind background)
4. Position outside viewport (e.g., `left: -100%`)

**Solution:**
```typescript
// Check themeId in browser console
console.log('Theme ID:', themeId);

// Check ornaments loaded
const { theme, loading } = useUnifiedTheme(themeId);
console.log('Theme:', theme, 'Loading:', loading);

// Verify ornaments
if (theme?.ornaments?.ornaments) {
  theme.ornaments.ornaments.forEach(orn => {
    console.log(`${orn.name}: visible=${orn.isVisible}, zIndex=${orn.style.zIndex}`);
  });
}
```

### Issue: Background images not showing uploaded images

**Possible Causes:**
1. Component not using `getBackground()` from hook
2. Old props (`customBackground`, `templateId`) still in use
3. Theme doesn't have background for that section

**Solution:**
1. Ensure component uses `useUnifiedTheme` hook
2. Remove old props from component
3. Check theme has `backgrounds.[sectionName]` set

### Issue: Drag handles not appearing

**Possible Causes:**
1. Edit mode is off
2. Ornament not selected
3. CSS conflict with `react-rnd`

**Solution:**
1. Toggle "Edit Mode" to ON
2. Click ornament to select it
3. Check for CSS conflicts in browser DevTools

### Issue: Position changes not saving

**Possible Causes:**
1. "Save" button not clicked
2. API error during save
3. Browser navigated away before save completed

**Solution:**
1. Always click "Save" after editing
2. Check Network tab for failed API calls
3. Wait for success toast before navigating

## Performance Optimization

### Best Practices

1. **Limit Ornament Count**:
   - Max 5-10 ornaments per section
   - More ornaments = slower rendering

2. **Optimize Images**:
   - Compress before upload
   - Use appropriate format (PNG for transparency, JPG for photos)
   - Resize to needed dimensions

3. **Use Opacity Wisely**:
   - Lower opacity (0.3-0.7) for subtle effects
   - Full opacity (1.0) only when needed

4. **Avoid Overlapping**:
   - Too many overlapping ornaments cause rendering issues
   - Spread ornaments across section

### Target Metrics

- API response: < 200ms
- Total ornaments per theme: < 50
- Image compression: < 2s
- Page load with ornaments: < 3s

## Differences from Old Template System

### Old System (Deprecated)
- Ornaments belonged to catalog templates
- Required `templateId` prop
- Separate `template_ornaments` table
- Used `useTemplateOrnaments` hook
- No integration with theme backgrounds

### New System (Current)
- Ornaments integrated into unified themes
- Uses `themeId` prop
- Stored in `unified_themes.ornaments` JSONB
- Uses `useUnifiedTheme` hook
- Fully integrated with theme colors + backgrounds + ornaments

### Migration Benefits
- ✅ Single theme = complete package (colors + backgrounds + ornaments)
- ✅ Simplified client creation (select ONE theme)
- ✅ Consistent styling across entire invitation
- ✅ Built-in themes can have ornaments
- ✅ Preview shows complete invitation

## Related Documentation

- [Database Schema](./database-schema.md) - Complete database structure
- [Theme System](./themes.md) - Unified theme management
- [Unified Theme System Plan](/.claude/plans/) - Implementation plan

## Support

For issues or questions:
1. Check this documentation first
2. Review console logs for errors
3. Test in incognito mode (clear cache issues)
4. Check unified theme has correct data in database

---

**Last Updated:** February 2026
**Version:** 2.0.0 (Unified Theme System)
**Replaces:** template-ornaments.md (v1.0.0)
