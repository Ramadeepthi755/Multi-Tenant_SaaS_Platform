# HRM Portal — Multi-Tenant HR Management SaaS

A full-stack **Human Resource Management SaaS platform** designed to manage employees, attendance, leave, payroll, recruitment, documents, performance, and workforce analytics in a secure multi-tenant environment.

The platform is built with **Java, Spring Boot, Spring Security, JWT, React, Vite, JPA/Hibernate, and REST APIs**, with role-based access control, server-side tenant isolation, responsive UI, and an extensible AI provider architecture.

---

## 🚀 Key Highlights

- 🏢 Multi-Tenant SaaS Architecture
- 🔐 JWT Authentication & Role-Based Access Control (RBAC)
- 👥 5 role-based user experiences
- 📊 Workforce dashboards and HR analytics
- ⏱️ Employee attendance and Check-In / Check-Out
- 🏖️ Leave application and approval workflows
- 💰 Payroll processing and payslip management
- 📄 Secure employee document management
- 🎯 Recruitment ATS with Kanban pipeline
- ⭐ Performance management and reviews
- 🤖 AI HR Copilot and HR intelligence features
- 🔒 Server-side tenant isolation
- 🔎 Global search and command palette
- 📱 Responsive desktop, tablet, and mobile UI
- 🧪 Automated backend and frontend quality checks

---

## 🏗️ System Architecture

The application follows a layered multi-tenant SaaS architecture that separates the frontend, backend, security, business logic, persistence, and AI services.

<img width="1536" height="1024" alt="System Architecture" src="https://github.com/user-attachments/assets/c83f2d77-2a8d-43d7-a5b0-8ac29bb2ae16" />

### Architecture Flow

```text
User / Browser
      │
      ▼
React Frontend
      │
      │ JWT + REST API
      ▼
Spring Boot Backend
      │
      ├── Spring Security + JWT
      │
      ├── REST Controllers
      │
      ├── Service Layer
      │
      ├── Tenant Security Context
      │
      ├── Repository Layer
      │
      ▼
Database
      │
      └── Company / Tenant Scoped Data

Spring Boot
      │
      ▼
AI Provider Factory
      ├── OpenAI Provider
      └── Deterministic Fallback Provider
```

### Main Components

- **React Frontend** — Responsive user interface and role-specific dashboards
- **Spring Boot Backend** — REST APIs and core business logic
- **Spring Security + JWT** — Authentication and authorization
- **Service Layer** — HR business workflows and validation
- **Repository Layer** — Database access through JPA/Hibernate
- **Database** — H2 for development with PostgreSQL-compatible configuration
- **AI Provider Layer** — Pluggable AI providers with deterministic fallback
- **Tenant Security** — Server-side company isolation using authenticated tenant context

---

## 🛠️ Tech Stack

### Backend

- Java 21
- Spring Boot 3.5+
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- Maven
- REST APIs
- H2 / PostgreSQL-compatible database configuration

### Frontend

- React 19
- Vite
- React Router
- Axios
- Material UI (MUI)
- Tailwind CSS
- Lucide Icons

### AI

- OpenAI API
- OpenAI `gpt-4o-mini`
- AI Provider Factory
- Deterministic Fallback AI Provider
- Policy RAG architecture

### Development & Testing

- JUnit
- Spring Boot Integration Tests
- MockMvc
- ESLint
- Playwright / Playwright Core
- Google Chrome UI automation
- Git

---

## 👥 User Roles

The platform provides different capabilities based on the authenticated user's role.

| Role | Scope |
|---|---|
| **SUPER_ADMIN** | Platform administration, companies, users, roles, subscriptions and security |
| **COMPANY_ADMIN** | Organization administration, employees, payroll, reports and configuration |
| **HR** | Employee operations, recruitment, attendance, leave and performance |
| **MANAGER** | Team management, attendance, leave approvals and performance |
| **EMPLOYEE** | Self-service attendance, leave, payroll and documents |

---

## ✨ Core Features

### 🔐 Authentication & Authorization

- JWT-based authentication
- Secure login and session restoration
- Role-based route protection
- Permission-based authorization
- Protected REST APIs
- Unauthorized access handling
- Server-side authorization using Spring Security

---

### 🏢 Multi-Tenant Architecture

- Company-based tenant isolation
- Server-side tenant identification
- Tenant-scoped database queries
- Cross-company data protection
- No reliance on client-supplied tenant IDs for authorization

Tenant context is derived from the authenticated security context using server-side security utilities.

---

### 👨‍💼 Employee Management

- Employee directory
- Employee profiles
- Employee search
- Pagination
- Employee lifecycle tracking
- Employee onboarding
- Promotions
- Transfers
- Status changes
- Exit tracking
- Employee timeline
- Profile photo management

---

### ⏱️ Attendance Management

- Employee Check-In
- Employee Check-Out
- Working duration calculation
- Daily attendance records
- Attendance history
- Team attendance
- Attendance filtering
- Duplicate Check-In validation
- Attendance analytics

