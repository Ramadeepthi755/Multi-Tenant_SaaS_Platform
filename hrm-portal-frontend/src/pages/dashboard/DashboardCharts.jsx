import { Grid, Paper, Typography } from "@mui/material";

import {
  PieChart,
  BarChart,
  LineChart,
} from "@mui/x-charts";

const DashboardCharts = ({ data }) => {

  const genderData = (data.genderDistribution || []).map((item, index) => ({
    id: index,
    value: item.value,
    label: item.label,
  }));

  const departmentLabels =
    (data.departmentDistribution || []).map((item) => item.label);

  const departmentValues =
    (data.departmentDistribution || []).map((item) => item.value);

  const companyLabels =
    (data.companyWiseEmployees || []).map((item) => item.label);

  const companyValues =
    (data.companyWiseEmployees || []).map((item) => item.value);

  const growthLabels =
    (data.employeeGrowth || []).map((item) => item.label);

  const growthValues =
    (data.employeeGrowth || []).map((item) => item.value);

  const resignationLabels =
    (data.resignationTrend || []).map((item) => item.label);

  const resignationValues =
    (data.resignationTrend || []).map((item) => item.value);

  return (
    <Grid container spacing={3}>

      {/* Gender Distribution */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>

          <Typography
            variant="h6"
            gutterBottom
          >
            Gender Distribution
          </Typography>

          <PieChart
            height={300}
            series={[
              {
                data: genderData,
              },
            ]}
          />

        </Paper>
      </Grid>

      {/* Department Distribution */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>

          <Typography
            variant="h6"
            gutterBottom
          >
            Department Distribution
          </Typography>

          <BarChart
            height={300}
            xAxis={[
              {
                scaleType: "band",
                data: departmentLabels,
              },
            ]}
            series={[
              {
                data: departmentValues,
              },
            ]}
          />

        </Paper>
      </Grid>

      {/* Employee Growth */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>

          <Typography
            variant="h6"
            gutterBottom
          >
            Employee Growth
          </Typography>

          <LineChart
            height={300}
            xAxis={[
              {
                scaleType: "point",
                data: growthLabels,
              },
            ]}
            series={[
              {
                data: growthValues,
              },
            ]}
          />

        </Paper>
      </Grid>

      {/* Resignation Trend */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>

          <Typography
            variant="h6"
            gutterBottom
          >
            Resignation Trend
          </Typography>

          <LineChart
            height={300}
            xAxis={[
              {
                scaleType: "point",
                data: resignationLabels,
              },
            ]}
            series={[
              {
                data: resignationValues,
              },
            ]}
          />

        </Paper>
      </Grid>

      {/* Company-wise Employees */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>

          <Typography
            variant="h6"
            gutterBottom
          >
            Company-wise Employees
          </Typography>

          <BarChart
            height={350}
            xAxis={[
              {
                scaleType: "band",
                data: companyLabels,
              },
            ]}
            series={[
              {
                data: companyValues,
              },
            ]}
          />

        </Paper>
      </Grid>

    </Grid>
  );
};

export default DashboardCharts;