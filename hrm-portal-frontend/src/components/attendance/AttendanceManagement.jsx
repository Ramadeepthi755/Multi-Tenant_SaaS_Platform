import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Pagination,
  Paper,
  Snackbar,
  Stack,
  Typography
} from "@mui/material";


import CheckCircleOutlineOutlinedIcon
  from "@mui/icons-material/CheckCircleOutlineOutlined";

import CancelOutlinedIcon
  from "@mui/icons-material/CancelOutlined";

import ScheduleOutlinedIcon
  from "@mui/icons-material/ScheduleOutlined";

import EventAvailableOutlinedIcon
  from "@mui/icons-material/EventAvailableOutlined";


import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";


import AttendanceStatCard
  from "../../components/attendance/AttendanceStatCard";

import AttendanceFilters
  from "../../components/attendance/AttendanceFilters";

import AttendanceTable
  from "../../components/attendance/AttendanceTable";

import AttendanceDetailsDialog
  from "../../components/attendance/AttendanceDetailsDialog";


import attendanceService
  from "../../services/attendanceService";


import {
  getTodayDateString,
  getAttendanceErrorMessage,
  normalizeAttendanceResponse,
  normalizeAttendanceSummary
} from "../../utils/attendanceUtils";


const AttendanceManagement = () => {

  // ==========================================================
  // DATA
  // ==========================================================

  const [
    attendance,
    setAttendance
  ] = useState([]);


  const [
    departments,
    setDepartments
  ] = useState([]);


  const [
    summary,
    setSummary
  ] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    onLeave: 0
  });


  // ==========================================================
  // LOADING
  // ==========================================================

  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    summaryLoading,
    setSummaryLoading
  ] = useState(false);


  // ==========================================================
  // ERROR
  // ==========================================================

  const [
    error,
    setError
  ] = useState("");


  // ==========================================================
  // FILTERS
  // ==========================================================

  const [
    date,
    setDate
  ] = useState(
    getTodayDateString()
  );


  const [
    searchInput,
    setSearchInput
  ] = useState("");


  const [
    search,
    setSearch
  ] = useState("");


  const [
    status,
    setStatus
  ] = useState("");


  const [
    departmentId,
    setDepartmentId
  ] = useState("");


  // ==========================================================
  // PAGINATION
  // ==========================================================

  const [
    page,
    setPage
  ] = useState(0);


  const [
    totalPages,
    setTotalPages
  ] = useState(1);


  const [
    totalElements,
    setTotalElements
  ] = useState(0);


  // ==========================================================
  // DETAILS
  // ==========================================================

  const [
    selectedAttendance,
    setSelectedAttendance
  ] = useState(null);


  const [
    detailsOpen,
    setDetailsOpen
  ] = useState(false);


  // ==========================================================
  // TOAST
  // ==========================================================

  const [
    toast,
    setToast
  ] = useState({
    open: false,
    message: "",
    severity: "success"
  });


  // ==========================================================
  // PERMISSIONS
  // ==========================================================

  const permissions =
    useMemo(() => {

      try {

        const storedUser =
          localStorage.getItem(
            "user"
          );

        if (!storedUser) {
          return [];
        }

        const user =
          JSON.parse(
            storedUser
          );

        return Array.isArray(
          user?.permissions
        )
          ? user.permissions
          : [];

      } catch (permissionError) {

        console.error(
          "Unable to read permissions:",
          permissionError
        );

        return [];
      }

    }, []);


  const canRead =
    permissions.includes(
      "ATTENDANCE_READ"
    );


  // ==========================================================
  // LOAD ATTENDANCE
  // ==========================================================

  const loadAttendance =
    useCallback(
      async () => {

        if (!canRead) {

          setLoading(false);

          setError(
            "You do not have permission to view attendance."
          );

          return;
        }


        setLoading(true);

        setError("");


        try {

          const response =
            await attendanceService
              .getAttendance({

                date,

                search,

                status,

                departmentId,

                page,

                size: 20

              });


          const normalized =
            normalizeAttendanceResponse(
              response
            );


          setAttendance(
            normalized.content
          );


          setTotalPages(
            normalized.totalPages
          );


          setTotalElements(
            normalized.totalElements
          );

        } catch (requestError) {

          console.error(
            "Attendance loading failed:",
            requestError
          );


          setAttendance([]);

          setTotalPages(1);

          setTotalElements(0);


          setError(
            getAttendanceErrorMessage(
              requestError,
              "Unable to load attendance records."
            )
          );

        } finally {

          setLoading(false);

        }

      },
      [
        canRead,
        date,
        search,
        status,
        departmentId,
        page
      ]
    );


  // ==========================================================
  // LOAD SUMMARY
  // ==========================================================

  const loadSummary =
    useCallback(
      async () => {

        if (!canRead) {
          return;
        }


        setSummaryLoading(
          true
        );


        try {

          const response =
            await attendanceService
              .getAttendanceSummary({
                date
              });


          setSummary(
            normalizeAttendanceSummary(
              response
            )
          );

        } catch (requestError) {

          /*
           * Summary failure should NOT break
           * the attendance table.
           */

          console.warn(
            "Attendance summary unavailable:",
            requestError
          );

        } finally {

          setSummaryLoading(
            false
          );

        }

      },
      [
        canRead,
        date
      ]
    );


  // ==========================================================
  // LOAD DEPARTMENTS
  // ==========================================================

  const loadDepartments =
    useCallback(
      async () => {

        try {

          /*
           * Existing backend company/department API.
           * We intentionally keep this isolated so if the
           * department API changes, only this function changes.
           */

          const response =
            await attendanceService
              .getAttendance({
                date,
                page: 0,
                size: 1000
              });


          const records =
            normalizeAttendanceResponse(
              response
            ).content;


          const map =
            new Map();


          records.forEach(
            record => {

              if (
                record.department &&
                !map.has(
                  record.department
                )
              ) {

                map.set(
                  record.department,
                  {
                    id:
                      record.department,
                    departmentName:
                      record.department
                  }
                );

              }

            }
          );


          setDepartments(
            Array.from(
              map.values()
            )
          );

        } catch (requestError) {

          /*
           * Department filter is optional.
           * Don't break the whole page if it isn't available.
           */

          console.warn(
            "Department filter unavailable:",
            requestError
          );

        }

      },
      [
        date
      ]
    );


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {

    loadAttendance();

  }, [
    loadAttendance
  ]);


  useEffect(() => {

    loadSummary();

  }, [
    loadSummary
  ]);


  useEffect(() => {

    loadDepartments();

  }, [
    loadDepartments
  ]);


  // ==========================================================
  // FILTER SEARCH
  // ==========================================================

  const handleSearch = () => {

    setPage(0);

    setSearch(
      searchInput.trim()
    );
  };


  // ==========================================================
  // CLEAR
  // ==========================================================

  const handleClear = () => {

    setDate(
      getTodayDateString()
    );

    setSearchInput("");

    setSearch("");

    setStatus("");

    setDepartmentId("");

    setPage(0);
  };


  // ==========================================================
  // DATE
  // ==========================================================

  const handleDateChange = (
    value
  ) => {

    setDate(value);

    setPage(0);
  };


  // ==========================================================
  // STATUS
  // ==========================================================

  const handleStatusChange = (
    value
  ) => {

    setStatus(value);

    setPage(0);
  };


  // ==========================================================
  // DEPARTMENT
  // ==========================================================

  const handleDepartmentChange = (
    value
  ) => {

    setDepartmentId(value);

    setPage(0);
  };


  // ==========================================================
  // REFRESH
  // ==========================================================

  const handleRefresh = async () => {

    await Promise.all([
      loadAttendance(),
      loadSummary()
    ]);

    setToast({
      open: true,
      message:
        "Attendance data refreshed.",
      severity:
        "success"
    });
  };


  // ==========================================================
  // VIEW
  // ==========================================================

  const handleView = (
    record
  ) => {

    setSelectedAttendance(
      record
    );

    setDetailsOpen(
      true
    );
  };


  // ==========================================================
  // PAGINATION
  // ==========================================================

  const handlePageChange = (
    event,
    value
  ) => {

    setPage(
      value - 1
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  // ==========================================================
  // FILTER STATE
  // ==========================================================

  const hasFilters =
    Boolean(
      search ||
      status ||
      departmentId ||
      date !==
        getTodayDateString()
    );


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <Box
      sx={{
        pb: 5
      }}
    >

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <Stack
        direction={{
          xs: "column",
          md: "row"
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          md: "center"
        }}
        spacing={2}
        sx={{
          mb: 3
        }}
      >

        <Box>

          <Typography
            variant="h4"
            fontWeight={900}
            sx={{
              letterSpacing: "-.04em"
            }}
          >
            Attendance
          </Typography>


          <Typography
            color="text.secondary"
            sx={{
              mt: .5
            }}
          >
            Monitor employee attendance,
            working hours and daily presence.
          </Typography>

        </Box>

      </Stack>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 3
          }}
          action={

            <Button
              size="small"
              onClick={
                loadAttendance
              }
            >
              Retry
            </Button>

          }
        >
          {error}
        </Alert>

      )}


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)"
          },
          gap: 2,
          mb: 2
        }}
      >

        <AttendanceStatCard
          title="Present"
          value={
            summaryLoading
              ? "..."
              : summary.present
          }
          subtitle="Employees present today"
          icon={
            CheckCircleOutlineOutlinedIcon
          }
          color="success"
        />


        <AttendanceStatCard
          title="Absent"
          value={
            summaryLoading
              ? "..."
              : summary.absent
          }
          subtitle="Employees absent today"
          icon={
            CancelOutlinedIcon
          }
          color="error"
        />


        <AttendanceStatCard
          title="Late"
          value={
            summaryLoading
              ? "..."
              : summary.late
          }
          subtitle="Late arrivals"
          icon={
            ScheduleOutlinedIcon
          }
          color="warning"
        />


        <AttendanceStatCard
          title="On Leave"
          value={
            summaryLoading
              ? "..."
              : summary.onLeave
          }
          subtitle="Employees on approved leave"
          icon={
            EventAvailableOutlinedIcon
          }
          color="info"
        />

      </Box>


      {/* =====================================================
          FILTERS
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider"
        }}
      >

        <AttendanceFilters
          date={
            date
          }
          searchInput={
            searchInput
          }
          status={
            status
          }
          departmentId={
            departmentId
          }
          departments={
            departments
          }
          onDateChange={
            handleDateChange
          }
          onSearchChange={
            setSearchInput
          }
          onStatusChange={
            handleStatusChange
          }
          onDepartmentChange={
            handleDepartmentChange
          }
          onSearch={
            handleSearch
          }
          onClear={
            handleClear
          }
          onRefresh={
            handleRefresh
          }
          hasFilters={
            hasFilters
          }
          loading={
            loading
          }
        />

      </Paper>


      {/* =====================================================
          RESULT COUNT
      ===================================================== */}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          mb: 1.5
        }}
      >

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {loading
            ? "Loading attendance..."
            : `${totalElements} record${
                totalElements === 1
                  ? ""
                  : "s"
              } found`}
        </Typography>


        {date && (

          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={750}
          >
            Selected date: {date}
          </Typography>

        )}

      </Stack>


      {/* =====================================================
          TABLE
      ===================================================== */}

      <Box
        sx={{
          position: "relative"
        }}
      >

        {loading && (

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              pt: 8,
              bgcolor:
                "rgba(255,255,255,.55)",
              backdropFilter:
                "blur(2px)"
            }}
          >

            <CircularProgress />

          </Box>

        )}


        <AttendanceTable
          attendance={
            attendance
          }
          onView={
            handleView
          }
        />

      </Box>


      {/* =====================================================
          PAGINATION
      ===================================================== */}

      {totalPages > 1 && (

        <Stack
          alignItems="center"
          sx={{
            mt: 3
          }}
        >

          <Pagination
            count={
              totalPages
            }
            page={
              page + 1
            }
            onChange={
              handlePageChange
            }
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />

        </Stack>

      )}


      {/* =====================================================
          DETAILS DIALOG
      ===================================================== */}

      <AttendanceDetailsDialog
        open={
          detailsOpen
        }
        attendance={
          selectedAttendance
        }
        onClose={() => {

          setDetailsOpen(
            false
          );

          setSelectedAttendance(
            null
          );

        }}
      />


      {/* =====================================================
          TOAST
      ===================================================== */}

      <Snackbar
        open={
          toast.open
        }
        autoHideDuration={
          3500
        }
        onClose={() =>
          setToast(
            previous => ({
              ...previous,
              open: false
            })
          )
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
      >

        <Alert
          severity={
            toast.severity
          }
          variant="filled"
          onClose={() =>
            setToast(
              previous => ({
                ...previous,
                open: false
              })
            )
          }
          sx={{
            width: "100%"
          }}
        >
          {
            toast.message
          }
        </Alert>

      </Snackbar>

    </Box>
  );
};


export default AttendanceManagement;