import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Pagination,
  Paper,
  Stack,
  Typography
} from "@mui/material";


import BusinessOutlinedIcon
  from "@mui/icons-material/BusinessOutlined";


import RefreshOutlinedIcon
  from "@mui/icons-material/RefreshOutlined";


import {
  useCallback,
  useEffect,
  useState
} from "react";


import ReportPageHeader
  from "./ReportPageHeader";


import ReportFilterBar
  from "../../components/reports/ReportFilterBar";


import ReportTable
  from "../../components/reports/ReportTable";


import ReportStatusChip
  from "../../components/reports/ReportStatusChip";


import ReportEmptyState
  from "../../components/reports/ReportEmptyState";


import reportService
  from "../../services/reportService";


import {
  getReportErrorMessage,
  normalizeDepartmentReport,
  normalizePageResponse
} from "../../utils/reportUtils";


const initialFilters = {
  search: "",
  status: ""
};


const DepartmentReport = () => {

  const [filters, setFilters] =
    useState(initialFilters);

  const [appliedFilters, setAppliedFilters] =
    useState(initialFilters);

  const [rows, setRows] =
    useState([]);

  const [page, setPage] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalElements, setTotalElements] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const loadReport =
    useCallback(
      async () => {

        setLoading(true);
        setError("");

        try {

          const response =
            await reportService
              .getDepartmentReport({
                page,
                size: 20,
                ...appliedFilters
              });


          const normalized =
            normalizePageResponse(
              response,
              normalizeDepartmentReport
            );


          setRows(
            normalized.content
          );

          setTotalPages(
            normalized.totalPages
          );

          setTotalElements(
            normalized.totalElements
          );

        } catch (requestError) {

          setError(
            getReportErrorMessage(
              requestError,
              "Unable to load department report."
            )
          );

        } finally {

          setLoading(false);

        }

      },
      [
        page,
        appliedFilters
      ]
    );


  useEffect(() => {

    loadReport();

  }, [
    loadReport
  ]);


  const columns = [

    {
      key: "departmentCode",
      label: "Code"
    },

    {
      key: "departmentName",
      label: "Department"
    },

    {
      key: "employeeCount",
      label: "Total Employees",
      align: "right"
    },

    {
      key: "activeEmployees",
      label: "Active",
      align: "right"
    },

    {
      key: "inactiveEmployees",
      label: "Inactive",
      align: "right"
    },

    {
      key: "status",
      label: "Status",
      render: row => (
        <ReportStatusChip
          status={
            row.status
          }
        />
      )
    }

  ];


  return (
    <Box sx={{ pb: 5 }}>

      <ReportPageHeader

        title="Department Report"

        subtitle="Understand workforce distribution across departments."

        icon={
          <BusinessOutlinedIcon />
        }

        actions={

          <Button
            variant="outlined"
            startIcon={
              <RefreshOutlinedIcon />
            }
            onClick={
              loadReport
            }
            disabled={
              loading
            }
            sx={{
              fontWeight: 800
            }}
          >
            Refresh
          </Button>

        }

      />


      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          border:
            "1px solid",
          borderColor:
            "divider",
          borderRadius: 3
        }}
      >

        <ReportFilterBar

          filters={
            filters
          }

          onChange={(
            field,
            value
          ) =>
            setFilters(
              previous => ({
                ...previous,
                [field]: value
              })
            )
          }

          onSearch={() => {

            setPage(0);

            setAppliedFilters(
              filters
            );

          }}

          onReset={() => {

            setFilters(
              initialFilters
            );

            setAppliedFilters(
              initialFilters
            );

            setPage(0);

          }}

          showSearch

          showStatus

          showFromDate={false}

          showToDate={false}

        />

      </Paper>


      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 3
          }}
        >
          {error}
        </Alert>

      )}


      {loading ? (

        <Paper
          elevation={0}
          sx={{
            py: 10,
            border:
              "1px solid",
            borderColor:
              "divider",
            borderRadius: 3
          }}
        >

          <Stack
            alignItems="center"
            spacing={2}
          >

            <CircularProgress />

            <Typography
              color="text.secondary"
            >
              Loading department report...
            </Typography>

          </Stack>

        </Paper>

      ) : rows.length === 0 ? (

        <Paper
          elevation={0}
          sx={{
            border:
              "1px solid",
            borderColor:
              "divider",
            borderRadius: 3
          }}
        >

          <ReportEmptyState />

        </Paper>

      ) : (

        <ReportTable
          columns={
            columns
          }
          rows={
            rows
          }
        />

      )}


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
            onChange={(
              event,
              value
            ) =>
              setPage(
                value - 1
              )
            }
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />

        </Stack>

      )}


      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: "block",
          textAlign: "center",
          mt: 2
        }}
      >
        {totalElements} department
        {totalElements === 1
          ? ""
          : "s"}
      </Typography>

    </Box>
  );
};


export default DepartmentReport;