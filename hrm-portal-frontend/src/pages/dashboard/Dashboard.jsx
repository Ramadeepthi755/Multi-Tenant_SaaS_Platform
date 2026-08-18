import {
  Alert,
  Box,
  Grid
} from "@mui/material";


import PeopleAltOutlinedIcon
  from "@mui/icons-material/PeopleAltOutlined";

import EventAvailableOutlinedIcon
  from "@mui/icons-material/EventAvailableOutlined";

import EventNoteOutlinedIcon
  from "@mui/icons-material/EventNoteOutlined";

import PaymentsOutlinedIcon
  from "@mui/icons-material/PaymentsOutlined";


import {
  useEffect,
  useState
} from "react";


import {
  useNavigate
} from "react-router-dom";


import DashboardHeader
  from "../../components/dashboard/DashboardHeader";

import StatCard
  from "../../components/dashboard/StatCard";

import AttendanceOverview
  from "../../components/dashboard/AttendanceOverview";

import LeaveOverview
  from "../../components/dashboard/LeaveOverview";

import RecentEmployees
  from "../../components/dashboard/RecentEmployees";

import PendingApprovals
  from "../../components/dashboard/PendingApprovals";

import UpcomingHolidays
  from "../../components/dashboard/UpcomingHolidays";

import WorkforceAnalytics
  from "../../components/dashboard/WorkforceAnalytics";


import dashboardService
  from "../../services/dashboardService";


import {
  getStatValue,
  normalizeDashboardData
} from "../../utils/dashboardUtils";


import PermissionGate
  from "../../components/permissions/PermissionGate";


