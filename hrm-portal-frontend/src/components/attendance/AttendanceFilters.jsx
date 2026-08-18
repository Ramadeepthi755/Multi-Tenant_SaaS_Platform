import {
  Button,
  InputAdornment,
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
  ATTENDANCE_STATUS_OPTIONS
} from "../../utils/attendanceUtils";


const AttendanceFilters = ({
  date,
  searchInput,
  status,
  departmentId,
  departments = [],
  onDateChange,
  onSearchChange,
  onStatusChange,
  onDepartmentChange,
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
      alignItems={{
        xs: "stretch",
        md: "center"
      }}
    >

      {/* =====================================================
          DATE
      ===================================================== */}

      <TextField
        size="small"
        type="date"
        label="Date"
        value={
          date
        }
        onChange={event =>
          onDateChange(
            event.target.value
          )
        }
        slotProps={{
          inputLabel: {
            shrink: true
          }
        }}
        sx={{
          minWidth: {
            md: 170
          }
        }}
      />


      {/* =====================================================
          SEARCH
      ===================================================== */}

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
            md: 220
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
            )
          }
        }}
      />


      {/* =====================================================
          STATUS
      ===================================================== */}

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
          minWidth: 170
        }}
      >

        <MenuItem value="">
          All Status
        </MenuItem>


        {ATTENDANCE_STATUS_OPTIONS.map(
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


      {/* =====================================================
          DEPARTMENT
      ===================================================== */}

      <Select
        size="small"
        value={
          departmentId
        }
        displayEmpty
        onChange={event =>
          onDepartmentChange(
            event.target.value
          )
        }
        sx={{
          minWidth: 180
        }}
      >

        <MenuItem value="">
          All Departments
        </MenuItem>


        {departments.map(
          department => {

            const id =
              department.id ??
              department.departmentId;

            const name =
              department.departmentName ??
              department.name ??
              "Department";

            return (

              <MenuItem
                key={id}
                value={id}
              >
                {name}
              </MenuItem>

            );

          }
        )}

      </Select>


      {/* =====================================================
          SEARCH BUTTON
      ===================================================== */}

      <Button
        variant="contained"
        onClick={
          onSearch
        }
        sx={{
          minWidth: 90,
          fontWeight: 850
        }}
      >
        Search
      </Button>


      {/* =====================================================
          CLEAR
      ===================================================== */}

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


      {/* =====================================================
          REFRESH
      ===================================================== */}

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
          minWidth: 105,
          fontWeight: 800
        }}
      >
        Refresh
      </Button>

    </Stack>
  );
};


export default AttendanceFilters;