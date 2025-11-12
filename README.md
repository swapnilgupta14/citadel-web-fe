# Citadel Web Frontend

A React-based web application built with modern tools and best practices.

## Tech Stack

- Vite - Build tool and development server
- React 19 - UI library with TypeScript
- Tailwind CSS - Utility-first CSS framework
- React Query - Server state management
- Framer Motion - Animation library
- React Router - Client-side routing
- Axios - HTTP client
- React Hook Form + Zod - Form handling and validation
- PNPM - Package manager
- ESLint - Code linting
- Vitest - Unit testing framework

## Project Structure

```text
src/
├── assets/              # Static assets (images, icons)
│   └── cities/         # City images for location selection
├── components/         # React components
│   ├── layout/         # Layout components (MobileLayout, ProtectedRoute, ProtectedPagesLayout)
│   ├── navigation/     # Navigation components (BottomNavigation)
│   ├── skeleton/       # Loading skeleton components
│   └── ui/             # Reusable UI components (Button, ImageWithPlaceholder, etc.)
├── config/             # Configuration files (environment variables)
├── constants/          # Application constants (cities, etc.)
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
│   ├── logic/          # Business logic hooks (useAuth, useBookingFlow, useCitySelection)
│   └── queries/        # React Query hooks (useProfile, useEvents, etc.)
├── lib/                # Utility libraries
│   ├── helpers/        # Helper functions (validations, route helpers, toast, etc.)
│   └── storage/        # Local storage utilities (auth, navigation persistence, signup persistence)
├── pages/              # Page components
│   ├── auth/           # Authentication pages (LoginEmailPage, OTPEntryPage)
│   ├── events/         # Event-related pages (EventsPage, EventDetailPage, LocationPage, etc.)
│   ├── profile/        # Profile pages (ProfilePage)
│   └── signup/         # Signup flow pages (WhoAreYouPage, EmailEntryPage, etc.)
├── routes/             # Route configuration
│   ├── protected/      # Protected route wrappers
│   ├── LoginFlow.tsx   # Login flow routing
│   └── SignupFlow.tsx  # Signup flow routing
├── services/           # API services
│   ├── api.ts          # API endpoint definitions
│   └── axiosInstance.ts # Axios configuration and interceptors
├── types/              # TypeScript type definitions
├── test/               # Test utilities and setup
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PNPM package manager

Install PNPM globally:

```bash
npm install -g pnpm
```

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The development server runs on `http://localhost:5173` by default.

## Building

Build the application for production:

```bash
# Build for production
pnpm build
```

The production build is output to the `dist/` folder.

Preview the production build locally:

```bash
pnpm preview
```

## Testing

Run tests:

```bash
# Run tests in watch mode
pnpm test

# Run tests with UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage
```

## Code Quality

Lint and type check the code:

```bash
# Run ESLint
pnpm lint

# Auto-fix ESLint errors
pnpm lint:fix

# TypeScript type checking
pnpm type-check
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Citadel Web
VITE_ENABLE_DEVTOOLS=true
```

Access validated environment variables:

```typescript
import { env } from "./config/env";

console.log(env.VITE_API_BASE_URL);
```

### Tailwind CSS

Tailwind configuration is in `tailwind.config.js` with custom color palette, forms plugin, and typography plugin.

### Vite

Vite configuration includes:

- Code splitting for vendor libraries
- Path aliases
- Production optimizations
- Console removal in production builds


## License

Private project - All rights reserved
