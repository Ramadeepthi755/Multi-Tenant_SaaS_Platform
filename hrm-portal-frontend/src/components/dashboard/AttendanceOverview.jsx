import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography
} from "@mui/material";


import {
  percentage,
  safeNumber
} from "../../utils/dashboardUtils";


const AttendanceOverview = ({
  data = {}
}) => {

  const present =
    safeNumber(
      data.present ??
      data.presentToday ??
      data.todayPresent
    );

  const absent =
    safeNumber(
      data.absent ??
      data.absentToday ??
      data.todayAbsent
    );

  const late =
    safeNumber(
      data.late ??
      data.lateToday
    );

  const total =
    safeNumber(
      data.totalEmployees ??
      data.total ??
      present + absent
    );


  const presentPercentage =
    percentage(
      present,
      total
    );


  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor:
          "divider",
        borderRadius: 3
      }}
    >

      <CardContent
        sx={{
          p: 2.5,
          "&:last-child": {
            pb: 2.5
          }
        }}
      >

        <Stack
          spacing={2.5}
        >

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >

            <Box>

              <Typography
                fontWeight={850}
              >
                Today's Attendance
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Workforce attendance snapshot
              </Typography>

            </Box>


            <Typography
              variant="h5"
              fontWeight={950}
            >
              {presentPercentage}%
            </Typography>

          </Stack>


          <Box>

            <Box
              sx={{
                height: 10,
                borderRadius: 10,
                bgcolor:
                  "action.hover",
                overflow: "hidden"
              }}
            >

              <Box
                sx={{
                  width:
                    `${presentPercentage}%`,
                  height: "100%",
                  bgcolor:
                    "success.main",
                  borderRadius: 10,
                  transition:
                    "width .5s ease"
                }}
              />

            </Box>

          </Box>


          <Stack
            direction="row"
            divider={
              <Divider
                orientation="vertical"
                flexItem
              />
            }
            justifyContent="space-between"
          >

            <Box>

              <Typography
                variant="h6"
                fontWeight={900}
              >
                {present}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Present
              </Typography>

            </Box>


            <Box>

              <Typography
                variant="h6"
                fontWeight={900}
              >
                {absent}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Absent
              </Typography>

            </Box>


            <Box>

              <Typography
                variant="h6"
                fontWeight={900}
              >
                {late}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Late
              </Typography>

            </Box>

          </Stack>

        </Stack>

      </CardContent>

    </Card>
  );
};


export default AttendanceOverview;