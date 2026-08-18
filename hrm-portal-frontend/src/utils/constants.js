// src/utils/constants.js

/*
|--------------------------------------------------------------------------
| API Configuration
|--------------------------------------------------------------------------
*/

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  TIMEOUT: 30000,
};

/*
|--------------------------------------------------------------------------
| Local Storage Keys
|--------------------------------------------------------------------------
*/

export const STORAGE_KEYS = {
  TOKEN: "token",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
  COMPANY: "company",
  THEME: "theme",
  LANGUAGE: "language",
  SIDEBAR: "sidebarState",
};

/*
|--------------------------------------------------------------------------
| User Roles
|--------------------------------------------------------------------------
*/

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  COMPANY_ADMIN: "COMPANY_ADMIN",
  HR: "HR",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
};

/*
|--------------------------------------------------------------------------
| Employee Status
|--------------------------------------------------------------------------
*/

export const EMPLOYEE_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  PROBATION: "PROBATION",
  RESIGNED: "RESIGNED",
  TERMINATED: "TERMINATED",
};

/*
|--------------------------------------------------------------------------
| Attendance Status
|--------------------------------------------------------------------------
*/

export const ATTENDANCE_STATUS = {
  PRESENT: "PRESENT",
  ABSENT: "ABSENT",
  LATE: "LATE",
  HALF_DAY: "HALF_DAY",
  WEEK_OFF: "WEEK_OFF",
  HOLIDAY: "HOLIDAY",
  WORK_FROM_HOME: "WORK_FROM_HOME",
};

/*
|--------------------------------------------------------------------------
| Leave Status
|--------------------------------------------------------------------------
*/

export const LEAVE_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
};

/*
|--------------------------------------------------------------------------
| Leave Types
|--------------------------------------------------------------------------
*/

export const LEAVE_TYPES = {
  CASUAL: "CASUAL",
  SICK: "SICK",
  EARNED: "EARNED",
  MATERNITY: "MATERNITY",
  PATERNITY: "PATERNITY",
  LOSS_OF_PAY: "LOSS_OF_PAY",
};

/*
|--------------------------------------------------------------------------
| Payroll Status
|--------------------------------------------------------------------------
*/

export const PAYROLL_STATUS = {
  GENERATED: "GENERATED",
  PROCESSING: "PROCESSING",
  PAID: "PAID",
  FAILED: "FAILED",
};

/*
|--------------------------------------------------------------------------
| Company Status
|--------------------------------------------------------------------------
*/

export const COMPANY_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BLOCKED: "BLOCKED",
};

/*
|--------------------------------------------------------------------------
| Gender
|--------------------------------------------------------------------------
*/

export const GENDER = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

/*
|--------------------------------------------------------------------------
| File Upload
|--------------------------------------------------------------------------
*/

export const FILE_TYPES = {
  IMAGE: [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
  ],

  DOCUMENT: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],

  EXCEL: [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/*
|--------------------------------------------------------------------------
| Pagination
|--------------------------------------------------------------------------
*/

export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
  SIZE_OPTIONS: [10, 25, 50, 100],
};

/*
|--------------------------------------------------------------------------
| Date Formats
|--------------------------------------------------------------------------
*/

export const DATE_FORMAT = {
  DISPLAY: "dd/MM/yyyy",
  API: "yyyy-MM-dd",
  DATETIME: "dd/MM/yyyy HH:mm:ss",
};

/*
|--------------------------------------------------------------------------
| Theme Modes
|--------------------------------------------------------------------------
*/

export const THEME_MODE = {
  LIGHT: "light",
  DARK: "dark",
};

/*
|--------------------------------------------------------------------------
| Dashboard Colors
|--------------------------------------------------------------------------
*/

export const DASHBOARD_COLORS = {
  PRIMARY: "#2563EB",
  SUCCESS: "#16A34A",
  WARNING: "#F59E0B",
  ERROR: "#DC2626",
  INFO: "#0284C7",
};

/*
|--------------------------------------------------------------------------
| Route Paths
|--------------------------------------------------------------------------
*/

export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/",

  COMPANY: "/companies",
  DEPARTMENT: "/departments",
  DESIGNATION: "/designations",
  EMPLOYEE: "/employees",

  ATTENDANCE: "/attendance",
  LEAVE: "/leave",
  PAYROLL: "/payroll",

  PROFILE: "/profile",
  SETTINGS: "/settings",

  USERS: "/users",
  REPORTS: "/reports",

  AUDIT_LOGS: "/audit-logs",

  LOGIN_HISTORY: "/login-history",

  UNAUTHORIZED: "/unauthorized",

  NOT_FOUND: "/404",
};

/*
|--------------------------------------------------------------------------
| HTTP Status Codes
|--------------------------------------------------------------------------
*/

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,

  INTERNAL_SERVER_ERROR: 500,
};

/*
|--------------------------------------------------------------------------
| Application Information
|--------------------------------------------------------------------------
*/

export const APP = {
  NAME: "Enterprise HRM Portal",
  VERSION: "1.0.0",
  COMPANY: "Your Company",
};

/*
|--------------------------------------------------------------------------
| Sidebar Width
|--------------------------------------------------------------------------
*/

export const SIDEBAR = {
  WIDTH: 260,
  COLLAPSED_WIDTH: 80,
};

/*
|--------------------------------------------------------------------------
| Animation Durations
|--------------------------------------------------------------------------
*/

export const ANIMATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};