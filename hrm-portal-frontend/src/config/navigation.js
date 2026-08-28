import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import BeachAccessOutlinedIcon from "@mui/icons-material/BeachAccessOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PolicyOutlinedIcon from "@mui/icons-material/PolicyOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";

const companyRoles = ["COMPANY_ADMIN", "HR"];
const managerRoles = ["MANAGER"];
const employeeRoles = ["EMPLOYEE"];

const navigation = [
  { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: DashboardOutlinedIcon, permission: "DASHBOARD_VIEW" },

  { id: "companies", label: "Companies", path: "/companies", icon: BusinessOutlinedIcon, roles: ["SUPER_ADMIN"], permission: "COMPANY_READ" },
  { id: "users", label: "Users", path: "/users", icon: ManageAccountsOutlinedIcon, roles: ["SUPER_ADMIN"], permission: "USER_READ" },
  { id: "roles", label: "Roles & permissions", path: "/roles", icon: PolicyOutlinedIcon, roles: ["SUPER_ADMIN"] },
  { id: "audit", label: "Audit logs", path: "/security", icon: SecurityOutlinedIcon, roles: ["SUPER_ADMIN"] },

  { id: "employees", label: "Employees", path: "/employees", icon: PeopleAltOutlinedIcon, roles: companyRoles, permission: "EMPLOYEE_READ" },
  { id: "departments", label: "Departments", path: "/departments", icon: ApartmentOutlinedIcon, roles: ["COMPANY_ADMIN"], permission: "DEPARTMENT_READ" },
  { id: "designations", label: "Designations", path: "/designations", icon: BadgeOutlinedIcon, roles: ["COMPANY_ADMIN"], permission: "DESIGNATION_READ" },
  { id: "attendance", label: "Attendance", path: "/attendance", icon: AccessTimeOutlinedIcon, roles: companyRoles, permission: "ATTENDANCE_READ" },
  { id: "leave", label: "Leave", path: "/leave", icon: EventAvailableOutlinedIcon, roles: companyRoles, permission: "LEAVE_READ" },
  { id: "holidays", label: "Holidays", path: "/holidays", icon: BeachAccessOutlinedIcon, roles: companyRoles, permission: "HOLIDAY_READ" },
  { id: "payroll", label: "Payroll", path: "/payroll", icon: PaymentsOutlinedIcon, roles: companyRoles, permission: "PAYROLL_READ" },
  { id: "documents", label: "Documents", path: "/documents", icon: FolderOutlinedIcon, roles: companyRoles, permissions: ["DOCUMENT_DOWNLOAD", "DOCUMENT_UPLOAD", "DOCUMENT_DELETE"], permissionMode: "any" },
  { id: "recruitment", label: "Recruitment", path: "/recruitment", icon: WorkOutlineOutlinedIcon, roles: companyRoles },
  { id: "reports", label: "Reports", path: "/reports", icon: AssessmentOutlinedIcon, roles: companyRoles, permission: "DASHBOARD_VIEW" },

  { id: "team", label: "My team", path: "/employees", icon: PeopleAltOutlinedIcon, roles: managerRoles, permission: "EMPLOYEE_READ" },
  { id: "team-attendance", label: "Team attendance", path: "/attendance", icon: AccessTimeOutlinedIcon, roles: managerRoles, permission: "ATTENDANCE_READ" },
  { id: "leave-approvals", label: "Leave approvals", path: "/leave", icon: EventAvailableOutlinedIcon, roles: managerRoles, permission: "LEAVE_READ" },
  { id: "team-performance", label: "Performance", path: "/reports/performance", icon: AssessmentOutlinedIcon, roles: managerRoles, permission: "DASHBOARD_VIEW" },
  { id: "team-reports", label: "Reports", path: "/reports", icon: AssessmentOutlinedIcon, roles: managerRoles, permission: "DASHBOARD_VIEW" },

  { id: "my-attendance", label: "My attendance", path: "/attendance", icon: AccessTimeOutlinedIcon, roles: employeeRoles, permission: "ATTENDANCE_READ" },
  { id: "my-leave", label: "My leave", path: "/leave", icon: EventAvailableOutlinedIcon, roles: employeeRoles, permission: "LEAVE_READ" },
  { id: "my-payroll", label: "My payroll", path: "/payroll", icon: PaymentsOutlinedIcon, roles: employeeRoles, permission: "PAYROLL_READ" },
  { id: "my-documents", label: "My documents", path: "/documents", icon: FolderOutlinedIcon, roles: employeeRoles, permissions: ["DOCUMENT_DOWNLOAD", "DOCUMENT_UPLOAD"], permissionMode: "any" },
  { id: "employee-holidays", label: "Holidays", path: "/holidays", icon: BeachAccessOutlinedIcon, roles: employeeRoles, permission: "HOLIDAY_READ" },

  { id: "notifications", label: "Notifications", path: "/notifications", icon: NotificationsOutlinedIcon }
];

export const bottomNavigation = [
  { id: "profile", label: "My profile", path: "/profile", icon: PersonOutlineOutlinedIcon },
  { id: "settings", label: "Settings", path: "/settings", icon: SettingsOutlinedIcon }
];

export default navigation;
