import {
  Alert,
  Box,
  CircularProgress,
  Pagination,
  Paper,
  Stack,
  Typography
} from "@mui/material";

import {
  useCallback,
  useEffect,
  useState
} from "react";

import ReportActions
  from "./ReportActions";

import ReportEmptyState
  from "./ReportEmptyState";

import ReportFilterBar
  from "./ReportFilterBar";

import ReportTable
  from "./ReportTable";

import ReportPageHeader
  from "../../pages/reports/ReportPageHeader";

import {
  getReportErrorMessage,
  normalizePageResponse
} from "../../utils/reportUtils";


const ReportDataPage = ({
  title,
  subtitle,
  icon,
  reportType,
  initialFilters,
  load,
  normalize,
  columns,
  filterProps,
  emptyTitle,
  emptyMessage
}) => {

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

  const loadReport = useCallback(async () => {

    setLoading(true);
    setError("");

    try {

      const response = await load({
        page,
        size: 20,
        ...appliedFilters
      });

      const normalized = normalizePageResponse(
        response,
        normalize
      );

      setRows(normalized.content);
      setTotalPages(normalized.totalPages);
      setTotalElements(normalized.totalElements);

    } catch (requestError) {

      setError(
        getReportErrorMessage(
          requestError,
          `Unable to load ${title.toLowerCase()}.`
        )
      );

    } finally {

      setLoading(false);

    }

  }, [appliedFilters, load, normalize, page, title]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  return (
    <Box sx={{ pb: 5 }}>

      <ReportPageHeader
        title={title}
        subtitle={subtitle}
        icon={icon}
        actions={
          <ReportActions
            reportType={reportType}
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
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3
        }}
      >
        <ReportFilterBar
          filters={filters}
          onChange={(field, value) =>
            setFilters(previous => ({
              ...previous,
              [field]: value
            }))
          }
          onSearch={() => {
            setPage(0);
            setAppliedFilters(filters);
          }}
          onReset={() => {
            setFilters(initialFilters);
            setAppliedFilters(initialFilters);
            setPage(0);
          }}
          {...filterProps}
        />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 1.5 }}
      >
        {totalElements} record{totalElements === 1 ? "" : "s"}
      </Typography>

      {loading ? (
        <Paper
          elevation={0}
          sx={{
            py: 10,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3
          }}
        >
          <Stack alignItems="center" spacing={2}>
            <CircularProgress />
            <Typography color="text.secondary">
              Loading report data...
            </Typography>
          </Stack>
        </Paper>
      ) : rows.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3
          }}
        >
          <ReportEmptyState
            title={emptyTitle}
            message={emptyMessage}
          />
        </Paper>
      ) : (
        <ReportTable columns={columns} rows={rows} />
      )}

      {totalPages > 1 && (
        <Stack alignItems="center" sx={{ mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(event, value) => setPage(value - 1)}
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


export default ReportDataPage;
