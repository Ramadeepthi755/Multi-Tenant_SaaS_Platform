import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography
} from "@mui/material";


const EmployeeStatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  loading = false
}) => {

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 3,
        border:
          "1px solid",
        borderColor:
          "divider"
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
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >

          <Box>

            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={750}
              sx={{
                mb: 1
              }}
            >
              {title}
            </Typography>


            {loading ? (

              <Box
                sx={{
                  width: 70,
                  height: 38,
                  bgcolor:
                    "action.hover",
                  borderRadius: 1
                }}
              />

            ) : (

              <Typography
                variant="h4"
                fontWeight={900}
                sx={{
                  letterSpacing:
                    "-.04em"
                }}
              >
                {value}
              </Typography>

            )}


            {subtitle && (

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {subtitle}
              </Typography>

            )}

          </Box>


          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor:
                "primary.50",
              color:
                "primary.main"
            }}
          >

            {Icon && <Icon />}

          </Box>

        </Stack>

      </CardContent>

    </Card>
  );
};


export default EmployeeStatCard;