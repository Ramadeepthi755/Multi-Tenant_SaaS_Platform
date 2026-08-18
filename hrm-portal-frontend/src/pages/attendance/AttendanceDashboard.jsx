import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";

import attendanceService from "../../services/attendanceService";

function AttendanceDashboard() {
  const [attendance, setAttendance] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================================
  // LOAD TODAY ATTENDANCE
  // =========================================================

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const today =
        new Date()
          .toISOString()
          .split("T")[0];

      const data =
        await attendanceService.getAttendance(
          {
            date: today,
          }
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
          "Failed to load attendance dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  // =========================================================
  // NORMALIZE STATUS
  // =========================================================

  const getStatus = (item) => {
    return String(
      item?.status ||
        item?.attendanceStatus ||
        ""
    ).toUpperCase();
  };

  // =========================================================
  // STATISTICS
  // =========================================================

  const statistics = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let halfDay = 0;

    attendance.forEach((item) => {
      const status =
        getStatus(item);

      if (status === "PRESENT") {
        present++;
      }

      if (status === "ABSENT") {
        absent++;
      }

      if (status === "LATE") {
        late++;
      }

      if (
        status === "HALF_DAY" ||
        status === "HALFDAY" ||
        status === "HALF-DAY"
      ) {
        halfDay++;
      }
    });

    return {
      total: attendance.length,
      present,
      absent,
      late,
      halfDay,
    };
  }, [attendance]);

  const attendanceRate =
    statistics.total > 0
      ? Math.round(
          (statistics.present /
            statistics.total) *
            100
        )
      : 0;

  // =========================================================
  // STAT CARD
  // =========================================================

  const StatCard = ({
    title,
    value,
    icon,
    color,
    subtitle,
  }) => {
    return (
      <Card
        sx={{
          height: "100%",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box>
              <Typography
                color="text.secondary"
                variant="body2"
                fontWeight={600}
              >
                {title}
              </Typography>

              <Typography
                variant="h3"
                fontWeight={800}
                mt={1}
              >
                {value}
              </Typography>

              {subtitle && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  mt={0.5}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: `${color}.lighter`,
                color: `${color}.main`,
              }}
            >
              {icon}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

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

      <Box mb={3}>
        <Typography
          variant="h4"
          fontWeight={800}
        >
          Attendance Dashboard
        </Typography>

        <Typography color="text.secondary">
          Monitor today's employee attendance.
        </Typography>
      </Box>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <Grid
        container
        spacing={2}
      >
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <StatCard
            title="Total Employees"
            value={statistics.total}
            icon={
              <PeopleRoundedIcon />
            }
            color="primary"
            subtitle="Today's records"
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <StatCard
            title="Present"
            value={statistics.present}
            icon={
              <CheckCircleRoundedIcon />
            }
            color="success"
            subtitle="Employees present"
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <StatCard
            title="Absent"
            value={statistics.absent}
            icon={
              <CancelRoundedIcon />
            }
            color="error"
            subtitle="Employees absent"
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <StatCard
            title="Late"
            value={statistics.late}
            icon={
              <ScheduleRoundedIcon />
            }
            color="warning"
            subtitle="Late arrivals"
          />
        </Grid>
      </Grid>

      {/* =====================================================
          ATTENDANCE SUMMARY
      ===================================================== */}

      <Grid
        container
        spacing={2}
        mt={0.5}
      >
        <Grid
          item
          xs={12}
          md={7}
        >
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                fontWeight={800}
              >
                Today's Attendance
              </Typography>

              <Typography
                color="text.secondary"
                variant="body2"
                mt={0.5}
              >
                Attendance distribution for today.
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Stack spacing={2.5}>
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography fontWeight={600}>
                      Present
                    </Typography>

                    <Typography fontWeight={700}>
                      {statistics.present}
                    </Typography>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={
                      statistics.total
                        ? (statistics.present /
                            statistics.total) *
                          100
                        : 0
                    }
                    color="success"
                    sx={{
                      height: 8,
                      borderRadius: 4,
                    }}
                  />
                </Box>

                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography fontWeight={600}>
                      Absent
                    </Typography>

                    <Typography fontWeight={700}>
                      {statistics.absent}
                    </Typography>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={
                      statistics.total
                        ? (statistics.absent /
                            statistics.total) *
                          100
                        : 0
                    }
                    color="error"
                    sx={{
                      height: 8,
                      borderRadius: 4,
                    }}
                  />
                </Box>

                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography fontWeight={600}>
                      Late
                    </Typography>

                    <Typography fontWeight={700}>
                      {statistics.late}
                    </Typography>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={
                      statistics.total
                        ? (statistics.late /
                            statistics.total) *
                          100
                        : 0
                    }
                    color="warning"
                    sx={{
                      height: 8,
                      borderRadius: 4,
                    }}
                  />
                </Box>

                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography fontWeight={600}>
                      Half-day
                    </Typography>

                    <Typography fontWeight={700}>
                      {statistics.halfDay}
                    </Typography>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={
                      statistics.total
                        ? (statistics.halfDay /
                            statistics.total) *
                          100
                        : 0
                    }
                    color="info"
                    sx={{
                      height: 8,
                      borderRadius: 4,
                    }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* =================================================
            RATE
        ================================================= */}

        <Grid
          item
          xs={12}
          md={5}
        >
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
              >
                <AccessTimeFilledRoundedIcon color="primary" />

                <Typography
                  variant="h6"
                  fontWeight={800}
                >
                  Attendance Rate
                </Typography>
              </Stack>

              <Typography
                variant="h2"
                fontWeight={800}
                mt={3}
              >
                {attendanceRate}%
              </Typography>

              <Typography
                color="text.secondary"
                mt={1}
              >
                Overall present percentage for today's
                attendance records.
              </Typography>

              <Chip
                sx={{ mt: 3 }}
                label={
                  attendanceRate >= 90
                    ? "Excellent"
                    : attendanceRate >= 75
                    ? "Good"
                    : "Needs Attention"
                }
                color={
                  attendanceRate >= 90
                    ? "success"
                    : attendanceRate >= 75
                    ? "primary"
                    : "warning"
                }
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AttendanceDashboard;