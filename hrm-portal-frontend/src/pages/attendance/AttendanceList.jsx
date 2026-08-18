import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import {
  useNavigate,
} from "react-router-dom";

import attendanceService from "../../services/attendanceService";

import PermissionGate from "../../components/auth/PermissionGate";

import {
  PERMISSIONS,
} from "../../config/permissions";

function AttendanceList() {
  const navigate = useNavigate();

  const [attendance, setAttendance] =
    useState([]);

  const [employees, setEmployees] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [employeeFilter, setEmployeeFilter] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [page, setPage] =
    useState(0);

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  // =========================================================
  // LOAD ATTENDANCE
  // =========================================================

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (fromDate) {
        params.fromDate = fromDate;
      }

      if (toDate) {
        params.toDate = toDate;
      }

      if (employeeFilter) {
        params.employeeId =
          employeeFilter;
      }

      if (statusFilter) {
        params.status =
          statusFilter;
      }

      const data =
        await attendanceService.getAttendance(
          params
        );

      const list =
        Array.isArray(data)
          ? data
          : data?.content || [];

      setAttendance(list);
    } catch (err) {
      console.error(
        "Failed to load attendance:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load attendance."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD EMPLOYEES
  // =========================================================

  const loadEmployees = async () => {
    try {
      const data =
        await attendanceService.getEmployees();

      const list =
        Array.isArray(data)
          ? data
          : data?.content || [];

      setEmployees(list);
    } catch (err) {
      console.error(
        "Failed to load employees:",
        err
      );
    }
  };

  // =========================================================
  // INITIAL
  // =========================================================

  useEffect(() => {
    loadAttendance();
    loadEmployees();
  }, []);

  // =========================================================
  // APPLY FILTERS
  // =========================================================

  const applyFilters = () => {
    setPage(0);
    loadAttendance();
  };

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setEmployeeFilter("");
    setStatusFilter("");
    setFromDate("");
    setToDate("");
    setPage(0);

    setTimeout(() => {
      loadAttendance();
    }, 0);
  };

  // =========================================================
  // NORMALIZE
  // =========================================================

  const getStatus = (item) =>
    String(
      item?.status ||
        item?.attendanceStatus ||
        ""
    ).toUpperCase();

  const getEmployeeName = (
    item
  ) => {
    return (
      item?.employeeName ||
      item?.employee?.fullName ||
      item?.employee?.name ||
      `${item?.employee?.firstName || ""} ${
        item?.employee?.lastName || ""
      }`.trim() ||
      "-"
    );
  };

  const getEmployeeCode = (
    item
  ) => {
    return (
      item?.employeeCode ||
      item?.employee?.employeeCode ||
      "-"
    );
  };

  const getDate = (item) => {
    return (
      item?.attendanceDate ||
      item?.date ||
      item?.workDate ||
      "-"
    );
  };

  // =========================================================
  // CLIENT SEARCH
  // =========================================================

  const filteredAttendance =
    useMemo(() => {
      const keyword =
        search.trim().toLowerCase();

      if (!keyword) {
        return attendance;
      }

      return attendance.filter(
        (item) => {
          const name =
            getEmployeeName(
              item
            ).toLowerCase();

          const code =
            getEmployeeCode(
              item
            ).toLowerCase();

          return (
            name.includes(keyword) ||
            code.includes(keyword)
          );
        }
      );
    },
    [attendance, search]
  );

  // =========================================================
  // PAGINATION
  // =========================================================

  const paginatedAttendance =
    filteredAttendance.slice(
      page * rowsPerPage,
      page * rowsPerPage +
        rowsPerPage
    );

  // =========================================================
  // STATUS COLOR
  // =========================================================

  const statusColor = (
    status
  ) => {
    switch (status) {
      case "PRESENT":
        return "success";

      case "ABSENT":
        return "error";

      case "LATE":
        return "warning";

      case "HALF_DAY":
      case "HALFDAY":
      case "HALF-DAY":
        return "info";

      default:
        return "default";
    }
  };

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          md: 3,
        },
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={800}
          >
            Attendance
          </Typography>

          <Typography color="text.secondary">
            View and manage employee attendance.
          </Typography>
        </Box>

        <PermissionGate
          permission={
            PERMISSIONS.ATTENDANCE_MARK
          }
        >
          <Button
            variant="contained"
            startIcon={
              <AddRoundedIcon />
            }
            onClick={() =>
              navigate(
                "/attendance/new"
              )
            }
          >
            Mark Attendance
          </Button>
        </PermissionGate>
      </Stack>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() =>
            setError("")
          }
        >
          {error}
        </Alert>
      )}

      {/* =====================================================
          FILTER CARD
      ===================================================== */}

      <Card
        sx={{
          mb: 2,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <CardContent>
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={2}
          >
            <TextField
              fullWidth
              label="Search"
              placeholder="Employee name or code"
              value={search}
              onChange={(event) => {
                setSearch(
                  event.target.value
                );
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <SearchRoundedIcon
                    sx={{
                      mr: 1,
                      color:
                        "text.secondary",
                    }}
                  />
                ),
              }}
            />

            <Select
              fullWidth
              displayEmpty
              value={employeeFilter}
              onChange={(event) =>
                setEmployeeFilter(
                  event.target.value
                )
              }
            >
              <MenuItem value="">
                All Employees
              </MenuItem>

              {employees.map(
                (employee) => (
                  <MenuItem
                    key={
                      employee.employeeId
                    }
                    value={
                      employee.employeeId
                    }
                  >
                    {employee.fullName ||
                      `${employee.firstName || ""} ${
                        employee.lastName || ""
                      }`.trim() ||
                      employee.employeeCode}
                  </MenuItem>
                )
              )}
            </Select>

            <Select
              fullWidth
              displayEmpty
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >
              <MenuItem value="">
                All Status
              </MenuItem>

              <MenuItem value="PRESENT">
                Present
              </MenuItem>

              <MenuItem value="ABSENT">
                Absent
              </MenuItem>

              <MenuItem value="LATE">
                Late
              </MenuItem>

              <MenuItem value="HALF_DAY">
                Half-day
              </MenuItem>
            </Select>
          </Stack>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={2}
            mt={2}
            alignItems={{
              xs: "stretch",
              md: "center",
            }}
          >
            <TextField
              fullWidth
              type="date"
              label="From Date"
              value={fromDate}
              onChange={(event) =>
                setFromDate(
                  event.target.value
                )
              }
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              type="date"
              label="To Date"
              value={toDate}
              onChange={(event) =>
                setToDate(
                  event.target.value
                )
              }
              InputLabelProps={{
                shrink: true,
              }}
            />

            <Button
              variant="contained"
              onClick={
                applyFilters
              }
            >
              Apply
            </Button>

            <Button
              variant="outlined"
              onClick={
                clearFilters
              }
            >
              Clear
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Employee
                </TableCell>

                <TableCell>
                  Code
                </TableCell>

                <TableCell>
                  Date
                </TableCell>

                <TableCell>
                  Check In
                </TableCell>

                <TableCell>
                  Check Out
                </TableCell>

                <TableCell>
                  Status
                </TableCell>

                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ py: 6 }}
                  >
                    <CircularProgress />

                    <Typography
                      mt={2}
                      color="text.secondary"
                    >
                      Loading attendance...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedAttendance.length ===
                0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ py: 6 }}
                  >
                    <Typography
                      variant="h6"
                      color="text.secondary"
                    >
                      No attendance records found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedAttendance.map(
                  (item) => {
                    const status =
                      getStatus(
                        item
                      );

                    return (
                      <TableRow
                        hover
                        key={
                          item.attendanceId ||
                          item.id
                        }
                      >
                        <TableCell>
                          <Typography fontWeight={600}>
                            {getEmployeeName(
                              item
                            )}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          {
                            getEmployeeCode(
                              item
                            )
                          }
                        </TableCell>

                        <TableCell>
                          {getDate(
                            item
                          )}
                        </TableCell>

                        <TableCell>
                          {item.checkInTime ||
                            item.checkIn ||
                            "-"}
                        </TableCell>

                        <TableCell>
                          {item.checkOutTime ||
                            item.checkOut ||
                            "-"}
                        </TableCell>

                        <TableCell>
                          <Chip
                            size="small"
                            label={
                              status ||
                              "UNKNOWN"
                            }
                            color={statusColor(
                              status
                            )}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <Stack
                            direction="row"
                            justifyContent="flex-end"
                          >
                            <Tooltip title="View">
                              <IconButton
                                color="primary"
                                onClick={() =>
                                  navigate(
                                    `/attendance/${
                                      item.attendanceId ||
                                      item.id
                                    }`
                                  )
                                }
                              >
                                <VisibilityRoundedIcon />
                              </IconButton>
                            </Tooltip>

                            <PermissionGate
                              permission={
                                PERMISSIONS.ATTENDANCE_UPDATE
                              }
                            >
                              <Tooltip title="Edit">
                                <IconButton
                                  color="warning"
                                  onClick={() =>
                                    navigate(
                                      `/attendance/${
                                        item.attendanceId ||
                                        item.id
                                      }/edit`
                                    )
                                  }
                                >
                                  <EditRoundedIcon />
                                </IconButton>
                              </Tooltip>
                            </PermissionGate>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  }
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />

        <TablePagination
          component="div"
          count={
            filteredAttendance.length
          }
          page={page}
          onPageChange={(
            _event,
            newPage
          ) =>
            setPage(newPage)
          }
          rowsPerPage={
            rowsPerPage
          }
          onRowsPerPageChange={(
            event
          ) => {
            setRowsPerPage(
              Number(
                event.target.value
              )
            );

            setPage(0);
          }}
          rowsPerPageOptions={[
            5,
            10,
            20,
            50,
          ]}
        />
      </Card>
    </Box>
  );
}

export default AttendanceList;