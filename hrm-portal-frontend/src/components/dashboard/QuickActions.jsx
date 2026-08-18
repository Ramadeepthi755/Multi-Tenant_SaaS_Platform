import {
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography
} from "@mui/material";


const QuickActions = ({
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

          <BoxHeader />

          <Grid
            container
            spacing={1.5}
          >

            {actions.map(
              action => (

                <Grid
                  key={
                    action.id ||
                    action.path
                  }
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 3
                  }}
                >

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={
                      action.icon
                    }
                    onClick={
                      action.onClick
                    }
                    sx={{
                      minHeight: 52,
                      justifyContent:
                        "flex-start",
                      borderRadius: 2,
                      fontWeight: 800,
                      textTransform:
                        "none"
                    }}
                  >
                    {action.label}
                  </Button>

                </Grid>

              )
            )}

          </Grid>

        </Stack>

      </CardContent>

    </Card>
  );
};


const BoxHeader = () => (

  <Typography
    fontWeight={850}
  >
    Quick Actions
  </Typography>

);


export default QuickActions;