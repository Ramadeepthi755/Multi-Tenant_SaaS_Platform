# HRM Enterprise — Multi-Tenant SaaS Platform

A production-oriented **Human Resource Management (HRM) SaaS platform** designed to manage employees, attendance, leave, payroll, recruitment, performance, documents, reporting, permissions, subscriptions, and AI-assisted HR workflows from a centralized multi-tenant system.

The platform implements role-based access control, tenant-level data isolation, JWT authentication, modular REST APIs, responsive React interfaces, and a pluggable AI provider architecture.

---

## 🚀 Overview

HRM Enterprise is a full-stack SaaS application built to model how a modern enterprise HR platform can be designed and engineered.

The application supports multiple organizations (tenants), each with its own employees, departments, designations, attendance, leave, payroll, recruitment, documents, and reports.

Different users receive different capabilities based on their assigned roles and permissions.

### Core Roles

- **Super Admin** — Platform-wide administration
- **Company Admin** — Organization administration
- **HR** — HR and recruitment operations
- **Manager** — Team management and approvals
- **Employee** — Employee self-service

---

## ✨ Key Features

### 🔐 Authentication & Authorization

- JWT-based authentication
- Secure login and session restoration
- Role-based access control (RBAC)
- Protected frontend routes
- Server-side authorization using Spring Security
- Permission-based access control
- Unauthorized access handling
- Secure tenant identification from authenticated user context

### 🏢 Multi-Tenant Architecture

- Multiple organizations supported
- Tenant-aware data access
- Company-level data isolation
- Server-side tenant scoping
- Tenant context derived from authenticated security claims
- Prevents users from accessing another organization's data

### 👥 Employee Management

- Employee directory
- Employee profiles
- Employee search and pagination
- Department and designation assignment
- Employee lifecycle management
- Employee timeline
- Lifecycle events such as:
  - ONBOARDING
  - PROMOTION
  - TRANSFER
  - EXIT
- Profile photo management

### ⏱️ Attendance Management

- Employee clock-in
- Employee clock-out
- Working duration calculation
- Duplicate check-in prevention
- Attendance history
- Team attendance views
- Attendance filtering
- Attendance analytics

### 🏖️ Leave Management

- Leave applications
- Leave balances
- Leave history
- Manager approvals
- HR approvals
- Leave rejection
- Leave status tracking
- Leave balance computation

### 💰 Payroll

- Salary structure
- Gross salary calculation
- Allowances
- Deductions
- Net salary
- Payslip generation
- Employee-specific payslip access

### 📄 Document Vault

- Document upload
- Document listing
- Document download
- Document deletion
- File size validation
- MIME type validation
- Tenant-aware document access

### 🎯 Recruitment / ATS

- Job openings
- Candidate management
- Recruitment pipeline
- Kanban-style workflow
- Candidate stage movement
- Interview management
- Offer management

Recruitment pipeline:

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
