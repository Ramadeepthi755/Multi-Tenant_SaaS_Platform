import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography
} from "@mui/material";


const LeaveOverview = ({
  data = []
}) => {

  const fallback = [
    {
      label: "Pending",
      value: 0
    },
    {
      label: "Approved",
      value: 0
    },
    {
      label: "Rejected",
      value: 0
    }
  ];


  const items =
    data.length > 0
      ? data
      : fallback;


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
          Leave Overview
        </Typography>


        <Typography
          variant="body2"
          color="text.secondary"
        >
          Leave requests by status
        </Typography>


        <Divider
          sx={{
            my: 2
          }}
        />


        <Stack
          spacing={1.5}
        >

          {items.map(
            (
              item,
              index
            ) => {

              const value =
                Number(
                  item.value ||
                  item.count ||
                  0
                );


              return (
                <Stack
                  key={
                    item.label ||
                    item.name ||
                    index
                  }
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor:
                      "background.default"
                  }}
                >

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.25}
                  >

                    <Box
                      sx={{
                        width: 9,
                        height: 9,
                        borderRadius:
                          "50%",
                        bgcolor:
                          index === 0
                            ? "warning.main"
                            : index === 1
                              ? "success.main"
                              : "error.main"
                      }}
                    />


                    <Typography
                      variant="body2"
                      fontWeight={650}
                    >
                      {
                        item.label ||
                        item.name ||
                        "Unknown"
                      }
                    </Typography>

                  </Stack>


                  <Typography
                    fontWeight={900}
                  >
                    {value}
                  </Typography>

                </Stack>
              );
            }
          )}

        </Stack>

      </CardContent>

    </Card>
  );
};


export default LeaveOverview;