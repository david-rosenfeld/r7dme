# Overview

This is a full-stack TypeScript web application built with a React frontend and Express.js backend architecture. The application appears to be a personal portfolio website featuring pages for home, about, projects, and research. It uses modern web technologies including shadcn/ui components for the frontend interface, Drizzle ORM for database operations with PostgreSQL, and a clean separation between client and server code.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React with TypeScript, built using Vite for development and bundling
- **UI Library**: shadcn/ui components with Radix UI primitives for accessible, customizable components
- **Styling**: TailwindCSS with CSS variables for theming and dark mode support
- **Routing**: Wouter for client-side routing with pages for home, about, projects, and research
- **State Management**: TanStack React Query for server state management and caching
- **Animations**: Framer Motion for page transitions and interactive animations
- **Layout**: Responsive design with a sidebar navigation that adapts to mobile screens

**Component Structure**: Organized with a clean separation between UI components, layout components, and page components. Uses a consistent design system with custom CSS variables for theming.

## Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js
- **API Structure**: RESTful API with routes prefixed under `/api`
- **Middleware**: Custom logging middleware for API requests with performance tracking
- **Error Handling**: Global error handler with proper HTTP status codes
- **Development**: Integrated with Vite for hot module replacement and development tooling

**Storage Layer**: Abstracted storage interface with both in-memory and database implementations
- **Current Implementation**: In-memory storage using Maps for development/testing
- **Database Ready**: Configured for PostgreSQL with Drizzle ORM integration
- **Schema**: User entity with id, username, and password fields

## Data Storage

**Database**: PostgreSQL with Drizzle ORM
- **Connection**: Neon Database serverless driver for cloud PostgreSQL
- **Migrations**: Drizzle Kit for schema management and migrations
- **Type Safety**: Fully typed database operations with Zod schema validation

**Session Management**: Configured for PostgreSQL session storage using connect-pg-simple

## Development & Build

**Development Stack**:
- **Build Tool**: Vite for fast development and optimized production builds
- **TypeScript**: Strict configuration with path aliases for clean imports
- **Hot Reload**: Integrated development server with error overlay
- **Code Quality**: ESM modules throughout the application

**Deployment**:
- **Build Process**: Separate client and server builds, with client assets served statically
- **Production**: Node.js server serving both API routes and static frontend assets

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database toolkit and query builder
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## UI & Styling
- **shadcn/ui**: Modern React component library built on Radix UI
- **Radix UI**: Unstyled, accessible UI primitives
- **TailwindCSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for React
- **Lucide React**: Icon library

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type checking and compilation
- **Replit Integration**: Development environment plugins and error handling

## Frontend Libraries
- **TanStack React Query**: Data fetching and caching
- **Wouter**: Lightweight client-side router
- **React Hook Form**: Form handling with validation
- **date-fns**: Date manipulation utilities
- **Embla Carousel**: Carousel/slider component

## Validation & Forms
- **Zod**: TypeScript-first schema validation
- **@hookform/resolvers**: React Hook Form validation resolvers
- **drizzle-zod**: Integration between Drizzle ORM and Zod