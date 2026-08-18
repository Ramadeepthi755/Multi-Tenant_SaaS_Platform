import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography
} from "@mui/material";


import CalendarMonthOutlinedIcon
  from "@mui/icons-material/CalendarMonthOutlined";


import {
  formatDate
} from "../../utils/dashboardUtils";


const UpcomingHolidays = ({
  holidays = []
}) => {

  return (
    <Card
      sx={{
        height: "100%",
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
          fontWeight={850}
        >
          Upcoming Holidays
        </Typography>


        <Typography
          variant="body2"
          color="text.secondary"
        >
          Upcoming company holidays
        </Typography>


        <Divider
          sx={{
            my: 2
          }}
        />


        {holidays.length === 0 ? (

          <Box
            sx={{
              py: 4,
              textAlign: "center"
            }}
          >

            <Typography
              color="text.secondary"
            >
              No upcoming holidays available.
            </Typography>

          </Box>

        ) : (

          <Stack
            spacing={1.25}
          >

            {holidays
              .slice(0, 5)
              .map(
                (
                  holiday,
                  index
                ) => {

                  const name =
                    holiday.name ||
                    holiday.holidayName ||
                    holiday.title ||
                    "Holiday";


                  const date =
                    holiday.date ||
                    holiday.holidayDate;


                  return (
                    <Stack
                      key={
                        holiday.id ||
                        index
                      }
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      sx={{
                        p: 1.25,
                        borderRadius: 2,
                        bgcolor:
                          "background.default"
                      }}
                    >

                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor:
                            "primary.50",
                          color:
                            "primary.main"
                        }}
                      >

                        <CalendarMonthOutlinedIcon
                          fontSize="small"
                        />

                      </Box>


                      <Box
                        sx={{
                          minWidth: 0
                        }}
                      >

                        <Typography
                          variant="body2"
                          fontWeight={800}
                          noWrap
                        >
                          {name}
                        </Typography>


                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {formatDate(
                            date
                          )}
                        </Typography>

                      </Box>

                    </Stack>
                  );
                }
              )}

          </Stack>

        )}

      </CardContent>

    </Card>
  );
};


export default UpcomingHolidays;