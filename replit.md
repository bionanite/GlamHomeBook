# Kosmospace - Luxury Beauty Services Platform

## Overview

Kosmospace is a luxury beauty services marketplace platform designed for Dubai, connecting clients with premium beauticians for in-home services. The platform focuses on high-end beauty treatments including manicures, pedicures, lash extensions, and makeup artistry. The application emphasizes a luxurious, minimalist design approach inspired by premium service marketplaces and beauty industry leaders.

## Recent Progress (November 1, 2025)

- Implemented complete database schema with 6 tables (sessions, users, beauticians, services, bookings, reviews)
- Integrated Replit Auth (OpenID Connect) for authentication with Google, GitHub, email/password support
- Created role-based user system (customer, beautician, admin)
- Built and connected beautician onboarding flow to backend API
- Established DatabaseStorage layer with full CRUD operations for all entities
- Set up session management with PostgreSQL-backed sessions
- **Admin Dashboard**: Built comprehensive admin panel at /admin with beautician approval workflow and booking management
- **Beautician Dashboard**: Completed service management dashboard with strict validation:
  - Full CRUD operations for beautician services
  - Integer-only validation for price and duration (decimals rejected)
  - Protected routes ensuring beauticians only manage their own services
  - Production-ready with architect approval and e2e testing
- **Find Beauticians Integration**: Successfully connected to backend API
  - Fetches beauticians from /api/beauticians with user names via database join
  - Shows only approved beauticians (isApproved=true)
  - Displays loading state while fetching
  - Fixed OIDC authentication bug where duplicate email constraint caused login failures

## User Preferences

Preferred communication style: Simple, everyday language.

## Current Feature Status

### Completed Features:
1. **Home Page** - Luxury landing page with animated showcase, services grid, reviews carousel
2. **Find Beauticians Page** - Search, filters (service, location, price, rating), beautician cards with responsive design
3. **Beautician Onboarding** - 3-step wizard integrated with backend (personal info → professional details → business setup)
4. **Authentication System** - Replit Auth integration with role-based access (customer/beautician/admin)
5. **Database Infrastructure** - Complete schema with all necessary tables and relationships
6. **Admin Dashboard** - Full-featured admin panel with:
   - Beautician application review (approve/reject pending applications)
   - Booking management (view all bookings, update status)
   - WhatsApp offer management (manual sending, automated trigger)
   - Protected with admin role authentication
   - Tabbed interface for different management functions
   - Real-time updates with optimistic UI updates
7. **Beautician Dashboard** - Complete service and pricing management:
   - View all services in responsive grid layout
   - Add new services with service type, price (AED), duration (minutes)
   - Edit existing services with dialog-based forms
   - Delete services with confirmation
   - Strict validation: positive integers only for price/duration (decimals rejected)
   - Security: beauticians can only manage their own services
   - Production-ready validation on both frontend (Zod) and backend (Number.isInteger)
8. **WhatsApp Offer Generation System** - Intelligent marketing automation:
   - Dual-provider messaging (Ultramessage primary, Twilio fallback)
   - Booking pattern analytics (favorite beauticians, service intervals, timing)
   - Personalized discount calculation based on booking history
   - Automated scheduler (10AM & 2PM Dubai time daily)
   - Customer dashboard preferences management (opt-in, contact times)
   - Admin manual offer sending and bulk automation trigger
   - Full message tracking and delivery logging

### In Progress:
1. Complete booking flow with Stripe payment integration
2. Review and rating system completion

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**Routing**: wouter - a lightweight client-side routing library for single-page application navigation.

**State Management**: TanStack Query (React Query) for server state management, providing caching, synchronization, and data fetching capabilities.

**UI Component Library**: shadcn/ui with Radix UI primitives, providing accessible and customizable components with consistent styling through Tailwind CSS.

**Design System**:
- Typography: Playfair Display (serif, headings) and Inter (sans-serif, body text)
- Color scheme: Neutral-based with luxury aesthetics, supporting light/dark modes
- Spacing: Tailwind's spacing system with custom configurations
- Custom CSS variables for theming and elevation effects

**Key Frontend Features**:
- Responsive design with mobile-first approach
- Theme toggle (light/dark mode) with localStorage persistence
- Image showcase carousel/slider components
- Form handling with React Hook Form and Zod validation
- Toast notifications for user feedback
- Authentication-aware routing and protected pages

### Backend Architecture

**Runtime**: Node.js with Express.js framework handling HTTP requests.

**Development Setup**: TypeScript with tsx for development runtime execution, esbuild for production bundling.

**API Structure**: RESTful API design with routes prefixed under `/api`:
- `/api/login`, `/api/logout`, `/api/callback` - Replit Auth endpoints
- `/api/auth/user` - Get current authenticated user
- `/api/auth/set-role` - Set user role (customer/beautician/admin)
- `/api/users` - Get all customers (admin only)
- `/api/beauticians/onboard` - Beautician onboarding
- `/api/beauticians` - Get all approved beauticians
- `/api/beauticians/:id` - Get beautician with services
- `/api/beautician/services` - GET beautician's services, POST create new service
- `/api/beautician/services/:id` - PATCH update service, DELETE remove service
- `/api/bookings/customer` - Get customer bookings
- `/api/bookings/beautician` - Get beautician bookings
- `/api/admin/beauticians/pending` - Get pending beautician applications (admin only)
- `/api/admin/beauticians/:id/approve` - Approve beautician application (admin only)
- `/api/admin/beauticians/:id/reject` - Reject beautician application (admin only)
- `/api/admin/bookings` - Get all bookings (admin only)
- `/api/admin/bookings/:id/status` - Update booking status with validation (admin only)
- `/api/notifications/preferences` - GET/PUT customer WhatsApp preferences
- `/api/offers/send` - Send personalized offer to customer (admin only)
- `/api/offers/trigger-automated` - Trigger bulk offer generation (admin only)
- `/api/offers/customer` - Get customer offers
- `/api/offers/:id/click` - Track offer click
- `/api/webhooks/ultramessage` - Ultramessage delivery status webhook

