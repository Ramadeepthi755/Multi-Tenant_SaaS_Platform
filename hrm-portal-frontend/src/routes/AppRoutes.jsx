// src/routes/AppRoutes.jsx

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom";

/*
=========================================================
LAYOUT
=========================================================
*/

import MainLayout
  from "../layouts/MainLayout";

/*
=========================================================
AUTH / ROUTE GUARDS
=========================================================
*/

import ProtectedRoute
  from "../components/auth/ProtectedRoute";

import PermissionRoute
  from "./PermissionRoute";

/*
=========================================================
AUTH PAGES
=========================================================
*/

import Login
  from "../pages/auth/Login";

import ForgotPassword
  from "../pages/auth/ForgotPassword";

import ResetPassword
  from "../pages/auth/ResetPassword";

import Unauthorized
  from "../pages/auth/Unauthorized";

import SessionExpired
  from "../pages/auth/SessionExpired";

import NotFound
  from "../pages/auth/NotFound";

import Landing
  from "../pages/public/Landing";

/*
=========================================================
DASHBOARD
=========================================================
*/

import Dashboard
  from "../pages/dashboard/Dashboard";

/*
=========================================================
COMPANY
=========================================================
*/

import CompanyList
  from "../pages/company/CompanyList";

/*
=========================================================
DEPARTMENT
=========================================================
*/

import DepartmentList
  from "../pages/department/DepartmentList";

/*
=========================================================
DESIGNATION
=========================================================
*/

import DesignationList
  from "../pages/designation/DesignationList";

/*
=========================================================
EMPLOYEE
=========================================================
*/

import EmployeeList
  from "../pages/employee/EmployeeList";

/*
=========================================================
ATTENDANCE
=========================================================
*/

import Attendance
  from "../pages/attendance/Attendance";

/*
=========================================================
LEAVE
=========================================================
*/

import Leave
  from "../pages/leave/Leave";

/*
=========================================================
PAYROLL
=========================================================
*/

import Payroll
  from "../pages/payroll/Payroll";

/*
=========================================================
HOLIDAY
=========================================================
*/

import Holiday
  from "../pages/holiday/Holiday";

/*
=========================================================
DOCUMENT
=========================================================
*/

import Documents
  from "../pages/document/Documents";

/*
=========================================================
USER MANAGEMENT
=========================================================
*/

import User
  from "../pages/user/User";

/*
=========================================================
ROLES
=========================================================
*/

import RoleManagement
  from "../pages/roles/RoleManagement";

/*
=========================================================
NOTIFICATIONS
=========================================================
*/

import Notifications
  from "../pages/notifications/Notifications";

/*
=========================================================
REPORTS
=========================================================
*/

import ReportsDashboard
  from "../pages/reports/ReportsDashboard";

import EmployeeReport
  from "../pages/reports/EmployeeReport";

import AttendanceReport
  from "../pages/reports/AttendanceReport";

import LeaveReport
  from "../pages/reports/LeaveReport";

import PayrollReport
  from "../pages/reports/PayrollReport";

import DepartmentReport
  from "../pages/reports/DepartmentReport";

import RecruitmentReport
  from "../pages/reports/RecruitmentReport";

import PerformanceReport
  from "../pages/reports/PerformanceReport";

/*
=========================================================
PROFILE
=========================================================
*/

import Profile
  from "../pages/profile/Profile";

/*
=========================================================
SETTINGS
=========================================================
*/

import Settings
  from "../pages/settings/Settings";

/*
=========================================================
RECRUITMENT
=========================================================
*/

import RecruitmentDashboard
  from "../pages/recruitment/RecruitmentDashboard";

import JobList
  from "../pages/recruitment/JobList";

import CandidateList
  from "../pages/recruitment/CandidateList";

import InterviewList
  from "../pages/recruitment/InterviewList";

import OfferLetter
  from "../pages/recruitment/OfferLetter";

/*
=========================================================
SECURITY
=========================================================
*/

import AuditLogs
  from "../pages/security/AuditLogs";


