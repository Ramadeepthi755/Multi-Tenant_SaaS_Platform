/*
|--------------------------------------------------------------------------
| HRM PORTAL PERMISSIONS
|--------------------------------------------------------------------------
*/

export const PERMISSIONS = {
  // =========================================================
  // DASHBOARD
  // =========================================================

  DASHBOARD_VIEW:
    "DASHBOARD_VIEW",

  // =========================================================
  // COMPANY
  // =========================================================

  COMPANY_VIEW:
    "COMPANY_READ",

  COMPANY_CREATE:
    "COMPANY_CREATE",

  COMPANY_UPDATE:
    "COMPANY_UPDATE",

  COMPANY_DELETE:
    "COMPANY_DELETE",

  // =========================================================
  // EMPLOYEE
  // =========================================================

  EMPLOYEE_VIEW:
    "EMPLOYEE_READ",

  EMPLOYEE_CREATE:
    "EMPLOYEE_CREATE",

  EMPLOYEE_UPDATE:
    "EMPLOYEE_UPDATE",

  EMPLOYEE_DELETE:
    "EMPLOYEE_DELETE",

  // =========================================================
  // DEPARTMENT
  // =========================================================

  DEPARTMENT_VIEW:
    "DEPARTMENT_READ",

  DEPARTMENT_CREATE:
    "DEPARTMENT_CREATE",

  DEPARTMENT_UPDATE:
    "DEPARTMENT_UPDATE",

  DEPARTMENT_DELETE:
    "DEPARTMENT_DELETE",

  // =========================================================
  // DESIGNATION
  // =========================================================

  DESIGNATION_VIEW:
    "DESIGNATION_READ",

  DESIGNATION_CREATE:
    "DESIGNATION_CREATE",

  DESIGNATION_UPDATE:
    "DESIGNATION_UPDATE",

  DESIGNATION_DELETE:
    "DESIGNATION_DELETE",

  // =========================================================
  // ATTENDANCE
  // =========================================================

  ATTENDANCE_VIEW:
    "ATTENDANCE_READ",

  ATTENDANCE_MARK:
    "ATTENDANCE_MARK",

  ATTENDANCE_UPDATE:
    "ATTENDANCE_UPDATE",

  // =========================================================
  // LEAVE
  // =========================================================

  LEAVE_VIEW:
    "LEAVE_READ",

  LEAVE_APPLY:
    "LEAVE_APPLY",

  LEAVE_APPROVE:
    "LEAVE_APPROVE",

  LEAVE_REJECT:
    "LEAVE_REJECT",

  // =========================================================
  // PAYROLL
  // =========================================================

  PAYROLL_VIEW:
    "PAYROLL_READ",

  PAYROLL_CREATE:
    "PAYROLL_CREATE",

  PAYROLL_UPDATE:
    "PAYROLL_UPDATE",

  // =========================================================
  // PROFILE
  // =========================================================

  PROFILE_VIEW:
    "PROFILE_READ",

  PROFILE_UPDATE:
    "PROFILE_UPDATE",

  // =========================================================
  // SETTINGS
  // =========================================================

  SETTINGS_VIEW:
    "SETTINGS_READ",

  SETTINGS_UPDATE:
    "SETTINGS_UPDATE",
};


/*
|--------------------------------------------------------------------------
| ROLE → PERMISSIONS
|--------------------------------------------------------------------------
*/

