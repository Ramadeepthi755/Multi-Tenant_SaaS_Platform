import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography
} from "@mui/material";


import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";


import PeopleAltOutlinedIcon
  from "@mui/icons-material/PeopleAltOutlined";

import EventAvailableOutlinedIcon
  from "@mui/icons-material/EventAvailableOutlined";

import EventBusyOutlinedIcon
  from "@mui/icons-material/EventBusyOutlined";

import PaymentsOutlinedIcon
  from "@mui/icons-material/PaymentsOutlined";

import PersonAddAltOutlinedIcon
  from "@mui/icons-material/PersonAddAltOutlined";

import BeachAccessOutlinedIcon
  from "@mui/icons-material/BeachAccessOutlined";

import DescriptionOutlinedIcon
  from "@mui/icons-material/DescriptionOutlined";

import AccessTimeOutlinedIcon
  from "@mui/icons-material/AccessTimeOutlined";


import DashboardHeader
  from "./DashboardHeader";

import DashboardKpiCard
  from "./DashboardKpiCard";

import AttendanceOverview
  from "./AttendanceOverview";

import WorkforceOverview
  from "./WorkforceOverview";

import LeaveOverview
  from "./LeaveOverview";

import PayrollOverview
  from "./PayrollOverview";

import PendingActions
  from "./PendingActions";

import RecentActivity
  from "./RecentActivity";

import QuickActions
  from "./QuickActions";

import DepartmentDistribution
  from "./DepartmentDistribution";


import dashboardService
  from "../../services/dashboardService";


import {
  getStoredUser,
  normalizeDashboardResponse,
  safeArray,
  safeNumber
} from "../../utils/dashboardUtils";


