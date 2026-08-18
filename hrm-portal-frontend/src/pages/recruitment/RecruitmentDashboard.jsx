import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";

import {
  Work,
  People,
  Event,
  Description,
  PersonAdd,
} from "@mui/icons-material";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

import {
  getRecruitmentDashboard,
} from "../../services/recruitmentService";

const COLORS = [
  "#1976d2",
  "#2e7d32",
  "#ed6c02",
  "#d32f2f",
  "#7b1fa2",
];

const RecruitmentDashboard = () => {

  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadDashboard();

  }, []);

  const loadDashboard = async () => {

    try {

      const response =
        await getRecruitmentDashboard();

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

  const stats = [

    {
      title: "Open Jobs",
      value: dashboard?.openJobs || 0,
      icon: <Work fontSize="large" />,
    },

    {
      title: "Candidates",
      value:
        dashboard?.totalCandidates || 0,
      icon: <People fontSize="large" />,
    },

    {
      title: "Interviews Today",
      value:
        dashboard?.todayInterviews || 0,
      icon: <Event fontSize="large" />,
    },

    {
      title: "Offers Sent",
      value:
        dashboard?.offersSent || 0,
      icon: <Description fontSize="large" />,
    },

    {
      title: "Joined",
      value:
        dashboard?.joinedEmployees || 0,
      icon: <PersonAdd fontSize="large" />,
    },

  ];

  return (

    <Box>

      <Typography
        variant="h4"
        mb={3}
      >
        Recruitment Dashboard
      </Typography>

      {/* KPI Cards */}

      <Grid
        container
        spacing={3}
        mb={3}
      >

        {stats.map((item) => (

          <Grid
            item
            xs={12}
            sm={6}
            md={2.4}
            key={item.title}
          >

            <Card>

              <CardContent>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >

                  <Box>

                    <Typography
                      color="text.secondary"
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      variant="h4"
                      fontWeight="bold"
                    >
                      {item.value}
                    </Typography>

                  </Box>

                  {item.icon}

                </Box>

              </CardContent>

            </Card>

          </Grid>

        ))}

      </Grid>

      {/* Charts */}

      <Grid
        container
        spacing={3}
      >

        {/* Hiring Trend */}

        <Grid
          item
          xs={12}
          md={6}
        >

          <Card>

            <CardContent>

              <Typography
                variant="h6"
                mb={2}
              >
                Monthly Hiring Trend
              </Typography>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <LineChart
                  data={
                    dashboard?.monthlyHiring ||
                    []
                  }
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#1976d2"
                    strokeWidth={3}
                  />

                </LineChart>

              </ResponsiveContainer>

            </CardContent>

          </Card>

        </Grid>

        {/* Candidate Status */}

        <Grid
          item
          xs={12}
          md={6}
        >

          <Card>

            <CardContent>

              <Typography
                variant="h6"
                mb={2}
              >
                Candidate Status
              </Typography>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <PieChart>

                  <Pie
                    data={
                      dashboard?.candidateStatus ||
                      []
                    }
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >

                    {(dashboard?.candidateStatus || [])
                      .map((item, index) => (

                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index %
                                COLORS.length
                            ]
                          }
                        />

                      ))}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            </CardContent>

          </Card>

        </Grid>

        {/* Department Hiring */}

        <Grid
          item
          xs={12}
        >

          <Card>

            <CardContent>

              <Typography
                variant="h6"
                mb={2}
              >
                Department-wise Hiring
              </Typography>

              <ResponsiveContainer
                width="100%"
                height={350}
              >

                <BarChart
                  data={
                    dashboard?.departmentHiring ||
                    []
                  }
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis dataKey="department" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="count"
                    fill="#2e7d32"
                  />

                </BarChart>

              </ResponsiveContainer>

            </CardContent>

          </Card>

        </Grid>

      </Grid>

      {/* Recent Activities */}

      <Card sx={{ mt: 3 }}>

        <CardContent>

          <Typography
            variant="h6"
            mb={2}
          >
            Recent Recruitment Activities
          </Typography>

          {(dashboard?.recentActivities || [])
            .length === 0 ? (

            <Typography
              color="text.secondary"
            >
              No recent activities available.
            </Typography>

          ) : (

            dashboard.recentActivities.map(
              (activity, index) => (

                <Box
                  key={index}
                  py={1}
                  borderBottom="1px solid #eee"
                >

                  <Typography
                    fontWeight="bold"
                  >
                    {activity.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {activity.description}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {activity.time}
                  </Typography>

                </Box>

              )
            )

          )}

        </CardContent>

      </Card>

    </Box>

  );

};

export default RecruitmentDashboard;