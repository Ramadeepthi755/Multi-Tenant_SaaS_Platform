import {
  Alert,
  Box,
  CircularProgress,
  Pagination,
  Paper,
  Stack,
  Typography
} from "@mui/material";


import PeopleOutlinedIcon
  from "@mui/icons-material/PeopleOutlined";


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

import ReportActions
  from "../../components/reports/ReportActions";


import reportService
  from "../../services/reportService";


import {
  formatReportDate,
  getReportErrorMessage,
  normalizeEmployeeReport,
  normalizePageResponse
} from "../../utils/reportUtils";


const initialFilters = {
  search: "",
  departmentId: "",
  designationId: "",
  status: "",
  fromDate: "",
  toDate: ""
};


const EmployeeReport = () => {

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
              .getEmployeeReport({
                page,
                size: 20,
                ...appliedFilters
              });


          const normalized =
            normalizePageResponse(
              response,
              normalizeEmployeeReport
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
              "Unable to load employee report."
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
      key: "employeeCode",
      label: "Employee ID"
    },

    {
      key: "employeeName",
      label: "Employee"
    },

    {
      key: "email",
      label: "Email"
    },

    {
      key: "department",
      label: "Department"
    },

    {
      key: "designation",
      label: "Designation"
    },

    {
      key: "joiningDate",
      label: "Joining Date",
      render: row =>
        formatReportDate(
          row.joiningDate
        )
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

        title="Employee Report"

        subtitle="Review employee workforce information and status."

        icon={
          <PeopleOutlinedIcon />
        }

        actions={
          <ReportActions
            reportType="employees"
            filters={appliedFilters}
            onRefresh={loadReport}
            loading={loading}
            onError={setError}
          />
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

          showDepartment

          showDesignation

          showStatus

          statusOptions={[
            { value: "ACTIVE", label: "Active" },
            { value: "INACTIVE", label: "Inactive" }
          ]}

          showFromDate

          showToDate

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


      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 1.5
        }}
      >
        {totalElements} employee
        {totalElements === 1
          ? ""
          : "s"}
      </Typography>


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
              Loading employee report...
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
            ) => {

              setPage(
                value - 1
              );

              window.scrollTo({
                top: 0,
                behavior: "smooth"
              });

            }}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />

        </Stack>

      )}

    </Box>
  );
};


export default EmployeeReport;
