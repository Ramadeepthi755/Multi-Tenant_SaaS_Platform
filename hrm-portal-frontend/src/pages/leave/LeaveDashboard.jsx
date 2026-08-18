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
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

import { useNavigate } from "react-router-dom";

import leaveService from "../../services/leaveService";

import PermissionGate from "../../components/auth/PermissionGate";

import {
  PERMISSIONS,
} from "../../config/permissions";

function LeaveDashboard() {
  const navigate = useNavigate();

  const [leaves, setLeaves] =
    useState([]);

  const [balances, setBalances] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [balanceLoading, setBalanceLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [balanceError, setBalanceError] =
    useState("");

  // =========================================================
  // GET CURRENT USER
  // =========================================================

  const getCurrentUser = () => {
    try {
      const storedUser =
        localStorage.getItem(
          "user"
        );

      if (!storedUser) {
        return null;
      }

      return JSON.parse(
        storedUser
      );
    } catch (err) {
      console.error(
        "Failed to read current user:",
        err
      );

      return null;
    }
  };

  // =========================================================
  // GET EMPLOYEE ID
  // =========================================================

  const getCurrentEmployeeId = () => {
    const user =
      getCurrentUser();

    if (!user) {
      return null;
    }

    return (
      user.employeeId ||
      user.employee?.employeeId ||
      null
    );
  };

  // =========================================================
  // LOAD LEAVES
  // =========================================================

  const loadLeaves =
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await leaveService.getLeaves();

        const list =
          Array.isArray(data)
            ? data
            : data?.content ||
              data?.data ||
              [];

        setLeaves(list);
      } catch (err) {
        console.error(
          "Failed to load leaves:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            "Failed to load leave requests."
        );
      } finally {
        setLoading(false);
      }
    };

  // =========================================================
  // LOAD BALANCES
  // =========================================================

  const loadBalances =
    async () => {
      const employeeId =
        getCurrentEmployeeId();

      /*
       * IMPORTANT
       *
       * Super Admin / Company Admin
       * may not have an employeeId.
       *
       * Don't call:
       *
       * GET /leave-balances
       *
       * without employeeId because
       * backend currently returns 500.
       */

      if (!employeeId) {
        setBalances([]);
        return;
      }

      try {
        setBalanceLoading(true);
        setBalanceError("");

        const data =
          await leaveService.getLeaveBalances(
            employeeId
          );

        const list =
          Array.isArray(data)
            ? data
            : data?.content ||
              data?.data ||
              [];

        setBalances(list);
      } catch (err) {
        console.error(
          "Failed to load leave balances:",
          err
        );

        /*
         * Balance failure must NOT
         * break the entire dashboard.
         */

        setBalances([]);

        setBalanceError(
          "Leave balance is currently unavailable."
        );
      } finally {
        setBalanceLoading(false);
      }
    };

  // =========================================================
  // LOAD DASHBOARD
  // =========================================================

  useEffect(() => {
    loadLeaves();
    loadBalances();
  }, []);

  // =========================================================
  // STATUS
  // =========================================================

  const getStatus = (
    leave
  ) =>
    String(
      leave?.status ||
        leave?.leaveStatus ||
        ""
    ).toUpperCase();

  // =========================================================
  // STATISTICS
  // =========================================================

  const statistics =
    useMemo(() => {
      let pending = 0;
      let approved = 0;
      let rejected = 0;

      leaves.forEach(
        (leave) => {
          const status =
            getStatus(
              leave
            );

          if (
            status ===
            "PENDING"
          ) {
            pending++;
          }

          if (
            status ===
            "APPROVED"
          ) {
            approved++;
          }

          if (
            status ===
            "REJECTED"
          ) {
            rejected++;
          }
        }
      );

      return {
        total: leaves.length,
        pending,
        approved,
        rejected,
      };
    }, [leaves]);

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
            Leave Management
          </Typography>

          <Typography color="text.secondary">
            Manage leave requests and employee leave balances.
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

      {/* =====================================================
          MAIN ERROR
      ===================================================== */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() =>
            setError("")
          }
        >
          {error}
        </Alert>
      )}

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <Grid
        container
        spacing={2}
      >
        {/* TOTAL */}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor:
                "divider",
              boxShadow:
                "none",
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Total Requests
                  </Typography>

                  <Typography
                    variant="h3"
                    fontWeight={800}
                    mt={1}
                  >
                    {
                      statistics.total
                    }
                  </Typography>
                </Box>

                <EventAvailableRoundedIcon
                  color="primary"
                  sx={{
                    fontSize: 42,
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* PENDING */}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor:
                "divider",
              boxShadow:
                "none",
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Pending
                  </Typography>

                  <Typography
                    variant="h3"
                    fontWeight={800}
                    mt={1}
                  >
                    {
                      statistics.pending
                    }
                  </Typography>
                </Box>

                <PendingActionsRoundedIcon
                  color="warning"
                  sx={{
                    fontSize: 42,
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* APPROVED */}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor:
                "divider",
              boxShadow:
                "none",
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Approved
                  </Typography>

                  <Typography
                    variant="h3"
                    fontWeight={800}
                    mt={1}
                  >
                    {
                      statistics.approved
                    }
                  </Typography>
                </Box>

                <CheckCircleRoundedIcon
                  color="success"
                  sx={{
                    fontSize: 42,
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* REJECTED */}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor:
                "divider",
              boxShadow:
                "none",
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Rejected
                  </Typography>

                  <Typography
                    variant="h3"
                    fontWeight={800}
                    mt={1}
                  >
                    {
                      statistics.rejected
                    }
                  </Typography>
                </Box>

                <CancelRoundedIcon
                  color="error"
                  sx={{
                    fontSize: 42,
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* =====================================================
          LEAVE BALANCE
      ===================================================== */}

      <Card
        sx={{
          mt: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor:
            "divider",
          boxShadow:
            "none",
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={800}
          >
            Leave Balance
          </Typography>

          <Typography
            color="text.secondary"
            variant="body2"
            mt={0.5}
          >
            Available leave balance by leave type.
          </Typography>

          <Divider
            sx={{
              my: 3,
            }}
          />

          {/* BALANCE ERROR */}

          {balanceError && (
            <Alert
              severity="info"
              sx={{
                mb: 2,
              }}
            >
              {balanceError}
            </Alert>
          )}

          {/* BALANCE LOADING */}

          {balanceLoading ? (
            <Box
              sx={{
                py: 4,
                display:
                  "flex",
                justifyContent:
                  "center",
              }}
            >
              <CircularProgress
                size={28}
              />
            </Box>
          ) : balances.length ===
            0 ? (
            <Box
              sx={{
                py: 3,
              }}
            >
              <Typography
                color="text.secondary"
              >
                Leave balance information is not available for this account.
              </Typography>
            </Box>
          ) : (
            <Grid
              container
              spacing={3}
            >
              {balances.map(
                (
                  balance,
                  index
                ) => {
                  const total =
                    Number(
                      balance.total ||
                        balance.totalDays ||
                        balance.allocated ||
                        0
                    );

                  const used =
                    Number(
                      balance.used ||
                        balance.usedDays ||
                        0
                    );

                  const remaining =
                    Number(
                      balance.remaining ||
                        balance.remainingDays ||
                        Math.max(
                          total -
                            used,
                          0
                        )
                    );

                  const percentage =
                    total >
                    0
                      ? Math.min(
                          (used /
                            total) *
                            100,
                          100
                        )
                      : 0;

                  return (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={
                        balance.id ||
                        balance.leaveBalanceId ||
                        balance.leaveTypeId ||
                        index
                      }
                    >
                      <Box>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={1}
                        >
                          <Typography fontWeight={700}>
                            {balance.leaveTypeName ||
                              balance.leaveType ||
                              balance.type ||
                              "Leave"}
                          </Typography>

                          <Chip
                            size="small"
                            label={`${remaining} remaining`}
                            color="primary"
                          />
                        </Stack>

                        <LinearProgress
                          variant="determinate"
                          value={
                            percentage
                          }
                          sx={{
                            height: 8,
                            borderRadius: 4,
                          }}
                        />

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {
                            used
                          }{" "}
                          used of{" "}
                          {
                            total
                          }{" "}
                          days
                        </Typography>
                      </Box>
                    </Grid>
                  );
                }
              )}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default LeaveDashboard;