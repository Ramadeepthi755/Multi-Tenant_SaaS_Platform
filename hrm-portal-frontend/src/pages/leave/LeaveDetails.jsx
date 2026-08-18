import {
  useEffect,
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
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import leaveService from "../../services/leaveService";

import PermissionGate from "../../components/auth/PermissionGate";

import {
  PERMISSIONS,
} from "../../config/permissions";

function LeaveDetails() {
  const navigate = useNavigate();

  const { leaveId } =
    useParams();

  const [leave, setLeave] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD
  |--------------------------------------------------------------------------
  */

  const loadLeave = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await leaveService.getLeaveById(
          leaveId
        );

      setLeave(data);
    } catch (err) {
      console.error(
        "Failed to load leave:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load leave details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (leaveId) {
      loadLeave();
    }
  }, [leaveId]);

  /*
  |--------------------------------------------------------------------------
  | HELPERS
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
  | APPROVE
  |--------------------------------------------------------------------------
  */

  const handleApprove = async () => {
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

      const data =
        await leaveService.approveLeave(
          leaveId
        );

      setLeave(data);

      setSuccess(
        "Leave approved successfully."
      );
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

  const handleReject = async () => {
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

      const data =
        await leaveService.rejectLeave(
          leaveId
        );

      setLeave(data);

      setSuccess(
        "Leave rejected successfully."
      );
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
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | ERROR / NOT FOUND
  |--------------------------------------------------------------------------
  */

  if (!leave) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error ||
            "Leave request not found."}
        </Alert>

        <Button
          sx={{ mt: 2 }}
          startIcon={
            <ArrowBackRoundedIcon />
          }
          onClick={() =>
            navigate("/leave")
          }
        >
          Back to Leave
        </Button>
      </Box>
    );
  }

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
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
        >
          <Button
            startIcon={
              <ArrowBackRoundedIcon />
            }
            onClick={() =>
              navigate("/leave")
            }
          >
            Back
          </Button>

          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
            >
              Leave Details
            </Typography>

            <Typography color="text.secondary">
              View leave request information.
            </Typography>
          </Box>
        </Stack>

        {leave.status ===
          "PENDING" && (
          <PermissionGate
            permission={
              PERMISSIONS.LEAVE_APPLY
            }
          >
            <Button
              variant="outlined"
              startIcon={
                <EditRoundedIcon />
              }
              onClick={() =>
                navigate(
                  `/leave/${leave.leaveId}/edit`
                )
              }
            >
              Edit Leave
            </Button>
          </PermissionGate>
        )}
      </Stack>

      {/* ALERTS */}

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

      {/* MAIN CARD */}

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* TITLE */}

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight={800}
              >
                {formatLeaveType(
                  leave.leaveType
                )}
              </Typography>

              <Typography
                color="text.secondary"
              >
                Leave Request #
                {leave.leaveId}
              </Typography>
            </Box>

            <Chip
              label={
                leave.status ||
                "UNKNOWN"
              }
              color={getStatusColor(
                leave.status
              )}
            />
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* INFORMATION */}

          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              sm={6}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Employee
              </Typography>

              <Typography
                fontWeight={700}
                mt={0.5}
              >
                {leave.employeeName ||
                  "-"}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Employee ID
              </Typography>

              <Typography
                fontWeight={700}
                mt={0.5}
              >
                {leave.employeeId ??
                  "-"}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Leave Type
              </Typography>

              <Typography
                fontWeight={700}
                mt={0.5}
              >
                {formatLeaveType(
                  leave.leaveType
                )}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Status
              </Typography>

              <Box mt={0.5}>
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
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Start Date
              </Typography>

              <Typography
                fontWeight={700}
                mt={0.5}
              >
                {leave.startDate ||
                  "-"}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                End Date
              </Typography>

              <Typography
                fontWeight={700}
                mt={0.5}
              >
                {leave.endDate ||
                  "-"}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Reason
              </Typography>

              <Typography
                fontWeight={600}
                mt={0.5}
                sx={{
                  whiteSpace:
                    "pre-wrap",
                }}
              >
                {leave.reason ||
                  "-"}
              </Typography>
            </Grid>
          </Grid>

          {/* ACTIONS */}

          {leave.status ===
            "PENDING" && (
            <>
              <Divider
                sx={{
                  my: 3,
                }}
              />

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={2}
              >
                <PermissionGate
                  permission={
                    PERMISSIONS.LEAVE_APPROVE
                  }
                >
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={
                      <CheckCircleRoundedIcon />
                    }
                    disabled={
                      actionLoading
                    }
                    onClick={
                      handleApprove
                    }
                  >
                    Approve Leave
                  </Button>
                </PermissionGate>

                <PermissionGate
                  permission={
                    PERMISSIONS.LEAVE_REJECT
                  }
                >
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={
                      <CancelRoundedIcon />
                    }
                    disabled={
                      actionLoading
                    }
                    onClick={
                      handleReject
                    }
                  >
                    Reject Leave
                  </Button>
                </PermissionGate>
              </Stack>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default LeaveDetails;