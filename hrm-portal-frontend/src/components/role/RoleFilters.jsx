import {
  Button,
  Stack,
  TextField
} from "@mui/material";


import SearchOutlinedIcon
  from "@mui/icons-material/SearchOutlined";

import RefreshOutlinedIcon
  from "@mui/icons-material/RefreshOutlined";


const RoleFilters = ({
  search,
  onSearchChange,
  onSearch,
  onClear,
  onRefresh,
  hasFilters = false,
  loading = false
}) => {

  return (
    <Stack
      direction={{
        xs: "column",
        md: "row"
      }}
      spacing={1.5}
    >

      <TextField
        size="small"
        fullWidth
        placeholder="Search roles..."
        value={search}
        onChange={event =>
          onSearchChange(
            event.target.value
          )
        }
        onKeyDown={event => {

          if (
            event.key === "Enter"
          ) {
            onSearch();
          }

        }}
        slotProps={{
          input: {
            startAdornment: (
              <SearchOutlinedIcon
                fontSize="small"
                sx={{
                  mr: 1
                }}
              />
            )
          }
        }}
      />


      <Button
        variant="contained"
        onClick={onSearch}
        sx={{
          minWidth: 100,
          fontWeight: 850
        }}
      >
        Search
      </Button>


      {hasFilters && (

        <Button
          variant="text"
          onClick={onClear}
          sx={{
            fontWeight: 800
          }}
        >
          Clear
        </Button>

      )}


      <Button
        variant="outlined"
        onClick={onRefresh}
        disabled={loading}
        startIcon={
          <RefreshOutlinedIcon />
        }
        sx={{
          fontWeight: 800
        }}
      >
        Refresh
      </Button>

    </Stack>
  );
};


export default RoleFilters;