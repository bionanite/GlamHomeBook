# Kosmospace - Luxury Beauty Services Platform

## Overview

Kosmospace is a luxury beauty services marketplace for Dubai, connecting clients with premium beauticians for in-home services like manicures, pedicures, lash extensions, and makeup. The platform aims for a luxurious, minimalist design and seeks to be a leading premium service marketplace in the beauty industry. Key capabilities include a comprehensive booking system, beautician onboarding, role-based access, and advanced analytics.

## Recent Updates

### November 4, 2025
- **AI Blog Generation Engine**: Complete content marketing system for driving organic traffic
  - Extended database schema with `blogPosts` and `blogGenerationJobs` tables
  - OpenAI GPT-4o integration for SEO-optimized Dubai beauty trend articles
  - DALL-E 3 integration for automatic cover image generation
  - "Content Studio" admin tab for generating 2/4/6 articles simultaneously
  - Real-time progress tracking for generation jobs
  - Article management: publish/unpublish/delete with cover image previews
  - Focus keyword targeting for SEO optimization
  - Lazy OpenAI client initialization to handle missing API key gracefully
- **Location Autocomplete Enhancement**: Added location autocomplete dropdown to homepage hero section using shadcn Combobox component with 70+ Dubai areas. Dropdown opens upward for better UX.
- **Social Media URL Management**: 
  - Extended `platformSettings` schema with Facebook, Instagram, Twitter, LinkedIn URL fields
  - Created public API endpoint `/api/settings/social-media` for footer consumption
  - Added Social Media Links section in Admin Dashboard Settings tab
  - Updated Footer component to dynamically fetch and display social media URLs from database
- **Beautician Availability Display Fix**: Fixed beautician cards on Find Beauticians page to display user-friendly availability text (e.g., "Available 7 days a week", "Available: Mon, Tue, Wed") instead of raw JSON format.
- **Beautician Profile Avatar**: Added large beautician profile photo to the profile page header section using Avatar component (96px mobile, 128px desktop) positioned on the left side.
- **UAE Dirham Currency Symbol**: Replaced all "AED" currency displays with the traditional UAE Dirham symbol "د.إ" throughout the application for a more authentic Dubai market experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with **React and TypeScript** using **Vite**. **Wouter** handles client-side routing, and **TanStack Query** manages server state, caching, and data fetching. The UI is built with **shadcn/ui** leveraging **Radix UI primitives** and styled with **Tailwind CSS**, emphasizing a luxury, minimalist aesthetic. Typography uses Playfair Display (headings) and Inter (body). The design is responsive and mobile-first, includes light/dark mode, and uses **React Hook Form with Zod** for form validation.

### Backend Architecture

The backend uses **Node.js with Express.js** and **TypeScript**. It features a **RESTful API** structured under `/api`, supporting authentication, user management (customer, beautician, admin roles), service management, booking, and administrative functions. Data is stored in **PostgreSQL** using **Drizzle ORM** and **Neon Serverless PostgreSQL**. Session management is PostgreSQL-backed.

### Database Schema

The database includes tables for `sessions`, `users`, `beauticians`, `services`, `bookings`, `reviews`, `customerPreferences`, `offers`, and `whatsappMessages`. Drizzle ORM and Drizzle Kit manage schema and migrations.

### Authentication and Authorization

**Replit Auth (OpenID Connect)** is integrated, providing Google, GitHub, and email/password login. A **role-based access system** (customer, beautician, admin) is implemented, with `isAuthenticated` and `isAdmin` middleware protecting routes. User roles are assigned during onboarding or explicitly.

## External Dependencies

*   **Payment Processing**: Stripe (`@stripe/stripe-js`, `@stripe/react-stripe-js`) for secure transactions.
*   **Authentication**: Replit Auth (OpenID Connect) using `openid-client` and Passport.js strategy.
*   **Messaging**: Ultramessage (primary) and Twilio (fallback) for WhatsApp notifications.
*   **Database**: Neon Serverless PostgreSQL.
*   **Fonts**: Google Fonts (Playfair Display, Inter).
*   **UI Icons**: `lucide-react` and `react-icons`.
*   **Form Validation**: Zod schemas with `@hookform/resolvers`.
*   **Date Handling**: `date-fns`.
*   **UI Libraries**: Radix UI primitives, `class-variance-authority` (CVA), `tailwind-merge`, `clsx`, `cmdk`, `embla-carousel-react`, `vaul`.

## SEO & Digital Marketing

### SEO Implementation (Production-Ready)

The platform features comprehensive SEO optimization designed for first-page Google ranking in the competitive Dubai beauty market:

#### Technical SEO
*   **Meta Tags**: Complete HTML metadata including title, description, keywords, robots, canonical URL
*   **Open Graph**: Full OG tags for social sharing (Facebook, LinkedIn)
*   **Twitter Cards**: Summary large image cards with all required fields
*   **Geo Targeting**: Dubai-specific geo meta tags (ICBM, geo.position, geo.region)
*   **Bilingual Support**: Arabic language meta tags and hreflang alternates

#### Structured Data (Schema.org)
*   **LocalBusiness Schema**: Complete business profile with address (Dubai Marina), geo coordinates (25.0657° N, 55.1713° E), phone (+971501234567), opening hours (8 AM - 10 PM daily), services catalog, price range (AED 100-2000)
*   **WebSite Schema**: Search action support with bilingual (English/Arabic) queries
*   **FAQ Schema**: Dynamically injected FAQ structured data for rich snippets
*   **Schema Linking**: Proper @id references for entity relationships

#### Crawling & Indexing
*   **robots.txt**: Configured with proper allow/disallow rules, sitemap reference, 1-second crawl delay
*   **sitemap.xml**: All main pages with correct hreflang (en-AE, ar-AE), priority settings, weekly/daily change frequencies
*   **SEOHead Component**: Utility for dynamic per-page meta tag management (`client/src/components/SEOHead.tsx`)

#### Voice Search Optimization
*   **FAQ Component**: 12 conversational questions optimized for voice queries (e.g., "What beauty services does Kosmospace offer in Dubai?")
*   **Coverage**: Services, booking process, areas served, pricing, certification, cancellation, bridal packages, safety
*   **Rich Snippets**: Automatic FAQ schema markup injection for featured snippet eligibility

### Google Ads Strategy (Planned)

Research-based recommendations for Dubai beauty market:

#### Budget
*   **Minimum**: AED 2,000-3,000/month for meaningful results
*   **CPC Range**: AED 3-12 per click (varies by keyword competitiveness)
*   **Focus**: High-intent keywords like "bridal makeup Dubai", "home manicure JBR", "nail salon Dubai Marina"

#### Priority Keywords
1. **Service-specific**: "manicure Dubai", "pedicure at home", "lash extensions Dubai", "bridal makeup artist"
2. **Location-specific**: "beauty salon JBR", "nail salon Dubai Marina", "makeup artist Downtown Dubai"
3. **Intent-based**: "book beautician Dubai", "home beauty service", "mobile nail salon"

#### Next Steps
1. Google Analytics 4 setup with conversion tracking (bookings, WhatsApp clicks, calls)
2. Google Ads account creation and campaign structure
3. Landing page optimization for ad traffic
4. A/B testing for ad copy and landing pages
5. Conversion rate optimization (CRO)