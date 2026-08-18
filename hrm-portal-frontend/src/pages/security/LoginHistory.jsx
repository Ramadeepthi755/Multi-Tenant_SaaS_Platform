import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";


import HistoryOutlinedIcon
  from "@mui/icons-material/HistoryOutlined";


import RefreshOutlinedIcon
  from "@mui/icons-material/RefreshOutlined";


import SearchOutlinedIcon
  from "@mui/icons-material/SearchOutlined";


import RestartAltOutlinedIcon
  from "@mui/icons-material/RestartAltOutlined";


import {
  useCallback,
  useEffect,
  useState
} from "react";


import SecurityPageHeader
  from "./SecurityPageHeader";


import LoginHistoryTable
  from "../../components/security/LoginHistoryTable";


import SecurityEmptyState
  from "../../components/security/SecurityEmptyState";


import securityService
  from "../../services/securityService";


import {
  getSecurityErrorMessage,
  normalizeLoginHistory,
  normalizePageResponse
} from "../../utils/securityUtils";


const initialFilters = {

  search: "",

  status: "",

  fromDate: "",

  toDate: ""

};


const LoginHistory = () => {

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
    history,
    setHistory
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


  const loadHistory =
    useCallback(
      async () => {

        setLoading(true);
        setError("");

        try {

          const response =
            await securityService
              .getLoginHistory({

                page,

                size: 20,

                ...appliedFilters

              });


          const normalized =
            normalizePageResponse(
              response,
              normalizeLoginHistory
            );


          setHistory(
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
            "Login history loading failed:",
            requestError
          );


          setError(
            getSecurityErrorMessage(
              requestError,
              "Unable to load login history."
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

    loadHistory();

  }, [
    loadHistory
  ]);


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

        title="Login History"

        subtitle="Review authentication activity and detect suspicious access."

        icon={
          <HistoryOutlinedIcon />
        }

        actions={

          <Button
            variant="outlined"
            startIcon={
              <RefreshOutlinedIcon />
            }
            onClick={
              loadHistory
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

        <Stack
          direction={{
            xs: "column",
            sm: "row"
          }}
          spacing={1.5}
          flexWrap="wrap"
          useFlexGap
        >

          <TextField
            size="small"
            label="Search"
            placeholder="Name or email"
            value={
              filters.search
            }
            onChange={event =>
              setFilters(
                previous => ({
                  ...previous,
                  search:
                    event.target.value
                })
              )
            }
            sx={{
              minWidth: {
                sm: 240
              }
            }}
          />


          <TextField
            select
            size="small"
            label="Status"
            value={
              filters.status
            }
            onChange={event =>
              setFilters(
                previous => ({
                  ...previous,
                  status:
                    event.target.value
                })
              )
            }
            sx={{
              minWidth: 150
            }}
          >

            <MenuItem value="">
              All Status
            </MenuItem>

            <MenuItem value="SUCCESS">
              Successful
            </MenuItem>

            <MenuItem value="FAILED">
              Failed
            </MenuItem>

            <MenuItem value="LOGOUT">
              Logout
            </MenuItem>

            <MenuItem value="BLOCKED">
              Blocked
            </MenuItem>

          </TextField>


          <TextField
            size="small"
            type="date"
            label="From"
            value={
              filters.fromDate
            }
            onChange={event =>
              setFilters(
                previous => ({
                  ...previous,
                  fromDate:
                    event.target.value
                })
              )
            }
            slotProps={{
              inputLabel: {
                shrink: true
              }
            }}
          />


          <TextField
            size="small"
            type="date"
            label="To"
            value={
              filters.toDate
            }
            onChange={event =>
              setFilters(
                previous => ({
                  ...previous,
                  toDate:
                    event.target.value
                })
              )
            }
            slotProps={{
              inputLabel: {
                shrink: true
              }
            }}
          />


          <Button
            variant="contained"
            startIcon={
              <SearchOutlinedIcon />
            }
            onClick={
              handleSearch
            }
            sx={{
              fontWeight: 850
            }}
          >
            Search
          </Button>


          <Button
            variant="outlined"
            startIcon={
              <RestartAltOutlinedIcon />
            }
            onClick={
              handleReset
            }
            sx={{
              fontWeight: 800
            }}
          >
            Reset
          </Button>

        </Stack>

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
                loadHistory
              }
            >
              Retry
            </Button>

          }
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
        {totalElements} login event
        {totalElements === 1
          ? ""
          : "s"}
      </Typography>


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
              Loading login history...
            </Typography>

          </Stack>

        </Paper>

      ) : history.length === 0 ? (

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

            title="No login history found"

            message="Try changing your filters or date range."

          />

        </Paper>

      ) : (

        <LoginHistoryTable
          history={
            history
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


export default LoginHistory;