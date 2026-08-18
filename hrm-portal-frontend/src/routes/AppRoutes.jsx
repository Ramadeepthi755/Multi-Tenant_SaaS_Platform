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

import Unauthorized
  from "../pages/auth/Unauthorized";

import SessionExpired
  from "../pages/auth/SessionExpired";

import NotFound
  from "../pages/auth/NotFound";

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
              element={
                <PermissionRoute
                  permission="NOTIFICATION_READ"
                />
              }
            >

              <Route
                path="/notifications"
                element={<Notifications />}
              />

            </Route>


            {/* =================================================
                REPORTS
            ================================================= */}

            <Route
              element={
                <PermissionRoute
                  permission="DASHBOARD_VIEW"
                />
              }
            >

              <Route
                path="/reports"
                element={<ReportsDashboard />}
              />

            </Route>


            {/* =================================================
                RECRUITMENT
            ================================================= */}

            <Route
              element={
                <PermissionRoute
                  role="SUPER_ADMIN"
                />
              }
            >

              <Route
                path="/recruitment"
                element={<RecruitmentDashboard />}
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
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
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