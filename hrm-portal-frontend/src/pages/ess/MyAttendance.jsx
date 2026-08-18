import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
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

import Grid from "@mui/material/Grid";

import {
  Login,
  Logout,
  Search,
} from "@mui/icons-material";

import {
  checkIn,
  checkOut,
  getMyAttendance,
} from "../../services/essService";

const attendanceStatuses = [
  "PRESENT",
  "ABSENT",
  "LATE",
  "HALF_DAY",
  "ON_LEAVE",
];

const MyAttendance = () => {

  const [attendance, setAttendance] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [page, setPage] =
    useState(0);

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  const [total, setTotal] =
    useState(0);

  const [filters, setFilters] =
    useState({
      month: "",
      year: "",
      status: "",
    });

  useEffect(() => {

    loadAttendance();

  }, [page, rowsPerPage]);

  const loadAttendance = async () => {

    try {

      setLoading(true);

      const response =
        await getMyAttendance({
          page,
          size: rowsPerPage,
          ...filters,
        });

      setAttendance(
        response.content || []
      );

      setTotal(
        response.totalElements || 0
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  const handleChange = (event) => {

    const { name, value } =
      event.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const handleSearch = () => {

    setPage(0);

    loadAttendance();

  };

  const handleCheckIn =
    async () => {

      try {

        await checkIn();

        alert(
          "Checked In Successfully"
        );

        loadAttendance();

      } catch (error) {

        console.error(error);

      }

    };

  const handleCheckOut =
    async () => {

      try {

        await checkOut();

        alert(
          "Checked Out Successfully"
        );

        loadAttendance();

      } catch (error) {

        console.error(error);

      }

    };

  const getStatusColor = (
    status
  ) => {

    switch (status) {

      case "PRESENT":
        return "success";

      case "ABSENT":
        return "error";

      case "LATE":
        return "warning";

      case "HALF_DAY":
        return "info";

      case "ON_LEAVE":
        return "secondary";

      default:
        return "default";

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
        My Attendance
      </Typography>

      <Card>

        <CardHeader
          title="Attendance History"
          action={

            <Box>

              <Button
                variant="contained"
                color="success"
                startIcon={<Login />}
                sx={{ mr: 1 }}
                onClick={
                  handleCheckIn
                }
              >
                Check In
              </Button>

              <Button
                variant="contained"
                color="error"
                startIcon={<Logout />}
                onClick={
                  handleCheckOut
                }
              >
                Check Out
              </Button>

            </Box>

          }
        />

        <CardContent>

          <Grid
            container
            spacing={2}
            mb={3}
          >

            <Grid
              item
              xs={12}
              md={3}
            >

              <TextField
                fullWidth
                label="Month"
                name="month"
                value={
                  filters.month
                }
                onChange={
                  handleChange
                }
              />

            </Grid>

            <Grid
              item
              xs={12}
              md={3}
            >

              <TextField
                fullWidth
                label="Year"
                name="year"
                value={
                  filters.year
                }
                onChange={
                  handleChange
                }
              />

            </Grid>

            <Grid
              item
              xs={12}
              md={3}
            >

              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={
                  filters.status
                }
                onChange={
                  handleChange
                }
              >

                <MenuItem value="">
                  All
                </MenuItem>

                {attendanceStatuses.map(
                  (
                    status
                  ) => (

                    <MenuItem
                      key={
                        status
                      }
                      value={
                        status
                      }
                    >
                      {status.replaceAll(
                        "_",
                        " "
                      )}
                    </MenuItem>

                  )
                )}

              </TextField>

            </Grid>

            <Grid
              item
              xs={12}
              md={3}
            >

              <Button
                fullWidth
                variant="contained"
                startIcon={
                  <Search />
                }
                sx={{
                  height: 56,
                }}
                onClick={
                  handleSearch
                }
              >
                Search
              </Button>

            </Grid>

          </Grid>

          <TableContainer
            component={Paper}
          >

            <Table>

              <TableHead>

                <TableRow>

                  <TableCell>
                    Date
                  </TableCell>

                  <TableCell>
                    Check In
                  </TableCell>

                  <TableCell>
                    Check Out
                  </TableCell>

                  <TableCell>
                    Working Hours
                  </TableCell>

                  <TableCell>
                    Status
                  </TableCell>

                </TableRow>

              </TableHead>

              <TableBody>

                {attendance.map(
                  (record) => (

                    <TableRow
                      key={
                        record.id
                      }
                    >

                      <TableCell>
                        {
                          record.date
                        }
                      </TableCell>

                      <TableCell>
                        {
                          record.checkIn
                        }
                      </TableCell>

                      <TableCell>
                        {
                          record.checkOut
                        }
                      </TableCell>

                      <TableCell>
                        {
                          record.workingHours
                        }
                      </TableCell>

                      <TableCell>

                        <Chip
                          label={
                            record.status
                          }
                          color={getStatusColor(
                            record.status
                          )}
                        />

                      </TableCell>

                    </TableRow>

                  )
                )}

                {attendance.length ===
                  0 && (

                  <TableRow>

                    <TableCell
                      colSpan={5}
                      align="center"
                    >
                      No Attendance
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
              setPage(
                newPage
              )
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

    </Box>

  );

};

export default MyAttendance;