const AppRoutes = () => {

  return (
    <BrowserRouter>

      <Routes>

        {/* =================================================
            PUBLIC ROUTES
        ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />

        <Route
          path="/session-expired"
          element={<SessionExpired />}
        />


        {/* =================================================
            PROTECTED APPLICATION
        ================================================= */}

        <Route
          element={<ProtectedRoute />}
        >

          <Route
            element={<MainLayout />}
          >


            {/* =================================================
                DASHBOARD
            ================================================= */}

            <Route
              element={
              <PermissionRoute
                permission="DASHBOARD_VIEW"
              />
              }
            >

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

            </Route>


            {/* =================================================
                COMPANY
            ================================================= */}

            <Route
              element={
                <PermissionRoute
                  permission="COMPANY_READ"
                />
              }
            >

              <Route
                path="/companies"
                element={<CompanyList />}
              />

            </Route>


            {/* =================================================
                DEPARTMENT
            ================================================= */}

            <Route
              element={
                <PermissionRoute
                  permission="DEPARTMENT_READ"
                />
              }
            >

              <Route
                path="/departments"
                element={<DepartmentList />}
              />

            </Route>


            {/* =================================================
                DESIGNATION
            ================================================= */}

            <Route
              element={
                <PermissionRoute
                  permission="DESIGNATION_READ"
                />
              }
            >

              <Route
                path="/designations"
                element={<DesignationList />}
              />

            </Route>


            {/* =================================================
                EMPLOYEE
            ================================================= */}

            <Route
              element={
                <PermissionRoute
                  permission="EMPLOYEE_READ"
                />
              }
            >

              <Route
                path="/employees"
                element={<EmployeeList />}
              />

            </Route>


            {/* =================================================
                ATTENDANCE
            ================================================= */}

            <Route
              element={
                <PermissionRoute
                  permission="ATTENDANCE_READ"
                />
              }
            >

              <Route
                path="/attendance"
                element={<Attendance />}
              />

            </Route>


            {/* =================================================
                LEAVE MANAGEMENT
            ================================================= */}

            <Route
              element={
                <PermissionRoute
                  permission="LEAVE_READ"
                />
              }
            >

              <Route
                path="/leave"
                element={<Leave />}
              />

            </Route>


            {/* =================================================
                PAYROLL
            ================================================= */}

            <Route
              element={
                <PermissionRoute
                  permission="PAYROLL_READ"
                />
              }
            >

              <Route
                path="/payroll"
                element={<Payroll />}
              />

            </Route>


            {/* =================================================
                HOLIDAYS
            ================================================= */}

            <Route
              element={
                <PermissionRoute
                  permission="HOLIDAY_READ"
                />
              }
            >

              <Route
                path="/holidays"
                element={<Holiday />}
              />

            </Route>


            {/* =================================================
                DOCUMENTS
            ================================================= */}

            <Route
              element={
                <PermissionRoute
                  permissions={[
                    "DOCUMENT_DOWNLOAD",
                    "DOCUMENT_UPLOAD",
                    "DOCUMENT_DELETE"
                  ]}
                  mode="any"
                />
              }
            >

              <Route
                path="/documents"
                element={<Documents />}
              />

            </Route>


            {/* =================================================
                USER MANAGEMENT
            ================================================= */}

            <Route
              element={
                <PermissionRoute
                  permission="USER_READ"
                />
              }
            >

              <Route
                path="/users"
                element={<User />}
              />

            </Route>


            {/* =================================================
                ROLE MANAGEMENT
                Only Super Admin
            ================================================= */}

            <Route
              element={
                <PermissionRoute
                  role="SUPER_ADMIN"
                />
              }
            >

              <Route
                path="/roles"
                element={<RoleManagement />}
              />

            </Route>


            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <Route
              path="/notifications"
              element={<Notifications />}
            />


            {/* =================================================
                REPORTS
            ================================================= */}

            <Route
              element={
                <PermissionRoute
                  permission="DASHBOARD_VIEW"
                  roles={[
                    "SUPER_ADMIN",
                    "COMPANY_ADMIN",
                    "HR",
                    "MANAGER"
                  ]}
                />
              }
            >

              <Route
                path="/reports"
                element={<ReportsDashboard />}
              />

              <Route
                path="/reports/employees"
                element={<EmployeeReport />}
              />

              <Route
                path="/reports/attendance"
                element={<AttendanceReport />}
              />

              <Route
                path="/reports/leave"
                element={<LeaveReport />}
              />

              <Route
                path="/reports/payroll"
                element={<PayrollReport />}
              />

              <Route
                path="/reports/departments"
                element={<DepartmentReport />}
              />

              <Route
                path="/reports/recruitment"
                element={<RecruitmentReport />}
              />

              <Route
                path="/reports/performance"
                element={<PerformanceReport />}
              />

            </Route>


            {/* =================================================
                RECRUITMENT
            ================================================= */}

            <Route
              element={
                <PermissionRoute
                  roles={[
                    "SUPER_ADMIN",
                    "COMPANY_ADMIN",
                    "HR",
                    "MANAGER"
                  ]}
                />
              }
            >

              <Route
                path="/recruitment"
                element={<RecruitmentDashboard />}
              />

              <Route
                path="/recruitment/jobs"
                element={<JobList />}
              />

              <Route
                path="/recruitment/candidates"
                element={<CandidateList />}
              />

              <Route
                path="/recruitment/interviews"
                element={<InterviewList />}
              />

              <Route
                path="/recruitment/offers"
                element={<OfferLetter />}
              />

            </Route>


            {/* =================================================
                SECURITY / AUDIT LOGS
                Only Super Admin
            ================================================= */}

            <Route
              element={
                <PermissionRoute
                  role="SUPER_ADMIN"
                />
              }
            >

              <Route
                path="/security"
                element={<AuditLogs />}
              />

            </Route>


            {/* =================================================
                PROFILE
            ================================================= */}

            <Route
              path="/profile"
              element={<Profile />}
            />


            {/* =================================================
                SETTINGS
            ================================================= */}

            <Route
              path="/settings"
              element={<Settings />}
            />


          </Route>

        </Route>


        {/* =================================================
            ROOT
        ================================================= */}

        <Route
          path="/"
          element={<Landing />}
        />


        {/* =================================================
            UNKNOWN ROUTE
        ================================================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </BrowserRouter>
  );
};


export default AppRoutes;
