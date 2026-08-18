import {
  Button,
  MenuItem,
  Stack,
  TextField
} from "@mui/material";


import SearchOutlinedIcon
  from "@mui/icons-material/SearchOutlined";


import RestartAltOutlinedIcon
  from "@mui/icons-material/RestartAltOutlined";


const ReportFilterBar = ({
  filters,
  onChange,
  onSearch,
  onReset,
  showSearch = false,
  showDepartment = false,
  showDesignation = false,
  showStatus = false,
  showLeaveType = false,
  showFromDate = true,
  showToDate = true,
  showMonth = false,
  showYear = false,
  showEmployee = false
}) => {

  return (
    <Stack
      direction={{
        xs: "column",
        sm: "row"
      }}
      spacing={1.5}
      flexWrap="wrap"
      useFlexGap
    >

      {showSearch && (

        <TextField
          size="small"
          label="Search"
          placeholder="Search..."
          value={
            filters.search || ""
          }
          onChange={event =>
            onChange(
              "search",
              event.target.value
            )
          }
          sx={{
            minWidth: {
              sm: 230
            }
          }}
        />

      )}


      {showEmployee && (

        <TextField
          size="small"
          label="Employee ID"
          placeholder="Employee ID"
          value={
            filters.employeeId || ""
          }
          onChange={event =>
            onChange(
              "employeeId",
              event.target.value
            )
          }
          sx={{
            minWidth: 145
          }}
        />

      )}


      {showDepartment && (

        <TextField
          size="small"
          label="Department ID"
          placeholder="Department ID"
          value={
            filters.departmentId || ""
          }
          onChange={event =>
            onChange(
              "departmentId",
              event.target.value
            )
          }
          sx={{
            minWidth: 150
          }}
        />

      )}


      {showDesignation && (

        <TextField
          size="small"
          label="Designation ID"
          placeholder="Designation ID"
          value={
            filters.designationId || ""
          }
          onChange={event =>
            onChange(
              "designationId",
              event.target.value
            )
          }
          sx={{
            minWidth: 155
          }}
        />

      )}


      {showStatus && (

        <TextField
          select
          size="small"
          label="Status"
          value={
            filters.status || ""
          }
          onChange={event =>
            onChange(
              "status",
              event.target.value
            )
          }
          sx={{
            minWidth: 135
          }}
        >

          <MenuItem value="">
            All Status
          </MenuItem>

          <MenuItem value="ACTIVE">
            Active
          </MenuItem>

          <MenuItem value="INACTIVE">
            Inactive
          </MenuItem>

          <MenuItem value="PRESENT">
            Present
          </MenuItem>

          <MenuItem value="ABSENT">
            Absent
          </MenuItem>

          <MenuItem value="LATE">
            Late
          </MenuItem>

          <MenuItem value="APPROVED">
            Approved
          </MenuItem>

          <MenuItem value="REJECTED">
            Rejected
          </MenuItem>

          <MenuItem value="PENDING">
            Pending
          </MenuItem>

          <MenuItem value="PROCESSED">
            Processed
          </MenuItem>

        </TextField>

      )}


      {showLeaveType && (

        <TextField
          select
          size="small"
          label="Leave Type"
          value={
            filters.leaveType || ""
          }
          onChange={event =>
            onChange(
              "leaveType",
              event.target.value
            )
          }
          sx={{
            minWidth: 150
          }}
        >

          <MenuItem value="">
            All Leave Types
          </MenuItem>

          <MenuItem value="CASUAL_LEAVE">
            Casual Leave
          </MenuItem>

          <MenuItem value="SICK_LEAVE">
            Sick Leave
          </MenuItem>

          <MenuItem value="EARNED_LEAVE">
            Earned Leave
          </MenuItem>

          <MenuItem value="OTHER">
            Other
          </MenuItem>

        </TextField>

      )}


      {showMonth && (

        <TextField
          select
          size="small"
          label="Month"
          value={
            filters.month || ""
          }
          onChange={event =>
            onChange(
              "month",
              event.target.value
            )
          }
          sx={{
            minWidth: 125
          }}
        >

          <MenuItem value="">
            All Months
          </MenuItem>

          {[
            ["01", "January"],
            ["02", "February"],
            ["03", "March"],
            ["04", "April"],
            ["05", "May"],
            ["06", "June"],
            ["07", "July"],
            ["08", "August"],
            ["09", "September"],
            ["10", "October"],
            ["11", "November"],
            ["12", "December"]
          ].map(
            ([value, label]) => (
              <MenuItem
                key={value}
                value={value}
              >
                {label}
              </MenuItem>
            )
          )}

        </TextField>

      )}


      {showYear && (

        <TextField
          size="small"
          type="number"
          label="Year"
          value={
            filters.year || ""
          }
          onChange={event =>
            onChange(
              "year",
              event.target.value
            )
          }
          sx={{
            minWidth: 110
          }}
        />

      )}


      {showFromDate && (

        <TextField
          size="small"
          type="date"
          label="From"
          value={
            filters.fromDate || ""
          }
          onChange={event =>
            onChange(
              "fromDate",
              event.target.value
            )
          }
          slotProps={{
            inputLabel: {
              shrink: true
            }
          }}
        />

      )}


      {showToDate && (

        <TextField
          size="small"
          type="date"
          label="To"
          value={
            filters.toDate || ""
          }
          onChange={event =>
            onChange(
              "toDate",
              event.target.value
            )
          }
          slotProps={{
            inputLabel: {
              shrink: true
            }
          }}
        />

      )}


      <Button
        variant="contained"
        startIcon={
          <SearchOutlinedIcon />
        }
        onClick={
          onSearch
        }
        sx={{
          fontWeight: 850,
          minHeight: 40
        }}
      >
        Apply
      </Button>


      <Button
        variant="outlined"
        startIcon={
          <RestartAltOutlinedIcon />
        }
        onClick={
          onReset
        }
        sx={{
          fontWeight: 800,
          minHeight: 40
        }}
      >
        Reset
      </Button>

    </Stack>
  );
};


export default ReportFilterBar;