export const ROLE_PERMISSIONS = {
  // =========================================================
  // SUPER ADMIN
  // =========================================================

  SUPER_ADMIN: [
    PERMISSIONS.DASHBOARD_VIEW,

    PERMISSIONS.COMPANY_VIEW,
    PERMISSIONS.COMPANY_CREATE,
    PERMISSIONS.COMPANY_UPDATE,
    PERMISSIONS.COMPANY_DELETE,

    PERMISSIONS.EMPLOYEE_VIEW,
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_UPDATE,
    PERMISSIONS.EMPLOYEE_DELETE,

    PERMISSIONS.DEPARTMENT_VIEW,
    PERMISSIONS.DEPARTMENT_CREATE,
    PERMISSIONS.DEPARTMENT_UPDATE,
    PERMISSIONS.DEPARTMENT_DELETE,

    PERMISSIONS.DESIGNATION_VIEW,
    PERMISSIONS.DESIGNATION_CREATE,
    PERMISSIONS.DESIGNATION_UPDATE,
    PERMISSIONS.DESIGNATION_DELETE,

    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.ATTENDANCE_MARK,
    PERMISSIONS.ATTENDANCE_UPDATE,

    PERMISSIONS.LEAVE_VIEW,
    PERMISSIONS.LEAVE_APPLY,
    PERMISSIONS.LEAVE_APPROVE,
    PERMISSIONS.LEAVE_REJECT,

    PERMISSIONS.PAYROLL_VIEW,
    PERMISSIONS.PAYROLL_CREATE,
    PERMISSIONS.PAYROLL_UPDATE,

    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.PROFILE_UPDATE,

    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_UPDATE,
  ],

  // =========================================================
  // COMPANY ADMIN
  // =========================================================

  COMPANY_ADMIN: [
    PERMISSIONS.DASHBOARD_VIEW,

    PERMISSIONS.COMPANY_VIEW,
    PERMISSIONS.COMPANY_UPDATE,

    PERMISSIONS.EMPLOYEE_VIEW,
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_UPDATE,
    PERMISSIONS.EMPLOYEE_DELETE,

    PERMISSIONS.DEPARTMENT_VIEW,
    PERMISSIONS.DEPARTMENT_CREATE,
    PERMISSIONS.DEPARTMENT_UPDATE,
    PERMISSIONS.DEPARTMENT_DELETE,

    PERMISSIONS.DESIGNATION_VIEW,
    PERMISSIONS.DESIGNATION_CREATE,
    PERMISSIONS.DESIGNATION_UPDATE,
    PERMISSIONS.DESIGNATION_DELETE,

    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.ATTENDANCE_MARK,
    PERMISSIONS.ATTENDANCE_UPDATE,

    PERMISSIONS.LEAVE_VIEW,
    PERMISSIONS.LEAVE_APPLY,
    PERMISSIONS.LEAVE_APPROVE,
    PERMISSIONS.LEAVE_REJECT,

    PERMISSIONS.PAYROLL_VIEW,
    PERMISSIONS.PAYROLL_CREATE,
    PERMISSIONS.PAYROLL_UPDATE,

    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.PROFILE_UPDATE,

    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_UPDATE,
  ],

  // =========================================================
  // HR
  // =========================================================

  HR: [
    PERMISSIONS.DASHBOARD_VIEW,

    PERMISSIONS.EMPLOYEE_VIEW,
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_UPDATE,

    PERMISSIONS.DEPARTMENT_VIEW,
    PERMISSIONS.DEPARTMENT_CREATE,
    PERMISSIONS.DEPARTMENT_UPDATE,

    PERMISSIONS.DESIGNATION_VIEW,
    PERMISSIONS.DESIGNATION_CREATE,
    PERMISSIONS.DESIGNATION_UPDATE,

    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.ATTENDANCE_MARK,
    PERMISSIONS.ATTENDANCE_UPDATE,

    PERMISSIONS.LEAVE_VIEW,
    PERMISSIONS.LEAVE_APPLY,
    PERMISSIONS.LEAVE_APPROVE,
    PERMISSIONS.LEAVE_REJECT,

    PERMISSIONS.PAYROLL_VIEW,

    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.PROFILE_UPDATE,

    PERMISSIONS.SETTINGS_VIEW,
  ],

  // =========================================================
  // JUNIOR HR
  // =========================================================

  JR_HR: [
    PERMISSIONS.DASHBOARD_VIEW,

    PERMISSIONS.EMPLOYEE_VIEW,
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_UPDATE,

    PERMISSIONS.DEPARTMENT_VIEW,

    PERMISSIONS.DESIGNATION_VIEW,

    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.ATTENDANCE_MARK,

    PERMISSIONS.LEAVE_VIEW,
    PERMISSIONS.LEAVE_APPLY,

    PERMISSIONS.PAYROLL_VIEW,

    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.PROFILE_UPDATE,
  ],

  // =========================================================
  // MANAGER
  // =========================================================

  MANAGER: [
    PERMISSIONS.DASHBOARD_VIEW,

    PERMISSIONS.EMPLOYEE_VIEW,

    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.ATTENDANCE_MARK,

    PERMISSIONS.LEAVE_VIEW,
    PERMISSIONS.LEAVE_APPLY,
    PERMISSIONS.LEAVE_APPROVE,
    PERMISSIONS.LEAVE_REJECT,

    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.PROFILE_UPDATE,
  ],

  // =========================================================
  // EMPLOYEE
  // =========================================================

  EMPLOYEE: [
    PERMISSIONS.DASHBOARD_VIEW,

    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.ATTENDANCE_MARK,

    PERMISSIONS.LEAVE_VIEW,
    PERMISSIONS.LEAVE_APPLY,

    PERMISSIONS.PAYROLL_VIEW,

    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.PROFILE_UPDATE,
  ],
};