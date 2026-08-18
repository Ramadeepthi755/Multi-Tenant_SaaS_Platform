import { useEffect, useMemo, useState } from "react";

import {
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Grid,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  Search,
  Visibility,
} from "@mui/icons-material";

import PayrollDialog from "./PayrollDialog";
import PayrollDetails from "./PayrollDetails";

import {
  getPayrolls,
  deletePayroll,
} from "../../services/payrollService";

const PayrollList = () => {

  const [payrolls, setPayrolls] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [monthFilter, setMonthFilter] = useState("");

  const [selectedPayroll, setSelectedPayroll] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);

  const loadPayrolls = async () => {

    try {

      setLoading(true);

      const data = await getPayrolls();

      setPayrolls(data);

    } catch (error) {

      console.error(
        "Error loading payrolls",
        error
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadPayrolls();

  }, []);

  const filteredPayrolls = useMemo(() => {

    return payrolls.filter((payroll) => {

      const employeeName =
        payroll.employeeName?.toLowerCase() || "";

      const employeeCode =
        String(payroll.employeeId || "");

      const keyword =
        search.toLowerCase();

      const matchesSearch =
        employeeName.includes(keyword) ||
        employeeCode.includes(keyword);

      const matchesStatus =
        !statusFilter ||
        payroll.payrollStatus === statusFilter;

      const matchesMonth =
        !monthFilter ||
        payroll.month === monthFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMonth
      );

    });

  }, [
    payrolls,
    search,
    statusFilter,
    monthFilter,
  ]);

  const openAddDialog = () => {

    setSelectedPayroll(null);

    setDialogOpen(true);

  };

  const openEditDialog = (payroll) => {

    setSelectedPayroll(payroll);

    setDialogOpen(true);

  };

  const openDetails = (payroll) => {

    setSelectedPayroll(payroll);

    setDetailsOpen(true);

  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this payroll record?"
    );

    if (!confirmDelete) return;

    try {

      await deletePayroll(id);

      loadPayrolls();

    } catch (error) {

      console.error(error);

      alert("Unable to delete payroll.");

    }

  };

  const statusChip = (status) => {

    switch (status) {

      case "PAID":
        return (
          <Chip
            label="Paid"
            color="success"
            size="small"
          />
        );

      case "PENDING":
        return (
          <Chip
            label="Pending"
            color="warning"
            size="small"
          />
        );

      case "GENERATED":
        return (
          <Chip
            label="Generated"
            color="info"
            size="small"
          />
        );

      default:
        return (
          <Chip
            label={status}
            size="small"
          />
        );

    }

  };

  return (

    <Card>

      <CardContent>

        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
          }}
        >

          <Typography variant="h5">
            Payroll Management
          </Typography>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openAddDialog}
          >
            Generate Payroll
          </Button>

        </Toolbar>

        <Grid
          container
          spacing={2}
          sx={{ mb: 3 }}
        >

          <Grid size={{ xs: 12, md: 4 }}>

            <TextField
              fullWidth
              placeholder="Search Employee..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />

          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>

            <TextField
              select
              fullWidth
              label="Status"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >

              <MenuItem value="">
                All
              </MenuItem>

              <MenuItem value="GENERATED">
                Generated
              </MenuItem>

              <MenuItem value="PENDING">
                Pending
              </MenuItem>

              <MenuItem value="PAID">
                Paid
              </MenuItem>

            </TextField>

          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>

            <TextField
              select
              fullWidth
              label="Month"
              value={monthFilter}
              onChange={(e) =>
                setMonthFilter(e.target.value)
              }
            >

              <MenuItem value="">All</MenuItem>
              <MenuItem value="JANUARY">January</MenuItem>
              <MenuItem value="FEBRUARY">February</MenuItem>
              <MenuItem value="MARCH">March</MenuItem>
              <MenuItem value="APRIL">April</MenuItem>
              <MenuItem value="MAY">May</MenuItem>
              <MenuItem value="JUNE">June</MenuItem>
              <MenuItem value="JULY">July</MenuItem>
              <MenuItem value="AUGUST">August</MenuItem>
              <MenuItem value="SEPTEMBER">September</MenuItem>
              <MenuItem value="OCTOBER">October</MenuItem>
              <MenuItem value="NOVEMBER">November</MenuItem>
              <MenuItem value="DECEMBER">December</MenuItem>

            </TextField>

          </Grid>

        </Grid>

        <TableContainer component={Paper}>

          <Table>

            <TableHead>

              <TableRow>

                <TableCell>Employee</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Month</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Net Salary</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">
                  Actions
                </TableCell>

              </TableRow>

            </TableHead>
                        <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                  >
                    Loading Payroll Records...
                  </TableCell>
                </TableRow>
              ) : filteredPayrolls.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                  >
                    No Payroll Records Found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayrolls.map((payroll) => (
                  <TableRow
                    key={payroll.payrollId}
                    hover
                  >
                    <TableCell>

                      <Typography
                        fontWeight="bold"
                      >
                        {payroll.employeeName}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        ID : {payroll.employeeId}
                      </Typography>

                    </TableCell>

                    <TableCell>
                      {payroll.departmentName}
                    </TableCell>

                    <TableCell>
                      {payroll.month
                        ? payroll.month.charAt(0) +
                          payroll.month
                            .slice(1)
                            .toLowerCase()
                        : "-"}
                    </TableCell>

                    <TableCell>
                      {payroll.year}
                    </TableCell>

                    <TableCell>

                      <Typography
                        fontWeight="bold"
                        color="success.main"
                      >
                        {new Intl.NumberFormat(
                          "en-IN",
                          {
                            style: "currency",
                            currency: "INR",
                          }
                        ).format(
                          payroll.netSalary || 0
                        )}
                      </Typography>

                    </TableCell>

                    <TableCell>
                      {statusChip(
                        payroll.payrollStatus
                      )}
                    </TableCell>

                    <TableCell
                      align="center"
                    >

                      <Tooltip title="View">

                        <IconButton
                          color="primary"
                          onClick={() =>
                            openDetails(
                              payroll
                            )
                          }
                        >
                          <Visibility />
                        </IconButton>

                      </Tooltip>

                      <Tooltip title="Edit">

                        <IconButton
                          color="warning"
                          onClick={() =>
                            openEditDialog(
                              payroll
                            )
                          }
                        >
                          <Edit />
                        </IconButton>

                      </Tooltip>

                      <Tooltip title="Delete">

                        <IconButton
                          color="error"
                          onClick={() =>
                            handleDelete(
                              payroll.payrollId
                            )
                          }
                        >
                          <Delete />
                        </IconButton>

                      </Tooltip>

                    </TableCell>

                  </TableRow>
                ))
              )}
            </TableBody>

          </Table>

        </TableContainer>
              </CardContent>

      <PayrollDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedPayroll(null);
        }}
        payroll={selectedPayroll}
        reload={loadPayrolls}
      />

      <PayrollDetails
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedPayroll(null);
        }}
        payroll={selectedPayroll}
      />

    </Card>

  );

};

export default PayrollList;