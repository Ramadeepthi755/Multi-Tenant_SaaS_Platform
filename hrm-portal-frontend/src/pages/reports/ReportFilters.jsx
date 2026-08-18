import {
  Box,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";

import Grid from "@mui/material/Grid";

import {
  Search,
  Refresh,
} from "@mui/icons-material";

const ReportFilters = ({
  filters,
  onChange,
  onSearch,
  onReset,
  showEmployee = true,
  showDepartment = false,
  showDesignation = false,
  showStatus = true,
  showDateRange = true,
}) => {

  return (

    <Box mb={3}>

      <Grid container spacing={2}>

        {showEmployee && (

          <Grid item xs={12} md={3}>

            <TextField
              fullWidth
              label="Employee"
              name="employeeName"
              value={filters.employeeName || ""}
              onChange={onChange}
            />

          </Grid>

        )}

        {showDepartment && (

          <Grid item xs={12} md={3}>

            <TextField
              select
              fullWidth
              label="Department"
              name="department"
              value={filters.department || ""}
              onChange={onChange}
            >

              <MenuItem value="">
                All
              </MenuItem>

            </TextField>

          </Grid>

        )}

        {showDesignation && (

          <Grid item xs={12} md={3}>

            <TextField
              select
              fullWidth
              label="Designation"
              name="designation"
              value={filters.designation || ""}
              onChange={onChange}
            >

              <MenuItem value="">
                All
              </MenuItem>

            </TextField>

          </Grid>

        )}

        {showStatus && (

          <Grid item xs={12} md={3}>

            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={filters.status || ""}
              onChange={onChange}
            >

              <MenuItem value="">
                All
              </MenuItem>

              <MenuItem value="ACTIVE">
                Active
              </MenuItem>

              <MenuItem value="INACTIVE">
                Inactive
              </MenuItem>

              <MenuItem value="PENDING">
                Pending
              </MenuItem>

              <MenuItem value="APPROVED">
                Approved
              </MenuItem>

              <MenuItem value="REJECTED">
                Rejected
              </MenuItem>

            </TextField>

          </Grid>

        )}

        {showDateRange && (

          <>

            <Grid item xs={12} md={3}>

              <TextField
                fullWidth
                type="date"
                label="From Date"
                name="fromDate"
                value={filters.fromDate || ""}
                onChange={onChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />

            </Grid>

            <Grid item xs={12} md={3}>

              <TextField
                fullWidth
                type="date"
                label="To Date"
                name="toDate"
                value={filters.toDate || ""}
                onChange={onChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />

            </Grid>

          </>

        )}

        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="flex-end"
          gap={2}
        >

          <Button
            variant="outlined"
            color="secondary"
            startIcon={<Refresh />}
            onClick={onReset}
          >
            Reset
          </Button>

          <Button
            variant="contained"
            startIcon={<Search />}
            onClick={onSearch}
          >
            Search
          </Button>

        </Grid>

      </Grid>

    </Box>

  );

};

export default ReportFilters;