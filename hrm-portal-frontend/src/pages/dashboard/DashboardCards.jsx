// src/pages/dashboard/DashboardCards.jsx

import { useEffect, useState } from "react";

import { Grid } from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BadgeIcon from "@mui/icons-material/Badge";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import PaymentsIcon from "@mui/icons-material/Payments";

import StatCard from "./StatCard";

import { getDashboard } from "../../services/dashboardService";

import { useAuth } from "../../context/AuthContext";

const DashboardCards = () => {
  // =====================================================
  // AUTH
  // =====================================================

  const {
    hasPermission,
  } = useAuth();

  // =====================================================
  // DASHBOARD STATE
  // =====================================================

  const [dashboard, setDashboard] =
    useState({
      totalEmployees: 0,
      activeEmployees: 0,
      totalDepartments: 0,
      totalDesignations: 0,
      todayAttendance: 0,
      todayLeaves: 0,
      currentMonthPayroll: 0,
    });

  const [loading, setLoading] =
    useState(true);

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const data =
        await getDashboard();

      setDashboard({
        totalEmployees:
          data?.totalEmployees ?? 0,

        activeEmployees:
          data?.activeEmployees ?? 0,

        totalDepartments:
          data?.totalDepartments ?? 0,

        totalDesignations:
          data?.totalDesignations ?? 0,

        todayAttendance:
          data?.todayAttendance ?? 0,

        todayLeaves:
          data?.todayLeaves ?? 0,

        currentMonthPayroll:
          data?.currentMonthPayroll ?? 0,
      });
    } catch (error) {
      console.error(
        "Dashboard API Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PERMISSION BASED CARDS
  // =====================================================

  const cards = [
    {
      key: "employees",

      title: "Employees",

      value: dashboard.totalEmployees,

      subtitle: "Total Employees",

      trend: 0,

      color: "#1976d2",

      icon: <PeopleIcon />,

      permission: "EMPLOYEE_READ",
    },

    {
      key: "departments",

      title: "Departments",

      value: dashboard.totalDepartments,

      subtitle: "Departments",

      trend: 0,

      color: "#ed6c02",

      icon: <ApartmentIcon />,

      permission: "DEPARTMENT_READ",
    },

    {
      key: "designations",

      title: "Designations",

      value: dashboard.totalDesignations,

      subtitle: "Designations",

      trend: 0,

      color: "#2e7d32",

      icon: <BadgeIcon />,

      permission: "DESIGNATION_READ",
    },

    {
      key: "attendance",

      title: "Attendance",

      value: dashboard.todayAttendance,

      subtitle: "Today's Attendance",

      trend: 0,

      color: "#0288d1",

      icon: <EventAvailableIcon />,

      permission: "ATTENDANCE_READ",
    },

    {
      key: "leave",

      title: "Leave",

      value: dashboard.todayLeaves,

      subtitle: "Today's Leaves",

      trend: 0,

      color: "#9c27b0",

      icon: <BeachAccessIcon />,

      permission: "LEAVE_READ",
    },

    {
      key: "payroll",

      title: "Payroll",

      value: `₹${dashboard.currentMonthPayroll}`,

      subtitle: "Current Month",

      trend: 0,

      color: "#d32f2f",

      icon: <PaymentsIcon />,

      permission: "PAYROLL_READ",
    },
  ];

  // =====================================================
  // FILTER CARDS BY PERMISSION
  // =====================================================

  const visibleCards =
    cards.filter((card) =>
      hasPermission(
        card.permission
      )
    );

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
        >
          Loading dashboard...
        </Grid>
      </Grid>
    );
  }

  // =====================================================
  // NO PERMISSION
  // =====================================================

  if (visibleCards.length === 0) {
    return null;
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <Grid
      container
      spacing={3}
    >
      {visibleCards.map(
        (card) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={2}
            key={card.key}
          >
            <StatCard
              title={card.title}
              value={card.value}
              subtitle={
                card.subtitle
              }
              trend={card.trend}
              color={card.color}
              icon={card.icon}
            />
          </Grid>
        )
      )}
    </Grid>
  );
};

export default DashboardCards;