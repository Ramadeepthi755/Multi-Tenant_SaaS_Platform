import {
  Button,
  MenuItem,
  Select,
  Stack,
  TextField
} from "@mui/material";


import SearchOutlinedIcon
  from "@mui/icons-material/SearchOutlined";

import RefreshOutlinedIcon
  from "@mui/icons-material/RefreshOutlined";


import {
  MONTH_OPTIONS,
  PAYROLL_STATUS_OPTIONS,
  getYearOptions
} from "../../utils/payrollUtils";


const PayrollFilters = ({
  searchInput,
  month,
  year,
  status,
  onSearchChange,
  onMonthChange,
  onYearChange,
  onStatusChange,
  onSearch,
  onClear,
  onRefresh,
  hasFilters = false,
  loading = false
}) => {

  const years =
    getYearOptions(5);


  return (
    <Stack
      direction={{
        xs: "column",
        lg: "row"
      }}
      spacing={1.5}
    >

      <TextField
        size="small"
        placeholder="Search employee..."
        value={searchInput}
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
        sx={{
          flex: 1,
          minWidth: {
            lg: 220
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


      <Select
        size="small"
        value={month}
        displayEmpty
        onChange={event =>
          onMonthChange(
            event.target.value
          )
        }
        sx={{
          minWidth: 145
        }}
      >

        <MenuItem value="">
          All Months
        </MenuItem>

        {MONTH_OPTIONS.map(item => (

          <MenuItem
            key={item.value}
            value={item.value}
          >
            {item.label}
          </MenuItem>

        ))}

      </Select>


      <Select
        size="small"
        value={year}
        displayEmpty
        onChange={event =>
          onYearChange(
            event.target.value
          )
        }
        sx={{
          minWidth: 115
        }}
      >

        <MenuItem value="">
          All Years
        </MenuItem>

        {years.map(item => (

          <MenuItem
            key={item}
            value={item}
          >
            {item}
          </MenuItem>

        ))}

      </Select>


      <Select
        size="small"
        value={status}
        displayEmpty
        onChange={event =>
          onStatusChange(
            event.target.value
          )
        }
        sx={{
          minWidth: 145
        }}
      >

        <MenuItem value="">
          All Status
        </MenuItem>

        {PAYROLL_STATUS_OPTIONS.map(
          item => (

            <MenuItem
              key={item.value}
              value={item.value}
            >
              {item.label}
            </MenuItem>

          )
        )}

      </Select>


      <Button
        variant="contained"
        onClick={onSearch}
        sx={{
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


export default PayrollFilters;