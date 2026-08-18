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


import PendingActionsOutlinedIcon
  from "@mui/icons-material/PendingActionsOutlined";

import CheckCircleOutlineOutlinedIcon
  from "@mui/icons-material/CheckCircleOutlineOutlined";

import CancelOutlinedIcon
  from "@mui/icons-material/CancelOutlined";

import EventNoteOutlinedIcon
  from "@mui/icons-material/EventNoteOutlined";


import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";


import LeaveStatCard
  from "../../components/leave/LeaveStatCard";

import LeaveFilters
  from "../../components/leave/LeaveFilters";

import LeaveTable
  from "../../components/leave/LeaveTable";

import LeaveDetailsDialog
  from "../../components/leave/LeaveDetailsDialog";

import ApplyLeaveDialog
  from "../../components/leave/ApplyLeaveDialog";

import LeaveDecisionDialog
  from "../../components/leave/LeaveDecisionDialog";


import leaveService
  from "../../services/leaveService";


import {
  getLeaveErrorMessage,
  normalizeLeaveResponse,
  normalizeLeaveSummary
} from "../../utils/leaveUtils";


const LeaveManagement = () => {

  // ==========================================================
  // DATA
  // ==========================================================

  const [
    leaves,
    setLeaves
  ] = useState([]);


  const [
    summary,
    setSummary
  ] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
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


  const [
    actionLoading,
    setActionLoading
  ] = useState(false);


  const [
    applyLoading,
    setApplyLoading
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
    searchInput,
    setSearchInput
  ] = useState("");


  const [
    search,
    setSearch
  ] = useState("");


  const [
    leaveType,
    setLeaveType
  ] = useState("");


  const [
    status,
    setStatus
  ] = useState("");


  const [
    fromDate,
    setFromDate
  ] = useState("");


  const [
    toDate,
    setToDate
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
    selectedLeave,
    setSelectedLeave
  ] = useState(null);


  const [
    detailsOpen,
    setDetailsOpen
  ] = useState(false);


  // ==========================================================
  // DECISION
  // ==========================================================

  const [
    decisionOpen,
    setDecisionOpen
  ] = useState(false);


  const [
    decisionMode,
    setDecisionMode
  ] = useState("APPROVE");


  const [
    decisionError,
    setDecisionError
  ] = useState("");


  // ==========================================================
  // APPLY
  // ==========================================================

  const [
    applyOpen,
    setApplyOpen
  ] = useState(false);


  const [
    applyError,
    setApplyError
  ] = useState("");


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
  // CURRENT USER
  // ==========================================================

  const currentUser =
    useMemo(() => {

      try {

        const stored =
          localStorage.getItem(
            "user"
          );

        if (!stored) {
          return null;
        }

        return JSON.parse(
          stored
        );

      } catch {
        return null;
      }

    }, []);


  const currentUserId =
    currentUser?.userId ??
    currentUser?.employeeId ??
    "";


  // ==========================================================
  // PERMISSIONS
  // ==========================================================

  const permissions =
    useMemo(() => {

      return Array.isArray(
        currentUser?.permissions
      )
        ? currentUser.permissions
        : [];

    }, [
      currentUser
    ]);


  const canRead =
    permissions.includes(
      "LEAVE_READ"
    );


  const canApprove =
    permissions.includes(
      "LEAVE_APPROVE"
    );


  const canReject =
    permissions.includes(
      "LEAVE_REJECT"
    );


  // ==========================================================
  // LOAD LEAVES
  // ==========================================================

  const loadLeaves =
    useCallback(
      async () => {

        if (!canRead) {

          setLoading(false);

          setError(
            "You do not have permission to view leave requests."
          );

          return;
        }


        setLoading(true);

        setError("");


        try {

          const response =
            await leaveService
              .getLeaves({

                search,

                leaveType,

                status,

                fromDate,

                toDate,

                page,

                size: 20

              });


          const normalized =
            normalizeLeaveResponse(
              response
            );


          setLeaves(
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
            "Leave loading failed:",
            requestError
          );


          setLeaves([]);

          setTotalPages(1);

          setTotalElements(0);


          setError(
            getLeaveErrorMessage(
              requestError,
              "Unable to load leave requests."
            )
          );

        } finally {

          setLoading(false);

        }

      },
      [
        canRead,
        search,
        leaveType,
        status,
        fromDate,
        toDate,
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
            await leaveService
              .getLeaveSummary();


          setSummary(
            normalizeLeaveSummary(
              response
            )
          );

        } catch (requestError) {

          console.warn(
            "Leave summary unavailable:",
            requestError
          );

        } finally {

          setSummaryLoading(
            false
          );

        }

      },
      [
        canRead
      ]
    );


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {

    loadLeaves();

  }, [
    loadLeaves
  ]);


  useEffect(() => {

    loadSummary();

  }, [
    loadSummary
  ]);


  // ==========================================================
  // SEARCH
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

    setSearchInput("");

    setSearch("");

    setLeaveType("");

    setStatus("");

    setFromDate("");

    setToDate("");

    setPage(0);
  };


  // ==========================================================
  // REFRESH
  // ==========================================================

  const handleRefresh = async () => {

    await Promise.all([
      loadLeaves(),
      loadSummary()
    ]);

    setToast({
      open: true,
      message:
        "Leave data refreshed.",
      severity:
        "success"
    });

  };


  // ==========================================================
  // VIEW
  // ==========================================================

  const handleView = (
    leave
  ) => {

    setSelectedLeave(
      leave
    );

    setDetailsOpen(
      true
    );

  };


  // ==========================================================
  // APPROVE
  // ==========================================================

  const handleApproveClick = (
    leave
  ) => {

    setSelectedLeave(
      leave
    );

    setDecisionMode(
      "APPROVE"
    );

    setDecisionError("");

    setDecisionOpen(
      true
    );

  };


  // ==========================================================
  // REJECT
  // ==========================================================

  const handleRejectClick = (
    leave
  ) => {

    setSelectedLeave(
      leave
    );

    setDecisionMode(
      "REJECT"
    );

    setDecisionError("");

    setDecisionOpen(
      true
    );

  };


  // ==========================================================
  // DECISION
  // ==========================================================

  const handleDecision =
    async (
      rejectionReason
    ) => {

      if (
        !selectedLeave?.id
      ) {
        return;
      }


      setActionLoading(
        true
      );

      setDecisionError("");


      try {

        if (
          decisionMode ===
          "APPROVE"
        ) {

          await leaveService
            .approveLeave(
              selectedLeave.id
            );

        } else {

          await leaveService
            .rejectLeave(
              selectedLeave.id,
              rejectionReason
            );

        }


        setDecisionOpen(
          false
        );


        setSelectedLeave(
          null
        );


        setToast({
          open: true,
          message:
            decisionMode ===
            "APPROVE"
              ? "Leave request approved successfully."
              : "Leave request rejected successfully.",
          severity:
            "success"
        });


        await Promise.all([
          loadLeaves(),
          loadSummary()
        ]);

      } catch (requestError) {

        setDecisionError(
          getLeaveErrorMessage(
            requestError,
            "Unable to process leave request."
          )
        );

      } finally {

        setActionLoading(
          false
        );

      }

    };


  // ==========================================================
  // APPLY LEAVE
  // ==========================================================

  const handleApplyLeave =
    async ({
      employeeId,
      leaveType: selectedType,
      fromDate: selectedFromDate,
      toDate: selectedToDate,
      reason
    }) => {

      setApplyLoading(
        true
      );

      setApplyError("");


      try {

        await leaveService
          .applyLeave({

            employeeId,

            leaveType:
              selectedType,

            fromDate:
              selectedFromDate,

            toDate:
              selectedToDate,

            reason

          });


        setApplyOpen(
          false
        );


        setToast({
          open: true,
          message:
            "Leave request submitted successfully.",
          severity:
            "success"
        });


        await Promise.all([
          loadLeaves(),
          loadSummary()
        ]);

      } catch (requestError) {

        setApplyError(
          getLeaveErrorMessage(
            requestError,
            "Unable to submit leave request."
          )
        );

      } finally {

        setApplyLoading(
          false
        );

      }

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
      leaveType ||
      status ||
      fromDate ||
      toDate
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
          HEADER
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
              letterSpacing:
                "-.04em"
            }}
          >
            Leave Management
          </Typography>


          <Typography
            color="text.secondary"
            sx={{
              mt: .5
            }}
          >
            Manage employee leave requests,
            approvals and leave history.
          </Typography>

        </Box>


        {currentUserId && (

          <Button
            variant="contained"
            startIcon={
              <EventNoteOutlinedIcon />
            }
            onClick={() => {

              setApplyError("");

              setApplyOpen(
                true
              );

            }}
            sx={{
              borderRadius: 2,
              px: 2.5,
              py: 1.2,
              fontWeight: 850
            }}
          >
            Apply Leave
          </Button>

        )}

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
                loadLeaves
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
          STATS
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

        <LeaveStatCard
          title="Total Requests"
          value={
            summaryLoading
              ? "..."
              : summary.total
          }
          subtitle="All leave requests"
          icon={
            EventNoteOutlinedIcon
          }
          color="primary"
        />


        <LeaveStatCard
          title="Pending"
          value={
            summaryLoading
              ? "..."
              : summary.pending
          }
          subtitle="Awaiting approval"
          icon={
            PendingActionsOutlinedIcon
          }
          color="warning"
        />


        <LeaveStatCard
          title="Approved"
          value={
            summaryLoading
              ? "..."
              : summary.approved
          }
          subtitle="Approved requests"
          icon={
            CheckCircleOutlineOutlinedIcon
          }
          color="success"
        />


        <LeaveStatCard
          title="Rejected"
          value={
            summaryLoading
              ? "..."
              : summary.rejected
          }
          subtitle="Rejected requests"
          icon={
            CancelOutlinedIcon
          }
          color="error"
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
          border:
            "1px solid",
          borderColor:
            "divider"
        }}
      >

        <LeaveFilters
          searchInput={
            searchInput
          }
          leaveType={
            leaveType
          }
          status={
            status
          }
          fromDate={
            fromDate
          }
          toDate={
            toDate
          }
          onSearchChange={
            setSearchInput
          }
          onLeaveTypeChange={
            value => {

              setLeaveType(
                value
              );

              setPage(0);

            }
          }
          onStatusChange={
            value => {

              setStatus(
                value
              );

              setPage(0);

            }
          }
          onFromDateChange={
            value => {

              setFromDate(
                value
              );

              setPage(0);

            }
          }
          onToDateChange={
            value => {

              setToDate(
                value
              );

              setPage(0);

            }
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
          COUNT
      ===================================================== */}

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 1.5
        }}
      >
        {loading
          ? "Loading leave requests..."
          : `${totalElements} request${
              totalElements === 1
                ? ""
                : "s"
            } found`}
      </Typography>


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
              alignItems:
                "flex-start",
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


        <LeaveTable
          leaves={
            leaves
          }
          onView={
            handleView
          }
          onApprove={
            handleApproveClick
          }
          onReject={
            handleRejectClick
          }
          canApprove={
            canApprove
          }
          canReject={
            canReject
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
          DETAILS
      ===================================================== */}

      <LeaveDetailsDialog
        open={
          detailsOpen
        }
        leave={
          selectedLeave
        }
        onClose={() => {

          setDetailsOpen(
            false
          );

          setSelectedLeave(
            null
          );

        }}
      />


      {/* =====================================================
          APPLY
      ===================================================== */}

      <ApplyLeaveDialog
        open={
          applyOpen
        }
        employeeId={
          currentUserId
        }
        loading={
          applyLoading
        }
        error={
          applyError
        }
        onClose={() =>
          setApplyOpen(
            false
          )
        }
        onSubmit={
          handleApplyLeave
        }
      />


      {/* =====================================================
          APPROVE / REJECT
      ===================================================== */}

      <LeaveDecisionDialog
        open={
          decisionOpen
        }
        mode={
          decisionMode
        }
        leave={
          selectedLeave
        }
        loading={
          actionLoading
        }
        error={
          decisionError
        }
        onClose={() => {

          if (
            !actionLoading
          ) {

            setDecisionOpen(
              false
            );

            setSelectedLeave(
              null
            );

          }

        }}
        onConfirm={
          handleDecision
        }
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


export default LeaveManagement;