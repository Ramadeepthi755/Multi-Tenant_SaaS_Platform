import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";


import SearchOutlinedIcon
  from "@mui/icons-material/SearchOutlined";


import {
  useEffect,
  useState
} from "react";


import {
  useSearchParams,
  useNavigate
} from "react-router-dom";


import searchService
  from "../../services/searchService";


import SearchResultItem
  from "../../components/search/SearchResultItem";


import SearchEmptyState
  from "../../components/search/SearchEmptyState";


const SearchResultsPage = () => {

  const [
    searchParams,
    setSearchParams
  ] = useSearchParams();


  const navigate =
    useNavigate();


  const queryParam =
    searchParams.get(
      "q"
    ) || "";


  const [
    query,
    setQuery
  ] = useState(
    queryParam
  );


  const [
    results,
    setResults
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(false);


  const [
    error,
    setError
  ] = useState("");


  useEffect(() => {

    setQuery(
      queryParam
    );

  }, [queryParam]);


  useEffect(() => {

    if (!queryParam.trim()) {

      setResults([]);

      return;

    }


    const load =
      async () => {

        setLoading(true);
        setError("");

        try {

          const response =
            await searchService
              .globalSearch(
                queryParam,
                {
                  page: 0,
                  size: 50
                }
              );


          const items =
            Array.isArray(
              response
            )
              ? response
              : response?.content ||
                response?.results ||
                response?.items ||
                response?.data ||
                [];


          setResults(
            Array.isArray(
              items
            )
              ? items
              : []
          );

        } catch (requestError) {

          setError(
            requestError?.response?.data?.message ||
            "Unable to perform search."
          );

        } finally {

          setLoading(false);

        }

      };


    load();

  }, [queryParam]);


  const submit =
    event => {

      event.preventDefault();


      const value =
        query.trim();


      if (!value) {
        return;
      }


      setSearchParams({
        q: value
      });

    };


  const handleSelect =
    result => {

      if (
        result?.path
      ) {

        navigate(
          result.path
        );

        return;

      }


      const type =
        String(
          result?.type ||
          ""
        ).toUpperCase();


      const id =
        result?.id ??
        result?.resultId;


      const paths = {

        COMPANY:
          id
            ? `/companies/${id}`
            : "/companies",

        DEPARTMENT:
          id
            ? `/departments/${id}`
            : "/departments",

        DESIGNATION:
          id
            ? `/designations/${id}`
            : "/designations",

        EMPLOYEE:
          id
            ? `/employees/${id}`
            : "/employees",

        ATTENDANCE:
          "/attendance",

        LEAVE:
          "/leave",

        PAYROLL:
          "/payroll",

        HOLIDAY:
          "/holidays",

        DOCUMENT:
          "/documents",

        USER:
          "/users"

      };


      const path =
        paths[type];


      if (path) {

        navigate(
          path
        );

      }

    };


  return (
    <Box
      sx={{
        pb: 5
      }}
    >

      <Typography
        variant="h4"
        fontWeight={950}
        sx={{
          mb: 0.5
        }}
      >
        Search
      </Typography>


      <Typography
        color="text.secondary"
        sx={{
          mb: 3
        }}
      >
        Search across your HRM workspace.
      </Typography>


      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 2.5,
          border:
            "1px solid",
          borderColor:
            "divider",
          borderRadius: 3
        }}
      >

        <form
          onSubmit={
            submit
          }
        >

          <Stack
            direction={{
              xs: "column",
              sm: "row"
            }}
            spacing={1.5}
          >

            <TextField
              fullWidth
              value={
                query
              }
              onChange={
                event =>
                  setQuery(
                    event.target.value
                  )
              }
              placeholder="Search employees, companies, departments..."
              InputProps={{
                startAdornment: (
                  <SearchOutlinedIcon
                    sx={{
                      mr: 1,
                      color:
                        "text.secondary"
                    }}
                  />
                )
              }}
            />


            <Button
              type="submit"
              variant="contained"
              sx={{
                px: 4,
                fontWeight: 850
              }}
            >
              Search
            </Button>

          </Stack>

        </form>

      </Paper>


      {loading && (

        <Box
          sx={{
            py: 5,
            display: "flex",
            justifyContent: "center"
          }}
        >
          <CircularProgress />
        </Box>

      )}


      {error && (

        <Alert
          severity="error"
          sx={{
            borderRadius: 2,
            mb: 2
          }}
        >
          {error}
        </Alert>

      )}


      {!loading &&
        !error &&
        queryParam &&
        results.length === 0 && (

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

            <SearchEmptyState
              query={
                queryParam
              }
            />

          </Paper>

        )}


      {!loading &&
        results.length > 0 && (

          <Grid
            container
            spacing={1}
          >

            {results.map(
              (result, index) => (

                <Grid
                  size={{
                    xs: 12,
                    md: 6
                  }}
                  key={
                    result.id ??
                    result.resultId ??
                    index
                  }
                >

                  <Paper
                    elevation={0}
                    sx={{
                      border:
                        "1px solid",
                      borderColor:
                        "divider",
                      borderRadius: 2
                    }}
                  >

                    <SearchResultItem
                      result={
                        result
                      }
                      onClick={
                        handleSelect
                      }
                    />

                  </Paper>

                </Grid>

              )
            )}

          </Grid>

        )}

    </Box>
  );
};


export default SearchResultsPage;