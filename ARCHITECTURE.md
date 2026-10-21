# Online Resume Builder - Application Architecture

## Overview

Online Resume Builder is a fullstack web application that allows users to create, customize, and export professional resumes. The application features a React-based frontend, Node.js backend, and uses modern technologies for authentication, payments, and PDF generation.

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Nginx Proxy   │    │   Frontend   │    │    Backend      │
│   (Port 80/443) │───▶│  React App   │───▶│  Express.js     │
│                 │    │ (built files)│    │  (Port 1337)    │
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
- **Routing**: React Router 7.6.2 in framework mode, without a server (`ssr: false`, see
  `frontend/react-router.config.ts`): `react-router build` writes the HTML of the pages, served as static files.
  The home page is pre-rendered in each language (`/`, `/fr`, see `src/entry.server.tsx`), with its content; other
  pages share an empty HTML file (`__spa-fallback.html`) and are rendered in the browser
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
├── root.tsx               # HTML document of every page, providers (Clerk, resume context), error page
├── routes.ts              # URL → page
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
- Premium follows the subscription (`routers/webhooks.js`): granted on its first payment (`payment_intent.succeeded`),
  ended when it's canceled or unpaid, given back if it's paid again (`customer.subscription.updated` and `.deleted`).
  While Stripe retries a failed renewal (`past_due`), the user stays premium. The Stripe webhook endpoint
  (Developers > Webhooks) must send these 3 events

## Infrastructure & Deployment

### Deployment
- **Github Actions**: All commits on main pushed to remote are automatically deployed to an OVH VPS in Canada (**user**: ubuntu /**IP**: 54.39.230.66),
once the tests pass. See ".github/workflows/deploy.yml" to for the github actions implementation
- **Deployment script**: See deploy.sh script at the root of the project

### Configuration and secrets
Secrets are never in the repository nor in the Docker image.
- **Settings** (ports, URLs, Stripe price, Clerk publishable keys): `.env.development` and `.env.production`, in the
  repository, in `backend/` and `frontend/`. The frontend's are sent to the browser: nothing secret there.
- **Secrets** (Stripe secret key and webhook secret, Clerk secret key and webhook secret, Gmail app password): the
  backend reads them from `backend/.env.<NODE_ENV>.local`, ignored by git.
  - In development: create `backend/.env.development.local` from `backend/.env.example`. Without it, the backend
    starts (the CI runs it that way) but the features using the secrets fail.
  - In production: they're GitHub secrets (Settings > Secrets and variables > Actions). The deploy writes them on the
    VPS (`~/backend.env.production.local`) and mounts that file in the container. The backend refuses to start if
    one is missing. To change a secret: update it in GitHub, then re-run the deploy.

### Database backups
The SQLite database (`~/database/database.db` on the VPS, mounted in the container) is the only copy of users' plans,
download counts and saved resumes. Every night at 03:00 UTC, a systemd timer on the VPS copies it with
`sqlite3 .backup` (consistent while the app writes), checks the copy's integrity, compresses it, encrypts it with
[age](https://age-encryption.org) and uploads it to the Cloudflare R2 bucket `online-resume` (EU jurisdiction, so
off OVH, and only reachable through the `.eu.` endpoint). R2 deletes backups after 30 days. Files: `ops/backup/`.
- **Access**: an R2 API token with Object Read & Write on that bucket only, restricted to the VPS's IPv4 and IPv6
  addresses (the VPS reaches Cloudflare over IPv6: with IPv4 alone, R2 answers 403).
- **Alert**: after each backup, the service reports its exit status to the healthchecks.io check
  `onlineresume-backup` (cron `0 3 * * *` UTC, 1 h grace), which emails when a backup fails or when none is reported
  (server down, timer stopped...). Without it, a broken backup would go unnoticed until R2's 30-day expiry had deleted
  every backup.
- **Encryption**: the VPS only has the age *public* key. The private key is kept off the server (password manager):
  it's the only way to read the backups. Losing it makes them useless.
- **Install** (once, on the VPS, from a checkout of the repo):
  ```bash
  sudo apt install -y sqlite3 age rclone
  sudo install -m 755 ops/backup/backup-db.sh /usr/local/bin/onlineresume-backup-db
  sudo install -m 644 ops/backup/onlineresume-backup.service ops/backup/onlineresume-backup.timer /etc/systemd/system/
  sudo install -m 600 ops/backup/backup.env.example /etc/onlineresume-backup.env   # then fill it in with sudo nano
  sudo systemctl daemon-reload && sudo systemctl enable --now onlineresume-backup.timer
  ```
- **Check**: `systemctl list-timers onlineresume-backup.timer` (next and last run),
  `journalctl -u onlineresume-backup.service` (results). Back up now: `sudo systemctl start onlineresume-backup.service`.
- **Restore**:
  ```bash
  # Download a backup (or from the Cloudflare dashboard), then on a machine that has the private key:
  age --decrypt --identity onlineresume-backup.agekey database-<date>.db.gz.age | gunzip > database.db
  sqlite3 database.db "PRAGMA integrity_check;"   # must print ok
  # On the VPS, after copying database.db there:
  sudo docker stop onlineresume && sudo cp database.db ~/database/database.db && sudo docker start onlineresume
  ```

### Containerization
- **Docker**: Single container deployment
- **Base Image**: Node.js 22.6.0
- **Additional Services**: Nginx, Supervisor, Chrome browser

### Process Management
- **Supervisor**: Manages multiple processes
  - Nginx web server: serves the frontend's built files (`frontend/build/client`, built with the Docker image) and
    proxies `/api/` to the backend
  - Node.js backend


## Development & Testing

### Development Workflow
```bash
# Install all dependencies
npm run install:all

# Development mode (concurrent frontend/backend)
npm run dev

# Production build, tested locally: built like in production, but with the development settings (Clerk's development
# instance, the backend's development secrets), on http://localhost:4173
npm run preview:local

# Production preview, with the production settings: Clerk's production instance only accepts onlineresume.dev, and the
# backend refuses to start without the production secrets, so signing in doesn't work locally
npm run preview

# Unit tests (from frontend/)
npx vitest run

# End-to-end testing (with npm run dev running)
npm run test:e2e

# Resume templates: real PDFs compared with approved screenshots (in Docker)
npm run test:templates
# ...after changing a template on purpose: approve the new screenshots (check the diffs first)
npm run test:templates -- --update-snapshots
```

### Testing Strategy
- **Unit Tests**: Vitest for utility functions (`frontend/tests/`)
- **E2E Tests**: Playwright for user workflows (`e2e/`). Those tagged `@clerk` sign in with Clerk's test accounts
- **Template Tests**: Playwright prints every resume template to a real PDF and compares its pages with approved
  screenshots (`npm run test:templates`, in Playwright's Linux image). A template lab shows these PDFs in dev: see
  `frontend/tests/templates/README.md`
- **Type Checking**: TypeScript strict mode
- **The backend has no tests of its own**: the PDF renderer is covered by the template tests
- **CI** (`.github/workflows/tests.yml`): every pull request, and every push to main before deploying, runs lint, the build,
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
- **Secrets**: outside the repository and the image, see "Configuration and secrets"

## Conclusion

The Online Resume Builder demonstrates a modern, full-stack architecture with careful consideration for security, performance, and user experience. The application successfully combines multiple technologies to deliver a cohesive resume creation platform with both free and premium tiers.