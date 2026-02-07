# Template Ornaments Documentation

## Overview

The Template Ornaments system allows administrators to add decorative elements (flowers, stars, ribbons, etc.) to catalog templates. These ornaments are displayed on client invitations and can be positioned, scaled, and rotated using an inline drag-and-drop editor.

**Key Features:**
- **Template-Level**: Ornaments belong to catalog templates, not individual clients
- **Inline Editing**: Drag, resize, and rotate ornaments directly on the invitation preview
- **Multi-Section Support**: Add ornaments to any section (fullscreen, welcome, timeline, etc.)
- **Automatic Inheritance**: All clients using a template automatically get its ornaments
- **Responsive Design**: Percentage-based positioning ensures mobile compatibility
- **Visual Editor**: Canva-like interface with handles for manipulation

## Architecture

### System Overview

```
External Catalog API (localhost:3001)
├── Template Metadata (title, category, price)
    ↓ Referenced by template_id
Master Database (PostgreSQL)
├── template_ornaments table
│   └── Ornament configurations (JSONB)
    ↓ Inherited by clients
Client Invitations
├── Fetch ornaments via templateId
├── Render on all sections
└── OrnamentLayer component displays them
```

### Data Flow

1. Admin selects a catalog template
2. Admin opens ornament editor (`/admin/catalog-templates/[id]/ornaments`)
3. Admin uploads images and positions ornaments using drag & drop
4. Ornaments saved to `template_ornaments` table
5. Clients using this template automatically fetch and display ornaments
6. Ornaments render on invitation sections via `OrnamentLayer` component

## Database Schema

### `template_ornaments` Table

