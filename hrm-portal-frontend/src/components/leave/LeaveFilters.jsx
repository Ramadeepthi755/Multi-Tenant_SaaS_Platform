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
  LEAVE_STATUS_OPTIONS,
  LEAVE_TYPES
} from "../../utils/leaveUtils";


const LeaveFilters = ({
  searchInput,
  leaveType,
  status,
  fromDate,
  toDate,
  onSearchChange,
  onLeaveTypeChange,
  onStatusChange,
  onFromDateChange,
  onToDateChange,
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
        lg: "row"
      }}
      spacing={1.5}
    >

      {/* SEARCH */}

      <TextField
        size="small"
        placeholder="Search employee..."
        value={
          searchInput
        }
        onChange={event =>
          onSearchChange(
            event.target.value
          )
        }
        onKeyDown={event => {

          if (
            event.key ===
            "Enter"
          ) {
            onSearch();
          }

        }}
        sx={{
          flex: 1,
          minWidth: {
            lg: 200
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


      {/* LEAVE TYPE */}

      <Select
        size="small"
        value={
          leaveType
        }
        displayEmpty
        onChange={event =>
          onLeaveTypeChange(
            event.target.value
          )
        }
        sx={{
          minWidth: 175
        }}
      >

        <MenuItem value="">
          All Leave Types
        </MenuItem>


        {LEAVE_TYPES.map(
          item => (

            <MenuItem
              key={
                item.value
              }
              value={
                item.value
              }
            >
              {
                item.label
              }
            </MenuItem>

          )
        )}

      </Select>


      {/* STATUS */}

      <Select
        size="small"
        value={
          status
        }
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


        {LEAVE_STATUS_OPTIONS.map(
          item => (

            <MenuItem
              key={
                item.value
              }
              value={
                item.value
              }
            >
              {
                item.label
              }
            </MenuItem>

          )
        )}

      </Select>


      {/* FROM DATE */}

      <TextField
        size="small"
        type="date"
        label="From"
        value={
          fromDate
        }
        onChange={event =>
          onFromDateChange(
            event.target.value
          )
        }
        slotProps={{
          inputLabel: {
            shrink: true
          }
        }}
      />


      {/* TO DATE */}

      <TextField
        size="small"
        type="date"
        label="To"
        value={
          toDate
        }
        onChange={event =>
          onToDateChange(
            event.target.value
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
        onClick={
          onSearch
        }
        sx={{
          fontWeight: 850
        }}
      >
        Search
      </Button>


      {hasFilters && (

        <Button
          variant="text"
          onClick={
            onClear
          }
          sx={{
            fontWeight: 800
          }}
        >
          Clear
        </Button>

      )}


      <Button
        variant="outlined"
        onClick={
          onRefresh
        }
        disabled={
          loading
        }
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


export default LeaveFilters;