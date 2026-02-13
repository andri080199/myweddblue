# MyWeddBlue - Wedding Invitation System

Digital wedding invitation platform dengan **Unified Theme System** yang memungkinkan admin membuat tema lengkap (colors + backgrounds + ornaments) dan client mendapatkan undangan yang fully customizable.

## Features

- 🎨 **Unified Theme System** - All-in-one themes dengan colors, backgrounds, dan ornaments
- 📱 **Responsive Design** - Mobile-first invitation pages
- 🖼️ **Per-Section Backgrounds** - 11 sections dengan background masing-masing
- ✨ **Drag & Drop Ornaments** - Visual editor untuk decorative elements
- 👥 **Client Dashboard** - Client dapat edit content, upload photos, manage guests
- 📊 **Admin Panel** - Kelola clients, themes, templates, dan ornaments
- 💌 **RSVP System** - Guest dapat konfirmasi kehadiran
- 📝 **Guest Book** - Ucapan dan doa dari tamu
- 🎵 **Music Player** - Background music untuk undangan
- 📸 **Photo Gallery** - Display wedding photos dengan lightbox

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS
- **Image Processing:** Sharp
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm/yarn/pnpm

### Installation

1. Clone repository
```bash
git clone https://github.com/yourusername/myweddblue.git
cd myweddblue
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/myweddblue"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

4. Setup database
```bash
npx prisma migrate dev
npx prisma db seed  # Optional: seed built-in themes
```

5. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/              # Admin panel pages
│   │   ├── dashboard/          # Client dashboard
│   │   ├── undangan/           # Invitation pages
│   │   └── api/                # API routes
│   ├── components/             # React components
│   │   ├── admin/              # Admin components
│   │   ├── cards/              # Card components
│   │   ├── forms/              # Form components
│   │   ├── interactive/        # Interactive elements
│   │   ├── layout/             # Layout components
│   │   ├── media/              # Media components
│   │   ├── ui/                 # UI primitives
│   │   └── wedding/            # Wedding-specific components
│   ├── contexts/               # React contexts
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript types
│   └── utils/                  # Utility functions
├── docs/                       # Documentation
│   ├── unified-theme-system.md         # Unified theme documentation
│   ├── unified-theme-ornaments.md      # Ornament system documentation
│   ├── database-schema.md              # Database schema
│   └── themes.md                       # Legacy theme docs
├── public/                     # Static assets
└── prisma/                     # Prisma schema
```

## Documentation

### Core Documentation

📚 **[Unified Theme System](./docs/unified-theme-system.md)**
- Overview sistem tema all-in-one
- Admin workflow untuk create/edit themes
- Component architecture dan integration
- API reference lengkap
- Migration guide dari old system

🎨 **[Unified Theme Ornaments](./docs/unified-theme-ornaments.md)**
- Sistem ornament decoration
- Drag & drop editor
- Section-specific ornaments
- Best practices dan troubleshooting

🗄️ **[Database Schema](./docs/database-schema.md)**
- Complete database structure
- Table relationships
- JSONB field structures

### Key Concepts

#### 1. Unified Theme System

Sistem tema terpusat yang menggabungkan:
- **Colors**: Palette warna untuk seluruh invitation
- **Backgrounds**: Background image untuk 11 sections
- **Ornaments**: Decorative elements per section

```typescript
// Example: Fetch and use unified theme
const { getOrnaments, getBackground } = useUnifiedTheme(themeId);

const backgroundImage = getBackground('welcome');
const ornaments = getOrnaments('welcome');
```

#### 2. Section Structure

11 sections dalam undangan:
1. **Fullscreen** - Hero/landing section
2. **Kutipan** - Quote/verse section
3. **Welcome** - Welcome message + couple info
4. **Timeline** - Love story timeline
5. **Event** - Wedding event details (Akad + Resepsi)
6. **Gift** - Gift registry with bank cards
7. **Gallery** - Photo gallery + YouTube video
8. **RSVP** - RSVP form
9. **Guestbook** - Guest messages
10. **Thankyou** - Thank you message
11. **Footer** - Footer with couple names

#### 3. Component Pattern

Semua wedding components mengikuti pattern:

```typescript
interface ComponentProps {
  clientSlug: string;
  themeId?: string;
}

const Component = ({ themeId }) => {
  const { getOrnaments, getBackground } = useUnifiedTheme(themeId);
  const backgroundImage = getBackground('section_name') || defaultImage;

  return (
    <section className="relative">
      <Image src={backgroundImage} fill />
      <div className="relative z-10">{/* Content */}</div>
      <OrnamentLayer ornaments={getOrnaments('section_name')} />
    </section>
  );
};
```

## Admin Panel

Access: `/admin/login`

### Features

1. **Client Management** (`/admin`)
   - Create new clients
   - Edit client content
   - Manage guest lists
   - Generate WhatsApp templates

2. **Theme Management** (`/admin/theme-backgrounds`)
   - Create unified themes
   - Edit colors & backgrounds
   - Add decorative ornaments
   - Preview complete invitation

3. **Ornament Editor** (`/admin/unified-themes/[id]/ornaments`)
   - Drag & drop interface
   - Position ornaments per section
   - Resize, rotate, adjust properties
   - Real-time preview

4. **Music Library** (`/admin/music-manager`)
   - Upload background music
   - Manage music files
   - Assign to clients

## Client Dashboard

Access: `/dashboard/[clientSlug]`

### Features

1. **Content Management**
   - Edit couple information
   - Set wedding dates & venues
   - Write love story
   - Add quotes

2. **Gallery Management**
   - Upload wedding photos
   - Arrange photo order
   - Add YouTube video

3. **Guest Management**
   - Add guest names
   - Assign RSVP slots
   - View RSVP responses
   - Read guest book messages

4. **Preview & Share**
   - Preview invitation
   - Get shareable links
   - Copy WhatsApp message

## API Routes

### Unified Themes
- `GET /api/unified-themes` - Get all themes or specific theme
- `POST /api/unified-themes` - Create/update theme
- `POST /api/unified-themes/ornaments` - Save ornaments

### Client Management
- `GET /api/clients` - Get all clients or specific client
- `POST /api/create-client` - Create new client
- `GET /api/client-content` - Get client content
- `GET /api/client-theme` - Get client's theme

### Guest Management
- `GET /api/guestNames` - Get guest list
- `POST /api/guestNames` - Add guest
- `DELETE /api/guestNames/[id]` - Delete guest

### RSVP & Guestbook
- `GET /api/rsvp` - Get RSVP responses
- `POST /api/rsvp` - Submit RSVP
- `GET /api/guestbook` - Get guest messages
- `POST /api/guestbook` - Add guest message

## Development

### Build

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

### Database Migration

```bash
npx prisma migrate dev --name migration_name
```

### Generate Prisma Client

```bash
npx prisma generate
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Environment Variables

Required for production:
```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
```

## Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues or questions:
1. Check [documentation](./docs/)
2. Open GitHub issue
3. Contact development team

---

**Built with ❤️ using Next.js and PostgreSQL**
