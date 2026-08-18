import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

import {
  AccessTime,
  BeachAccess,
  Campaign,
  Event,
  MonetizationOn,
  Person,
} from "@mui/icons-material";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import { getEmployeeDashboard } from "../../services/essService";

const COLORS = [
  "#1976d2",
  "#2e7d32",
  "#ed6c02",
  "#d32f2f",
];

const EmployeeDashboard = () => {

  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {

    try {

      const response = await getEmployeeDashboard();

      setDashboard(response);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

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

  const attendanceData = [

    {
      name: "Present",
      value: dashboard?.attendance?.present || 0,
    },

    {
      name: "Absent",
      value: dashboard?.attendance?.absent || 0,
    },

    {
      name: "Leave",
      value: dashboard?.attendance?.leave || 0,
    },

    {
      name: "Late",
      value: dashboard?.attendance?.late || 0,
    },

  ];

  return (

    <Box>

      <Typography
        variant="h4"
        mb={3}
      >
        Employee Dashboard
      </Typography>

      {/* KPI Cards */}

      <Grid container spacing={3} mb={3}>

        <Grid item xs={12} sm={6} md={3}>

          <Card>

            <CardContent>

              <Person color="primary" />

              <Typography variant="h6">
                Welcome
              </Typography>

              <Typography>
                {dashboard?.employeeName}
              </Typography>

            </CardContent>

          </Card>

        </Grid>

        <Grid item xs={12} sm={6} md={3}>

          <Card>

            <CardContent>

              <AccessTime color="success" />

              <Typography variant="h6">
                Today
              </Typography>

              <Typography>
                {dashboard?.todayStatus}
              </Typography>

            </CardContent>

          </Card>

        </Grid>

        <Grid item xs={12} sm={6} md={3}>

          <Card>

            <CardContent>

              <BeachAccess color="warning" />

              <Typography variant="h6">
                Leave Balance
              </Typography>

              <Typography variant="h5">
                {dashboard?.leaveBalance}
              </Typography>

            </CardContent>

          </Card>

        </Grid>

        <Grid item xs={12} sm={6} md={3}>

          <Card>

            <CardContent>

              <MonetizationOn color="success" />

              <Typography variant="h6">
                Latest Salary
              </Typography>

              <Typography>
                ₹ {dashboard?.latestSalary}
              </Typography>

            </CardContent>

          </Card>

        </Grid>

      </Grid>

      {/* Charts */}

      <Grid container spacing={3}>

        <Grid item xs={12} md={6}>

          <Card>

            <CardContent>

              <Typography
                variant="h6"
                mb={2}
              >
                Attendance Summary
              </Typography>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <PieChart>

                  <Pie
                    data={attendanceData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >

                    {attendanceData.map(
                      (_, index) => (

                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index %
                              COLORS.length
                            ]
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            </CardContent>

          </Card>

        </Grid>

        <Grid item xs={12} md={6}>

          <Card>

            <CardContent>

              <Typography
                variant="h6"
                gutterBottom
              >
                Upcoming Holidays
              </Typography>

              <List>

                {(dashboard?.holidays || []).map(
                  (holiday) => (

                    <ListItem
                      key={holiday.id}
                    >

                      <Event
                        color="primary"
                        sx={{ mr: 2 }}
                      />

                      <ListItemText
                        primary={
                          holiday.name
                        }
                        secondary={
                          holiday.date
                        }
                      />

                    </ListItem>

                  )
                )}

              </List>

            </CardContent>

          </Card>

        </Grid>

      </Grid>

      {/* Announcements */}

      <Card sx={{ mt: 3 }}>

        <CardContent>

          <Typography
            variant="h6"
            gutterBottom
          >
            <Campaign
              sx={{
                mr: 1,
                verticalAlign:
                  "middle",
              }}
            />
            Latest Announcements
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {(dashboard?.announcements || [])
            .length === 0 ? (

            <Typography
              color="text.secondary"
            >
              No announcements available.
            </Typography>

          ) : (

            <List>

              {dashboard.announcements.map(
                (
                  announcement,
                  index
                ) => (

                  <ListItem
                    key={index}
                  >

                    <ListItemText
                      primary={
                        announcement.title
                      }
                      secondary={
                        announcement.message
                      }
                    />

                  </ListItem>

                )
              )}

            </List>

          )}

        </CardContent>

      </Card>

    </Box>

  );

};

export default EmployeeDashboard;