# Online Resume Builder - Application Architecture

## Overview

Online Resume Builder is a fullstack web application that allows users to create, customize, and export professional resumes. The application features a React-based frontend, Node.js backend, and uses modern technologies for authentication, payments, and PDF generation.

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Nginx Proxy   │    │   Frontend   │    │    Backend      │
│   (Port 80/443) │───▶│  React App   │───▶│  Express.js     │
│                 │    │  (Port 4173) │    │  (Port 1337)    │
└─────────────────┘    └──────────────┘    └─────────────────┘
                              │                       │
                              │                       ▼
                              │              ┌─────────────────┐
                              │              │   SQLite DB     │
                              │              │                 │
                              │              └─────────────────┘
                              ▼
                       ┌──────────────┐
                       │  External    │
                       │  Services    │
                       │  - Clerk     │
                       │  - Stripe    │
                       │  - Puppeteer │
                       └──────────────┘
```

## Frontend Architecture

### Technology Stack
- **Framework**: React 19.1.0 with TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.8
- **Routing**: React Router 7.6.2
- **State Management**: React Context + useImmer hook
- **Authentication**: Clerk React SDK
- **Internationalization**: i18next with French/English support
- **Testing**: Vitest + Playwright

### Key Features & Components

#### Core Features
1. **Resume Builder Interface**
   - Form-based resume creation
   - Real-time preview
   - Multiple resume templates (classic, professional, modern), registered in `src/components/ResumeModels/templates.ts`
   - Theme customization
   - Multi-language support (English/French)

2. **Authentication System**
   - User registration/login via Clerk
   - Protected routes
   - SSO callbacks

3. **Dashboard & Account Management**
   - Resume management
   - Account settings
   - Subscription management

#### Component Structure
```
src/
├── features/
│   ├── Form/              # Main resume form
│   ├── PdfViewer/         # PDF preview component
│   ├── Profile/           # Personal information
│   ├── WorkExperience/    # Work history
│   ├── Education/         # Education section
│   ├── Skills/            # Skills section
│   ├── Languages/         # Language skills
│   ├── ResumeTemplate/    # Template selection
│   └── ResumeTheme/       # Theme customization
├── routes/
│   ├── Home.tsx           # Landing page
│   ├── ResumeBuilder.tsx  # Main app interface
│   ├── Dashboard.tsx      # User dashboard
│   ├── SignIn.tsx         # Authentication
│   └── layouts/           # Layout components
├── context/
│   ├── ResumeContext.ts   # Resume state management
│   └── ContextProvider.tsx
└── Types/
    └── CommonTypes.ts     # TypeScript definitions
```

## Backend Architecture

### Technology Stack
- **Runtime**: Node.js 22.6.0
- **Framework**: Express.js 5.1.0
- **Database**: SQLite 3
- **Authentication**: Clerk Express SDK
- **PDF Generation**: Puppeteer with clustering
- **Payments**: Stripe integration
- **Security**: Helmet, CORS middleware
- **Email**: EmailJS for contact forms

### API Structure
```
/api/users/
├── /auth          # Clerk authentication middleware
├── /stripe        # Payment processing
├── /pdf           # PDF generation endpoints
├── /account-type  # Subscription status
├── /contact       # Contact form handling
└── /webhook       # Stripe/Clerk webhooks
```

### Key Services

#### PDF Generation Service
- Uses Puppeteer Cluster for performance
- Generates resumes from HTML templates: the frontend renders the template to a self-contained HTML document
  (`buildResumeHtml`, fonts embedded) and the backend prints it (`src/pdf/renderPdf.js`)
- Handles multiple concurrent requests
- System-installed Chrome for Docker compatibility

#### Authentication & Authorization
- Clerk middleware for protected routes
- JWT token validation
- User session management
- Webhook handling for user lifecycle events

#### Payment Processing
- Stripe integration for subscriptions
- Premium account management
- Webhook handling for payment events
- Account type validation

## Infrastructure & Deployment

### Deployment
- **Github Actions**: All commits on main pushed to remote are automatically deployed to an Oracle VPS (**user**: ubuntu /**IP**: 89.168.63.99),
once the tests pass. See ".github/workflows/deploy.yml" to for the github actions implementation
- **Deployment script**: See deploy.sh script at the root of the project

### Containerization
- **Docker**: Single container deployment
- **Base Image**: Node.js 22.6.0
- **Additional Services**: Nginx, Supervisor, Chrome browser

### Process Management
- **Supervisor**: Manages multiple processes
  - Nginx web server
  - Node.js application


## Development & Testing

### Development Workflow
```bash
# Install all dependencies
npm run install:all

# Development mode (concurrent frontend/backend)
npm run dev

# Production preview
npm run preview

# Unit tests (from frontend/)
npx vitest run

# End-to-end testing (with npm run dev running)
npm run test:e2e

# Resume templates: real PDFs compared with approved screenshots (in Docker)
npm run test:templates
```

### Testing Strategy
- **Unit Tests**: Vitest for utility functions (`frontend/tests/`)
- **E2E Tests**: Playwright for user workflows (`e2e/`). Those tagged `@clerk` sign in with Clerk's test accounts
- **Template Tests**: Playwright prints every resume template to a real PDF and compares its pages with approved
  screenshots (`npm run test:templates`, in Playwright's Linux image). A template lab shows these PDFs in dev: see
  `frontend/tests/templates/README.md`
- **Type Checking**: TypeScript strict mode
- **The backend has no tests of its own**: the PDF renderer is covered by the template tests
- **CI** (`.github/workflows/tests.yml`): every pull request, and every push to main before deploying, runs the build,
  the unit tests, the template tests and the E2E tests (except `@clerk`)

## Performance Considerations

### Frontend Optimization
- **Vite**: Fast development and optimized builds
- **Code Splitting**: Route-based lazy loading
- **Asset Optimization**: Tailwind CSS purging
- **Caching**: Browser caching strategies

### Backend Optimization
- **Puppeteer Clustering**: Concurrent PDF generation
- **SQLite**: Lightweight, file-based database
- **Process Management**: Supervisor for reliability
- **Memory Management**: Graceful cluster cleanup

## Security Measures

### Application Security
- **Authentication**: Clerk-managed user sessions
- **Authorization**: Route-level protection
- **Input Sanitization**: DOMPurify for user content
- **HTTPS**: Full SSL encryption
- **Headers**: Security headers via Helmet

### Infrastructure Security
- **Container Security**: Minimal attack surface
- **IP Filtering**: Direct IP access blocked
- **SSL/TLS**: Modern cipher suites
- **Environment Variables**: Secure credential management

## Conclusion

The Online Resume Builder demonstrates a modern, full-stack architecture with careful consideration for security, performance, and user experience. The application successfully combines multiple technologies to deliver a cohesive resume creation platform with both free and premium tiers.