const Dashboard = () => {

  const [
    dashboard,
    setDashboard
  ] = useState({});


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    refreshing,
    setRefreshing
  ] = useState(false);


  const [
    error,
    setError
  ] = useState("");


  const user =
    useMemo(
      () =>
        getStoredUser(),
      []
    );


  const loadDashboard =
    useCallback(
      async (
        isRefresh = false
      ) => {

        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");


        try {

          const response =
            await dashboardService
              .getDashboard();


          const normalized =
            normalizeDashboardResponse(
              response
            );


          setDashboard(
            normalized
          );


        } catch (requestError) {

          console.error(
            "Dashboard loading failed:",
            requestError
          );


          setError(
            requestError
              ?.response
              ?.data
              ?.message ||
            requestError?.message ||
            "Unable to load dashboard data."
          );


          /*
           * Keep the dashboard visible even
           * when the backend is temporarily
           * unavailable.
           */
          setDashboard({});


        } finally {

          setLoading(false);
          setRefreshing(false);

        }

      },
      []
    );


  useEffect(() => {

    loadDashboard();

  }, [
    loadDashboard
  ]);


  const totalEmployees =
    safeNumber(
      dashboard.totalEmployees ??
      dashboard.employeeCount ??
      dashboard.totalEmployeeCount
    );


  const activeEmployees =
    safeNumber(
      dashboard.activeEmployees ??
      dashboard.activeEmployeeCount
    );


  const todayPresent =
    safeNumber(
      dashboard.todayPresent ??
      dashboard.presentToday ??
      dashboard.countTodayAttendance
    );


  const todayAbsent =
    safeNumber(
      dashboard.todayAbsent ??
      dashboard.absentToday ??
      dashboard.absentEmployees
    );


  const pendingLeaves =
    safeNumber(
      dashboard.pendingLeaves ??
      dashboard.pendingLeaveCount ??
      dashboard.countTodayLeave
    );


  const payroll =
    safeNumber(
      dashboard.currentMonthPayroll ??
      dashboard.monthlyPayroll ??
      dashboard.totalPayroll
    );


  const attendanceData =
    dashboard.attendance ||
    dashboard.attendanceOverview ||
    {

      present:
        todayPresent,

      absent:
        todayAbsent,

      late:
        dashboard.todayLate ??
        dashboard.lateToday ??
        0,

      totalEmployees:
        totalEmployees

    };


  const workforceData =
    dashboard.workforce ||
    dashboard.workforceOverview ||
    {

      totalEmployees:
        totalEmployees,

      activeEmployees:
        activeEmployees,

      inactiveEmployees:
        Math.max(
          0,
          totalEmployees -
            activeEmployees
        )

    };


  const leaveData =
    dashboard.leave ||
    dashboard.leaveOverview ||
    {

      pending:
        pendingLeaves,

      approved:
        dashboard.approvedLeaves ??
        0,

      rejected:
        dashboard.rejectedLeaves ??
        0

    };


  const payrollData =
    dashboard.payroll ||
    dashboard.payrollOverview ||
    {

      currentMonthPayroll:
        payroll,

      processedEmployees:
        dashboard.processedPayrollEmployees ??
        0,

      pendingEmployees:
        dashboard.pendingPayrollEmployees ??
        0

    };


  const activities =
    safeArray(
      dashboard.recentActivity ??
      dashboard.activities ??
      dashboard.recentActivities
    );


  const pendingActions =
    safeArray(
      dashboard.pendingActions ??
      dashboard.actions
    );


  const departments =
    safeArray(
      dashboard.departmentDistribution ??
      dashboard.departments ??
      dashboard.departmentStats
    );


  const quickActions = [];


  const userRole =
    user?.role;


  const userPermissions =
    Array.isArray(
      user?.permissions
    )
      ? user.permissions
      : [];


  const hasPermission =
    permission => {

      if (
        userRole ===
        "SUPER_ADMIN"
      ) {
        return true;
      }

      return userPermissions.includes(
        permission
      );

    };


  if (
    hasPermission(
      "EMPLOYEE_CREATE"
    )
  ) {

    quickActions.push({

      id: "employee",

      label:
        "Add Employee",

      icon:
        <PersonAddAltOutlinedIcon />,

      onClick: () =>
        window.location.href =
          "/employees"

    });

  }


  if (
    hasPermission(
      "LEAVE_APPROVE"
    )
  ) {

    quickActions.push({

      id: "leave",

      label:
        "Review Leaves",

      icon:
        <BeachAccessOutlinedIcon />,

      onClick: () =>
        window.location.href =
          "/leave"

    });

  }


  if (
    hasPermission(
      "ATTENDANCE_READ"
    )
  ) {

    quickActions.push({

      id: "attendance",

      label:
        "View Attendance",

      icon:
        <AccessTimeOutlinedIcon />,

      onClick: () =>
        window.location.href =
          "/attendance"

    });

  }


  if (
    hasPermission(
      "DOCUMENT_UPLOAD"
    )
  ) {

    quickActions.push({

      id: "documents",

      label:
        "Documents",

      icon:
        <DescriptionOutlinedIcon />,

      onClick: () =>
        window.location.href =
          "/documents"

    });

  }


  /*
   * Fallback actions for users whose
   * permission list is limited.
   */

  if (
    quickActions.length === 0
  ) {

    quickActions.push({

      id: "profile",

      label:
        "My Profile",

      icon:
        <PeopleAltOutlinedIcon />,

      onClick: () =>
        window.location.href =
          "/profile"

    });

  }


  return (
    <Box
      sx={{
        pb: 5
      }}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <DashboardHeader

        user={
          user
        }

        onRefresh={() =>
          loadDashboard(true)
        }

        refreshing={
          refreshing
        }

      />


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (

        <Alert
          severity="warning"
          sx={{
            mb: 2,
            borderRadius: 3
          }}
          action={

            <Button
              size="small"
              onClick={() =>
                loadDashboard(true)
              }
            >
              Retry
            </Button>

          }
        >
          Dashboard data could not
          be loaded completely.
          Showing available information.
        </Alert>

      )}


      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <Grid
        container
        spacing={2}
        sx={{
          mb: 3
        }}
      >

        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3
          }}
        >

          <DashboardKpiCard

            title="Total Employees"

            value={
              totalEmployees.toLocaleString(
                "en-IN"
              )
            }

            subtitle="Workforce size"

            icon={
              <PeopleAltOutlinedIcon />
            }

            loading={
              loading
            }

          />

        </Grid>


        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3
          }}
        >

          <DashboardKpiCard

            title="Present Today"

            value={
              todayPresent
            }

            subtitle="Today's attendance"

            icon={
              <EventAvailableOutlinedIcon />
            }

            loading={
              loading
            }

          />

        </Grid>


        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3
          }}
        >

          <DashboardKpiCard

            title="Absent Today"

            value={
              todayAbsent
            }

            subtitle="Requires attention"

            icon={
              <EventBusyOutlinedIcon />
            }

            loading={
              loading
            }

          />

        </Grid>


        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3
          }}
        >

          <DashboardKpiCard

            title="Pending Leaves"

            value={
              pendingLeaves
            }

            subtitle="Awaiting action"

            icon={
              <BeachAccessOutlinedIcon />
            }

            loading={
              loading
            }

          />

        </Grid>

      </Grid>


      {/* =====================================================
          MAIN ANALYTICS
      ===================================================== */}

      <Grid
        container
        spacing={2}
        sx={{
          mb: 3
        }}
      >

        <Grid
          size={{
            xs: 12,
            md: 7
          }}
        >

          <AttendanceOverview
            data={
              attendanceData
            }
          />

        </Grid>


        <Grid
          size={{
            xs: 12,
            md: 5
          }}
        >

          <WorkforceOverview
            data={
              workforceData
            }
          />

        </Grid>

      </Grid>


      {/* =====================================================
          SECONDARY ANALYTICS
      ===================================================== */}

      <Grid
        container
        spacing={2}
        sx={{
          mb: 3
        }}
      >

        <Grid
          size={{
            xs: 12,
            md: 4
          }}
        >

          <LeaveOverview
            data={
              leaveData
            }
          />

        </Grid>


        <Grid
          size={{
            xs: 12,
            md: 4
          }}
        >

          <PayrollOverview
            data={
              payrollData
            }
          />

        </Grid>


        <Grid
          size={{
            xs: 12,
            md: 4
          }}
        >

          <DepartmentDistribution
            departments={
              departments
            }
          />

        </Grid>

      </Grid>


      {/* =====================================================
          ACTIONS + ACTIVITY
      ===================================================== */}

      <Grid
        container
        spacing={2}
        sx={{
          mb: 3
        }}
      >

        <Grid
          size={{
            xs: 12,
            md: 6
          }}
        >

          <PendingActions
            actions={
              pendingActions
            }
          />

        </Grid>


        <Grid
          size={{
            xs: 12,
            md: 6
          }}
        >

          <RecentActivity
            activities={
              activities
            }
          />

        </Grid>

      </Grid>


      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <QuickActions
        actions={
          quickActions
        }
      />


      {/* =====================================================
          INITIAL LOADING OVERLAY
      ===================================================== */}

      {loading && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            px: 2,
            py: 1,
            borderRadius: 2,
            bgcolor: "background.paper",
            boxShadow:
              "0 8px 30px rgba(15,23,42,.12)",
            zIndex: 1200
          }}
        >

          <CircularProgress
            size={18}
          />

          <Typography
            variant="caption"
            fontWeight={750}
          >
            Loading dashboard...
          </Typography>

        </Stack>
      )}

    </Box>
  );
};


export default Dashboard;