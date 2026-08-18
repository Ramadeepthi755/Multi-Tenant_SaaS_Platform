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


import SecurityOutlinedIcon
  from "@mui/icons-material/SecurityOutlined";


import RefreshOutlinedIcon
  from "@mui/icons-material/RefreshOutlined";


import {
  useCallback,
  useEffect,
  useState
} from "react";


import SecurityPageHeader
  from "./SecurityPageHeader";


import AuditLogFilters
  from "../../components/security/AuditLogFilters";


import AuditLogTable
  from "../../components/security/AuditLogTable";


import AuditLogDetails
  from "./AuditLogDetails";


import SecurityEmptyState
  from "../../components/security/SecurityEmptyState";


import securityService
  from "../../services/securityService";


import {
  getSecurityErrorMessage,
  normalizeAuditLog,
  normalizePageResponse
} from "../../utils/securityUtils";


const initialFilters = {

  search: "",

  module: "",

  action: "",

  status: "",

  userId: "",

  fromDate: "",

  toDate: ""

};


const AuditLogs = () => {

  const [
    filters,
    setFilters
  ] = useState(
    initialFilters
  );


  const [
    appliedFilters,
    setAppliedFilters
  ] = useState(
    initialFilters
  );


  const [
    logs,
    setLogs
  ] = useState([]);


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


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  const [
    selectedLog,
    setSelectedLog
  ] = useState(null);


  const loadLogs =
    useCallback(
      async () => {

        setLoading(true);
        setError("");

        try {

          const response =
            await securityService
              .getAuditLogs({

                page,

                size: 20,

                ...appliedFilters

              });


          const normalized =
            normalizePageResponse(
              response,
              normalizeAuditLog
            );


          setLogs(
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
            "Audit log loading failed:",
            requestError
          );


          setError(
            getSecurityErrorMessage(
              requestError,
              "Unable to load audit logs."
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

    loadLogs();

  }, [
    loadLogs
  ]);


  const handleFilterChange =
    (
      field,
      value
    ) => {

      setFilters(
        previous => ({
          ...previous,
          [field]: value
        })
      );

    };


  const handleSearch =
    () => {

      setPage(0);

      setAppliedFilters(
        filters
      );

    };


  const handleReset =
    () => {

      setFilters(
        initialFilters
      );

      setAppliedFilters(
        initialFilters
      );

      setPage(0);

    };


  return (
    <Box
      sx={{
        pb: 5
      }}
    >

      <SecurityPageHeader

        title="Audit Logs"

        subtitle="Track important actions performed across the HRM platform."

        icon={
          <SecurityOutlinedIcon />
        }

        actions={

          <Button
            variant="outlined"
            startIcon={
              <RefreshOutlinedIcon />
            }
            onClick={
              loadLogs
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

        <AuditLogFilters

          filters={
            filters
          }

          onChange={
            handleFilterChange
          }

          onSearch={
            handleSearch
          }

          onReset={
            handleReset
          }

        />

      </Paper>


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
                loadLogs
              }
            >
              Retry
            </Button>

          }
        >
          {error}
        </Alert>

      )}


      <Stack
        direction={{
          xs: "column",
          sm: "row"
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center"
        }}
        sx={{
          mb: 1.5
        }}
      >

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {totalElements} audit event
          {totalElements === 1
            ? ""
            : "s"}
        </Typography>

      </Stack>


      {loading ? (

        <Paper
          elevation={0}
          sx={{
            border:
              "1px solid",
            borderColor:
              "divider",
            borderRadius: 3,
            py: 10
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
              Loading audit logs...
            </Typography>

          </Stack>

        </Paper>

      ) : logs.length === 0 ? (

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

          <SecurityEmptyState

            title="No audit logs found"

            message="Try changing your filters or date range."

          />

        </Paper>

      ) : (

        <AuditLogTable

          logs={
            logs
          }

          onView={
            setSelectedLog
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


      <AuditLogDetails

        log={
          selectedLog
        }

        open={
          Boolean(
            selectedLog
          )
        }

        onClose={() =>
          setSelectedLog(
            null
          )
        }

      />

    </Box>
  );
};


export default AuditLogs;