**Data Storage**: 
- Abstracted storage interface (`IStorage`) with DatabaseStorage implementation
- PostgreSQL database with Drizzle ORM
- Full CRUD operations for users, beauticians, services, bookings, reviews

**Session Management**: PostgreSQL-backed sessions using connect-pg-simple with 1-week TTL.

**Request Processing**:
- JSON body parsing with raw body capture for webhook verification (Stripe)
- Request logging middleware tracking API response times
- CORS and credential handling configured
- isAuthenticated middleware for protected routes

### Database Schema

**Tables**:
1. `sessions` - Session storage for Replit Auth
2. `users` - User accounts with Replit Auth integration (id, email, firstName, lastName, profileImageUrl, phone, role: 'customer' | 'beautician' | 'admin')
3. `beauticians` - Beautician profiles (userId, bio, experience, startingPrice, availability, rating, reviewCount, isApproved, serviceAreas)
4. `services` - Services offered by beauticians (beauticianId, name, price, duration)
5. `bookings` - Customer bookings (customerId, beauticianId, serviceId, scheduledDate, location, status: 'pending' | 'confirmed' | 'completed' | 'cancelled', amounts, stripePaymentIntentId)
6. `reviews` - Customer reviews (bookingId, customerId, beauticianId, rating, comment)
7. `customerPreferences` - WhatsApp notification preferences (customerId, whatsappNumber, whatsappOptIn, receiveOffers, receiveReminders, preferredContactTime)
8. `offers` - Generated personalized offers (customerId, beauticianId, serviceId, offerType, discountPercent, prices, message, status, tracking dates)
9. `whatsappMessages` - WhatsApp delivery tracking (offerId, customerId, phoneNumber, provider, messageType, providerMessageId, status, deliveryStatus)

**ORM**: Drizzle ORM configured for PostgreSQL database operations.

**Database Provider**: Neon Serverless PostgreSQL with WebSocket support.

**Migration Strategy**: Drizzle Kit with `npm run db:push` for schema synchronization.

**Connection Pooling**: Neon's connection pooling for efficient database connections in serverless environments.

### Authentication and Authorization

**Implementation**: Replit Auth (OpenID Connect) integrated with role-based system.

**Authentication Flow**:
- Users log in via `/api/login` (supports Google, GitHub, email/password)
- Session stored in PostgreSQL with connect-pg-simple
- User profile automatically created/updated via upsertUser
- Role assignment (customer/beautician/admin) happens during onboarding or explicitly via `/api/auth/set-role`

**Protected Routes**: 
- `isAuthenticated` middleware validates sessions and refreshes tokens automatically
- `isAdmin` middleware restricts admin endpoints to users with role='admin'
- Admin routes include double-layer protection: isAuthenticated + isAdmin

**Frontend Auth**: useAuth hook provides user data, loading state, and authentication status throughout the app.

**Admin Access**: 
- Admin dashboard at `/admin` requires admin role
- To set a user as admin: `UPDATE users SET role = 'admin' WHERE email = 'user@example.com'`
- Admin dashboard uses wouter navigation for client-side routing

### External Dependencies

**Payment Processing**: Stripe integration prepared with both client-side (`@stripe/stripe-js`, `@stripe/react-stripe-js`) and server-side capabilities. Environment variables configured: `STRIPE_SECRET_KEY`, `VITE_STRIPE_PUBLIC_KEY`, plus testing variants.

**Authentication**: Replit Auth (OpenID Connect) with `openid-client` and Passport.js strategy.

**Asset Management**: Static image assets stored in `attached_assets/generated_images/` directory, imported directly into components.

**Fonts**: Google Fonts (Playfair Display and Inter) loaded via CDN in the HTML head.

**Development Tools**:
- Replit-specific plugins for development (vite-plugin-runtime-error-modal, cartographer, dev-banner)
- Error overlay and debugging tools for development environment

**UI Icons**: lucide-react for consistent iconography, react-icons for social media icons.

**Form Validation**: Zod schemas with @hookform/resolvers for type-safe form validation. zod-validation-error for user-friendly error messages. All pricing and duration fields validated as positive integers on both frontend (z.coerce.number().int().positive()) and backend (Number.isInteger with >0 checks).

**Date Handling**: date-fns library for date manipulation and formatting.

**Key Third-Party UI Libraries**:
- Radix UI primitives for accessible component foundations
- class-variance-authority (CVA) for component variant styling
- tailwind-merge and clsx for conditional CSS class composition
- cmdk for command menu/search functionality
- embla-carousel-react for image carousels
- vaul for drawer components
