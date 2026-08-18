import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography
} from "@mui/material";

import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";


// ============================================================
// SAFE NUMBER
// ============================================================

const safeNumber = (value) => {

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;

};


// ============================================================
// EMPTY STATE
// ============================================================

const EmptyChartState = ({
  message = "No data available"
}) => {

  return (
    <Box
      sx={{
        height: 250,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >

      <Typography
        variant="body2"
        color="text.secondary"
      >
        {message}
      </Typography>

    </Box>
  );

};


// ============================================================
// CHART CARD
// ============================================================

const ChartCard = ({
  title,
  subtitle,
  children
}) => {

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3
      }}
    >

      <CardContent
        sx={{
          p: 2.5
        }}
      >

        <Typography
          variant="h6"
          sx={{
            fontWeight: 800
          }}
        >
          {title}
        </Typography>

        {subtitle && (

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5
            }}
          >
            {subtitle}
          </Typography>

        )}

        <Box
          sx={{
            mt: 2
          }}
        >
          {children}
        </Box>

      </CardContent>

    </Card>
  );

};


// ============================================================
// TOOLTIP
// ============================================================

const ChartTooltip = ({
  active,
  payload,
  label
}) => {

  if (
    !active ||
    !payload ||
    !payload.length
  ) {
    return null;
  }

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        px: 1.5,
        py: 1,
        boxShadow: 3
      }}
    >

      {label && (

        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            mb: 0.5
          }}
        >
          {label}
        </Typography>

      )}

      {payload.map(
        (item, index) => (

          <Typography
            key={
              `${item.name || "value"}-${index}`
            }
            variant="body2"
            color="text.secondary"
          >
            {item.name || "Value"}:{" "}
            <strong>
              {item.value}
            </strong>
          </Typography>

        )
      )}

    </Box>
  );

};


// ============================================================
// COLORS
// ============================================================

const chartColors = [
  "#1976d2",
  "#2e7d32",
  "#ed6c02",
  "#9c27b0",
  "#d32f2f",
  "#0288d1",
  "#7b1fa2",
  "#455a64"
];


// ============================================================
// WORKFORCE ANALYTICS
// ============================================================

