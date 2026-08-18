import {
  Avatar,
  Card,
  CardContent,
  Stack,
  Typography
} from "@mui/material";


const RecentActivity = ({
  activities = []
}) => {

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
          p: 2.5
        }}
      >

        <Stack
          spacing={2}
        >

          <Typography
            fontWeight={850}
          >
            Recent Activity
          </Typography>


          {activities.length === 0 ? (

            <Typography
              color="text.secondary"
              variant="body2"
              sx={{
                py: 3
              }}
            >
              No recent activity available.
            </Typography>

          ) : (

            activities
              .slice(0, 8)
              .map(
                (
                  activity,
                  index
                ) => {

                  const name =
                    activity.userName ||
                    activity.employeeName ||
                    activity.name ||
                    "System";


                  const title =
                    activity.title ||
                    activity.action ||
                    activity.description ||
                    "Activity recorded";


                  const time =
                    activity.time ||
                    activity.createdAt ||
                    activity.date ||
                    "";


                  return (
                    <Stack
                      key={
                        activity.id ??
                        index
                      }
                      direction="row"
                      spacing={1.5}
                    >

                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          fontSize: 13,
                          fontWeight: 850
                        }}
                      >
                        {name
                          .slice(0, 1)
                          .toUpperCase()}
                      </Avatar>


                      <Stack
                        spacing={0.25}
                        sx={{
                          minWidth: 0
                        }}
                      >

                        <Typography
                          variant="body2"
                          fontWeight={750}
                        >
                          {title}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {name}
                          {time
                            ? ` • ${time}`
                            : ""}
                        </Typography>

                      </Stack>

                    </Stack>
                  );

                }
              )

          )}

        </Stack>

      </CardContent>

    </Card>
  );
};


export default RecentActivity;