const Dashboard = () => {

  const navigate =
    useNavigate();


  const [
    data,
    setData
  ] = useState(
    normalizeDashboardData(null)
  );


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  // ==========================================================
  // LOAD DASHBOARD
  // ==========================================================

  useEffect(() => {

    let mounted = true;


    const loadDashboard =
      async () => {

        setLoading(true);
        setError("");


        try {

          const response =
            await dashboardService
              .getDashboard();


          if (!mounted) {
            return;
          }


          setData(
            normalizeDashboardData(
              response
            )
          );


        } catch (requestError) {

          if (!mounted) {
            return;
          }


          console.error(
            "Dashboard loading failed:",
            requestError
          );


          setError(
            requestError
              ?.response
              ?.data
              ?.message ||
            "Unable to load the latest dashboard data."
          );


          setData(
            normalizeDashboardData(
              null
            )
          );


        } finally {

          if (mounted) {
            setLoading(false);
          }

        }

      };


    loadDashboard();


    return () => {

      mounted = false;

    };

  }, []);


  // ==========================================================
  // STATISTICS
  // ==========================================================

  const stats =
    data.stats || {};


  const totalEmployees =
    getStatValue(
      stats,
      [
        "totalEmployees",
        "employeeCount",
        "totalEmployee",
        "employees"
      ]
    );


  /*
   * Backend currently returns:
   *
   * todayAttendance
   *
   * normalizeDashboardData()
   * maps this to:
   *
   * stats.todayAttendance
   */

  const presentToday =
    getStatValue(
      stats,
      [
        "todayAttendance",
        "presentToday",
        "todayPresent",
        "presentEmployees",
        "attendanceToday"
      ]
    );


  /*
   * Backend currently returns:
   *
   * todayLeaves
   */

  const onLeave =
    getStatValue(
      stats,
      [
        "todayLeaves",
        "onLeave",
        "todayLeave",
        "employeesOnLeave",
        "leaveToday"
      ]
    );


  /*
   * Backend currently does not return
   * pending leave count.
   *
   * Therefore this safely remains 0
   * until the backend provides that field.
   */

  const pendingLeave =
    getStatValue(
      stats,
      [
        "pendingLeave",
        "pendingLeaves",
        "pendingLeaveRequests"
      ]
    );


  return (
    <Box
      sx={{
        pb: 5
      }}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <DashboardHeader />


      {/* =====================================================
          API WARNING
      ===================================================== */}

      {error && (

        <Alert
          severity="warning"
          sx={{
            mb: 3,
            borderRadius: 2
          }}
        >
          {error}
        </Alert>

      )}


      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <Grid
        container
        spacing={2}
        sx={{
          mb: 2
        }}
      >

        {/* ====================================================
            TOTAL EMPLOYEES
        ==================================================== */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3
          }}
        >

          <PermissionGate
            permission="EMPLOYEE_READ"
          >

            <StatCard
              title="Total Employees"
              value={
                loading
                  ? "—"
                  : totalEmployees
              }
              subtitle="Active workforce"
              icon={
                PeopleAltOutlinedIcon
              }
              onClick={() =>
                navigate(
                  "/employees"
                )
              }
            />

          </PermissionGate>

        </Grid>


        {/* ====================================================
            PRESENT TODAY
        ==================================================== */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3
          }}
        >

          <PermissionGate
            permission="ATTENDANCE_READ"
          >

            <StatCard
              title="Present Today"
              value={
                loading
                  ? "—"
                  : presentToday
              }
              subtitle="Today's attendance"
              icon={
                EventAvailableOutlinedIcon
              }
              onClick={() =>
                navigate(
                  "/attendance"
                )
              }
            />

          </PermissionGate>

        </Grid>


        {/* ====================================================
            ON LEAVE
        ==================================================== */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3
          }}
        >

          <PermissionGate
            permission="LEAVE_READ"
          >

            <StatCard
              title="On Leave"
              value={
                loading
                  ? "—"
                  : onLeave
              }
              subtitle="Employees away today"
              icon={
                EventNoteOutlinedIcon
              }
              onClick={() =>
                navigate(
                  "/leave"
                )
              }
            />

          </PermissionGate>

        </Grid>


        {/* ====================================================
            PENDING ACTIONS
        ==================================================== */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3
          }}
        >

          <PermissionGate
            permissions={[
              "LEAVE_READ",
              "PAYROLL_READ"
            ]}
            mode="any"
          >

            <StatCard
              title="Pending Actions"
              value={
                loading
                  ? "—"
                  : pendingLeave
              }
              subtitle="Needs your attention"
              icon={
                PaymentsOutlinedIcon
              }
              onClick={() =>
                navigate(
                  "/leave"
                )
              }
            />

          </PermissionGate>

        </Grid>

      </Grid>


      {/* =====================================================
          ATTENDANCE + LEAVE
      ===================================================== */}

      <Grid
        container
        spacing={2}
        sx={{
          mb: 2
        }}
      >

        <Grid
          size={{
            xs: 12,
            lg: 7
          }}
        >

          <PermissionGate
            permission="ATTENDANCE_READ"
          >

            <AttendanceOverview
              data={
                data.attendance
              }
            />

          </PermissionGate>

        </Grid>


        <Grid
          size={{
            xs: 12,
            lg: 5
          }}
        >

          <PermissionGate
            permission="LEAVE_READ"
          >

            <LeaveOverview
              data={
                data.leave
              }
            />

          </PermissionGate>

        </Grid>

      </Grid>


      {/* =====================================================
          PEOPLE + APPROVALS
      ===================================================== */}

      <Grid
        container
        spacing={2}
        sx={{
          mb: 2
        }}
      >

        <Grid
          size={{
            xs: 12,
            lg: 6
          }}
        >

          <PermissionGate
            permission="EMPLOYEE_READ"
          >

            <RecentEmployees
              employees={
                data.employees
              }
            />

          </PermissionGate>

        </Grid>


        <Grid
          size={{
            xs: 12,
            lg: 6
          }}
        >

          <PermissionGate
            permissions={[
              "LEAVE_APPROVE",
              "LEAVE_REJECT"
            ]}
            mode="any"
          >

            <PendingApprovals
              approvals={
                data.approvals
              }
              onViewAll={() =>
                navigate(
                  "/leave"
                )
              }
            />

          </PermissionGate>

        </Grid>

      </Grid>


      {/* =====================================================
          HOLIDAYS + WORKFORCE ANALYTICS
      ===================================================== */}

      <Grid
        container
        spacing={2}
      >

        {/* ====================================================
            UPCOMING HOLIDAYS
        ==================================================== */}

        <Grid
          size={{
            xs: 12,
            lg: 5
          }}
        >

          <PermissionGate
            permission="HOLIDAY_READ"
          >

            <UpcomingHolidays
              holidays={
                data.holidays
              }
            />

          </PermissionGate>

        </Grid>


        {/* ====================================================
            ANALYTICS
        ==================================================== */}

        <Grid
          size={{
            xs: 12,
            lg: 7
          }}
        >

          <PermissionGate
            permission="DASHBOARD_VIEW"
          >

            <WorkforceAnalytics
              data={
                data
              }
            />

          </PermissionGate>

        </Grid>

      </Grid>

    </Box>
  );
};


export default Dashboard;