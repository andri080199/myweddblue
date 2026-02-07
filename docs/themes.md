# Theme System Documentation

This document outlines the architecture and management of themes in the MyWeddBlue application.

## Overview
The theme system allows for dynamic switching of color palettes and background images across the application. It supports both **Built-in Themes** (hardcoded in code) and **Custom Themes** (stored in database/API).

## Core Components

### 1. Theme Definitions
-   **Color Themes**: Defined in `src/themes/colorThemes.ts` (for built-in) and fetched via API (for custom).
-   **Background Themes**: Managed via `src/app/admin/theme-backgrounds/page.tsx` and related API endpoints.

### 2. Admin Interface
Located at: `/admin/theme-backgrounds`

**Features:**
-   **Dynamic Grid Layout**: Responsive grid that adjusts from 1 column (mobile) to 5 columns (large screens).
-   **Live Previews**: Visual representation of theme colors and background images.
-   **Management Actions**:
    -   **Preview**: View theme details in a modal.
    -   **Edit**: Modify custom themes (Built-in themes are read-only).
    -   **Delete**: Remove custom themes.

**Key Files:**
-   `src/app/admin/theme-backgrounds/page.tsx`: Main management interface.
-   `src/themes/colorThemes.ts`: Types and built-in color definitions.

## Recent Updates (Feb 2026)

### UI Refinements
-   **Compact Design**: Theme cards have been reduced in size to fit more on the screen.
-   **Responsive Layout**:
    -   Mobile: 1 column (`grid-cols-1`)
    -   Tablet: 2-3 columns
    -   Desktop: 4-5 columns
-   **Action Buttons**: Converted "Preview", "Edit", and "Delete" buttons to icon-only format to prevent overflow on smaller cards.
-   **Real Thumbnails**:
    -   **Built-in Themes**: Display the `hero` image defined in `src/themes/backgroundThemes.ts`.
    -   **Custom Themes**: Display the first available background image (optimized via `thumbnail` field in API).

### Bug Fixes
-   **Dynamic Color Loading**: Fixed an issue where built-in themes were displaying hardcoded fallback colors instead of their actual definitions from `colorThemes.ts`.
-   **Variable Collision**: Renamed imports to avoid conflicts with local state variables.

## How to Add New Built-in Themes
1.  Open `src/themes/colorThemes.ts`.
2.  Add a new entry to the `colorThemes` object with a unique ID.
3.  Add the theme ID to the `BUILTIN_COLOR_THEMES` list in `src/app/admin/theme-backgrounds/page.tsx` (or ensure it's dynamically imported if refactored).

## API Endpoints
-   `GET /api/custom-color-themes`: Fetch custom color themes.
-   `GET /api/custom-background-themes`: Fetch custom background themes.
