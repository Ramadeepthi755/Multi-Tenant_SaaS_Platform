import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
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
  Add,
  Delete,
  Edit,
  Search,
  Visibility,
} from "@mui/icons-material";

import {
  getInterviews,
  deleteInterview,
} from "../../services/recruitmentService";

import InterviewDialog from "./InterviewDialog";

const InterviewList = () => {

  const [interviews, setInterviews] = useState([]);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [total, setTotal] = useState(0);

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [selectedInterview, setSelectedInterview] =
    useState(null);

  const [filters, setFilters] = useState({
    keyword: "",
    interviewType: "",
    status: "",
  });

  useEffect(() => {

    loadInterviews();

  }, [page, rowsPerPage]);

  const loadInterviews = async () => {

    try {

      setLoading(true);

      const response = await getInterviews({
        page,
        size: rowsPerPage,
        ...filters,
      });

      setInterviews(response.content || []);

      setTotal(response.totalElements || 0);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  const handleFilterChange = (event) => {

    const { name, value } = event.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const handleSearch = () => {

    setPage(0);

    loadInterviews();

  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete interview?"))
      return;

    try {

      await deleteInterview(id);

      loadInterviews();

    } catch (error) {

      console.error(error);

    }

  };

  const getStatusColor = (status) => {

    switch (status) {

      case "SCHEDULED":
        return "primary";

      case "COMPLETED":
        return "success";

      case "CANCELLED":
        return "error";

      case "RESCHEDULED":
        return "warning";

      default:
        return "default";

    }

  };

  return (

    <Box>

      <Typography
        variant="h4"
        mb={3}
      >
        Interview Management
      </Typography>

      <Card>

        <CardHeader
          title="Interviews"
          action={
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {

                setSelectedInterview(null);

                setDialogOpen(true);

              }}
            >
              Schedule Interview
            </Button>
          }
        />

        <CardContent>

          <Grid
            container
            spacing={2}
            mb={3}
          >

            <Grid item xs={12} md={4}>

              <TextField
                fullWidth
                label="Search Candidate"
                name="keyword"
                value={filters.keyword}
                onChange={handleFilterChange}
              />

            </Grid>

            <Grid item xs={12} md={3}>

              <TextField
                select
                fullWidth
                label="Interview Type"
                name="interviewType"
                value={filters.interviewType}
                onChange={handleFilterChange}
              >

                <MenuItem value="">
                  All
                </MenuItem>

                <MenuItem value="HR">
                  HR
                </MenuItem>

                <MenuItem value="TECHNICAL">
                  Technical
                </MenuItem>

                <MenuItem value="MANAGERIAL">
                  Managerial
                </MenuItem>

                <MenuItem value="ONLINE">
                  Online
                </MenuItem>

              </TextField>

            </Grid>

            <Grid item xs={12} md={3}>

              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >

                <MenuItem value="">
                  All
                </MenuItem>

                <MenuItem value="SCHEDULED">
                  Scheduled
                </MenuItem>

                <MenuItem value="COMPLETED">
                  Completed
                </MenuItem>

                <MenuItem value="CANCELLED">
                  Cancelled
                </MenuItem>

                <MenuItem value="RESCHEDULED">
                  Rescheduled
                </MenuItem>

              </TextField>

            </Grid>

            <Grid item xs={12} md={2}>

              <Button
                fullWidth
                variant="contained"
                startIcon={<Search />}
                sx={{ height: "56px" }}
                onClick={handleSearch}
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
                    Candidate
                  </TableCell>

                  <TableCell>
                    Interviewer
                  </TableCell>

                  <TableCell>
                    Type
                  </TableCell>

                  <TableCell>
                    Date
                  </TableCell>

                  <TableCell>
                    Time
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
                                {interviews.map((interview) => (

                  <TableRow key={interview.interviewId}>

                    <TableCell>
                      {interview.candidateName}
                    </TableCell>

                    <TableCell>
                      {interview.interviewerName}
                    </TableCell>

                    <TableCell>
                      {interview.interviewType}
                    </TableCell>

                    <TableCell>
                      {interview.interviewDate}
                    </TableCell>

                    <TableCell>
                      {interview.interviewTime}
                    </TableCell>

                    <TableCell>

                      <Chip
                        label={interview.status}
                        color={getStatusColor(interview.status)}
                      />

                    </TableCell>

                    <TableCell align="center">

                      <IconButton>

                        <Visibility />

                      </IconButton>

                      <IconButton
                        onClick={() => {

                          setSelectedInterview(interview);

                          setDialogOpen(true);

                        }}
                      >

                        <Edit />

                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() =>
                          handleDelete(
                            interview.interviewId
                          )
                        }
                      >

                        <Delete />

                      </IconButton>

                    </TableCell>

                  </TableRow>

                ))}

                {!loading &&
                  interviews.length === 0 && (

                    <TableRow>

                      <TableCell
                        colSpan={7}
                        align="center"
                      >
                        No Interviews Found
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
            onPageChange={(event, newPage) =>
              setPage(newPage)
            }
            onRowsPerPageChange={(event) => {

              setRowsPerPage(
                parseInt(
                  event.target.value,
                  10
                )
              );

              setPage(0);

            }}
          />

        </CardContent>

      </Card>

      <InterviewDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        reload={loadInterviews}
        interview={selectedInterview}
      />

    </Box>

  );

};

export default InterviewList;
              