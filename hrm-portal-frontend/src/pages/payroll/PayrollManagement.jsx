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


import PaymentsOutlinedIcon
  from "@mui/icons-material/PaymentsOutlined";

import AccountBalanceWalletOutlinedIcon
  from "@mui/icons-material/AccountBalanceWalletOutlined";

import TrendingUpOutlinedIcon
  from "@mui/icons-material/TrendingUpOutlined";

import ReceiptLongOutlinedIcon
  from "@mui/icons-material/ReceiptLongOutlined";


import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";


import PayrollStatCard
  from "../../components/payroll/PayrollStatCard";

import PayrollFilters
  from "../../components/payroll/PayrollFilters";

import PayrollTable
  from "../../components/payroll/PayrollTable";

import PayrollDetailsDialog
  from "../../components/payroll/PayrollDetailsDialog";

import PayrollPayslipDialog
  from "../../components/payroll/PayrollPayslipDialog";


import payrollService
  from "../../services/payrollService";


import {
  formatCurrency,
  getPayrollErrorMessage,
  normalizePayrollResponse,
  normalizePayrollSummary
} from "../../utils/payrollUtils";


const PayrollManagement = () => {

  const [payrolls, setPayrolls] =
    useState([]);

  const [summary, setSummary] =
    useState({
      totalEmployees: 0,
      grossPayroll: 0,
      deductions: 0,
      netPayroll: 0,
      pending: 0,
      processed: 0,
      paid: 0
    });


  const [loading, setLoading] =
    useState(true);

  const [summaryLoading, setSummaryLoading] =
    useState(false);

  const [payslipLoading, setPayslipLoading] =
    useState(false);


  const [error, setError] =
    useState("");

  const [payslipError, setPayslipError] =
    useState("");


  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [month, setMonth] =
    useState("");

  const [year, setYear] =
    useState("");

  const [status, setStatus] =
    useState("");


  const [page, setPage] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalElements, setTotalElements] =
    useState(0);


  const [selectedPayroll, setSelectedPayroll] =
    useState(null);

  const [detailsOpen, setDetailsOpen] =
    useState(false);


  const [payslipOpen, setPayslipOpen] =
    useState(false);

  const [payslipData, setPayslipData] =
    useState(null);


  const [toast, setToast] =
    useState({
      open: false,
      message: "",
      severity: "success"
    });


  const currentUser = useMemo(() => {

    try {

      const stored =
        localStorage.getItem("user");

      if (!stored) {
        return null;
      }

      return JSON.parse(stored);

    } catch {

      return null;

    }

  }, []);


  const permissions =
    Array.isArray(
      currentUser?.permissions
    )
      ? currentUser.permissions
      : [];


  const canRead =
    permissions.includes(
      "PAYROLL_READ"
    );


  const loadPayrolls =
    useCallback(async () => {

      if (!canRead) {

        setLoading(false);

        setError(
          "You do not have permission to view payroll."
        );

        return;
      }


      setLoading(true);
      setError("");


      try {

        const response =
          await payrollService
            .getPayrolls({

              search,
              status,
              month,
              year,
              page,
              size: 20

            });


        const normalized =
          normalizePayrollResponse(
            response
          );


        setPayrolls(
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
          "Payroll loading failed:",
          requestError
        );


        setPayrolls([]);

        setTotalPages(1);

        setTotalElements(0);


        setError(
          getPayrollErrorMessage(
            requestError,
            "Unable to load payroll records."
          )
        );

      } finally {

        setLoading(false);

      }

    }, [
      canRead,
      search,
      status,
      month,
      year,
      page
    ]);


  const loadSummary =
    useCallback(async () => {

      if (!canRead) {
        return;
      }


      setSummaryLoading(true);


      try {

        const response =
          await payrollService
            .getPayrollSummary({
              month,
              year
            });


        setSummary(
          normalizePayrollSummary(
            response
          )
        );

      } catch (requestError) {

        console.warn(
          "Payroll summary unavailable:",
          requestError
        );

      } finally {

        setSummaryLoading(false);

      }

    }, [
      canRead,
      month,
      year
    ]);


  useEffect(() => {

    loadPayrolls();

  }, [loadPayrolls]);


  useEffect(() => {

    loadSummary();

  }, [loadSummary]);


  const handleSearch = () => {

    setPage(0);

    setSearch(
      searchInput.trim()
    );

  };


  const handleClear = () => {

    setSearchInput("");
    setSearch("");
    setMonth("");
    setYear("");
    setStatus("");
    setPage(0);

  };


  const handleRefresh = async () => {

    await Promise.all([
      loadPayrolls(),
      loadSummary()
    ]);


    setToast({
      open: true,
      message:
        "Payroll data refreshed successfully.",
      severity: "success"
    });

  };


  const handleView = payroll => {

    setSelectedPayroll(
      payroll
    );

    setDetailsOpen(true);

  };


  const handlePayslip =
    async payroll => {

      setSelectedPayroll(
        payroll
      );

      setPayslipData(null);

      setPayslipError("");

      setPayslipOpen(true);

      setPayslipLoading(true);


      try {

        const data =
          await payrollService
            .getPayslip(
              payroll.id
            );

        setPayslipData(data);

      } catch (requestError) {

        /*
         * If backend does not have a separate
         * payslip endpoint yet, the normalized
         * payroll record is still useful for
         * preview.
         */

        console.warn(
          "Detailed payslip unavailable:",
          requestError
        );

        setPayslipError(
          getPayrollErrorMessage(
            requestError,
            "Detailed payslip data is unavailable. Showing available payroll data."
          )
        );

      } finally {

        setPayslipLoading(false);

      }

    };


  const handleDownloadPayslip =
    async () => {

      if (!selectedPayroll?.id) {
        return;
      }


      setPayslipLoading(true);

      setPayslipError("");


      try {

        const response =
          await payrollService
            .downloadPayslip(
              selectedPayroll.id
            );


        const blob =
          response.data;


        const url =
          window.URL.createObjectURL(
            blob
          );


        const anchor =
          document.createElement(
            "a"
          );

        anchor.href = url;

        anchor.download =
          `payslip-${selectedPayroll.employeeCode || selectedPayroll.employeeId || selectedPayroll.id}-${selectedPayroll.month || "period"}-${selectedPayroll.year || ""}.pdf`;

        document.body.appendChild(
          anchor
        );

        anchor.click();

        anchor.remove();

        window.URL.revokeObjectURL(
          url
        );


        setToast({
          open: true,
          message:
            "Payslip download started.",
          severity: "success"
        });

      } catch (requestError) {

        setPayslipError(
          getPayrollErrorMessage(
            requestError,
            "Unable to download payslip."
          )
        );

      } finally {

        setPayslipLoading(false);

      }

    };


  const handlePageChange =
    (event, value) => {

      setPage(
        value - 1
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    };


  const hasFilters =
    Boolean(
      search ||
      month ||
      year ||
      status
    );


  return (
    <Box
      sx={{
        pb: 5
      }}
    >

      {/* HEADER */}

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
            Payroll
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5
            }}
          >
            Monitor employee payroll,
            salary breakdowns and payslips.
          </Typography>

        </Box>


        <Button
          variant="outlined"
          startIcon={
            <ReceiptLongOutlinedIcon />
          }
          onClick={() =>
            handleRefresh()
          }
          disabled={loading}
          sx={{
            borderRadius: 2,
            fontWeight: 850
          }}
        >
          Refresh Payroll
        </Button>

      </Stack>


      {/* ERROR */}

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
                loadPayrolls
              }
            >
              Retry
            </Button>

          }
        >
          {error}
        </Alert>

      )}


      {/* STATISTICS */}

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

        <PayrollStatCard
          title="Employees"
          value={
            summaryLoading
              ? "..."
              : summary.totalEmployees
          }
          subtitle="Included in payroll"
          icon={
            PaymentsOutlinedIcon
          }
        />


        <PayrollStatCard
          title="Gross Payroll"
          value={
            summaryLoading
              ? "..."
              : formatCurrency(
                  summary.grossPayroll
                )
          }
          subtitle="Before deductions"
          icon={
            TrendingUpOutlinedIcon
          }
        />


        <PayrollStatCard
          title="Deductions"
          value={
            summaryLoading
              ? "..."
              : formatCurrency(
                  summary.deductions
                )
          }
          subtitle="Total deductions"
          icon={
            AccountBalanceWalletOutlinedIcon
          }
        />


        <PayrollStatCard
          title="Net Payroll"
          value={
            summaryLoading
              ? "..."
              : formatCurrency(
                  summary.netPayroll
                )
          }
          subtitle="Employee take-home"
          icon={
            ReceiptLongOutlinedIcon
          }
        />

      </Box>


      {/* FILTERS */}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 3,
          border: "1px solid",
          borderColor:
            "divider"
        }}
      >

        <PayrollFilters

          searchInput={
            searchInput
          }

          month={
            month
          }

          year={
            year
          }

          status={
            status
          }

          onSearchChange={
            setSearchInput
          }

          onMonthChange={
            value => {

              setMonth(value);

              setPage(0);

            }
          }

          onYearChange={
            value => {

              setYear(value);

              setPage(0);

            }
          }

          onStatusChange={
            value => {

              setStatus(value);

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


      {/* RESULT COUNT */}

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 1.5
        }}
      >
        {loading
          ? "Loading payroll records..."
          : `${totalElements} record${
              totalElements === 1
                ? ""
                : "s"
            } found`}
      </Typography>


      {/* TABLE */}

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
              justifyContent:
                "center",
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


        <PayrollTable

          payrolls={
            payrolls
          }

          onView={
            handleView
          }

          onPayslip={
            handlePayslip
          }

        />

      </Box>


      {/* PAGINATION */}

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


      {/* DETAILS */}

      <PayrollDetailsDialog
        open={
          detailsOpen
        }
        payroll={
          selectedPayroll
        }
        onClose={() => {

          setDetailsOpen(
            false
          );

          setSelectedPayroll(
            null
          );

        }}
      />


      {/* PAYSLIP */}

      <PayrollPayslipDialog
        open={
          payslipOpen
        }
        payroll={
          selectedPayroll
        }
        payslip={
          payslipData
        }
        loading={
          payslipLoading
        }
        error={
          payslipError
        }
        onClose={() => {

          if (!payslipLoading) {

            setPayslipOpen(
              false
            );

            setSelectedPayroll(
              null
            );

            setPayslipData(
              null
            );

            setPayslipError(
              ""
            );

          }

        }}
        onDownload={
          handleDownloadPayslip
        }
      />


      {/* TOAST */}

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
          {toast.message}
        </Alert>

      </Snackbar>

    </Box>
  );
};


export default PayrollManagement;