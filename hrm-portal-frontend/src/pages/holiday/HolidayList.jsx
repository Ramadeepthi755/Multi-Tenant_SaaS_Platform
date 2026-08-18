import { useEffect, useMemo, useState } from "react";

import {
  Add,
  Delete,
  Edit,
  Search,
  Visibility,
} from "@mui/icons-material";

import {
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
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

import HolidayDialog from "./HolidayDialog";
import HolidayDetails from "./HolidayDetails";

import {
  getHolidays,
  deleteHoliday,
} from "../../services/holidayService";

const HolidayList = () => {

  const [holidays, setHolidays] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [yearFilter, setYearFilter] = useState("");

  const [typeFilter, setTypeFilter] = useState("");

  const [selectedHoliday, setSelectedHoliday] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);

  const loadHolidays = async () => {

    try {

      setLoading(true);

const data = await getHolidays();
setHolidays(data.content || []);
      

    } catch (error) {

      console.error(
        "Error loading holidays",
        error
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadHolidays();

  }, []);

 const filteredHolidays = useMemo(() => {

  if (!Array.isArray(holidays)) {
    return [];
  }

  return holidays.filter((holiday) => {

    const keyword = search.toLowerCase();

    const matchesSearch =
      holiday.holidayName
        ?.toLowerCase()
        .includes(keyword);

    const matchesYear =
      !yearFilter ||
      String(holiday.year) === yearFilter;

    const matchesType =
      !typeFilter ||
      holiday.holidayType === typeFilter;

    return (
      matchesSearch &&
      matchesYear &&
      matchesType
    );

  });

}, [
  holidays,
  search,
  yearFilter,
  typeFilter,
]);

  const openAddDialog = () => {

    setSelectedHoliday(null);

    setDialogOpen(true);

  };

  const openEditDialog = (holiday) => {

    setSelectedHoliday(holiday);

    setDialogOpen(true);

  };

  const openDetails = (holiday) => {

    setSelectedHoliday(holiday);

    setDetailsOpen(true);

  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this holiday?"
    );

    if (!confirmDelete) return;

    try {

      await deleteHoliday(id);

      loadHolidays();

    } catch (error) {

      console.error(error);

      alert("Unable to delete holiday.");

    }

  };

  const statusChip = (status) => {

    return (
      <Chip
        label={status}
        color={
          status === "ACTIVE"
            ? "success"
            : "default"
        }
        size="small"
      />
    );

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
            mb: 2,
          }}
        >

          <Typography variant="h5">
            Holiday Management
          </Typography>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openAddDialog}
          >
            Add Holiday
          </Button>

        </Toolbar>

        <Grid
          container
          spacing={2}
          mb={3}
        >

          <Grid item xs={12} md={4}>

            <TextField
              fullWidth
              placeholder="Search Holiday..."
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

          <Grid item xs={12} md={4}>

            <TextField
              fullWidth
              label="Year"
              value={yearFilter}
              onChange={(e) =>
                setYearFilter(e.target.value)
              }
            />

          </Grid>

          <Grid item xs={12} md={4}>

            <TextField
              select
              fullWidth
              label="Holiday Type"
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value)
              }
            >

              <MenuItem value="">
                All
              </MenuItem>

              <MenuItem value="NATIONAL">
                National
              </MenuItem>

              <MenuItem value="FESTIVAL">
                Festival
              </MenuItem>

              <MenuItem value="COMPANY">
                Company
              </MenuItem>

              <MenuItem value="OPTIONAL">
                Optional
              </MenuItem>

            </TextField>

          </Grid>

        </Grid>

        <TableContainer component={Paper}>

          <Table>

            <TableHead>

              <TableRow>

                <TableCell>Holiday</TableCell>

                <TableCell>Date</TableCell>

                <TableCell>Day</TableCell>

                <TableCell>Type</TableCell>

                <TableCell>Year</TableCell>

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
  Loading Holidays...
</TableCell>

                </TableRow>

              ) : filteredHolidays.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={7}
                    align="center"
                  >
                    No Holidays Found
                  </TableCell>

                </TableRow>

              ) : (

                filteredHolidays.map((holiday) => (

                  <TableRow
                    hover
                    key={holiday.holidayId}
                  >

                    <TableCell>
                      {holiday.holidayName}
                    </TableCell>

                    <TableCell>
                      {holiday.holidayDate}
                    </TableCell>

                   <TableCell>
  {new Date(holiday.holidayDate).toLocaleDateString("en-US", {
    weekday: "long",
  })}
</TableCell>

                    <TableCell>

                      <Chip
                        label={holiday.holidayType}
                        color="primary"
                        size="small"
                      />

                    </TableCell>

                    <TableCell>
                      {holiday.year}
                    </TableCell>

                    <TableCell>
                      {statusChip(holiday.status)}
                    </TableCell>

                    <TableCell align="center">

                      <Tooltip title="View">

                        <IconButton
                          color="info"
                          onClick={() =>
                            openDetails(holiday)
                          }
                        >

                          <Visibility />

                        </IconButton>

                      </Tooltip>

                      <Tooltip title="Edit">

                        <IconButton
                          color="primary"
                          onClick={() =>
                            openEditDialog(holiday)
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
                              holiday.holidayId
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

      <HolidayDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        holiday={selectedHoliday}
        reload={loadHolidays}
      />

      <HolidayDetails
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        holiday={selectedHoliday}
      />

    </Card>

  );

};

export default HolidayList;
     