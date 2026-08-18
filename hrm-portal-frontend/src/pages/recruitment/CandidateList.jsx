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
  TableRow,
  TablePagination,
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
  UploadFile,
  Download,
} from "@mui/icons-material";

import {
  getCandidates,
  deleteCandidate,
  uploadResume,
} from "../../services/recruitmentService";

import CandidateDialog from "./CandidateDialog";

const CandidateList = () => {

  const [candidates, setCandidates] = useState([]);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [total, setTotal] = useState(0);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedCandidate, setSelectedCandidate] =
    useState(null);

  const [filters, setFilters] = useState({
    keyword: "",
    status: "",
  });

  useEffect(() => {

    loadCandidates();

  }, [page, rowsPerPage]);

  const loadCandidates = async () => {

    try {

      setLoading(true);

      const response = await getCandidates({
        page,
        size: rowsPerPage,
        ...filters,
      });

      setCandidates(response.content || []);

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

    loadCandidates();

  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this candidate?"))
      return;

    try {

      await deleteCandidate(id);

      loadCandidates();

    } catch (error) {

      console.error(error);

    }

  };

  const handleResumeUpload = async (
    candidates,
    file  ) => {

    if (!file) return;

    try {

      await uploadResume(candidateId, file);

      loadCandidates();

      alert("Resume uploaded successfully.");

    } catch (error) {

      console.error(error);

      alert("Failed to upload resume.");

    }

  };

  const getStatusColor = (status) => {

    switch (status) {

      case "APPLIED":
        return "primary";

      case "SHORTLISTED":
        return "info";

      case "INTERVIEW_SCHEDULED":
        return "warning";

      case "SELECTED":
        return "success";

      case "REJECTED":
        return "error";

      case "JOINED":
        return "success";

      default:
        return "default";

    }

  };

  return (

    <Box>

      <Typography variant="h4" mb={3}>
        Candidate Management
      </Typography>

      <Card>

        <CardHeader
          title="Candidates"
          action={
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setSelectedCandidate(null);
                setDialogOpen(true);
              }}
            >
              Add Candidate
            </Button>
          }
        />

        <CardContent>

          <Grid container spacing={2} mb={3}>

            <Grid item xs={12} md={5}>
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
                label="Status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="APPLIED">Applied</MenuItem>
                <MenuItem value="SHORTLISTED">Shortlisted</MenuItem>
                <MenuItem value="INTERVIEW_SCHEDULED">
                  Interview Scheduled
                </MenuItem>
                <MenuItem value="SELECTED">Selected</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
                <MenuItem value="JOINED">Joined</MenuItem>
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

                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">
                    Actions
                  </TableCell>

                </TableRow>

              </TableHead>

              <TableBody>

                {candidates.map((candidate) => (

                  <TableRow key={candidate.candidateId}>

                    <TableCell>
                      {candidate.fullName}
                    </TableCell>

                    <TableCell>
                      {candidate.email}
                    </TableCell>

                    <TableCell>
                      {candidate.phone}
                    </TableCell>

                    <TableCell>
                      {candidate.experience}
                    </TableCell>

                    <TableCell>

                      <Chip
                        label={candidate.status}
                        color={getStatusColor(candidate.status)}
                      />

                    </TableCell>

                    <TableCell align="center">

                      <IconButton>
                        <Visibility />
                      </IconButton>

                      <IconButton
                        onClick={() => {
                          setSelectedCandidate(candidate);
                          setDialogOpen(true);
                        }}
                      >
                        <Edit />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() =>
                          handleDelete(candidate.candidateId)
                        }
                      >
                        <Delete />
                      </IconButton>

                      <IconButton component="label">
                        <UploadFile />

                        <input
                          hidden
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(event) =>
                            handleResumeUpload(
                              candidate.candidateId,
                              event.target.files[0]
                            )
                          }
                        />

                      </IconButton>

                      {candidate.resumeUrl && (

                        <IconButton
                          component="a"
                          href={candidate.resumeUrl}
                          target="_blank"
                        >
                          <Download />
                        </IconButton>

                      )}

                    </TableCell>

                  </TableRow>

                ))}

                {!loading &&
                  candidates.length === 0 && (

                    <TableRow>

                      <TableCell
                        colSpan={6}
                        align="center"
                      >
                        No Candidates Found
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
                parseInt(event.target.value, 10)
              );

              setPage(0);

            }}
          />

        </CardContent>

      </Card>

      <CandidateDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        reload={loadCandidates}
        candidate={selectedCandidate}
      />

    </Box>

  );

};

export default CandidateList;