const WorkforceAnalytics = ({
  data = {}
}) => {

  const employeeGrowth =
    Array.isArray(
      data.employeeGrowth
    )
      ? data.employeeGrowth
      : [];


  const departmentDistribution =
    Array.isArray(
      data.departmentDistribution
    )
      ? data.departmentDistribution
      : [];


  const genderDistribution =
    Array.isArray(
      data.genderDistribution
    )
      ? data.genderDistribution
      : [];


  const companyWiseEmployees =
    Array.isArray(
      data.companyWiseEmployees
    )
      ? data.companyWiseEmployees
      : [];


  const resignationTrend =
    Array.isArray(
      data.resignationTrend
    )
      ? data.resignationTrend
      : [];


  return (
    <Box>

      {/* ======================================================
          SECTION HEADER
      ====================================================== */}

      <Stack
        direction={{
          xs: "column",
          sm: "row"
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center"
        }}
        sx={{
          mb: 2
        }}
      >

        <Box>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 900
            }}
          >
            Workforce Analytics
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5
            }}
          >
            Overview of workforce trends and distribution.
          </Typography>

        </Box>

      </Stack>


      {/* ======================================================
          EMPLOYEE GROWTH
      ====================================================== */}

      <Grid
        container
        spacing={2}
      >

        <Grid
          size={{
            xs: 12,
            lg: 7
          }}
        >

          <ChartCard
            title="Employee Growth"
            subtitle="Employees added over time"
          >

            {employeeGrowth.length === 0 ? (

              <EmptyChartState
                message="No employee growth data available"
              />

            ) : (

              <ResponsiveContainer
                width="100%"
                height={280}
              >

                <LineChart
                  data={
                    employeeGrowth.map(
                      item => ({
                        label:
                          item.label,
                        value:
                          safeNumber(
                            item.value
                          )
                      })
                    )
                  }
                  margin={{
                    top: 10,
                    right: 20,
                    left: 0,
                    bottom: 5
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="label"
                  />

                  <YAxis
                    allowDecimals={false}
                  />

                  <Tooltip
                    content={
                      <ChartTooltip />
                    }
                  />

                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Employees"
                    stroke="#1976d2"
                    strokeWidth={3}
                    dot={{
                      r: 5
                    }}
                    activeDot={{
                      r: 7
                    }}
                  />

                </LineChart>

              </ResponsiveContainer>

            )}

          </ChartCard>

        </Grid>


        {/* ====================================================
            DEPARTMENT DISTRIBUTION
        ==================================================== */}

        <Grid
          size={{
            xs: 12,
            lg: 5
          }}
        >

          <ChartCard
            title="Department Distribution"
            subtitle="Employees by department"
          >

            {departmentDistribution.length === 0 ? (

              <EmptyChartState
                message="No department data available"
              />

            ) : (

              <ResponsiveContainer
                width="100%"
                height={280}
              >

                <BarChart
                  data={
                    departmentDistribution.map(
                      item => ({
                        label:
                          item.label,
                        value:
                          safeNumber(
                            item.value
                          )
                      })
                    )
                  }
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 5
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="label"
                  />

                  <YAxis
                    allowDecimals={false}
                  />

                  <Tooltip
                    content={
                      <ChartTooltip />
                    }
                  />

                  <Bar
                    dataKey="value"
                    name="Employees"
                    fill="#2e7d32"
                    radius={[
                      6,
                      6,
                      0,
                      0
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            )}

          </ChartCard>

        </Grid>


        {/* ====================================================
            GENDER DISTRIBUTION
        ==================================================== */}

        <Grid
          size={{
            xs: 12,
            md: 6
          }}
        >

          <ChartCard
            title="Gender Distribution"
            subtitle="Workforce gender composition"
          >

            {genderDistribution.length === 0 ? (

              <EmptyChartState
                message="No gender data available"
              />

            ) : (

              <ResponsiveContainer
                width="100%"
                height={280}
              >

                <PieChart>

                  <Pie
                    data={
                      genderDistribution.map(
                        item => ({
                          name:
                            item.label,
                          value:
                            safeNumber(
                              item.value
                            )
                        })
                      )
                    }
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    paddingAngle={3}
                  >

                    {
                      genderDistribution.map(
                        (entry, index) => (

                          <Cell
                            key={
                              `${entry.label}-${index}`
                            }
                            fill={
                              chartColors[
                                index %
                                chartColors.length
                              ]
                            }
                          />

                        )
                      )
                    }

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            )}

          </ChartCard>

        </Grid>


        {/* ====================================================
            COMPANY-WISE EMPLOYEES
        ==================================================== */}

        <Grid
          size={{
            xs: 12,
            md: 6
          }}
        >

          <ChartCard
            title="Company-wise Employees"
            subtitle="Employee distribution by company"
          >

            {companyWiseEmployees.length === 0 ? (

              <EmptyChartState
                message="No company data available"
              />

            ) : (

              <ResponsiveContainer
                width="100%"
                height={280}
              >

                <BarChart
                  layout="vertical"
                  data={
                    companyWiseEmployees.map(
                      item => ({
                        label:
                          item.label,
                        value:
                          safeNumber(
                            item.value
                          )
                      })
                    )
                  }
                  margin={{
                    top: 10,
                    right: 20,
                    left: 20,
                    bottom: 5
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="label"
                    width={110}
                  />

                  <Tooltip
                    content={
                      <ChartTooltip />
                    }
                  />

                  <Bar
                    dataKey="value"
                    name="Employees"
                    fill="#ed6c02"
                    radius={[
                      0,
                      6,
                      6,
                      0
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            )}

          </ChartCard>

        </Grid>


        {/* ====================================================
            RESIGNATION TREND
        ==================================================== */}

        <Grid
          size={{
            xs: 12
          }}
        >

          <ChartCard
            title="Resignation Trend"
            subtitle="Employee resignation trend over time"
          >

            {resignationTrend.length === 0 ? (

              <EmptyChartState
                message="No resignation data available"
              />

            ) : (

              <ResponsiveContainer
                width="100%"
                height={280}
              >

                <LineChart
                  data={
                    resignationTrend.map(
                      item => ({
                        label:
                          item.label,
                        value:
                          safeNumber(
                            item.value
                          )
                      })
                    )
                  }
                  margin={{
                    top: 10,
                    right: 20,
                    left: 0,
                    bottom: 5
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="label"
                  />

                  <YAxis
                    allowDecimals={false}
                  />

                  <Tooltip
                    content={
                      <ChartTooltip />
                    }
                  />

                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Resignations"
                    stroke="#d32f2f"
                    strokeWidth={3}
                    dot={{
                      r: 5
                    }}
                  />

                </LineChart>

              </ResponsiveContainer>

            )}

          </ChartCard>

        </Grid>

      </Grid>

    </Box>
  );
};


export default WorkforceAnalytics;