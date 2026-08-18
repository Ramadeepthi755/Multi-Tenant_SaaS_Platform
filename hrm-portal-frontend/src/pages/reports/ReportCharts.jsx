import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";

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
  AreaChart,
  Area,
} from "recharts";

const COLORS = [
  "#1976d2",
  "#2e7d32",
  "#ed6c02",
  "#d32f2f",
  "#9c27b0",
  "#00897b",
];

const ReportCharts = ({
  kpis = [],
  pieData = [],
  barData = [],
  lineData = [],
  areaData = [],
}) => {

  return (

    <Box>

      {/* KPI Cards */}

      <Grid container spacing={3} mb={3}>

        {kpis.map((item, index) => (

          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={index}
          >

            <Card>

              <CardContent>

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

              </CardContent>

            </Card>

          </Grid>

        ))}

      </Grid>

      {/* Charts */}

      <Grid container spacing={3}>

        {/* Pie Chart */}

        <Grid item xs={12} md={6}>

          <Card>

            <CardHeader
              title="Pie Chart"
            />

            <CardContent>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <PieChart>

                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >

                    {pieData.map(
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

        {/* Bar Chart */}

        <Grid item xs={12} md={6}>

          <Card>

            <CardHeader
              title="Bar Chart"
            />

            <CardContent>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart data={barData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="value"
                    fill="#1976d2"
                  />

                </BarChart>

              </ResponsiveContainer>

            </CardContent>

          </Card>

        </Grid>

        {/* Line Chart */}

        <Grid item xs={12} md={6}>

          <Card>

            <CardHeader
              title="Line Chart"
            />

            <CardContent>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <LineChart data={lineData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#2e7d32"
                    strokeWidth={3}
                  />

                </LineChart>

              </ResponsiveContainer>

            </CardContent>

          </Card>

        </Grid>

        {/* Area Chart */}

        <Grid item xs={12} md={6}>

          <Card>

            <CardHeader
              title="Area Chart"
            />

            <CardContent>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <AreaChart data={areaData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#ed6c02"
                    fill="#ed6c02"
                    fillOpacity={0.3}
                  />

                </AreaChart>

              </ResponsiveContainer>

            </CardContent>

          </Card>

        </Grid>

      </Grid>

    </Box>

  );

};

export default ReportCharts;