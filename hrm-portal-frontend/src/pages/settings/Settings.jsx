import {
  Box,
  Grid
} from "@mui/material";


import BusinessOutlinedIcon
  from "@mui/icons-material/BusinessOutlined";

import TuneOutlinedIcon
  from "@mui/icons-material/TuneOutlined";

import AccessTimeOutlinedIcon
  from "@mui/icons-material/AccessTimeOutlined";

import EventAvailableOutlinedIcon
  from "@mui/icons-material/EventAvailableOutlined";

import PaymentsOutlinedIcon
  from "@mui/icons-material/PaymentsOutlined";

import NotificationsNoneOutlinedIcon
  from "@mui/icons-material/NotificationsNoneOutlined";

import SecurityOutlinedIcon
  from "@mui/icons-material/SecurityOutlined";


import {
  useMemo,
  useState
} from "react";


import SettingsSidebar
  from "../../components/settings/SettingsSidebar";


import CompanySettings
  from "./CompanySettings";


import GeneralSettings
  from "./GeneralSettings";


import AttendanceSettings
  from "./AttendanceSettings";


import LeaveSettings
  from "./LeaveSettings";


import PayrollSettings
  from "./PayrollSettings";


import NotificationSettings
  from "./NotificationSettings";


import SecuritySettings
  from "./SecuritySettings";


const Settings = () => {

  const [
    activeSection,
    setActiveSection
  ] = useState(
    "general"
  );


  const sections = useMemo(
    () => [

      {
        id: "general",
        label: "General",
        description:
          "Application preferences",
        icon:
          <TuneOutlinedIcon />
      },

      {
        id: "company",
        label: "Company",
        description:
          "Organization information",
        icon:
          <BusinessOutlinedIcon />
      },

      {
        id: "attendance",
        label: "Attendance",
        description:
          "Working hours & rules",
        icon:
          <AccessTimeOutlinedIcon />
      },

      {
        id: "leave",
        label: "Leave",
        description:
          "Leave policies",
        icon:
          <EventAvailableOutlinedIcon />
      },

      {
        id: "payroll",
        label: "Payroll",
        description:
          "Salary processing",
        icon:
          <PaymentsOutlinedIcon />
      },

      {
        id: "notifications",
        label: "Notifications",
        description:
          "Alert preferences",
        icon:
          <NotificationsNoneOutlinedIcon />
      },

      {
        id: "security",
        label: "Security",
        description:
          "Authentication policies",
        icon:
          <SecurityOutlinedIcon />
      }

    ],
    []
  );


  const renderSection =
    () => {

      switch (
        activeSection
      ) {

        case "company":
          return (
            <CompanySettings />
          );


        case "attendance":
          return (
            <AttendanceSettings />
          );


        case "leave":
          return (
            <LeaveSettings />
          );


        case "payroll":
          return (
            <PayrollSettings />
          );


        case "notifications":
          return (
            <NotificationSettings />
          );


        case "security":
          return (
            <SecuritySettings />
          );


        case "general":
        default:
          return (
            <GeneralSettings />
          );

      }

    };


  return (
    <Box
      sx={{
        pb: 5
      }}
    >

      <Grid
        container
        spacing={2.5}
      >

        <Grid
          size={{
            xs: 12,
            md: 3
          }}
        >

          <SettingsSidebar

            sections={
              sections
            }

            activeSection={
              activeSection
            }

            onSelect={
              setActiveSection
            }

          />

        </Grid>


        <Grid
          size={{
            xs: 12,
            md: 9
          }}
        >

          {renderSection()}

        </Grid>

      </Grid>

    </Box>
  );
};


export default Settings;