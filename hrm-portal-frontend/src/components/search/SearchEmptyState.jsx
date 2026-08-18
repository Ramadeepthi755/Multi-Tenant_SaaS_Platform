import {
  Box,
  Typography
} from "@mui/material";


import SearchOffOutlinedIcon
  from "@mui/icons-material/SearchOffOutlined";


const SearchEmptyState = ({
  query = ""
}) => {

  return (
    <Box
      sx={{
        py: 5,
        px: 2,
        textAlign: "center"
      }}
    >

      <SearchOffOutlinedIcon
        sx={{
          fontSize: 44,
          color: "text.disabled",
          mb: 1
        }}
      />


      <Typography
        fontWeight={800}
      >
        No results found
      </Typography>


      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mt: 0.5
        }}
      >
        {query
          ? `Nothing matched "${query}".`
          : "Try searching for an employee, department or other HR record."}
      </Typography>

    </Box>
  );
};


export default SearchEmptyState;