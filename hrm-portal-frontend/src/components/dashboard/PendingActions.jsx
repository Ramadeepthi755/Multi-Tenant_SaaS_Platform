import {
  Alert,
  Card,
  CardContent,
  Stack,
  Typography
} from "@mui/material";


const PendingActions = ({
  actions = []
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
            Pending Actions
          </Typography>


          {actions.length === 0 ? (

            <Alert
              severity="success"
              variant="outlined"
            >
              No pending actions.
            </Alert>

          ) : (

            actions
              .slice(0, 6)
              .map(
                (
                  action,
                  index
                ) => (

                  <Stack
                    key={
                      action.id ??
                      index
                    }
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor:
                        "action.hover"
                    }}
                  >

                    <Stack
                      spacing={0.25}
                    >

                      <Typography
                        variant="body2"
                        fontWeight={800}
                      >
                        {
                          action.title ||
                          action.name ||
                          "Pending action"
                        }
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {
                          action.description ||
                          "Requires your attention"
                        }
                      </Typography>

                    </Stack>


                    {action.count !==
                      undefined && (

                      <Typography
                        fontWeight={900}
                      >
                        {action.count}
                      </Typography>

                    )}

                  </Stack>

                )
              )

          )}

        </Stack>

      </CardContent>

    </Card>
  );
};


export default PendingActions;