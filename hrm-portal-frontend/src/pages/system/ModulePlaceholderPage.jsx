import {
  useLocation
} from "react-router-dom";

import BusinessOutlinedIcon
  from "@mui/icons-material/BusinessOutlined";

import ApartmentOutlinedIcon
  from "@mui/icons-material/ApartmentOutlined";

import BadgeOutlinedIcon
  from "@mui/icons-material/BadgeOutlined";

import PeopleAltOutlinedIcon
  from "@mui/icons-material/PeopleAltOutlined";

import EventAvailableOutlinedIcon
  from "@mui/icons-material/EventAvailableOutlined";

import EventNoteOutlinedIcon
  from "@mui/icons-material/EventNoteOutlined";

import PaymentsOutlinedIcon
  from "@mui/icons-material/PaymentsOutlined";

import CalendarMonthOutlinedIcon
  from "@mui/icons-material/CalendarMonthOutlined";

import FolderOutlinedIcon
  from "@mui/icons-material/FolderOutlined";

import ManageAccountsOutlinedIcon
  from "@mui/icons-material/ManageAccountsOutlined";

import AssessmentOutlinedIcon
  from "@mui/icons-material/AssessmentOutlined";

import SettingsOutlinedIcon
  from "@mui/icons-material/SettingsOutlined";

import PersonOutlinedIcon
  from "@mui/icons-material/PersonOutlined";

import ModulePlaceholder
  from "../../components/common/ModulePlaceholder";


const MODULES = {

  "/companies": {
    title: "Companies",
    description:
      "Manage organizations, company information, status and enterprise configuration.",
    icon: BusinessOutlinedIcon
  },

  "/departments": {
    title: "Departments",
    description:
      "Manage organizational departments, department structure and responsible managers.",
    icon: ApartmentOutlinedIcon
  },

  "/designations": {
    title: "Designations",
    description:
      "Manage job designations and organizational roles.",
    icon: BadgeOutlinedIcon
  },

  "/employees": {
    title: "Employees",
    description:
      "Manage employee profiles, employment information, departments and designations.",
    icon: PeopleAltOutlinedIcon
  },

  "/attendance": {
    title: "Attendance",
    description:
      "Monitor employee attendance, daily status, late arrivals and attendance history.",
    icon: EventAvailableOutlinedIcon
  },

  "/leave": {
    title: "Leave Management",
    description:
      "Manage leave applications, approvals, rejections and leave history.",
    icon: EventNoteOutlinedIcon
  },

  "/payroll": {
    title: "Payroll",
    description:
      "Manage payroll information, salary processing and payroll history.",
    icon: PaymentsOutlinedIcon
  },

  "/holidays": {
    title: "Holiday Calendar",
    description:
      "Manage organization holidays and annual holiday calendars.",
    icon: CalendarMonthOutlinedIcon
  },

  "/documents": {
    title: "Documents",
    description:
      "Manage employee documents, uploads, downloads and document categories.",
    icon: FolderOutlinedIcon
  },

  "/users": {
    title: "User Management",
    description:
      "Manage HRM portal users, roles, account status and access control.",
    icon: ManageAccountsOutlinedIcon
  },

  "/reports": {
    title: "Reports & Analytics",
    description:
      "View HR reports and workforce analytics.",
    icon: AssessmentOutlinedIcon
  },

  "/settings": {
    title: "Settings",
    description:
      "Configure HRM portal preferences and organization settings.",
    icon: SettingsOutlinedIcon
  },

  "/profile": {
    title: "My Profile",
    description:
      "View and manage your personal HRM portal profile.",
    icon: PersonOutlinedIcon
  }
};


const ModulePlaceholderPage = () => {

  const location = useLocation();

  const module =
    MODULES[location.pathname];


  if (!module) {

    return (
      <ModulePlaceholder
        title="Module"
        description="The requested module could not be found."
      />
    );
  }


  return (
    <ModulePlaceholder
      title={module.title}
      description={module.description}
      icon={module.icon}
    />
  );
};


export default ModulePlaceholderPage;