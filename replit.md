# Kosmospace - Luxury Beauty Services Platform

## Overview

Kosmospace is a luxury beauty services marketplace for Dubai, connecting clients with premium beauticians for in-home services like manicures, pedicures, lash extensions, and makeup. The platform aims for a luxurious, minimalist design and seeks to be a leading premium service marketplace in the beauty industry. Key capabilities include a comprehensive booking system, beautician onboarding, role-based access, and advanced analytics.

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