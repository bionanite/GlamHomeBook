# Design Guidelines: Dubai Luxury Beautician Booking Platform

## Design Approach

**Reference-Based Luxury Service Platform**
Drawing inspiration from high-end service marketplaces (Airbnb, luxury hotel booking platforms) combined with premium beauty industry aesthetics (Glossier, Net-a-Porter). The design should convey trust, elegance, and effortless sophistication while maintaining excellent usability.

**Core Principle**: Luxurious minimalism - every element serves a purpose, generous whitespace creates breathing room, and premium typography elevates the experience.

---

## Typography System

**Primary Font Family**: Playfair Display (Google Fonts) - for headings and brand moments
**Secondary Font Family**: Inter (Google Fonts) - for body text and UI elements

**Type Scale**:
- Hero Headlines: 4xl to 6xl (48-60px desktop), bold weight
- Page Titles: 3xl to 4xl (36-48px), semibold
- Section Headers: 2xl to 3xl (24-36px), semibold
- Card Titles: xl to 2xl (20-24px), medium
- Body Text: base to lg (16-18px), regular
- Captions/Meta: sm to base (14-16px), regular
- Button Text: base (16px), medium weight

**Hierarchy Rules**:
- Use generous letter-spacing (tracking-wide) on uppercase labels
- Maintain 1.6-1.8 line height for body text
- Pair serif headlines with sans-serif body for visual interest

---

## Layout & Spacing System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 for consistency
- Component padding: p-6 to p-8
- Section spacing: py-16 to py-24
- Card gaps: gap-6 to gap-8
- Element margins: mb-4, mt-6, etc.

**Container Strategy**:
- Maximum content width: max-w-7xl (1280px)
- Form containers: max-w-2xl (672px)
- Text content: max-w-4xl (896px)

**Grid Systems**:
- Service cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Beautician profiles: grid-cols-1 md:grid-cols-2 xl:grid-cols-3
- Feature highlights: grid-cols-1 lg:grid-cols-2

---

## Component Library

### Navigation
**Desktop Header** (sticky, backdrop-blur):
- Logo left-aligned, primary navigation center, authentication/profile right
- Height: h-20
- Horizontal padding: px-8
- Link spacing: space-x-8

**Mobile Navigation**:
- Slide-in drawer with full-screen overlay
- Menu items stacked with generous py-4 spacing

### Hero Section
**Home Page Hero**:
- Full-width with large background image showing beautician at work
- Height: min-h-screen on desktop, min-h-[600px] on mobile
- Centered overlay content with blurred button backgrounds
- Headline + subheadline + dual CTAs ("Book Now" + "Become a Beautician")
- Search bar integrated below CTAs (location + service type)

### Service Cards
**Premium Card Design**:
- Elevated with subtle shadow (shadow-lg)
- Rounded corners: rounded-2xl
- Image aspect ratio: aspect-[4/3]
- Content padding: p-6
- Hover state: subtle lift (transform scale-105 transition)

**Card Content Structure**:
- Service image (top)
- Service name (heading)
- Beautician name with small profile photo
- Price range
- Rating stars + review count
- "View Details" or "Book Now" button

### Beautician Profile Cards
- Square profile photo: aspect-square, rounded-full for avatar
- Name + specialties
- Years of experience badge
- Rating + number of bookings
- Starting price indicator
- Grid layout with consistent spacing

### Calendar Component
**Availability Calendar**:
- Month view with date cells
- Each cell: min-h-16 for adequate tap targets
- Available slots highlighted distinctly
- Selected date has elevated treatment
- Time slot picker below calendar
- Padding: p-6, spacing between elements: gap-4

### Booking Flow
**Step-by-Step Layout**:
- Progress indicator at top
- Single-column form: max-w-2xl mx-auto
- Large form inputs: h-12 to h-14
- Generous spacing between fields: space-y-6
- Sticky footer with navigation buttons

### Dashboard Layouts
**Beautician Dashboard**:
- Sidebar navigation (w-64) with main content area
- Stats cards in grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
- Upcoming bookings list with timeline view
- Calendar integration prominent

**Customer Dashboard**:
- Horizontal tab navigation
- Booking history cards
- Favorite beauticians grid
- Profile settings in sidebar

### Forms
**Input Fields**:
- Height: h-12
- Rounded: rounded-lg
- Padding: px-4
- Labels above inputs with mb-2
- Error messages below with text-sm

**Buttons**:
- Primary: Large (h-12), rounded-lg, font-medium
- Secondary: Same size, outlined variant
- Text buttons: Underline on hover
- Icon buttons: Square (w-10 h-10), rounded-full

### Pricing Tables
**Service Pricing Display**:
- Clean table layout or card-based comparison
- Row height: h-16 for comfort
- Column padding: px-6
- Highlight featured/popular services

---

## Images Strategy

**Required Images**:
1. **Hero Section**: High-quality lifestyle image showing beautician performing service in elegant Dubai home setting (manicure/makeup application). Full-width, high-resolution
2. **Service Category Cards**: Individual images for each service type (manicures, pedicures, lashes, makeup) - professional, clean aesthetic
3. **Beautician Profiles**: Professional headshots with consistent styling
4. **Before/After Gallery**: Service result showcases in grid layout
5. **Trust Indicators**: Placeholder for certification badges, partner logos
6. **Mobile App Mockups**: If promoting mobile booking

**Image Treatment**:
- Consistent aspect ratios across categories
- Subtle overlay gradients on hero images for text legibility
- Rounded corners on all images (rounded-xl to rounded-2xl)
- Lazy loading for performance

---

## Responsive Breakpoints

**Mobile-First Approach**:
- Base (0-640px): Single column, stacked navigation, full-width cards
- md (768px+): Two-column grids, horizontal navigation
- lg (1024px+): Three-column grids, expanded layouts
- xl (1280px+): Maximum widths, enhanced spacing

**Touch Targets**: Minimum 44x44px for all interactive elements on mobile

---

## Micro-interactions

**Subtle Animation Usage** (minimal, purposeful):
- Card hover: slight lift (translate-y-1) + shadow enhancement
- Button press: subtle scale (scale-95)
- Page transitions: fade-in for content
- Loading states: skeleton screens with shimmer effect
- Calendar date selection: smooth highlight transition

**Performance**: Use CSS transforms only, avoid animating layout properties

---

## Accessibility Standards

- Focus indicators on all interactive elements (ring-2 ring-offset-2)
- ARIA labels for icon-only buttons
- Semantic HTML structure (nav, main, section, article)
- Form labels always visible
- Sufficient contrast ratios (ensure designer verifies)
- Keyboard navigation support
- Screen reader friendly component structure

---

This design system creates a cohesive, luxurious experience that builds trust with both beauticians and customers while maintaining excellent usability across all devices.