import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip
} from "@mui/material";


import SearchOutlinedIcon
  from "@mui/icons-material/SearchOutlined";


import CloseOutlinedIcon
  from "@mui/icons-material/CloseOutlined";


import {
  useEffect,
  useRef,
  useState
} from "react";


import {
  useNavigate
} from "react-router-dom";


import searchService
  from "../../services/searchService";


import SearchResults
  from "./SearchResults";


const GlobalSearch = ({
  fullWidth = false
}) => {

  const navigate =
    useNavigate();


  const containerRef =
    useRef(null);


  const [
    query,
    setQuery
  ] = useState("");


  const [
    results,
    setResults
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(false);


  const [
    open,
    setOpen
  ] = useState(false);


  const [
    error,
    setError
  ] = useState("");


  useEffect(() => {

    const value =
      query.trim();


    if (!value) {

      setResults([]);
      setLoading(false);
      setOpen(false);

      return;

    }


    setOpen(true);


    const timer =
      setTimeout(
        async () => {

          setLoading(true);
          setError("");

          try {

            const response =
              await searchService
                .globalSearch(
                  value
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

            setResults([]);

            setError(
              requestError?.response?.data?.message ||
              "Search is currently unavailable."
            );

          } finally {

            setLoading(false);

          }

        },
        350
      );


    return () =>
      clearTimeout(timer);

  }, [query]);


  useEffect(() => {

    const handleOutsideClick =
      event => {

        if (
          containerRef.current &&
          !containerRef.current.contains(
            event.target
          )
        ) {

          setOpen(false);

        }

      };


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

    };

  }, []);


  const clear =
    () => {

      setQuery("");
      setResults([]);
      setOpen(false);
      setError("");

    };


  const handleSelect =
    result => {

      const path =
        getResultPath(
          result
        );


      if (path) {

        clear();

        navigate(
          path
        );

      }

    };


  const getResultPath =
    result => {

      if (!result) {
        return null;
      }


      if (
        result.path
      ) {

        return result.path;

      }


      const type =
        String(
          result.type ||
          ""
        ).toUpperCase();


      const id =
        result.id ??
        result.resultId;


      switch (type) {

        case "COMPANY":
          return id
            ? `/companies/${id}`
            : "/companies";


        case "DEPARTMENT":
          return id
            ? `/departments/${id}`
            : "/departments";


        case "DESIGNATION":
          return id
            ? `/designations/${id}`
            : "/designations";


        case "EMPLOYEE":
          return id
            ? `/employees/${id}`
            : "/employees";


        case "ATTENDANCE":
          return "/attendance";


        case "LEAVE":
          return "/leave";


        case "PAYROLL":
          return "/payroll";


        case "HOLIDAY":
          return "/holidays";


        case "DOCUMENT":
          return "/documents";


        case "USER":
          return "/users";


        default:
          return null;

      }

    };


  return (
    <Box
      ref={
        containerRef
      }
      sx={{
        position: "relative",
        width:
          fullWidth
            ? "100%"
            : {
                xs: 180,
                sm: 280,
                md: 360
              }
      }}
    >

      <TextField
        fullWidth
        size="small"
        placeholder="Search employees, departments..."
        value={
          query
        }
        onChange={
          event =>
            setQuery(
              event.target.value
            )
        }
        onFocus={() => {

          if (
            query.trim()
          ) {

            setOpen(true);

          }

        }}
        slotProps={{
          input: {

            startAdornment: (
              <InputAdornment
                position="start"
              >
                <SearchOutlinedIcon
                  fontSize="small"
                />
              </InputAdornment>
            ),

            endAdornment: (

              <InputAdornment
                position="end"
              >

                {loading ? (

                  <CircularProgress
                    size={18}
                  />

                ) : query ? (

                  <Tooltip
                    title="Clear search"
                  >

                    <IconButton
                      size="small"
                      onClick={
                        clear
                      }
                    >

                      <CloseOutlinedIcon
                        fontSize="small"
                      />

                    </IconButton>

                  </Tooltip>

                ) : null}

              </InputAdornment>

            )

          }
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2.5,
            bgcolor:
              "background.paper"
          }
        }}
      />


      {open && (

        <Box
          sx={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            zIndex: 1500
          }}
        >

          {error ? (

            <Box
              sx={{
                p: 2,
                bgcolor:
                  "background.paper",
                border:
                  "1px solid",
                borderColor:
                  "divider",
                borderRadius: 2.5,
                boxShadow: 8,
                color:
                  "error.main",
                fontSize: 13
              }}
            >
              {error}
            </Box>

          ) : (

            <SearchResults

              results={
                results
              }

              query={
                query
              }

              onSelect={
                handleSelect
              }

            />

          )}

        </Box>

      )}

    </Box>
  );
};


export default GlobalSearch;