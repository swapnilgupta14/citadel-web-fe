# Citadel Web Frontend

A fast, performant React application built with modern tools and best practices.

## 🚀 Tech Stack

- **⚡ Vite** - Lightning-fast dev experience with HMR
- **⚛️ React 19** - Latest React with TypeScript
- **🎨 Tailwind CSS** - Utility-first styling with plugins
- **🔄 React Query** - Powerful server state management
- **🎭 Framer Motion** - Production-ready animations
- **📦 PNPM** - Fast, disk-efficient package manager
- **🔍 ESLint** - Code quality and linting
- **🧪 Vitest** - Fast unit testing
- **📝 React Hook Form + Zod** - Type-safe form validation

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── layout/          # Layout components
│   └── features/        # Feature-specific components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and helpers
├── pages/               # Page components
├── services/            # API services
├── types/               # TypeScript types
├── config/              # Configuration files
├── test/                # Test utilities
├── App.tsx
├── main.tsx
└── index.css
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- PNPM (install globally: `npm install -g pnpm`)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server (runs on http://localhost:3000)
pnpm dev
```

## 📜 Available Scripts

```bash
# Development
pnpm dev              # Start dev server on port 3000

# Building
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Auto-fix ESLint errors
pnpm type-check       # TypeScript type checking

# Testing
pnpm test             # Run tests in watch mode
pnpm test:ui          # Run tests with UI
pnpm test:coverage    # Generate coverage report
```

## 🎨 Features

### Path Aliases
Import using `@/` prefix:
```typescript
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
```

### Utility Functions
The `cn()` function combines `clsx` and `tailwind-merge` for conflict-free class names:
```typescript
import { cn } from '@/lib/utils'

<div className={cn('base-class', isActive && 'active-class')} />
```

### Environment Variables
Create a `.env` file based on `.env.example`:
```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Citadel Web
VITE_ENABLE_DEVTOOLS=true
```

Access validated env vars:
```typescript
import { env } from '@/config/env'

console.log(env.VITE_API_BASE_URL)
```

## 🔧 Configuration

### Tailwind
Custom configuration in `tailwind.config.js` with:
- Custom primary color palette
- Forms plugin
- Typography plugin

### Vite
Optimized build configuration with:
- Code splitting for vendors
- Path aliases (`@/`)
- Production optimizations
- Console removal in production

### ESLint
Configured for React and TypeScript with recommended rules.

## 🧪 Testing

Vitest is configured with:
- React Testing Library
- jsdom environment
- Test utilities in `src/test/`

Example test:
```typescript
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders app', () => {
  render(<App />)
  expect(screen.getByText(/React/i)).toBeInTheDocument()
})
```

## 🚀 Deployment

```bash
# Build for production
pnpm build

# The dist/ folder is ready to deploy
```

Deploy to platforms like:
- Vercel
- Netlify
- Cloudflare Pages
- AWS Amplify

## 📝 Code Style

This project uses:
- ESLint for linting
- Husky for git hooks (when initialized with git)
- lint-staged for pre-commit checks

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `pnpm lint:fix`
4. Run `pnpm type-check` and `pnpm test`
5. Submit a PR

## 📄 License

Private project - All rights reserved
