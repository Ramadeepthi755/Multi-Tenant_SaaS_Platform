# Multi-Tenant HRM SaaS

A multi-tenant Human Resource Management (HRM) platform that helps organizations manage employees and core HR workflows in one application.

**The problem it solves:** multiple companies can use the same HR platform, but each company must only access its own workforce data. This project uses a Spring Boot backend with JWT authentication, role-based authorization, and server-side tenant scoping, alongside a React frontend.

- **Repository:** [Multi-Tenant_SaaS_Platform](https://github.com/Ramadeepthi755/Multi-Tenant_SaaS_Platform)
- **Live demo:** A public deployment URL is not configured yet. After starting the app locally, open [http://localhost:5173](http://localhost:5173) (local machine only).
- **Stack:** Java 21, Spring Boot 3.5.x, Spring Security, JWT, Spring Data JPA/Hibernate, H2 by default with a PostgreSQL driver, React 19, Vite, Axios, Material UI, and Tailwind CSS.

## Features

- **Multi-tenancy:** server-side company context and tenant-scoped data access.
- **Authentication and authorization:** JWT, role-based access control, protected routes, and backend API guards.
- **Employee management:** directory, profiles, departments, designations, onboarding, and employee status tracking.
- **Attendance and leave:** check-in/check-out, attendance history, leave requests, balances, and approval workflows.
- **Payroll and documents:** salary details, payslips, and employee document upload/access.
- **Recruitment:** job openings, candidates, interview workflow, and Kanban pipeline.
- **Performance and reporting:** performance reviews, workforce dashboards, HR reports, and CSV exports.
- **AI-assisted HR:** HR copilot, policy Q&A, job-description generation, candidate screening, performance summaries, and attendance anomaly analysis. A deterministic fallback is available; live provider use requires valid API credentials and quota.

## User roles

| Role | Primary access |
|---|---|
| `SUPER_ADMIN` | Platform administration, companies, users, roles, and subscriptions |
| `COMPANY_ADMIN` | Company configuration, employees, payroll, reports, and organization settings |
| `HR` | Employee operations, recruitment, attendance, leave, and performance |
| `MANAGER` | Team information, attendance, leave approvals, and performance |
| `EMPLOYEE` | Self-service attendance, leave, payroll, and personal documents |

## Architecture

```text
Browser (React + Vite)
        │  REST API + JWT
        ▼
Spring Boot REST API
        ├── Spring Security / JWT authentication
        ├── Controllers → Services → Repositories
        ├── Authenticated tenant context / role checks
        ▼
H2 (local default) or configured database

Spring Boot AI services → provider factory
                         ├── configured AI provider
                         └── deterministic fallback
```

The backend lives at the repository root. The frontend is in `hrm-portal-frontend/`.

## Quick start

### Prerequisites

- Java 21
- Node.js and npm (a current supported Node.js LTS release)
- Git

### 1. Clone this repository

```bash
git clone https://github.com/Ramadeepthi755/Multi-Tenant_SaaS_Platform.git
cd Multi-Tenant_SaaS_Platform
```

### 2. Configure local environment

The repository includes a safe template: [`.env.example`](.env.example). Copy it and edit it before starting the application:

```bash
cp .env.example .env
```

Generate a fresh local JWT secret with `openssl rand -base64 32`, then replace `JWT_SECRET` in `.env` with that output. Keep `AI_PROVIDER=fallback` to develop without a paid external AI API. To seed demo users locally, set `SEED_DEMO_ACCOUNTS=true` and choose a unique `DEMO_ACCOUNT_PASSWORD` in `.env`.

Spring Boot does **not** automatically load this project's `.env` file. In Bash or Zsh, after editing the file, load it into the current terminal:

```bash
set -a
source .env
set +a
```

Alternatively, enter the values in your IDE's run configuration. Never commit `.env`, live API keys, or production credentials. Do not use development settings or demo accounts in production.

### 3. Start the backend

From the repository root:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

The backend listens on `http://localhost:8080` by default. Swagger UI is configured at [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html).

### 4. Start the frontend

Open a second terminal:

```bash
cd hrm-portal-frontend
npm install
npm run dev
```

Open the URL printed by Vite (normally [http://localhost:5173](http://localhost:5173)). Vite proxies `/api` requests to `http://localhost:8080`. If port 5173 is busy, Vite may select another port; use the URL shown in the terminal.

### Local demo accounts

Demo account seeding is controlled by `SEED_DEMO_ACCOUNTS`. Enable it only for local development and set `DEMO_ACCOUNT_PASSWORD` to a password you choose. The app configuration has historically included a default demo password; do not rely on default credentials or use them beyond a disposable local environment. If sign-in fails, confirm demo seeding is enabled and check the backend logs.

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

This is a high-level view of the important folders, not an exhaustive file listing. Runtime uploads are stored under `uploads/`; do not commit real employee documents.

## Tests and quality checks

Run these checks on your current checkout. This README does not claim that they pass on the current commit; confirm results locally or through a recent CI run.

| Check | Command |
|---|---|
| Backend automated tests | From repository root: `./mvnw clean test` |
| Frontend production build | `cd hrm-portal-frontend && npm install && npm run build` |
| Frontend lint | From `hrm-portal-frontend/`: `npm run lint` |
| Patch whitespace check | From repository root after changes: `git diff --check` |

A historical [acceptance report](HRM_PORTAL_FINAL_ACCEPTANCE_REPORT.md) documents checks from August 2026. Treat it as a dated report, not as proof that the same checks pass on the current commit.

## Security notes

- Derive tenant scope from the authenticated server-side identity, not a tenant ID supplied by the browser.
- Enforce authorization on backend APIs; frontend route guards alone are not a security boundary.
- Replace the JWT secret and demo password before any deployment. Do not use the development profile in production.
- Store API keys and database credentials in environment variables or deployment secret storage, never in frontend bundles or source control.
- Configure HTTPS, restricted CORS origins, a production database, and secure file storage before deployment.

## Screenshots

### Home
<img width="1200" alt="Home screen" src="https://github.com/user-attachments/assets/3e6339fb-ac6e-441e-9ea3-34b2e5a2e004" />

### Login
<img width="1200" alt="Login screen" src="https://github.com/user-attachments/assets/6479256c-4fb1-4d83-8b46-af3a1da0dd26" />

### Super Admin dashboard
<img width="1200" alt="Super Admin dashboard" src="https://github.com/user-attachments/assets/731ad548-da05-4335-9784-373093edaf9e" />

### Company Admin dashboard
<img width="1200" alt="Company Admin dashboard" src="https://github.com/user-attachments/assets/4fd0405a-e935-4cd1-9be8-00e72a9327c5" />

### Manager dashboard
<img width="1200" alt="Manager dashboard" src="https://github.com/user-attachments/assets/0817c279-54ff-4399-b907-c52d5b3a3477" />

### Employee dashboard
<img width="1200" alt="Employee dashboard" src="https://github.com/user-attachments/assets/c8624b61-5240-4921-9f52-44b61837f52e" />

### Recruitment Kanban
<img width="1200" alt="Recruitment Kanban" src="https://github.com/user-attachments/assets/49966e06-65e7-4c33-8ea5-f17d1c0ac9d4" />

### AI HR Copilot
<img width="1200" alt="AI HR Copilot" src="https://github.com/user-attachments/assets/fe47c127-de46-4c49-bccd-052e9bec10c0" />

## Author

**Ramadeepthi Badireddy** — B.Tech, Information Technology.

If you find this project useful, please consider starring the [repository](https://github.com/Ramadeepthi755/Multi-Tenant_SaaS_Platform).
