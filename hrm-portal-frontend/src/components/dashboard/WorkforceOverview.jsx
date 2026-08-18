import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography
} from "@mui/material";


import {
  safeNumber
} from "../../utils/dashboardUtils";


const WorkforceOverview = ({
  data = {}
}) => {

  const total =
    safeNumber(
      data.totalEmployees ??
      data.total ??
      0
    );

  const active =
    safeNumber(
      data.activeEmployees ??
      data.active ??
      0
    );

  const inactive =
    safeNumber(
      data.inactiveEmployees ??
      data.inactive ??
      Math.max(
        0,
        total - active
      )
    );


  const activeWidth =
    total > 0
      ? Math.min(
          100,
          (active / total) * 100
        )
      : 0;


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
              Workforce
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Employee lifecycle overview
            </Typography>

          </Box>


          <Typography
            variant="h3"
            fontWeight={950}
            sx={{
              letterSpacing:
                "-.05em"
            }}
          >
            {total.toLocaleString(
              "en-IN"
            )}
          </Typography>


          <Box>

            <Box
              sx={{
                display: "flex",
                height: 12,
                borderRadius: 10,
                overflow: "hidden",
                bgcolor:
                  "action.hover"
              }}
            >

              <Box
                sx={{
                  width:
                    `${activeWidth}%`,
                  bgcolor:
                    "primary.main"
                }}
              />

            </Box>

          </Box>


          <Stack
            direction="row"
            justifyContent="space-between"
          >

            <Box>

              <Typography
                fontWeight={850}
              >
                {active}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Active employees
              </Typography>

            </Box>


            <Box
              sx={{
                textAlign: "right"
              }}
            >

              <Typography
                fontWeight={850}
              >
                {inactive}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Inactive
              </Typography>

            </Box>

          </Stack>

        </Stack>

      </CardContent>

    </Card>
  );
};


export default WorkforceOverview;