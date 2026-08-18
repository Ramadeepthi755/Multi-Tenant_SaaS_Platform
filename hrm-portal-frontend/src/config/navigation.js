import DashboardOutlinedIcon
  from "@mui/icons-material/DashboardOutlined";

import BusinessOutlinedIcon
  from "@mui/icons-material/BusinessOutlined";

import ApartmentOutlinedIcon
  from "@mui/icons-material/ApartmentOutlined";

import BadgeOutlinedIcon
  from "@mui/icons-material/BadgeOutlined";

import PeopleAltOutlinedIcon
  from "@mui/icons-material/PeopleAltOutlined";

import AccessTimeOutlinedIcon
  from "@mui/icons-material/AccessTimeOutlined";

import EventAvailableOutlinedIcon
  from "@mui/icons-material/EventAvailableOutlined";

import PaymentsOutlinedIcon
  from "@mui/icons-material/PaymentsOutlined";

import BeachAccessOutlinedIcon
  from "@mui/icons-material/BeachAccessOutlined";

import FolderOutlinedIcon
  from "@mui/icons-material/FolderOutlined";

import AssessmentOutlinedIcon
  from "@mui/icons-material/AssessmentOutlined";

import ManageAccountsOutlinedIcon
  from "@mui/icons-material/ManageAccountsOutlined";

import SettingsOutlinedIcon
  from "@mui/icons-material/SettingsOutlined";

import PersonOutlineOutlinedIcon
  from "@mui/icons-material/PersonOutlineOutlined";


const navigation = [

  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: DashboardOutlinedIcon,
    permission: "DASHBOARD_VIEW"
  },


  {
    id: "company",
    label: "Company",
    path: "/companies",
    icon: BusinessOutlinedIcon,
    permission: "COMPANY_READ"
  },


  {
    id: "departments",
    label: "Departments",
    path: "/departments",
    icon: ApartmentOutlinedIcon,
    permission: "DEPARTMENT_READ"
  },


  {
    id: "designations",
    label: "Designations",
    path: "/designations",
    icon: BadgeOutlinedIcon,
    permission: "DESIGNATION_READ"
  },


  {
    id: "employees",
    label: "Employees",
    path: "/employees",
    icon: PeopleAltOutlinedIcon,
    permission: "EMPLOYEE_READ"
  },


  {
    id: "attendance",
    label: "Attendance",
    path: "/attendance",
    icon: AccessTimeOutlinedIcon,
    permission: "ATTENDANCE_READ"
  },


  {
    id: "leave",
    label: "Leave Management",
    path: "/leave",
    icon: EventAvailableOutlinedIcon,
    permission: "LEAVE_READ"
  },


  {
    id: "payroll",
    label: "Payroll",
    path: "/payroll",
    icon: PaymentsOutlinedIcon,
    permission: "PAYROLL_READ"
  },


  {
    id: "holidays",
    label: "Holidays",
    path: "/holidays",
    icon: BeachAccessOutlinedIcon,
    permission: "HOLIDAY_READ"
  },


  {
    id: "documents",
    label: "Documents",
    path: "/documents",
    icon: FolderOutlinedIcon,

    permissions: [
      "DOCUMENT_DOWNLOAD",
      "DOCUMENT_UPLOAD",
      "DOCUMENT_DELETE"
    ],

    permissionMode: "any"
  },


  {
    id: "reports",
    label: "Reports",
    path: "/reports",
    icon: AssessmentOutlinedIcon,
    permission: "DASHBOARD_VIEW"
  },


  {
    id: "users",
    label: "User Management",
    path: "/users",
    icon: ManageAccountsOutlinedIcon,
    role: "COMPANY_ADMIN"
  }

];


export const bottomNavigation = [

  {
    id: "profile",
    label: "My Profile",
    path: "/profile",
    icon: PersonOutlineOutlinedIcon
  },


  {
    id: "settings",
    label: "Settings",
    path: "/settings",
    icon: SettingsOutlinedIcon
  }

];


export default navigation;