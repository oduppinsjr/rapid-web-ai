# AutoSite - AI Website Builder

## Overview
AutoSite is a SAAS application that helps small businesses, solopreneurs, and freelancers create professional websites using AI. The application provides three main approaches: choosing from AI-generated templates, building from AI prompts, and modifying existing websites through natural language chat commands.

## User Preferences
Preferred communication style: Simple, everyday language.
Design preferences: Royal purple primary color (#663399) with golden yellow secondary (#FFD700), modern hero sections with animated backgrounds, removal of corporate styling.

## Recent Changes (Jan 28, 2025)
- Updated UI theme to royal purple and golden yellow color scheme
- Created modern landing page with animated gradient background and hero section
- Replaced Replit OAuth with username/password authentication system
- Added login page with sign in/sign up tabs
- Updated database schema to include username and password fields
- Created demo user account for testing (username: demo, password: password)

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with structured error handling
- **Session Management**: Express sessions with PostgreSQL storage
- **Authentication**: Replit OAuth integration with OpenID Connect

### Database Architecture
- **Primary Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM with type-safe queries
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Connection Pooling**: Neon serverless connection pooling

## Key Components

### Authentication System
- **Provider**: Username/password authentication with bcrypt hashing
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **User Management**: User registration and login with secure password storage
- **Route Protection**: Middleware-based authentication checks
- **Demo Account**: Username: demo, Password: password

### AI Integration
- **Provider**: OpenAI GPT-4o for website generation and modifications
- **Website Generation**: Prompt-based website creation with structured JSON output
- **Chat Interface**: Natural language website editing through AI chat
- **Content Structure**: Hierarchical page/section/component organization

### Website Management
- **Templates**: Pre-built AI-generated websites across multiple categories (restaurant, personal, service, portfolio)
- **Custom Domains**: Support for both subdomains and custom domain names
- **Publishing**: Draft/published state management
- **Visual Editor**: Component-based editing interface

### UI Component System
- **Design System**: Shadcn/ui with consistent theming
- **Components**: Comprehensive set including forms, dialogs, navigation, data display
- **Theming**: CSS custom properties with light/dark mode support
- **Responsive Design**: Mobile-first approach with breakpoint utilities

## Data Flow

### User Authentication Flow
1. User clicks login → Redirected to Replit OAuth
2. OAuth callback → User data extracted and stored/updated
3. Session created → User redirected to dashboard
4. Protected routes check session validity

### Website Creation Flow
1. **Template Mode**: User selects template → Template duplicated → User can edit
2. **AI Prompt Mode**: User enters business description → AI generates complete website structure → User can modify
3. **AI Chat Mode**: User provides natural language instructions → AI modifies existing website content

### Website Publishing Flow
1. User makes changes in editor → Changes saved to database
2. User clicks publish → Website marked as published
3. Website accessible via subdomain or custom domain

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **AI Service**: OpenAI API for content generation
- **Authentication**: Replit OAuth service
- **UI Components**: Radix UI primitives and Shadcn/ui
- **State Management**: TanStack Query for server state

### Development Dependencies
- **Build Tool**: Vite with React plugin
- **Type Checking**: TypeScript with strict configuration
- **Code Bundling**: ESBuild for server-side bundling
- **Development Tools**: Replit-specific plugins for enhanced development experience

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds React app to static assets in `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations applied via `db:push` script

### Environment Configuration
- **Database**: `DATABASE_URL` for PostgreSQL connection
- **AI Service**: `OPENAI_API_KEY` for OpenAI integration  
- **Authentication**: `REPL_ID`, `ISSUER_URL`, `SESSION_SECRET` for Replit OAuth
- **Domains**: `REPLIT_DOMAINS` for allowed authentication domains

### Scalability Considerations
- **Database**: Serverless PostgreSQL with connection pooling
- **Session Storage**: Database-backed sessions for horizontal scaling
- **Static Assets**: Served through Vite in development, can be CDN-served in production
- **API Rate Limiting**: OpenAI API usage tracking per user with plan-based limits

The application follows a traditional three-tier architecture with clear separation between presentation (React), business logic (Express), and data (PostgreSQL) layers, enhanced with AI capabilities for content generation and modification.