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
  Download,
  Visibility,
  Search,
} from "@mui/icons-material";

import {
  downloadPayslip,
  getMyPayroll,
} from "../../services/essService";

import PayslipViewer from "./PayslipViewer";

const months = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

const MyPayroll = () => {

  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const [selectedPayroll, setSelectedPayroll] =
    useState(null);

  const [openViewer, setOpenViewer] =
    useState(false);

  const [filters, setFilters] = useState({
    month: "",
    year: "",
  });

  useEffect(() => {
    loadPayroll();
  }, [page, rowsPerPage]);

  const loadPayroll = async () => {

    try {

      setLoading(true);

      const response = await getMyPayroll({
        page,
        size: rowsPerPage,
        ...filters,
      });

      setPayrolls(response.content || []);
      setTotal(response.totalElements || 0);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  const handleSearch = () => {

    setPage(0);

    loadPayroll();

  };

  const handleDownload = async (id) => {

    try {

      const blob =
        await downloadPayslip(id);

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download = `Payslip-${id}.pdf`;

      link.click();

      window.URL.revokeObjectURL(url);

    } catch (error) {

      console.error(error);

    }

  };

  if (loading) {

    return (
      <Box
        display="flex"
        justifyContent="center"
        mt={5}
      >
        <CircularProgress />
      </Box>
    );

  }

  return (

    <Box>

      <Typography
        variant="h4"
        mb={3}
      >
        My Payroll
      </Typography>

      <Card>

        <CardHeader title="Payroll History" />

        <CardContent>

          <Grid
            container
            spacing={2}
            mb={3}
          >

            <Grid item xs={12} md={4}>

              <TextField
                fullWidth
                select
                label="Month"
                value={filters.month}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    month:
                      e.target.value,
                  })
                }
              >

                <MenuItem value="">
                  All
                </MenuItem>

                {months.map((month) => (

                  <MenuItem
                    key={month}
                    value={month}
                  >
                    {month}
                  </MenuItem>

                ))}

              </TextField>

            </Grid>

            <Grid item xs={12} md={4}>

              <TextField
                fullWidth
                label="Year"
                value={filters.year}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    year:
                      e.target.value,
                  })
                }
              />

            </Grid>

            <Grid item xs={12} md={4}>

              <Button
                fullWidth
                variant="contained"
                startIcon={<Search />}
                sx={{ height: 56 }}
                onClick={
                  handleSearch
                }
              >
                Search
              </Button>

            </Grid>

          </Grid>

          <TableContainer component={Paper}>

            <Table>

              <TableHead>

                <TableRow>

                  <TableCell>
                    Month
                  </TableCell>

                  <TableCell>
                    Year
                  </TableCell>

                  <TableCell>
                    Basic Salary
                  </TableCell>

                  <TableCell>
                    Allowances
                  </TableCell>

                  <TableCell>
                    Deductions
                  </TableCell>

                  <TableCell>
                    Net Salary
                  </TableCell>

                  <TableCell>
                    Status
                  </TableCell>

                  <TableCell align="center">
                    Actions
                  </TableCell>

                </TableRow>

              </TableHead>

              <TableBody>

                {payrolls.map(
                  (payroll) => (

                    <TableRow
                      key={
                        payroll.id
                      }
                    >

                      <TableCell>
                        {
                          payroll.month
                        }
                      </TableCell>

                      <TableCell>
                        {
                          payroll.year
                        }
                      </TableCell>

                      <TableCell>
                        ₹
                        {payroll.basicSalary}
                      </TableCell>

                      <TableCell>
                        ₹
                        {payroll.allowances}
                      </TableCell>

                      <TableCell>
                        ₹
                        {payroll.deductions}
                      </TableCell>

                      <TableCell>
                        ₹
                        {payroll.netSalary}
                      </TableCell>

                      <TableCell>

                        <Chip
                          label={
                            payroll.status
                          }
                          color="success"
                        />

                      </TableCell>

                      <TableCell
                        align="center"
                      >

                        <Button
                          startIcon={
                            <Visibility />
                          }
                          onClick={() => {

                            setSelectedPayroll(
                              payroll
                            );

                            setOpenViewer(
                              true
                            );

                          }}
                        >
                          View
                        </Button>

                        <Button
                          startIcon={
                            <Download />
                          }
                          onClick={() =>
                            handleDownload(
                              payroll.id
                            )
                          }
                        >
                          PDF
                        </Button>

                      </TableCell>

                    </TableRow>

                  )
                )}

                {payrolls.length ===
                  0 && (

                  <TableRow>

                    <TableCell
                      colSpan={8}
                      align="center"
                    >
                      No Payroll
                      Records Found
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
            rowsPerPage={
              rowsPerPage
            }
            onPageChange={(
              e,
              newPage
            ) =>
              setPage(newPage)
            }
            onRowsPerPageChange={(
              e
            ) => {

              setRowsPerPage(
                parseInt(
                  e.target.value,
                  10
                )
              );

              setPage(0);

            }}
          />

        </CardContent>

      </Card>

      <PayslipViewer
        open={openViewer}
        onClose={() =>
          setOpenViewer(false)
        }
        payroll={selectedPayroll}
      />

    </Box>

  );

};

export default MyPayroll;