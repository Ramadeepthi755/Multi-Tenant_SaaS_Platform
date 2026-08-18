import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  Event,
  CalendarMonth,
} from "@mui/icons-material";

import { getHolidays } from "../../services/essService";

const holidayTypes = [
  "ALL",
  "NATIONAL",
  "FESTIVAL",
  "COMPANY",
  "OPTIONAL",
];

const typeColors = {
  NATIONAL: "error",
  FESTIVAL: "warning",
  COMPANY: "primary",
  OPTIONAL: "success",
};

const Holidays = () => {

  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    type: "ALL",
  });

  useEffect(() => {
    loadHolidays();
  }, []);

  const loadHolidays = async () => {

    try {

      setLoading(true);

      const response = await getHolidays();

      setHolidays(response || []);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  const filteredHolidays = useMemo(() => {

    return holidays.filter((holiday) => {

      const holidayYear = new Date(
        holiday.date
      ).getFullYear();

      const matchYear =
        String(holidayYear) ===
        String(filters.year);

      const matchType =
        filters.type === "ALL" ||
        holiday.type === filters.type;

      return matchYear && matchType;

    });

  }, [holidays, filters]);

  const groupedHolidays = useMemo(() => {

    return filteredHolidays.reduce(
      (groups, holiday) => {

        const month = new Date(
          holiday.date
        ).toLocaleString("default", {
          month: "long",
        });

        if (!groups[month]) {

          groups[month] = [];

        }

        groups[month].push(holiday);

        return groups;

      },
      {}
    );

  }, [filteredHolidays]);

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
        Holiday Calendar
      </Typography>

      {/* Summary */}

      <Grid
        container
        spacing={2}
        mb={3}
      >

        <Grid item xs={12} md={4}>

          <Card>

            <CardContent>

              <Typography
                variant="subtitle2"
              >
                Total Holidays
              </Typography>

              <Typography variant="h4">
                {filteredHolidays.length}
              </Typography>

            </CardContent>

          </Card>

        </Grid>

        <Grid item xs={12} md={4}>

          <Card>

            <CardContent>

              <Typography
                variant="subtitle2"
              >
                National Holidays
              </Typography>

              <Typography variant="h4">
                {
                  filteredHolidays.filter(
                    (holiday) =>
                      holiday.type ===
                      "NATIONAL"
                  ).length
                }
              </Typography>

            </CardContent>

          </Card>

        </Grid>

        <Grid item xs={12} md={4}>

          <Card>

            <CardContent>

              <Typography
                variant="subtitle2"
              >
                Festival Holidays
              </Typography>

              <Typography variant="h4">
                {
                  filteredHolidays.filter(
                    (holiday) =>
                      holiday.type ===
                      "FESTIVAL"
                  ).length
                }
              </Typography>

            </CardContent>

          </Card>

        </Grid>

      </Grid>

      {/* Filters */}

      <Paper sx={{ p: 2, mb: 3 }}>

        <Grid container spacing={2}>

          <Grid item xs={12} md={6}>

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

          <Grid item xs={12} md={6}>

            <TextField
              fullWidth
              select
              label="Holiday Type"
              value={filters.type}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  type:
                    e.target.value,
                })
              }
            >

              {holidayTypes.map(
                (type) => (

                  <MenuItem
                    key={type}
                    value={type}
                  >
                    {type}
                  </MenuItem>

                )
              )}

            </TextField>

          </Grid>

        </Grid>

      </Paper>

      {/* Month Wise Holidays */}

      {Object.keys(groupedHolidays).length ===
      0 ? (

        <Typography
          align="center"
          color="text.secondary"
        >
          No Holidays Available
        </Typography>

      ) : (

        Object.entries(
          groupedHolidays
        ).map(
          ([month, holidayList]) => (

            <Card
              key={month}
              sx={{ mb: 4 }}
            >

              <CardContent>

                <Box
                  display="flex"
                  alignItems="center"
                  mb={2}
                >

                  <CalendarMonth
                    color="primary"
                    sx={{ mr: 1 }}
                  />

                  <Typography variant="h6">
                    {month}
                  </Typography>

                </Box>

                <Divider
                  sx={{ mb: 2 }}
                />

                <TableContainer>

                  <Table>

                    <TableHead>

                      <TableRow>

                        <TableCell>
                          Date
                        </TableCell>

                        <TableCell>
                          Holiday
                        </TableCell>

                        <TableCell>
                          Day
                        </TableCell>

                        <TableCell>
                          Type
                        </TableCell>

                      </TableRow>

                    </TableHead>

                    <TableBody>

                      {holidayList.map(
                        (holiday) => (

                          <TableRow
                            key={
                              holiday.id
                            }
                          >

                            <TableCell>
                              {
                                holiday.date
                              }
                            </TableCell>

                            <TableCell>

                              <Box
                                display="flex"
                                alignItems="center"
                              >

                                <Event
                                  color="primary"
                                  sx={{
                                    mr: 1,
                                  }}
                                />

                                {
                                  holiday.name
                                }

                              </Box>

                            </TableCell>

                            <TableCell>
                              {
                                holiday.day
                              }
                            </TableCell>

                            <TableCell>

                              <Chip
                                label={
                                  holiday.type
                                }
                                color={
                                  typeColors[
                                    holiday.type
                                  ] ||
                                  "default"
                                }
                                size="small"
                              />

                            </TableCell>

                          </TableRow>

                        )
                      )}

                    </TableBody>

                  </Table>

                </TableContainer>

              </CardContent>

            </Card>

          )
        )

      )}

    </Box>

  );

};

export default Holidays;