import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography
} from "@mui/material";


import {
  formatCurrency,
  safeNumber
} from "../../utils/dashboardUtils";


const PayrollOverview = ({
  data = {}
}) => {

  const payroll =
    safeNumber(
      data.currentMonthPayroll ??
      data.monthlyPayroll ??
      data.totalPayroll ??
      0
    );

  const processed =
    safeNumber(
      data.processedEmployees ??
      data.processed ??
      0
    );

  const pending =
    safeNumber(
      data.pendingEmployees ??
      data.pending ??
      0
    );


  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor:
          "divider",
        borderRadius: 3,
        height: "100%"
      }}
    >

      <CardContent
        sx={{
          p: 2.5
        }}
      >

        <Stack
          spacing={2.5}
        >

          <Box>

            <Typography
              fontWeight={850}
            >
              Payroll
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Current payroll cycle
            </Typography>

          </Box>


          <Typography
            variant="h4"
            fontWeight={950}
            sx={{
              letterSpacing:
                "-.04em"
            }}
          >
            {formatCurrency(
              payroll
            )}
          </Typography>


          <Stack
            direction="row"
            spacing={4}
          >

            <Box>

              <Typography
                fontWeight={850}
              >
                {processed}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Processed
              </Typography>

            </Box>


            <Box>

              <Typography
                fontWeight={850}
              >
                {pending}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Pending
              </Typography>

            </Box>

          </Stack>

        </Stack>

      </CardContent>

    </Card>
  );
};


export default PayrollOverview;