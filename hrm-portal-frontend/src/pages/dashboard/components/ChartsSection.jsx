import Grid from "@mui/material/Grid";
import { Paper, Typography } from "@mui/material";

import {
  PieChart,
  BarChart,
} from "@mui/x-charts";

const ChartsSection = ({ data }) => {

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

  return (
    <Grid container spacing={3}>

      {/* Gender Distribution */}

      <Grid size={{ xs: 12, md: 6 }}>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            border: "1px solid #e5e7eb",
            height: "100%",
          }}
        >

          <Typography
            variant="h6"
            fontWeight={600}
            mb={2}
          >
            Gender Distribution
          </Typography>

          {genderData.length > 0 ? (

            <PieChart
              height={280}
              series={[
                {
                  data: genderData,
                  innerRadius: 50,
                  outerRadius: 100,
                },
              ]}
            />

          ) : (

            <Typography
              color="text.secondary"
              align="center"
              mt={10}
            >
              No Data Available
            </Typography>

          )}

        </Paper>

      </Grid>

      {/* Department Distribution */}

      <Grid size={{ xs: 12, md: 6 }}>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            border: "1px solid #e5e7eb",
            height: "100%",
          }}
        >

          <Typography
            variant="h6"
            fontWeight={600}
            mb={2}
          >
            Department Distribution
          </Typography>

          {departmentValues.length > 0 ? (

            <BarChart
              height={280}
              xAxis={[
                {
                  scaleType: "band",
                  data: departmentLabels,
                },
              ]}
              series={[
                {
                  data: departmentValues,
                  label: "Employees",
                },
              ]}
            />

          ) : (

            <Typography
              color="text.secondary"
              align="center"
              mt={10}
            >
              No Data Available
            </Typography>

          )}

        </Paper>

      </Grid>

      {/* Company-wise Employees */}

      <Grid size={{ xs: 12 }}>

        <Paper
          elevation={0}
          sx={{
            mt: 1,
            p: 3,
            borderRadius: 4,
            border: "1px solid #e5e7eb",
          }}
        >

          <Typography
            variant="h6"
            fontWeight={600}
            mb={2}
          >
            Company-wise Employees
          </Typography>

          {companyValues.length > 0 ? (

            <BarChart
              height={320}
              xAxis={[
                {
                  scaleType: "band",
                  data: companyLabels,
                },
              ]}
              series={[
                {
                  data: companyValues,
                  label: "Employees",
                },
              ]}
            />

          ) : (

            <Typography
              color="text.secondary"
              align="center"
              mt={10}
            >
              No Data Available
            </Typography>

          )}

        </Paper>

      </Grid>

    </Grid>
  );
};

export default ChartsSection;