# Kosmospace - Luxury Beauty Services Platform

## Overview

Kosmospace is a luxury beauty services marketplace platform designed for Dubai, connecting clients with premium beauticians for in-home services. The platform focuses on high-end beauty treatments including manicures, pedicures, lash extensions, and makeup artistry. The application emphasizes a luxurious, minimalist design approach inspired by premium service marketplaces and beauty industry leaders.

## User Preferences

Preferred communication style: Simple, everyday language.

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

### Backend Architecture

**Runtime**: Node.js with Express.js framework handling HTTP requests.

**Development Setup**: TypeScript with tsx for development runtime execution, esbuild for production bundling.

**API Structure**: RESTful API design with routes prefixed under `/api`. Currently structured but not fully implemented - the routes are registered through a modular system in `server/routes.ts`.

**Data Storage Strategy**: 
- Abstracted storage interface (`IStorage`) allowing for multiple implementations
- Current implementation: In-memory storage (`MemStorage`) for development
- Designed to be swapped with database implementations (Drizzle ORM configured for PostgreSQL/Neon)

**Session Management**: Infrastructure includes connect-pg-simple for PostgreSQL session storage (prepared but not actively used with in-memory storage).

**Request Processing**:
- JSON body parsing with raw body capture for webhook verification (Stripe)
- Request logging middleware tracking API response times and payloads
- CORS and credential handling configured

### Data Storage Solutions

**ORM**: Drizzle ORM configured for PostgreSQL database operations.

**Database Provider**: Neon Serverless PostgreSQL with WebSocket support for serverless environments.

**Schema Design** (initial setup):
- Users table with UUID primary keys
- Username/password authentication fields
- Extensible schema structure for adding beautician profiles, bookings, services, reviews

**Migration Strategy**: Drizzle Kit for schema migrations with configuration in `drizzle.config.ts`.

**Connection Pooling**: Neon's connection pooling for efficient database connections in serverless environments.

### Authentication and Authorization

**Current State**: Basic user schema defined with username/password fields, but authentication logic not yet implemented.

**Planned Approach**: 
- Session-based authentication (connect-pg-simple configured)
- User roles likely to include: clients, beauticians, and potentially administrators
- Password hashing expected for production (infrastructure suggests bcrypt or similar)

### External Dependencies

**Payment Processing**: Stripe integration prepared with both client-side (`@stripe/stripe-js`, `@stripe/react-stripe-js`) and expected server-side implementation for handling payments, bookings, and beautician payouts.

**Asset Management**: Static image assets stored in `attached_assets/generated_images/` directory, imported directly into components.

**Fonts**: Google Fonts (Playfair Display and Inter) loaded via CDN in the HTML head.

**Development Tools**:
- Replit-specific plugins for development (vite-plugin-runtime-error-modal, cartographer, dev-banner)
- Error overlay and debugging tools for development environment

**UI Icons**: lucide-react for consistent iconography, react-icons for social media icons.

**Form Validation**: Zod schemas with @hookform/resolvers for type-safe form validation.

**Date Handling**: date-fns library for date manipulation and formatting.

**Key Third-Party UI Libraries**:
- Radix UI primitives for accessible component foundations
- class-variance-authority (CVA) for component variant styling
- tailwind-merge and clsx for conditional CSS class composition
- cmdk for command menu/search functionality
- embla-carousel-react for image carousels
- vaul for drawer components