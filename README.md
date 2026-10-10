# Multi-Tenant HRM SaaS

A multi-tenant Human Resource Management (HRM) platform for organizations to manage employees and HR workflows in one application. It includes employee management, attendance, leave approvals, payroll, recruitment, performance reviews, reports, and AI-assisted HR tools.

**The key engineering problem:** multiple companies share one application, but each company must only access its own data. The backend derives tenant scope from the authenticated user, combines it with JWT authentication and role-based authorization, and exposes functionality through Spring Boot REST APIs to a React frontend.

- **Repository:** https://github.com/Ramadeepthi755/Multi-Tenant_SaaS_Platform
- **Live demo:** Not currently published. Run locally using the steps below.
- **Tech stack:** Java 21, Spring Boot 3.5.x, Spring Security, JWT, Spring Data JPA/Hibernate, H2 (local default) / PostgreSQL driver, React 19, Vite, Axios, Material UI, Tailwind CSS.

## What it does

- **Multi-tenancy:** server-side company context and tenant-scoped data access.
- **Authentication and authorization:** JWT authentication, protected routes/APIs, role-based access controls.
- **Employee lifecycle:** employee directory, profiles, departments, designations, onboarding, and status tracking.
- **Attendance and leave:** check-in/check-out, attendance history, leave requests, balances, and approvals.
- **Payroll and documents:** salary information, payslips, employee document upload and access.
- **Recruitment:** jobs, candidates, interview workflow, and Kanban pipeline.
- **Performance and reporting:** performance reviews, workforce dashboards, HR reports, and CSV exports.
- **AI-assisted HR:** provider-based HR copilot, policy Q&A, job-description generation, screening, performance summaries, and attendance anomaly analysis. A deterministic fallback is available; live provider use requires valid provider credentials and quota.

## Roles

| Role | Primary access |
|---|---|
| `SUPER_ADMIN` | Platform administration, companies, users, roles, and subscriptions |
| `COMPANY_ADMIN` | Company configuration, people, payroll, reports, and organization settings |
| `HR` | Employee operations, recruitment, attendance, leave, and performance |
| `MANAGER` | Team information, attendance, leave approvals, and performance |
| `EMPLOYEE` | Self-service attendance, leave, payroll, and personal documents |

## Architecture

```text
Browser (React + Vite)
        │  HTTPS/REST + JWT
        ▼
Spring Boot REST API
        ├── Spring Security / JWT filter
        ├── Controllers → Services → Repositories
        ├── Authenticated tenant context / role checks
        ▼
H2 (local default) or configured PostgreSQL database

Spring Boot AI services → provider factory
                         ├── configured AI provider
                         └── deterministic fallback
```

The frontend is in `hrm-portal-frontend/`. The backend is at the repository root, with application code in `src/main/java/com/workforce/hrm/`, configuration and migrations in `src/main/resources/`, and automated tests in `src/test/java/com/workforce/hrm/`.

## Quick start

### Prerequisites

- Java 21
- Node.js and npm (use a current supported Node.js LTS release)
- Git

### 1. Clone the real repository

```bash
git clone https://github.com/Ramadeepthi755/Multi-Tenant_SaaS_Platform.git
cd Multi-Tenant_SaaS_Platform
```

### 2. Configure environment variables

A safe template is available at [`.env.example`](.env.example). Copy it for reference:

```bash
cp .env.example .env
```

**Note:** Spring Boot does not automatically load every `.env` file in a plain local run. Export the variables in your shell or configure them in your IDE/run configuration. Do not commit `.env`, real API keys, or production credentials.

For a local development run, the application defaults to an in-memory H2 database. Set strong local-only secrets explicitly before starting:

```bash
export JWT_SECRET='replace-with-a-long-random-local-development-secret'
export SEED_DEMO_ACCOUNTS=true
export DEMO_ACCOUNT_PASSWORD='replace-with-a-local-demo-password'
# Optional; leave unset or empty to use the deterministic AI fallback.
export AI_PROVIDER=fallback
```

If you select a live AI provider, set its matching API key as an environment variable (for example, `OPENAI_API_KEY`) and make sure the provider account has available quota. Never place a key in frontend code.

### 3. Start the backend

From the repository root:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

The API listens on `http://localhost:8080` by default. The OpenAPI/Swagger UI is configured at `http://localhost:8080/swagger-ui.html` when the backend is running.

### 4. Start the frontend

Open a second terminal at the repository root:

```bash
cd hrm-portal-frontend
npm install
npm run dev
```

Open the URL printed by Vite (normally http://localhost:5173). The Vite configuration proxies `/api` requests to `http://localhost:8080`. If port 5173 is occupied, Vite may choose the next available port.

### Local demo access

When demo-account seeding is enabled in the development profile, the app can seed accounts for the five roles. The default development configuration historically defines `AdminPassword123!` as its demo password; **do not use that default outside a disposable local development environment**. Prefer setting `DEMO_ACCOUNT_PASSWORD` to a local-only value before running. If an account cannot log in, check the seeding configuration and backend logs rather than assuming demo records already exist.

## Project structure

```text
Multi-Tenant_SaaS_Platform/
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── pom.xml
├── mvnw
├── README.md
├── HRM_PORTAL_FINAL_ACCEPTANCE_REPORT.md
├── src/
│   ├── main/
│   │   ├── java/com/workforce/hrm/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── entity/
│   │   │   ├── dto/
│   │   │   ├── security/
│   │   │   └── config/
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.yml
│   │       └── db/migration/
│   └── test/java/com/workforce/hrm/
└── hrm-portal-frontend/
    ├── src/
    ├── public/
    ├── package.json
    └── vite.config.js
```

The tree above highlights the important source folders; it does not list every source file.

## Tests and quality checks

Run these commands from the indicated directories. This README does not claim that checks pass on the current checkout; run them locally or inspect a recent CI run to confirm current results.

| Check | Command |
|---|---|
| Backend tests | From repository root: `./mvnw clean test` |
| Frontend production build | From repository root: `cd hrm-portal-frontend && npm ci && npm run build` |
| Frontend lint | From `hrm-portal-frontend/`: `npm run lint` |
| Patch whitespace check | From repository root after changes: `git diff --check` |

A historical acceptance report is available in [`HRM_PORTAL_FINAL_ACCEPTANCE_REPORT.md`](HRM_PORTAL_FINAL_ACCEPTANCE_REPORT.md). Treat it as a dated report, not a substitute for running the checks against the current commit.

## Security notes

- Tenant scope must come from the authenticated server-side identity, not a tenant ID supplied by the browser.
- Enforce authorization on backend APIs; frontend route guards are not a security boundary by themselves.
- Replace the default JWT secret and demo password before any deployment. Do not use development profile settings in production.
- Keep API keys and database credentials in deployment environment/secrets settings, never in source code or frontend bundles.
- Use a properly secured database, HTTPS, restricted CORS origins, and production-ready file storage when deploying.

## Screenshots

The repository README includes screenshots of the home page, login, role dashboards, recruitment Kanban, and AI HR Copilot. Scroll below this overview on the [README page](https://github.com/Ramadeepthi755/Multi-Tenant_SaaS_Platform#screenshots) to view them.

## Author

**Ramadeepthi Badireddy** — B.Tech, Information Technology.

If you find the project useful, please consider starring the [repository](https://github.com/Ramadeepthi755/Multi-Tenant_SaaS_Platform).