---

### 🏖️ Leave Management

- Leave application
- Leave balance tracking
- Leave history
- Manager approvals
- HR approvals
- Leave rejection
- Leave status tracking
- Balance calculation
- Tenant-scoped leave records

---

### 💰 Payroll Management

- Employee salary structures
- Gross salary calculation
- Allowances
- Deductions
- Net salary calculation
- Payslip generation
- Payslip viewing
- Employee-specific payroll access
- Payroll reporting

---

### 📄 Document Management

- Employee document upload
- Document listing
- Document preview/download
- Document deletion
- MIME type validation
- File size validation
- Tenant-isolated document storage

---

### 🎯 Recruitment ATS

- Job opening management
- Candidate management
- Recruitment pipeline
- Kanban workflow
- Candidate stage movement
- Interview management
- Offer management
- Hiring workflow

### Recruitment Pipeline

```text
APPLIED
   ↓
SCREENING
   ↓
SHORTLISTED
   ↓
INTERVIEW
   ↓
OFFER
   ↓
HIRED
```

Rejected candidates can be handled separately through the recruitment workflow.

---

### ⭐ Performance Management

- Performance review cycles
- Employee evaluations
- Ratings
- Feedback
- Performance summaries
- Performance reporting
- Role-based performance access

---

### 📊 Reports & Analytics

- Employee reports
- Attendance reports
- Leave reports
- Payroll reports
- Department reports
- Performance reports
- Workforce dashboard metrics
- CSV exports

---

### 🔎 Global Search & Command Palette

- Global search
- Quick navigation
- Command palette
- `Cmd + K` support on macOS
- `Ctrl + K` support on compatible systems

---

## 🤖 AI Features

The application uses a provider-based architecture so that AI functionality is not tightly coupled to a single provider.

### AI Capabilities

- AI HR Copilot
- Policy Q&A / Policy RAG
- Job Description Generator
- Candidate / Resume Screening
- Performance Review Summary
- Attendance Anomaly Analysis

### AI Architecture

```text
AI Request
    │
    ▼
AiAssistantService
    │
    ▼
AiProviderFactory
    │
    ├── OpenAiProvider
    │
    └── DeterministicFallbackAiProvider
```

### AI Security

AI API keys are handled only by the backend through environment variables.

API keys are never intended to be exposed through:

- React source code
- Browser bundles
- Git repositories
- Client-side API requests
- Public configuration files

> Real OpenAI API usage requires an account with available API quota. The project also contains a deterministic fallback engine for development and environments where external AI access is unavailable.

---

## 🔒 Security

Security is implemented at both frontend and backend layers.

### Authentication

- JWT access tokens
- Stateless authentication
- Secure authentication filter
- Session restoration

### Authorization

- Role-Based Access Control
- Permission-based access
- Spring Security method-level authorization
- Protected frontend routes
- Protected backend endpoints

### Multi-Tenant Security

- Company ID derived from authenticated security context
- Tenant-scoped repository queries
- Cross-tenant access prevention
- Employee self-service scope restrictions
- Manager team-level access restrictions

### Secret Management

Sensitive values such as API keys are provided through environment variables.

Example:

```bash
export OPENAI_API_KEY="YOUR_ACTUAL_KEY"
export AI_PROVIDER="openai"
```

Never commit real secrets to GitHub.

---

## 📁 Project Structure

```text
hrm-portal/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── workforce/
│   │   │           └── hrm/
│   │   │               ├── controller/
│   │   │               ├── service/
│   │   │               ├── repository/
│   │   │               ├── entity/
│   │   │               ├── dto/
│   │   │               ├── security/
│   │   │               └── config/
│   │   │
│   │   └── resources/
│   │       ├── application.properties
│   │       └── application-dev.yml
│   │
│   └── test/
│
├── hrm-portal-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── routes/
│   │   └── utils/
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   └── architecture.png
│
├── pom.xml
├── mvnw
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure the following are installed:

- Java 21
- Node.js 18+
- npm
- Git

Verify installations:

```bash
java -version
node -v
npm -v
git --version
```

---

## 🔧 Backend Setup

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/hrm-portal.git
cd hrm-portal
```

### Configure AI Environment Variables

If you want to use OpenAI:

```bash
export OPENAI_API_KEY="YOUR_ACTUAL_KEY"
export AI_PROVIDER="openai"
```

The API key should only exist in your local/server environment.

### Run Backend

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

Backend runs on:

```text
http://localhost:8080
```

---

## 🎨 Frontend Setup

Open another terminal:

