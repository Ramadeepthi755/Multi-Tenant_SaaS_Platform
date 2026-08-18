import {
  Box,
  Divider,
  List,
  Paper,
  Typography
} from "@mui/material";


import SearchResultItem
  from "./SearchResultItem";


import SearchEmptyState
  from "./SearchEmptyState";


const SearchResults = ({
  results = [],
  query = "",
  onSelect
}) => {

  if (!query) {

    return null;

  }


  return (
    <Paper
      elevation={8}
      sx={{
        width: "100%",
        maxHeight: 480,
        overflowY: "auto",
        border:
          "1px solid",
        borderColor:
          "divider",
        borderRadius: 2.5
      }}
    >

      <Box
        sx={{
          px: 2,
          py: 1.5
        }}
      >

        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={800}
        >
          SEARCH RESULTS
        </Typography>

      </Box>


      <Divider />


      {results.length === 0 ? (

        <SearchEmptyState
          query={query}
        />

      ) : (

        <List
          disablePadding
          sx={{
            p: 1
          }}
        >

          {results.map(
            (result, index) => (

              <SearchResultItem

                key={
                  result.id ??
                  result.resultId ??
                  `${result.type}-${index}`
                }

                result={
                  result
                }

                onClick={
                  onSelect
                }

              />

            )
          )}

        </List>

      )}

    </Paper>
  );
};


export default SearchResults;