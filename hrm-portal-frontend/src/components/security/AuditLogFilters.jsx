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


const AuditLogFilters = ({
  filters,
  onChange,
  onSearch,
  onReset
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

      <TextField
        size="small"
        label="Search"
        placeholder="User, email, action..."
        value={
          filters.search
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


      <TextField
        select
        size="small"
        label="Module"
        value={
          filters.module
        }
        onChange={event =>
          onChange(
            "module",
            event.target.value
          )
        }
        sx={{
          minWidth: 150
        }}
      >

        <MenuItem value="">
          All Modules
        </MenuItem>

        <MenuItem value="AUTH">
          Authentication
        </MenuItem>

        <MenuItem value="COMPANY">
          Company
        </MenuItem>

        <MenuItem value="DEPARTMENT">
          Department
        </MenuItem>

        <MenuItem value="DESIGNATION">
          Designation
        </MenuItem>

        <MenuItem value="EMPLOYEE">
          Employee
        </MenuItem>

        <MenuItem value="ATTENDANCE">
          Attendance
        </MenuItem>

        <MenuItem value="LEAVE">
          Leave
        </MenuItem>

        <MenuItem value="PAYROLL">
          Payroll
        </MenuItem>

        <MenuItem value="DOCUMENT">
          Documents
        </MenuItem>

        <MenuItem value="SYSTEM">
          System
        </MenuItem>

      </TextField>


      <TextField
        select
        size="small"
        label="Action"
        value={
          filters.action
        }
        onChange={event =>
          onChange(
            "action",
            event.target.value
          )
        }
        sx={{
          minWidth: 145
        }}
      >

        <MenuItem value="">
          All Actions
        </MenuItem>

        <MenuItem value="CREATE">
          Create
        </MenuItem>

        <MenuItem value="UPDATE">
          Update
        </MenuItem>

        <MenuItem value="DELETE">
          Delete
        </MenuItem>

        <MenuItem value="LOGIN">
          Login
        </MenuItem>

        <MenuItem value="LOGOUT">
          Logout
        </MenuItem>

        <MenuItem value="APPROVE">
          Approve
        </MenuItem>

        <MenuItem value="REJECT">
          Reject
        </MenuItem>

        <MenuItem value="DOWNLOAD">
          Download
        </MenuItem>

        <MenuItem value="UPLOAD">
          Upload
        </MenuItem>

      </TextField>


      <TextField
        select
        size="small"
        label="Status"
        value={
          filters.status
        }
        onChange={event =>
          onChange(
            "status",
            event.target.value
          )
        }
        sx={{
          minWidth: 125
        }}
      >

        <MenuItem value="">
          All Status
        </MenuItem>

        <MenuItem value="SUCCESS">
          Success
        </MenuItem>

        <MenuItem value="FAILED">
          Failed
        </MenuItem>

        <MenuItem value="DENIED">
          Denied
        </MenuItem>

        <MenuItem value="PENDING">
          Pending
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


      <TextField
        size="small"
        type="date"
        label="To"
        value={
          filters.toDate
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
        Search
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


export default AuditLogFilters;