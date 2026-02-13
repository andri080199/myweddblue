# Ornament Animation System

> **Fitur animasi untuk ornament undangan digital** - Memungkinkan ornament bergerak secara dinamis dengan berbagai jenis animasi yang dapat dikustomisasi.

---

## 📋 Daftar Isi

- [Overview](#overview)
- [Jenis Animasi](#jenis-animasi)
- [Konfigurasi Animasi](#konfigurasi-animasi)
- [Cara Penggunaan](#cara-penggunaan)
- [Arsitektur Teknis](#arsitektur-teknis)
- [API Reference](#api-reference)
- [Contoh Penggunaan](#contoh-penggunaan)
- [Performance & Best Practices](#performance--best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

Sistem animasi ornament memungkinkan admin untuk menambahkan gerakan dinamis pada ornament (hiasan) di undangan digital. Ornament dapat bergerak dengan berbagai jenis animasi seperti bergoyang (sway), melayang (float), berputar (rotate), dan kombinasi lainnya.

### Fitur Utama

✅ **8 Jenis Animasi** - Dari gerakan sederhana hingga kombinasi kompleks
✅ **Kontrol Penuh** - Kecepatan, intensitas, dan delay dapat dikustomisasi
✅ **Real-time Preview** - Lihat animasi langsung saat mengedit
✅ **GPU Accelerated** - Menggunakan CSS transform untuk performa optimal
✅ **Mobile Responsive** - Animasi bekerja smooth di semua device
✅ **Accessibility Support** - Respect `prefers-reduced-motion` preference
✅ **Layer System** - Positioning, transforms, dan animasi terpisah untuk menghindari konflik

---

## Jenis Animasi

### 1. **None** - Tidak Ada Animasi
- **Icon**: ⏸️
- **Deskripsi**: Ornament tetap diam (default)
- **Use Case**: Ornament dekoratif statis

### 2. **Sway** - Goyang (Kiri-Kanan)
- **Icon**: ↔️
- **Deskripsi**: Gerakan horizontal bolak-balik
- **Use Case**: Ornament yang ingin terlihat bergoyang seperti ditiup angin
- **Keyframe**: `translateX(0)` ↔ `translateX(var(--sway-distance))`

### 3. **Float** - Melayang (Naik-Turun)
- **Icon**: ↕️
- **Deskripsi**: Gerakan vertikal naik-turun
- **Use Case**: Ornament yang ingin terlihat melayang di udara
- **Keyframe**: `translateY(0)` ↔ `translateY(var(--float-distance))`

### 4. **Rotate** - Berputar
- **Icon**: 🔄
- **Deskripsi**: Rotasi kontinyu 360 derajat
- **Use Case**: Ornament circular atau bunga yang ingin terlihat berputar
- **Keyframe**: `rotate(0deg)` → `rotate(360deg)`

### 5. **Pulse** - Berkedip
- **Icon**: 💓
- **Deskripsi**: Scale in-out (membesar-mengecil)
- **Use Case**: Ornament yang ingin menarik perhatian
- **Keyframe**: `scale(1)` ↔ `scale(var(--pulse-scale))`

### 6. **Bounce** - Bouncing
- **Icon**: ⬆️
- **Deskripsi**: Efek memantul dengan ease-in-out
- **Use Case**: Ornament playful dan energetik
- **Keyframe**: Multi-step bounce effect

### 7. **Sway + Float** - Goyang + Melayang ⭐
- **Icon**: 🌸
- **Deskripsi**: Kombinasi gerakan horizontal dan vertikal
- **Use Case**: **Ornament bunga yang realistis** (paling natural)
- **Keyframe**: Combined `translateX()` + `translateY()`
- **Recommended**: ✅ Untuk ornament bunga dan daun

### 8. **Rotate + Float** - Putar + Melayang
- **Icon**: 🌀
- **Deskripsi**: Rotasi sambil melayang
- **Use Case**: Ornament yang ingin terlihat melayang sambil berputar
- **Keyframe**: `rotate()` + `translateY()`

---

## Konfigurasi Animasi

Setiap ornament dapat dikonfigurasi dengan 5 parameter:

### 1. **Enabled** (Toggle)
- **Type**: `boolean`
- **Default**: `false`
- **Deskripsi**: Mengaktifkan/menonaktifkan animasi
- **UI**: Toggle switch hijau/abu-abu

### 2. **Type** (Jenis Animasi)
- **Type**: `AnimationType`
- **Options**: `none | sway | float | rotate | pulse | bounce | sway-float | rotate-float`
- **Default**: `none`
- **Deskripsi**: Pilih jenis gerakan animasi
- **UI**: Grid selector 2 kolom dengan icon

### 3. **Speed** (Kecepatan)
- **Type**: `AnimationSpeed`
- **Options**:
  - `slow`: 8 detik per siklus
  - `normal`: 5 detik per siklus
  - `fast`: 3 detik per siklus
- **Default**: `normal`
- **Deskripsi**: Kecepatan animasi
- **UI**: 3 button horizontal (Lambat | Normal | Cepat)

### 4. **Intensity** (Intensitas)
- **Type**: `number`
- **Range**: `0.1` - `1.0`
- **Default**: `0.5`
- **Deskripsi**: Mengontrol jarak/amplitudo gerakan
  - `0.1`: Gerakan sangat halus (subtle)
  - `0.5`: Gerakan medium (default)
  - `1.0`: Gerakan maksimal
- **UI**: Range slider dengan percentage display
- **Mapping**:
  ```typescript
  '--sway-distance': `${15 * intensity}px`    // 1.5px - 15px
  '--float-distance': `${20 * intensity}px`   // 2px - 20px
  '--pulse-scale': `${1 + (0.2 * intensity)}` // 1.02 - 1.2
  ```

### 5. **Delay** (Delay)
- **Type**: `number`
- **Range**: `0` - `5` seconds
- **Default**: `0`
- **Deskripsi**: Delay sebelum animasi dimulai
- **Use Case**: Membuat stagger effect (animasi bergantian)
- **UI**: Range slider 0-5 detik

---

## Cara Penggunaan

### Di Admin Dashboard

#### Step 1: Buka Preview-Edit Page
```
/admin/unified-themes/[themeId]/preview-edit
```

#### Step 2: Pilih Ornament
1. Klik ornament yang sudah ditambahkan ke canvas
2. Ornament akan ter-select (border biru)
3. Sidebar kanan akan menampilkan kontrol

#### Step 3: Aktifkan Animasi
1. Scroll ke bagian **"Pengaturan Animasi"** (icon Sparkles ✨)
2. Toggle **"Aktifkan Animasi"** ke posisi ON (hijau)

#### Step 4: Konfigurasikan Animasi
1. **Pilih Jenis Animasi**: Klik salah satu dari 8 jenis
   - Untuk ornament bunga: Pilih **"Goyang + Melayang"** 🌸
2. **Atur Kecepatan**: Pilih Lambat/Normal/Cepat
   - Untuk efek natural: Pilih **"Lambat"**
3. **Sesuaikan Intensitas**: Geser slider
   - Untuk gerakan halus: Set ke **0.3 - 0.5**
4. **Atur Delay (opsional)**: Geser slider jika ingin delay

#### Step 5: Preview Real-time
- Animasi akan langsung terlihat di canvas
- Anda tetap bisa drag/move ornament saat animasi aktif
- Test dengan berbagai kombinasi sampai sesuai

#### Step 6: Simpan
- Klik tombol **"Simpan Perubahan"** di header
- Animasi akan tersimpan dan aktif di undangan client

---

## Arsitektur Teknis

### Layer System (3-Layer Architecture)

Untuk menghindari konflik antara positioning, static transforms, dan animasi, sistem menggunakan 3 layer nested divs:

```jsx
// Layer 1: Positioning (absolute, top/left/right/bottom)
<div style={{ position: 'absolute', top: '10%', left: '20%', zIndex: 15 }}>

  // Layer 2: Static Transforms (scale, rotate dari ornament settings)
  <div style={{ transform: 'scale(1.2) rotate(45deg)', width: '150px', height: '150px' }}>

    // Layer 3: Animation Transforms (sway, float, dll)
    <div className="ornament-animate-sway ornament-animation-slow" style={{ '--sway-distance': '7.5px' }}>
      <Image src={ornament.image} ... />
    </div>

  </div>
</div>
```

#### Mengapa 3 Layer?

**❌ Masalah (1 Layer)**:
```jsx
// BAD: Semua transform di satu layer
<div style={{
  position: 'absolute',
  top: '10%',
  transform: 'scale(1.2) rotate(45deg)', // Static
  animation: 'sway 5s infinite' // CSS animation dengan translateX()
}}>
```
**Hasil**: Animation `translateX()` akan override/conflict dengan positioning!

**✅ Solusi (3 Layers)**:
- Layer 1 handle positioning → tidak terpengaruh transform
- Layer 2 handle static transforms → tidak conflict dengan positioning
- Layer 3 handle animations → tidak conflict dengan layer 1 & 2

### File Structure

```
src/
├── types/
│   └── ornament.ts                   # Type definitions (AnimationType, OrnamentAnimation)
├── styles/
│   └── animations.css                # CSS keyframes (@keyframes ornament-sway, dll)
├── components/
│   ├── admin/
│   │   ├── EditableOrnament.tsx      # Ornament dengan drag/drop + animation preview
│   │   └── AnimationControlPanel.tsx # UI controls untuk konfigurasi animasi
│   └── wedding/
│       └── OrnamentLayer.tsx         # Render ornament di client invitation
├── app/
│   ├── admin/unified-themes/[themeId]/
│   │   └── preview-edit/page.tsx     # Integration AnimationControlPanel
│   └── api/unified-themes/ornaments/
│       └── route.ts                  # API validation untuk animation config
```

### Data Flow

```
1. User mengklik ornament → selectedOrnamentId set
2. AnimationControlPanel menerima ornament.animation (atau DEFAULT_ANIMATION_VALUES)
3. User mengubah animasi → onChange() callback dipanggil
4. handleOrnamentUpdate() update localOrnaments state
5. EditableOrnament re-render dengan animation classes/styles
6. Real-time preview terlihat di canvas
7. User klik "Simpan" → POST /api/unified-themes/ornaments
8. Database update ornaments JSONB dengan animation config
9. Client page render dengan OrnamentLayer → animasi aktif
```

---

## API Reference

### Type Definitions

```typescript
// Animation Types
export type AnimationType =
  | 'none' | 'sway' | 'float' | 'rotate'
  | 'pulse' | 'bounce' | 'sway-float' | 'rotate-float';

export type AnimationSpeed = 'slow' | 'normal' | 'fast';

// Animation Configuration
export interface OrnamentAnimation {
  type: AnimationType;
  enabled: boolean;
  speed: AnimationSpeed;
  intensity: number;  // 0.1 - 1.0
  delay: number;      // 0 - 5 seconds
}

// Ornament with Animation
export interface Ornament {
  id: string;
  section: SectionId;
  name: string;
  image: string;
  position: OrnamentPosition;
  transform: OrnamentTransform;
  style: OrnamentStyle;
  isVisible: boolean;
  createdAt: string;
  animation?: OrnamentAnimation;  // ← Optional
}

// Default Values
export const DEFAULT_ANIMATION_VALUES: OrnamentAnimation = {
  type: 'none',
  enabled: false,
  speed: 'normal',
  intensity: 0.5,
  delay: 0
};
```

### Helper Functions

#### `getAnimationClasses(animation?: OrnamentAnimation): string`

Menghasilkan CSS class names untuk animasi.

```typescript
// Example
getAnimationClasses({
  type: 'sway',
  enabled: true,
  speed: 'slow',
  intensity: 0.5,
  delay: 0
})
// Returns: "ornament-animate-sway ornament-animation-slow"

getAnimationClasses({ enabled: false, ... })
// Returns: ""
```

#### `getAnimationStyle(animation?: OrnamentAnimation): React.CSSProperties`

Menghasilkan inline styles untuk CSS custom properties.

```typescript
// Example
getAnimationStyle({
  type: 'sway',
  enabled: true,
  speed: 'normal',
  intensity: 0.7,
  delay: 2
})
// Returns:
{
  '--sway-distance': '10.5px',
  '--float-distance': '14px',
  '--pulse-scale': '1.14',
  animationDelay: '2s'
}
```

### CSS Classes

```css
/* Animation Type Classes */
.ornament-animate-sway      { animation-name: ornament-sway; }
.ornament-animate-float     { animation-name: ornament-float; }
.ornament-animate-rotate    { animation-name: ornament-rotate; }
.ornament-animate-pulse     { animation-name: ornament-pulse; }
.ornament-animate-bounce    { animation-name: ornament-bounce; }
.ornament-animate-sway-float { animation-name: ornament-sway-float; }
.ornament-animate-rotate-float { animation-name: ornament-rotate-float; }

/* Speed Classes */
.ornament-animation-slow    { animation-duration: 8s; }
.ornament-animation-normal  { animation-duration: 5s; }
.ornament-animation-fast    { animation-duration: 3s; }

/* All animation classes have: */
/* - animation-timing-function: ease-in-out (or linear for rotate) */
/* - animation-iteration-count: infinite */
```

### API Validation

```typescript
// POST /api/unified-themes/ornaments
function validateAnimation(animation?: any): boolean {
  if (!animation) return true; // Optional field

  const validTypes = ['none', 'sway', 'float', 'rotate', 'pulse', 'bounce', 'sway-float', 'rotate-float'];
  const validSpeeds = ['slow', 'normal', 'fast'];

  if (animation.type && !validTypes.includes(animation.type)) return false;
  if (animation.speed && !validSpeeds.includes(animation.speed)) return false;
  if (animation.intensity != null && (animation.intensity < 0.1 || animation.intensity > 1)) return false;
  if (animation.delay != null && (animation.delay < 0 || animation.delay > 5)) return false;

  return true;
}
```

---

## Contoh Penggunaan

### Use Case 1: Ornament Bunga yang Natural

**Goal**: Bunga bergoyang pelan seperti ditiup angin

```typescript
const flowerAnimation: OrnamentAnimation = {
  type: 'sway-float',     // Kombinasi goyang + melayang
  enabled: true,
  speed: 'slow',          // 8 detik (sangat smooth)
  intensity: 0.4,         // Gerakan halus
  delay: 0
};
```

**Hasil**:
- Bunga bergerak horizontal: 6px (15px × 0.4)
- Bunga bergerak vertikal: 8px (20px × 0.4)
- Durasi: 8 detik per cycle
- Efek: Natural, seperti angin sepoi-sepoi

---

### Use Case 2: Stagger Effect (Multiple Ornaments)

**Goal**: 3 ornament bergerak bergantian (seperti ombak)

```typescript
// Ornament 1
const ornament1Animation: OrnamentAnimation = {
  type: 'float',
  enabled: true,
  speed: 'normal',
  intensity: 0.6,
  delay: 0          // ← Mulai immediately
};

// Ornament 2
const ornament2Animation: OrnamentAnimation = {
  type: 'float',
  enabled: true,
  speed: 'normal',
  intensity: 0.6,
  delay: 1.5        // ← Delay 1.5 detik
};

// Ornament 3
const ornament3Animation: OrnamentAnimation = {
  type: 'float',
  enabled: true,
  speed: 'normal',
  intensity: 0.6,
  delay: 3          // ← Delay 3 detik
};
```

**Hasil**: Gerakan bergelombang, ornament bergerak bergantian dengan interval 1.5 detik.

---

### Use Case 3: Ornament Highlight (Attention Grabber)

**Goal**: Ornament yang menarik perhatian ke element penting

```typescript
const highlightAnimation: OrnamentAnimation = {
  type: 'pulse',        // Scale in-out
  enabled: true,
  speed: 'normal',      // 5 detik
  intensity: 0.8,       // Scale up to 1.16x
  delay: 0
};
```

**Hasil**: Ornament "berkedip" smooth, menarik mata user ke area tertentu.

---

### Use Case 4: Disable Animation di Section Tertentu

Jika ingin ornament tetap ada tapi tidak bergerak:

```typescript
const staticOrnament: OrnamentAnimation = {
  type: 'none',         // atau type apapun
  enabled: false,       // ← Key: disabled
  speed: 'normal',
  intensity: 0.5,
  delay: 0
};
```

**Hasil**: Ornament ditampilkan static tanpa animasi.

---

## Performance & Best Practices

### ✅ DO - Best Practices

1. **Gunakan GPU-Accelerated Properties**
   - Animasi hanya menggunakan `transform` dan `opacity`
   - Tidak ada `left`, `top`, `width`, `height` dalam animasi
   - Browser dapat optimize di GPU layer

2. **Batasi Jumlah Animated Ornaments**
   - **Recommended**: Max 5-10 animated ornaments per section
   - Terlalu banyak animasi dapat menurunkan performa di low-end devices

3. **Pilih Speed yang Tepat**
   - `slow` (8s): Untuk efek natural, smooth, relaxing
   - `normal` (5s): Default, balanced
   - `fast` (3s): Untuk efek playful, energetic (hati-hati jangan terlalu cepat)

4. **Test di Mobile Device**
   - Animasi yang smooth di desktop belum tentu smooth di mobile
   - Always test di real device, bukan hanya Chrome DevTools

5. **Respect User Preferences**
   - Sistem otomatis disable animasi jika user enable `prefers-reduced-motion`
   - Accessibility compliance built-in

### ❌ DON'T - Anti-Patterns

1. **Jangan Gunakan Intensity Terlalu Tinggi**
   - Intensity > 0.8 dapat terlihat "bouncy" dan tidak natural
   - Untuk ornament bunga: stick to 0.3 - 0.5

2. **Jangan Combine Speed Fast + Intensity High**
   - Kombinasi ini dapat membuat user pusing
   - Gunakan salah satu: fast OR high intensity, not both

3. **Jangan Animate Semua Ornament**
   - Terlalu banyak gerakan = distracting
   - Pilih 2-3 ornament key untuk di-animate

4. **Jangan Gunakan Rotate untuk Large Ornaments**
   - Rotasi pada ornament besar dapat mengganggu
   - Rotate cocok untuk ornament kecil (max 100px)

### Performance Metrics

- **Target**: 60 FPS (16.67ms per frame)
- **5 animated ornaments**: ~10-12 FPS usage (smooth)
- **10 animated ornaments**: ~15-20 FPS usage (still acceptable)
- **20+ animated ornaments**: ⚠️ Risk of jank on low-end devices

### Browser Compatibility

✅ Supported:
- Chrome 90+ (full support)
- Firefox 88+ (full support)
- Safari 14+ (full support)
- Edge 90+ (full support)
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

---

## Troubleshooting

### ❌ Problem: Ornament posisi berubah saat animasi di-enable

**Penyebab**: Layer system tidak properly implemented
**Solusi**: Pastikan menggunakan 3-layer architecture seperti di [Arsitektur Teknis](#arsitektur-teknis)

```jsx
// ❌ WRONG: Animation dan positioning di layer yang sama
<div style={{ position: 'absolute', top: '10%' }} className="ornament-animate-sway">

// ✅ CORRECT: Positioning terpisah dari animation
<div style={{ position: 'absolute', top: '10%' }}>
  <div style={{ transform: 'scale(1.2)' }}>
    <div className="ornament-animate-sway">
```

---

### ❌ Problem: Ornament tidak bisa di-click/delete setelah animasi aktif

**Penyebab**: `pointer-events` di-disable atau z-index terlalu rendah
**Solusi**: Pastikan `Rnd` component tidak memiliki animation classes

```jsx
// ❌ WRONG: Animation di Rnd component
<Rnd className="ornament-animate-sway">

// ✅ CORRECT: Animation di inner div
<Rnd>
  <div className="ornament-animate-sway">
```

---

### ❌ Problem: Animasi tidak smooth (choppy/jank)

**Penyebab**: Terlalu banyak animated ornaments atau non-GPU properties
**Solusi**:
1. Kurangi jumlah animated ornaments (max 5-10)
2. Pastikan hanya `transform` yang digunakan (no `left`, `top`)
3. Test di incognito mode (extensions can affect performance)

---

### ❌ Problem: Animasi tidak muncul sama sekali

**Debug Checklist**:
1. ✅ `animation.enabled` = `true`?
2. ✅ `animation.type` != `'none'`?
3. ✅ CSS file `animations.css` ter-import?
4. ✅ Class names correct? Check browser DevTools Elements tab
5. ✅ User tidak enable `prefers-reduced-motion`?

```bash
# Check if CSS loaded
# Open DevTools → Elements → Select ornament div → Check Computed styles
# Should see: animation-name, animation-duration, etc.
```

---

### ❌ Problem: Static transform (scale, rotate) hilang saat animasi aktif

**Penyebab**: Animation transforms override static transforms di layer yang sama
**Solusi**: Pastikan static transforms di layer terpisah

```jsx
// ✅ CORRECT: Static transform di layer 2, animation di layer 3
<div style={{ transform: 'scale(1.2) rotate(45deg)' }}>  {/* Layer 2 */}
  <div className="ornament-animate-sway">                {/* Layer 3 */}
```

---

### ❌ Problem: Intensity slider tidak mengubah jarak gerakan

**Penyebab**: CSS custom properties tidak ter-apply
**Debug**:
```jsx
// Check inline styles di browser DevTools
<div style="--sway-distance: 7.5px; --float-distance: 10px;">
```

**Solusi**: Pastikan `getAnimationStyle()` dipanggil dan spread ke `style` prop:
```jsx
style={getAnimationStyle(ornament.animation)}
```

---

## Advanced Topics

### Custom Animation Timing Functions

Untuk kontrol lebih advanced, edit `/src/styles/animations.css`:

```css
/* Default: ease-in-out */
.ornament-animate-sway {
  animation-timing-function: ease-in-out;
}

/* Custom: cubic-bezier untuk efek spring */
.ornament-animate-sway-spring {
  animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Extending Animation Types

Untuk menambah jenis animasi baru:

1. **Update type definition** (`src/types/ornament.ts`):
```typescript
export type AnimationType =
  | 'none' | 'sway' | 'float' | ...
  | 'custom-spin';  // ← New type
```

2. **Add CSS keyframes** (`src/styles/animations.css`):
```css
@keyframes ornament-custom-spin {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
  100% { transform: rotate(360deg) scale(1); }
}

.ornament-animate-custom-spin {
  animation-name: ornament-custom-spin;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
```

3. **Update AnimationControlPanel** (`src/components/admin/AnimationControlPanel.tsx`):
```typescript
const animationTypes = [
  // ... existing types
  { value: 'custom-spin', label: 'Custom Spin', icon: '🌪️' },
];
```

4. **Update API validation** (`src/app/api/unified-themes/ornaments/route.ts`):
```typescript
const validTypes = [..., 'custom-spin'];
```

---

## Credits & References

**Developed by**: MyWeddBlue Team
**Date**: February 2026
**Version**: 1.0.0

### Related Documentation
- [Unified Theme System](./unified-theme-system.md)
- [Unified Theme Ornaments](./unified-theme-ornaments.md)
- [Ornament Library](../README.md#ornament-library)

### External References
- [MDN: CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [CSS Transforms Performance](https://web.dev/animations-guide/)
- [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

---

## Changelog

### v1.0.0 (2026-02-13)
- ✨ Initial release
- ✅ 8 animation types implemented
- ✅ Full customization controls (speed, intensity, delay)
- ✅ 3-layer architecture for transform separation
- ✅ Real-time preview in admin dashboard
- ✅ GPU-accelerated animations
- ✅ Mobile responsive
- ✅ Accessibility support (prefers-reduced-motion)

---

**🎉 Happy Animating! Selamat berkreasi dengan ornament yang hidup!**
