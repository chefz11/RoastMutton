# Responsive Design Notes

## Mobile Responsiveness

The application is now fully responsive down to 320px width with the following breakpoints:

### Breakpoints

1. **Desktop**: Default styles (1200px+ containers)
2. **Tablet**: `@media (max-width: 768px)` - Two-column grids, adjusted spacing
3. **Mobile**: `@media (max-width: 480px)` - Single column layouts, smaller text
4. **Small Mobile**: `@media (max-width: 320px)` - Fully vertical layouts, optimized for narrow screens

### Key Responsive Features at 320px

#### Layout Changes
- All grids convert to single column
- Stats cards change from centered/vertical to horizontal rows (icon on right, content on left)
- Achievement badges become horizontal cards instead of vertical
- Headers stack vertically with reduced spacing

#### Typography
- h1: 1.5rem (down from 3rem)
- h2: 1.2rem (down from 2rem)
- h3: 1rem (down from 1.5rem)
- Body text: 0.9rem in most places
- Buttons: 0.85rem

#### Spacing
- App padding: 0.5rem
- Card padding: 0.75rem
- Gap between elements: 0.5rem typically

#### Component-Specific Changes

**Dashboard:**
- Stats grid: 1 column
- Books grid: 1 column
- Quick actions: vertical stack
- Buddy stats: vertical stack

**StatsView:**
- Stats cards: horizontal layout with icon on right
- Achievement badges: horizontal cards with icon on left
- Single column for all grids

**BookView:**
- Progress stats: vertical stack
- Movies grid: single column
- Chapter buttons: full width
- Metadata: vertical stack

**JournalView:**
- Timeline decorations hidden
- Badges: smaller with adjusted padding
- Entry content: optimized line height
- Edit hints: always visible on mobile

## Authentication

The app uses Firebase email link authentication (passwordless/magic link). Users cannot access any functionality until they:
1. Enter their email address
2. Receive the magic link email
3. Click the link to verify and authenticate

This ensures all users are email-verified before accessing the app.

## Favicon

A custom One Ring-themed favicon has been added. The SVG version is at `/public/favicon.svg`.

To replace with the actual Ring image:
1. Save the ring image as `/public/favicon.png`
2. Generate additional sizes using a favicon generator (favicon.io, realfavicongenerator.net)
3. Replace the SVG link in index.html with PNG if preferred