```bash
cd hrm-portal/hrm-portal-frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

If Vite selects another available port, use the URL shown in the terminal.

---

## 🧪 Running Tests

### Backend Tests

From the project root:

```bash
./mvnw clean test
```

### Frontend Production Build

```bash
cd hrm-portal-frontend
npm run build
```

### Frontend Lint

```bash
npm run lint
```

### Git Validation

From the project root:

```bash
git diff --check
```

---

## 🔑 Demo Access

The project contains development/demo accounts for evaluating different role scopes.

| Role | Example Account | Access |
|---|---|---|
| **SUPER_ADMIN** | `admin@gmail.com` | Platform administration |
| **COMPANY_ADMIN** | `company-admin@gmail.com` | Organization administration |
| **HR** | `hr@gmail.com` | HR operations |
| **MANAGER** | `manager@gmail.com` | Team management |
| **EMPLOYEE** | `employee@gmail.com` | Employee self-service |

> Demo passwords should be shared separately during evaluation rather than stored as production credentials in the public repository.

---

## 🧪 Verification & Quality Gates

The project has been validated through multiple quality layers.

| Quality Gate | Result |
|---|---|
| Backend Automated Tests | ✅ Passed |
| Frontend Production Build | ✅ Passed |
| ESLint | ✅ Passed |
| Git Diff Check | ✅ Passed |
| RBAC Verification | ✅ Passed |
| Multi-Tenant Isolation | ✅ Verified |
| Role-Based Browser Testing | ✅ Verified |
| Responsive UI Testing | ✅ Verified |
| Secret Scan | ✅ Passed |

---

## 📸 Screenshots

### Home

<img width="1470" height="956" alt="Screenshot 2026-08-29 at 9 33 20 AM" src="https://github.com/user-attachments/assets/3e6339fb-ac6e-441e-9ea3-34b2e5a2e004" />

### Login

<img width="1470" height="956" alt="Screenshot 2026-08-29 at 9 33 31 AM" src="https://github.com/user-attachments/assets/6479256c-4fb1-4d83-8b46-af3a1da0dd26" />


### Super Admin Dashboard

<img width="1470" height="956" alt="Screenshot 2026-08-29 at 9 33 41 AM" src="https://github.com/user-attachments/assets/731ad548-da05-4335-9784-373093edaf9e" />


### Company Admin Dashboard

<img width="1470" height="956" alt="Screenshot 2026-08-29 at 9 34 15 AM" src="https://github.com/user-attachments/assets/4fd0405a-e935-4cd1-9be8-00e72a9327c5" />

### Manager Dashboard

<img width="1470" height="956" alt="Screenshot 2026-08-29 at 9 35 05 AM" src="https://github.com/user-attachments/assets/0817c279-54ff-4399-b907-c52d5b3a3477" />


### Employee Dashboard
<img width="1470" height="956" alt="Screenshot 2026-08-29 at 9 34 34 AM" src="https://github.com/user-attachments/assets/c8624b61-5240-4921-9f52-44b61837f52e" />


### Recruitment Kanban

<img width="1470" height="956" alt="Screenshot 2026-08-29 at 9 34 50 AM" src="https://github.com/user-attachments/assets/49966e06-65e7-4c33-8ea5-f17d1c0ac9d4" />


### AI HR Copilot

<img width="1470" height="956" alt="Screenshot 2026-08-29 at 9 33 59 AM" src="https://github.com/user-attachments/assets/fe47c127-de46-4c49-bccd-052e9bec10c0" />


## 📱 Responsive Design

The application is designed for multiple screen sizes:

- Desktop
- Tablet
- Mobile

The UI was tested against representative viewport sizes including:

```text
Desktop: 1440 × 900
Tablet:  1024 × 768
Mobile:   390 × 844
```

---

## 🐛 Error Handling

The frontend includes centralized error handling and protected UI boundaries to prevent unexpected runtime exceptions from breaking the entire application.

The backend provides structured error responses for:

- Authentication failures
- Authorization failures
- Validation errors
- Resource-not-found scenarios
- AI provider failures
- Invalid file uploads
- Tenant access violations

---

## 📈 Future Improvements

Potential production enhancements include:

- PostgreSQL production deployment
- Cloud object storage for documents
- Redis caching
- Background job processing
- Email notification service
- CI/CD pipeline
- Production observability and monitoring
- Advanced audit analytics
- Additional AI providers
- Production-grade secrets management
- Containerized deployment with Docker

---

## 🎯 Project Goals

The main goal of this project is to demonstrate the design and implementation of a **production-oriented enterprise HR management platform** with:

- Secure authentication
- Fine-grained authorization
- Multi-tenant architecture
- Real HR business workflows
- RESTful backend services
- Modern frontend architecture
- Database-backed persistence
- AI service abstraction
- Automated testing
- Responsive UI design

---

## 👨‍💻 Author

**Ramadeepthi Badireddy**

B.Tech — Information Technology

### Technologies

```text
Java
Spring Boot
Spring Security
JWT
Spring Data JPA
Hibernate
React
Vite
JavaScript
REST APIs
SQL
Git
AI Integration
```

---

## ⭐ Project

If you find this project interesting, consider giving the repository a ⭐ on GitHub.
