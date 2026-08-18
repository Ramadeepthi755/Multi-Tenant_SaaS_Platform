import {
  Card,
  CardContent,
  Chip,
  Stack,
  Typography
} from "@mui/material";


import {
  safeNumber
} from "../../utils/dashboardUtils";


const LeaveOverview = ({
  data = {}
}) => {

  const pending =
    safeNumber(
      data.pending ??
      data.pendingLeaves ??
      0
    );

  const approved =
    safeNumber(
      data.approved ??
      data.approvedLeaves ??
      0
    );

  const rejected =
    safeNumber(
      data.rejected ??
      data.rejectedLeaves ??
      0
    );


  const items = [
    {
      label: "Pending",
      value: pending,
      color: "warning"
    },
    {
      label: "Approved",
      value: approved,
      color: "success"
    },
    {
      label: "Rejected",
      value: rejected,
      color: "error"
    }
  ];


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
          spacing={2}
        >

          <Typography
            fontWeight={850}
          >
            Leave Overview
          </Typography>


          <Typography
            variant="caption"
            color="text.secondary"
          >
            Current leave workflow
          </Typography>


          {items.map(
            item => (

              <Stack
                key={item.label}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >

                <Typography
                  variant="body2"
                  fontWeight={700}
                >
                  {item.label}
                </Typography>


                <Chip
                  size="small"
                  label={item.value}
                  color={item.color}
                  variant="outlined"
                  sx={{
                    minWidth: 55,
                    fontWeight: 850
                  }}
                />

              </Stack>

            )
          )}

        </Stack>

      </CardContent>

    </Card>
  );
};


export default LeaveOverview;