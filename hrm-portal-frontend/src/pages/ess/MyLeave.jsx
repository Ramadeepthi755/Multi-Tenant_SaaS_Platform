import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  Add,
  Delete,
  Search,
} from "@mui/icons-material";

import {
  cancelLeave,
  getLeaveBalance,
  getMyLeaves,
} from "../../services/essService";

import ApplyLeaveDialog from "./ApplyLeaveDialog";

const statusList = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
];

const MyLeave = () => {

  const [leaves, setLeaves] = useState([]);
  const [balance, setBalance] = useState({});
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const [openDialog, setOpenDialog] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    year: "",
  });

  useEffect(() => {
    loadData();
  }, [page, rowsPerPage]);

  const loadData = async () => {

    try {

      setLoading(true);

      const leaveResponse = await getMyLeaves({
        page,
        size: rowsPerPage,
        ...filters,
      });

      const balanceResponse = await getLeaveBalance();

      setLeaves(leaveResponse.content || []);
      setTotal(leaveResponse.totalElements || 0);
      setBalance(balanceResponse || {});

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  const handleSearch = () => {
    setPage(0);
    loadData();
  };

  const handleCancel = async (id) => {

    if (!window.confirm("Cancel this leave request?")) return;

    try {

      await cancelLeave(id);

      loadData();

    } catch (error) {

      console.error(error);

    }

  };

  const getStatusColor = (status) => {

    switch (status) {

      case "APPROVED":
        return "success";

      case "PENDING":
        return "warning";

      case "REJECTED":
        return "error";

      case "CANCELLED":
        return "default";

      default:
        return "primary";

    }

  };

  if (loading) {

    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  }

  return (

    <Box>

      <Typography variant="h4" mb={3}>
        My Leave
      </Typography>

      {/* Leave Balance */}

      <Grid container spacing={2} mb={3}>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">
                Casual Leave
              </Typography>
              <Typography variant="h4">
                {balance.casualLeave || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">
                Sick Leave
              </Typography>
              <Typography variant="h4">
                {balance.sickLeave || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">
                Earned Leave
              </Typography>
              <Typography variant="h4">
                {balance.earnedLeave || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">
                Total Balance
              </Typography>
              <Typography variant="h4">
                {balance.total || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      <Card>

        <CardHeader
          title="Leave History"
          action={
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
            >
              Apply Leave
            </Button>
          }
        />

        <CardContent>

          {/* Filters */}

          <Grid container spacing={2} mb={3}>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Year"
                value={filters.year}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    year: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Status"
                value={filters.status}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status: e.target.value,
                  })
                }
              >
                <MenuItem value="">All</MenuItem>

                {statusList.map((status) => (
                  <MenuItem
                    key={status}
                    value={status}
                  >
                    {status}
                  </MenuItem>
                ))}

              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Search />}
                sx={{ height: 56 }}
                onClick={handleSearch}
              >
                Search
              </Button>
            </Grid>

          </Grid>

          {/* Table */}

          <TableContainer component={Paper}>

            <Table>

              <TableHead>

                <TableRow>
                  <TableCell>Leave Type</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Days</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell align="center">
                    Action
                  </TableCell>
                </TableRow>

              </TableHead>

              <TableBody>

                {leaves.map((leave) => (

                  <TableRow key={leave.id}>

                    <TableCell>
                      {leave.leaveType}
                    </TableCell>

                    <TableCell>
                      {leave.fromDate}
                    </TableCell>

                    <TableCell>
                      {leave.toDate}
                    </TableCell>

                    <TableCell>
                      {leave.numberOfDays}
                    </TableCell>

                    <TableCell>

                      <Chip
                        label={leave.status}
                        color={getStatusColor(
                          leave.status
                        )}
                      />

                    </TableCell>

                    <TableCell>
                      {leave.reason}
                    </TableCell>

                    <TableCell align="center">

                      {leave.status === "PENDING" && (

                        <Button
                          color="error"
                          startIcon={<Delete />}
                          onClick={() =>
                            handleCancel(
                              leave.id
                            )
                          }
                        >
                          Cancel
                        </Button>

                      )}

                    </TableCell>

                  </TableRow>

                ))}

                {leaves.length === 0 && (

                  <TableRow>

                    <TableCell
                      colSpan={7}
                      align="center"
                    >
                      No Leave Records Found
                    </TableCell>

                  </TableRow>

                )}

              </TableBody>

            </Table>

          </TableContainer>

          <TablePagination
            component="div"
            count={total}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(e, newPage) =>
              setPage(newPage)
            }
            onRowsPerPageChange={(e) => {
              setRowsPerPage(
                parseInt(e.target.value, 10)
              );
              setPage(0);
            }}
          />

        </CardContent>

      </Card>

      <ApplyLeaveDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        reload={loadData}
      />

    </Box>

  );

};

export default MyLeave;