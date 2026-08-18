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
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import {
  useNavigate,
} from "react-router-dom";

import leaveService from "../../services/leaveService";

import PermissionGate from "../../components/auth/PermissionGate";

import {
  PERMISSIONS,
} from "../../config/permissions";

function LeaveList() {
  const navigate = useNavigate();

  const [leaves, setLeaves] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  /*
  |--------------------------------------------------------------------------
  | LOAD LEAVES
  |--------------------------------------------------------------------------
  */

  const loadLeaves = async () => {
    try {
      setLoading(true);
      setError("");

      let data;

      if (
        statusFilter &&
        statusFilter !== "ALL"
      ) {
        data =
          await leaveService.getLeavesByStatus(
            statusFilter
          );
      } else {
        data =
          await leaveService.getLeaves();
      }

      const list =
        Array.isArray(data)
          ? data
          : data?.content || [];

      setLeaves(list);
    } catch (err) {
      console.error(
        "Failed to load leaves:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load leave requests."
      );

      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, [statusFilter]);

  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  const filteredLeaves = useMemo(() => {
    const keyword =
      search
        .trim()
        .toLowerCase();

    if (!keyword) {
      return leaves;
    }

    return leaves.filter(
      (leave) =>
        String(
          leave.employeeName || ""
        )
          .toLowerCase()
          .includes(keyword) ||

        String(
          leave.leaveType || ""
        )
          .toLowerCase()
          .includes(keyword) ||

        String(
          leave.reason || ""
        )
          .toLowerCase()
          .includes(keyword) ||

        String(
          leave.status || ""
        )
          .toLowerCase()
          .includes(keyword)
    );
  }, [leaves, search]);

  /*
  |--------------------------------------------------------------------------
  | STATUS CHIP
  |--------------------------------------------------------------------------
  */

  const getStatusColor = (
    status
  ) => {
    switch (status) {
      case "APPROVED":
        return "success";

      case "REJECTED":
        return "error";

      case "PENDING":
        return "warning";

      default:
        return "default";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LEAVE TYPE LABEL
  |--------------------------------------------------------------------------
  */

  const formatLeaveType = (
    value
  ) => {
    if (!value) {
      return "-";
    }

    return value
      .replaceAll("_", " ")
      .replace(
        /\b\w/g,
        (char) =>
          char.toUpperCase()
      );
  };

  /*
  |--------------------------------------------------------------------------
  | APPROVE
  |--------------------------------------------------------------------------
  */

  const handleApprove = async (
    leaveId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to approve this leave?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await leaveService.approveLeave(
        leaveId
      );

      setSuccess(
        "Leave approved successfully."
      );

      await loadLeaves();
    } catch (err) {
      console.error(
        "Approve leave error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to approve leave."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | REJECT
  |--------------------------------------------------------------------------
  */

  const handleReject = async (
    leaveId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to reject this leave?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await leaveService.rejectLeave(
        leaveId
      );

      setSuccess(
        "Leave rejected successfully."
      );

      await loadLeaves();
    } catch (err) {
      console.error(
        "Reject leave error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to reject leave."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          md: 3,
        },
      }}
    >
      {/* HEADER */}

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
            Leave History
          </Typography>

          <Typography color="text.secondary">
            View and manage employee leave requests.
          </Typography>
        </Box>

        <PermissionGate
          permission={
            PERMISSIONS.LEAVE_APPLY
          }
        >
          <Button
            variant="contained"
            startIcon={
              <AddRoundedIcon />
            }
            onClick={() =>
              navigate(
                "/leave/new"
              )
            }
          >
            Apply Leave
          </Button>
        </PermissionGate>
      </Stack>

      {/* ERROR */}

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

      {/* SUCCESS */}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() =>
            setSuccess("")
          }
        >
          {success}
        </Alert>
      )}

      {/* FILTER CARD */}

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
          mb: 3,
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
              placeholder="Search employee, leave type, reason..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl
              sx={{
                minWidth: 180,
              }}
            >
              <InputLabel>
                Status
              </InputLabel>

              <Select
                value={statusFilter}
                label="Status"
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >
                <MenuItem value="ALL">
                  All Status
                </MenuItem>

                <MenuItem value="PENDING">
                  Pending
                </MenuItem>

                <MenuItem value="APPROVED">
                  Approved
                </MenuItem>

                <MenuItem value="REJECTED">
                  Rejected
                </MenuItem>
              </Select>
            </FormControl>

            <Tooltip title="Refresh">
              <IconButton
                onClick={loadLeaves}
                disabled={
                  loading ||
                  actionLoading
                }
                sx={{
                  border: "1px solid",
                  borderColor:
                    "divider",
                  borderRadius: 2,
                }}
              >
                <RefreshRoundedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </CardContent>
      </Card>

      {/* TABLE */}

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
                  Leave Type
                </TableCell>

                <TableCell>
                  Start Date
                </TableCell>

                <TableCell>
                  End Date
                </TableCell>

                <TableCell>
                  Status
                </TableCell>

                <TableCell>
                  Reason
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
                    sx={{
                      py: 8,
                    }}
                  >
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredLeaves.length ===
                0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{
                      py: 8,
                    }}
                  >
                    <Typography
                      fontWeight={700}
                    >
                      No leave requests found
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      Try changing your search or filter.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeaves.map(
                  (leave) => (
                    <TableRow
                      key={
                        leave.leaveId
                      }
                      hover
                    >
                      <TableCell>
                        <Typography
                          fontWeight={700}
                        >
                          {leave.employeeName ||
                            "-"}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          ID:{" "}
                          {leave.employeeId ??
                            "-"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {formatLeaveType(
                          leave.leaveType
                        )}
                      </TableCell>

                      <TableCell>
                        {leave.startDate ||
                          "-"}
                      </TableCell>

                      <TableCell>
                        {leave.endDate ||
                          "-"}
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={
                            leave.status ||
                            "UNKNOWN"
                          }
                          color={getStatusColor(
                            leave.status
                          )}
                        />
                      </TableCell>

                      <TableCell
                        sx={{
                          maxWidth: 260,
                        }}
                      >
                        <Typography
                          noWrap
                        >
                          {leave.reason ||
                            "-"}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Stack
                          direction="row"
                          justifyContent="flex-end"
                          spacing={0.5}
                        >
                          {/* VIEW */}

                          <Tooltip title="View">
                            <IconButton
                              color="primary"
                              onClick={() =>
                                navigate(
                                  `/leave/${leave.leaveId}`
                                )
                              }
                            >
                              <VisibilityRoundedIcon />
                            </IconButton>
                          </Tooltip>

                          {/* EDIT */}

                          {leave.status ===
                            "PENDING" && (
                            <PermissionGate
                              permission={
                                PERMISSIONS.LEAVE_APPLY
                              }
                            >
                              <Tooltip title="Edit">
                                <IconButton
                                  color="warning"
                                  onClick={() =>
                                    navigate(
                                      `/leave/${leave.leaveId}/edit`
                                    )
                                  }
                                >
                                  <EditRoundedIcon />
                                </IconButton>
                              </Tooltip>
                            </PermissionGate>
                          )}

                          {/* APPROVE */}

                          {leave.status ===
                            "PENDING" && (
                            <PermissionGate
                              permission={
                                PERMISSIONS.LEAVE_APPROVE
                              }
                            >
                              <Tooltip title="Approve">
                                <span>
                                  <IconButton
                                    color="success"
                                    disabled={
                                      actionLoading
                                    }
                                    onClick={() =>
                                      handleApprove(
                                        leave.leaveId
                                      )
                                    }
                                  >
                                    <CheckCircleRoundedIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </PermissionGate>
                          )}

                          {/* REJECT */}

                          {leave.status ===
                            "PENDING" && (
                            <PermissionGate
                              permission={
                                PERMISSIONS.LEAVE_REJECT
                              }
                            >
                              <Tooltip title="Reject">
                                <span>
                                  <IconButton
                                    color="error"
                                    disabled={
                                      actionLoading
                                    }
                                    onClick={() =>
                                      handleReject(
                                        leave.leaveId
                                      )
                                    }
                                  >
                                    <CancelRoundedIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </PermissionGate>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}

export default LeaveList;