See [Database Schema Documentation](./database-schema.md#10-template_ornaments) for full details.

**Key Fields:**
- `template_id`: Links to external catalog template
- `ornaments_data`: JSONB containing array of ornament objects
- `created_at`, `updated_at`: Timestamps

### JSONB Structure (`ornaments_data`)

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

### GET `/api/template-ornaments`

Fetch ornaments for a catalog template.

**Query Parameters:**
- `templateId` (required): Catalog template ID

**Response:**
```json
{
  "success": true,
  "data": {
    "ornaments": [
      { /* ornament object */ }
    ]
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "data": { "ornaments": [] },
  "error": "Template ID is required"
}
```

### POST `/api/template-ornaments`

Save/update ornaments for a catalog template (upsert).

**Request Body:**
```json
{
  "templateId": 1,
  "ornaments": [
    { /* ornament object */ }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully saved 3 ornament(s) for template 1"
}
```

**Validation:**
- `templateId` must be a valid integer
- `ornaments` must be an array
- Each ornament must have `id`, `section`, and `image` fields

## Admin Workflow

### Accessing the Ornament Editor

1. Navigate to **Admin → Catalog Templates** (`/admin/catalog-templates`)
2. Find the template you want to edit
3. Click **"Edit Ornaments"** button (Layers icon)
4. Editor opens at `/admin/catalog-templates/[id]/ornaments`

### Editor Interface

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│ [← Back] Template #1: Modern Floral                      │
├──────────────────────────────────────────────────────────┤
│ [Edit Mode: ON] [Save Changes]                           │
├────────────┬─────────────────────────────────────────────┤
│ Left Panel │  Main Canvas (Invitation Preview)           │
│            │                                              │
│ Section:   │  ┌─────────────────────────────────┐        │
│ ▼ Fullscr. │  │ Fullscreen Section              │        │
│            │  │ [Background image]              │        │
│ [Upload]   │  │    🌸 ← Draggable ornament     │        │
│            │  └─────────────────────────────────┘        │
│ Ornaments: │  ┌─────────────────────────────────┐        │
│ • Flower 1 │  │ Welcome Section                 │        │
│ • Star     │  │ [Content preview]               │        │
│            │  │       ⭐ ← Selected ornament    │        │
│ Selected:  │  └─────────────────────────────────┘        │
│ Name: Star │  ... (all sections rendered)                │
│ Scale: 1.2 │                                              │
│ Rotate: 0° │                                              │
│ Opacity: 1 │                                              │
│ Z-Index:15 │                                              │
│ [Delete]   │                                              │
└────────────┴─────────────────────────────────────────────┘
```

### Adding Ornaments

1. **Select Section**: Choose target section from dropdown (e.g., "Welcome")
2. **Upload Image**: Click "Upload Ornament" button
3. **Choose File**: Select PNG, JPG, or SVG (max 5MB)
4. **Automatic Processing**:
   - Image compressed to max 500KB
   - Converted to base64 data URI
   - Added to selected section at default position (10%, 10%)
5. **Position Ornament**: Drag to desired location
6. **Save Changes**: Click "Save Changes" button

### Editing Ornaments

**Drag to Move:**
- Click and hold ornament
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
- Use sliders in left panel:
  - **Scale**: 0.5 to 3.0
  - **Rotation**: -180° to 180°
  - **Opacity**: 0 to 1
  - **Z-Index**: 5 to 20

**Delete:**
- Select ornament
- Click "Delete" button in left panel
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
   - Test on mobile preview

4. **Z-Index Strategy**:
   - **5-9**: Background decorations (behind content)
   - **10-14**: Mixed with content
   - **15-20**: Foreground decorations (in front of content)

5. **Performance**:
   - Limit to 5-10 ornaments per section
   - Use lower opacity for subtle effects
   - Compress images before upload

## Technical Implementation

### Hook: `useTemplateOrnaments`

Custom React hook for fetching and managing template ornaments.

**Location:** `/src/hooks/useTemplateOrnaments.ts`

**Usage:**
```typescript
import { useTemplateOrnaments } from '@/hooks/useTemplateOrnaments';

function MyComponent({ templateId }: { templateId: number | null }) {
  const { ornaments, loading, getOrnaments, saveOrnaments } =
    useTemplateOrnaments(templateId);

  // Get ornaments for specific section
  const welcomeOrnaments = getOrnaments('welcome');

  return (
    <section>
      {/* Your content */}
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
| `saveOrnaments(ornaments)` | Save ornaments to API | `Promise<Response>` |
| `refetch()` | Reload ornaments from API | `Promise<void>` |

### Component: `OrnamentLayer`

Renders ornaments on invitation sections.

**Location:** `/src/components/wedding/OrnamentLayer.tsx`

**Usage:**
```typescript
import OrnamentLayer from '@/components/wedding/OrnamentLayer';
import { useTemplateOrnaments } from '@/hooks/useTemplateOrnaments';

function WelcomeSection({ templateId }: { templateId?: number | null }) {
  const { getOrnaments } = useTemplateOrnaments(templateId);

  return (
    <section className="relative min-h-screen">
      {/* Background */}
      <div className="background">...</div>

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

### Component: `EditableOrnament`

Interactive ornament with drag/resize/rotate for admin editor.

**Location:** `/src/components/admin/EditableOrnament.tsx`

**Key Features:**
- Uses `react-rnd` library for drag & resize
- Custom rotation handle at top
- Percentage ↔ pixel conversion for responsiveness
- Edit mode vs. preview mode rendering
- Selection state with visual feedback

**Props:**

```typescript
interface EditableOrnamentProps {
  ornament: Ornament;
  isEditMode: boolean;
  isSelected: boolean;
  containerWidth: number;
  containerHeight: number;
  onSelect: () => void;
  onUpdate: (updated: Ornament) => void;
  onDelete: () => void;
}
```

### Integration into Wedding Components

All wedding components support ornaments via this pattern:

**Step 1:** Add `templateId` to props interface
```typescript
interface WelcomeProps {
  clientSlug: string;
  templateId?: number | null;  // Added
  // ... other props
}
```

**Step 2:** Import hook and layer
```typescript
import { useTemplateOrnaments } from '@/hooks/useTemplateOrnaments';
import OrnamentLayer from '../wedding/OrnamentLayer';
```

**Step 3:** Use hook in component
```typescript
const { getOrnaments } = useTemplateOrnaments(templateId);
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

**Example:**
```json
{
  "name": "Subtle Corner Flower",
  "style": { "zIndex": 8 }  // Behind content
}
{
  "name": "Bold Center Star",
  "style": { "zIndex": 18 }  // In front of content
}
```

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
1. `templateId` is null or undefined
2. Ornament `isVisible` is false
3. Z-index too low (behind background)
4. Position outside viewport (e.g., `left: -100%`)

**Solution:**
```typescript
// Check templateId in browser console
console.log('Template ID:', templateId);

// Check ornaments loaded
const { ornaments, loading } = useTemplateOrnaments(templateId);
console.log('Ornaments:', ornaments, 'Loading:', loading);

// Verify visibility
ornaments.forEach(orn => {
  console.log(`${orn.name}: visible=${orn.isVisible}, zIndex=${orn.style.zIndex}`);
});
```

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
1. "Save Changes" button not clicked
2. API error during save
3. Browser navigated away before save completed

**Solution:**
1. Always click "Save Changes" after editing
2. Check Network tab for failed API calls
3. Wait for success toast before navigating

### Issue: Ornament appears distorted on mobile

**Possible Causes:**
1. Using fixed pixel positions instead of percentages
2. Container width/height not responsive
3. Extreme scale values (e.g., 5.0)

**Solution:**
1. Use percentage positions: `"10%"` not `"100px"`
2. Ensure section has responsive dimensions
3. Keep scale between 0.5 and 2.0

### Issue: Image compression failed

**Possible Causes:**
1. Unsupported image format
2. Corrupted image file
3. Image too large (>10MB)

**Solution:**
1. Use PNG or JPG format
2. Re-export image from editor
3. Resize image before upload (<5MB)

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

### Monitoring

**Check Ornament Load Time:**
```typescript
const start = performance.now();
const { ornaments, loading } = useTemplateOrnaments(templateId);
useEffect(() => {
  if (!loading) {
    const duration = performance.now() - start;
    console.log(`Ornaments loaded in ${duration}ms`);
  }
}, [loading]);
```

**Target Metrics:**
- API response: < 200ms
- Total ornaments per template: < 50
- Image compression: < 2s
- Page load with ornaments: < 3s

## Future Enhancements

### Planned Features

1. **Ornament Library**:
   - Pre-made ornament collection
   - Category filters (floral, abstract, geometric)
   - Drag from library to preview

2. **Advanced Editing**:
   - Copy ornament to multiple sections
   - Duplicate ornament
   - Undo/redo functionality
   - Keyboard shortcuts (Delete, Arrow keys)

3. **Animations**:
   - Entrance animations (fade in, slide in)
   - Subtle floating/rotation effects
   - Parallax on scroll

4. **Client Customization**:
   - Allow clients to toggle ornament visibility
   - Client-specific ornament overrides
   - Custom ornament uploads per client

## Related Documentation

- [Database Schema](./database-schema.md) - Complete database structure
- [Theme System](./themes.md) - Color and background theme management
- [API Documentation](#) - Full API reference (coming soon)

## Support

For issues or questions:
1. Check this documentation first
2. Review console logs for errors
3. Test in incognito mode (clear cache issues)
4. Contact development team

---

**Last Updated:** February 2026
**Version:** 1.0.0
