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
  Edit,
  Delete,
  Visibility,
  Search,
  LockOpen,
  Lock,
} from "@mui/icons-material";

import {
  getJobs,
  deleteJob,
  closeJob,
  reopenJob,
} from "../../services/recruitmentService";

import JobDialog from "./JobDialog";

const JobList = () => {

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [total, setTotal] = useState(0);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null);

  const [filters, setFilters] = useState({
    keyword: "",
    department: "",
    status: "",
  });

  useEffect(() => {
    loadJobs();
  }, [page, rowsPerPage]);

  const loadJobs = async () => {

    try {

      setLoading(true);

      const response = await getJobs({
        page,
        size: rowsPerPage,
        ...filters,
      });

      setJobs(response.content || []);

      setTotal(response.totalElements || 0);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const handleSearch = () => {

    setPage(0);

    loadJobs();

  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this job?")) return;

    try {

      await deleteJob(id);

      loadJobs();

    } catch (error) {

      console.error(error);

    }

  };

  const handleCloseJob = async (id) => {

    await closeJob(id);

    loadJobs();

  };

  const handleReopenJob = async (id) => {

    await reopenJob(id);

    loadJobs();

  };

  const getStatusColor = (status) => {

    switch (status) {

      case "OPEN":
        return "success";

      case "CLOSED":
        return "error";

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
        Job Openings
      </Typography>

      <Card>

        <CardHeader
          title="Job Management"
          action={

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {

                setSelectedJob(null);

                setDialogOpen(true);

              }}
            >
              Add Job
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
                label="Search"
                name="keyword"
                value={filters.keyword}
                onChange={handleChange}
              />

            </Grid>

            <Grid item xs={12} md={3}>

              <TextField
                select
                fullWidth
                label="Department"
                name="department"
                value={filters.department}
                onChange={handleChange}
              >

                <MenuItem value="">
                  All
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
                onChange={handleChange}
              >

                <MenuItem value="">
                  All
                </MenuItem>

                <MenuItem value="OPEN">
                  Open
                </MenuItem>

                <MenuItem value="CLOSED">
                  Closed
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

                  <TableCell>Title</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Vacancies</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Salary</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">
                    Actions
                  </TableCell>

                </TableRow>

              </TableHead>

              <TableBody>

                {jobs.map((job) => (

                  <TableRow key={job.jobId}>

                    <TableCell>
                      {job.jobTitle}
                    </TableCell>

                    <TableCell>
                      {job.departmentName}
                    </TableCell>

                    <TableCell>
                      {job.vacancies}
                    </TableCell>

                    <TableCell>
                      {job.experience}
                    </TableCell>

                    <TableCell>
                      ${job.salary}
                    </TableCell>

                    <TableCell>

                      <Chip
                        label={job.status}
                        color={getStatusColor(job.status)}
                      />

                    </TableCell>

                    <TableCell align="center">

                      <IconButton>

                        <Visibility />

                      </IconButton>

                      <IconButton
                        onClick={() => {

                          setSelectedJob(job);

                          setDialogOpen(true);

                        }}
                      >

                        <Edit />

                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() =>
                          handleDelete(job.jobId)
                        }
                      >

                        <Delete />

                      </IconButton>

                      {job.status === "OPEN" ? (

                        <IconButton
                          color="warning"
                          onClick={() =>
                            handleCloseJob(job.jobId)
                          }
                        >

                          <Lock />

                        </IconButton>

                      ) : (

                        <IconButton
                          color="success"
                          onClick={() =>
                            handleReopenJob(job.jobId)
                          }
                        >

                          <LockOpen />

                        </IconButton>

                      )}

                    </TableCell>

                  </TableRow>

                ))}

                {!loading &&
                  jobs.length === 0 && (

                    <TableRow>

                      <TableCell
                        colSpan={7}
                        align="center"
                      >
                        No Jobs Found
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

      <JobDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        reload={loadJobs}
        job={selectedJob}
      />

    </Box>

  );

};

export default JobList;