# Real Estate CRM System

## Overview

This is a comprehensive Real Estate Customer Relationship Management (CRM) system built as a full-stack web application. The system manages the complete sales lifecycle for real estate developers, from lead generation to payment processing. It features a multi-role user system supporting Master Owners, Developer HQ administrators, Sales Admins, and Sales Executives, each with specific permissions and workflows.

The application handles core real estate business processes including lead management with pipeline tracking, customer relationship management, project and inventory management, payment processing, communication tracking, channel partner management, and comprehensive reporting and analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety and modern development
- **Vite** as the build tool for fast development and optimized production builds
- **Wouter** for lightweight client-side routing
- **TailwindCSS** with shadcn/ui components for consistent, modern UI design
- **React Query (TanStack Query)** for server state management, caching, and API interactions
- **React Hook Form** with Zod validation for form handling and data validation

### Backend Architecture
- **Express.js** server with TypeScript for API development
- **Passport.js** with Local Strategy for session-based authentication
- **Express Session** with PostgreSQL session store for secure session management
- **RESTful API** design with structured error handling and middleware
- **Modular route organization** with separate controllers for different business domains

### Database Design
- **PostgreSQL** as the primary relational database
- **Drizzle ORM** for type-safe database operations and schema management
- **Neon Database** as the serverless PostgreSQL provider
- **Schema-first approach** with shared TypeScript types between frontend and backend
- Comprehensive relational model covering users, projects, towers, units, leads, customers, bookings, payments, communications, and channel partners

### Authentication & Authorization
- **Role-based access control** with four distinct user roles: master, developer_hq, sales_admin, and sales_executive
- **Session-based authentication** using secure HTTP-only cookies
- **Password hashing** using Node.js crypto scrypt for security
- **Protected routes** on both frontend and backend with proper authorization checks

### State Management Pattern
- **Server state** managed through React Query with optimistic updates and cache invalidation
- **Client state** handled via React hooks and context where needed
- **Form state** managed through React Hook Form with Zod schema validation
- **Authentication state** managed through custom React context with query integration

### UI/UX Architecture
- **Responsive design** using Tailwind CSS with mobile-first approach
- **Component-driven development** with reusable UI components from shadcn/ui
- **Consistent design system** with CSS custom properties for theming
- **Accessible components** following ARIA guidelines and semantic HTML

## External Dependencies

### Database & Storage
- **Neon Database** - Serverless PostgreSQL database hosting
- **connect-pg-simple** - PostgreSQL session store for Express sessions

### UI & Styling
- **@radix-ui** components - Accessible, unstyled UI primitives for building the design system
- **TailwindCSS** - Utility-first CSS framework for styling
- **Lucide React** - Icon library providing consistent iconography
- **class-variance-authority** - Utility for creating variant-based component APIs

### Form Handling & Validation
- **React Hook Form** - Performant forms library with minimal re-renders
- **Zod** - TypeScript-first schema validation for runtime type checking
- **@hookform/resolvers** - Integration between React Hook Form and validation libraries

### Development Tools
- **Vite** - Fast build tool with hot module replacement
- **TypeScript** - Static type checking and enhanced developer experience
- **ESBuild** - Fast JavaScript bundler for production builds
- **Drizzle Kit** - Database schema management and migration tools

### Utility Libraries
- **date-fns** - Date manipulation and formatting utilities
- **clsx & tailwind-merge** - Conditional className utilities for dynamic styling
- **ws** - WebSocket library for real-time database connections via Neon

### Authentication & Security
- **Passport.js** - Authentication middleware with strategy-based architecture
- **Express Session** - Session management middleware for user state persistence
- **Node.js Crypto** - Built-in cryptographic functionality for password hashing

The system is designed to be scalable, maintainable, and secure, with a clear separation of concerns between the presentation layer, business logic, and data persistence layers.