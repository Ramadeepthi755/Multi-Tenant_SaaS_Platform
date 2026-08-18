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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";

import { getDashboardAnalytics } from "../../services/reportService";

const COLORS = [
  "#1976d2",
  "#2e7d32",
  "#ed6c02",
  "#d32f2f",
  "#9c27b0",
  "#00acc1",
];

const DashboardAnalytics = () => {

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    monthlyPayroll: 0,

    genderDistribution: [],

    departmentDistribution: [],

    monthlyHiring: [],

    attendanceTrend: [],
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {

    try {

      const response = await getDashboardAnalytics();

      setData(response);

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

  return (

    <Box>

      <Typography
        variant="h4"
        mb={3}
      >
        Dashboard Analytics
      </Typography>

      {/* KPI Cards */}

      <Grid container spacing={3} mb={3}>

        <Grid item xs={12} md={3}>

          <Card>

            <CardContent>

              <Typography color="text.secondary">
                Total Employees
              </Typography>

              <Typography variant="h4">
                {data.totalEmployees}
              </Typography>

            </CardContent>

          </Card>

        </Grid>

        <Grid item xs={12} md={3}>

          <Card>

            <CardContent>

              <Typography color="text.secondary">
                Present Today
              </Typography>

              <Typography variant="h4">
                {data.presentToday}
              </Typography>

            </CardContent>

          </Card>

        </Grid>

        <Grid item xs={12} md={3}>

          <Card>

            <CardContent>

              <Typography color="text.secondary">
                Pending Leaves
              </Typography>

              <Typography variant="h4">
                {data.pendingLeaves}
              </Typography>

            </CardContent>

          </Card>

        </Grid>

        <Grid item xs={12} md={3}>

          <Card>

            <CardContent>

              <Typography color="text.secondary">
                Monthly Payroll
              </Typography>

              <Typography variant="h4">
                ${data.monthlyPayroll}
              </Typography>

            </CardContent>

          </Card>

        </Grid>

      </Grid>

      {/* Charts */}

      <Grid container spacing={3}>

        {/* Gender */}

        <Grid item xs={12} md={6}>

          <Card>

            <CardContent>

              <Typography
                variant="h6"
                mb={2}
              >
                Gender Distribution
              </Typography>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <PieChart>

                  <Pie
                    data={data.genderDistribution}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >

                    {data.genderDistribution.map(
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

        {/* Department */}

        <Grid item xs={12} md={6}>

          <Card>

            <CardContent>

              <Typography
                variant="h6"
                mb={2}
              >
                Department Distribution
              </Typography>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart
                  data={
                    data.departmentDistribution
                  }
                >

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="employees"
                    fill="#1976d2"
                  />

                </BarChart>

              </ResponsiveContainer>

            </CardContent>

          </Card>

        </Grid>

        {/* Hiring Trend */}

        <Grid item xs={12} md={6}>

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
                  data={data.monthlyHiring}
                >

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="employees"
                    stroke="#2e7d32"
                    strokeWidth={3}
                  />

                </LineChart>

              </ResponsiveContainer>

            </CardContent>

          </Card>

        </Grid>

        {/* Attendance */}

        <Grid item xs={12} md={6}>

          <Card>

            <CardContent>

              <Typography
                variant="h6"
                mb={2}
              >
                Attendance Trend
              </Typography>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <LineChart
                  data={
                    data.attendanceTrend
                  }
                >

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="day" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="present"
                    stroke="#ed6c02"
                    strokeWidth={3}
                  />

                </LineChart>

              </ResponsiveContainer>

            </CardContent>

          </Card>

        </Grid>

      </Grid>

    </Box>

  );

};

export default DashboardAnalytics;