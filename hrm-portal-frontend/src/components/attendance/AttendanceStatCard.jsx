import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography
} from "@mui/material";


const AttendanceStatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "primary"
}) => {

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        transition: "transform .2s ease, box-shadow .2s ease",

        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            "0 10px 30px rgba(15, 23, 42, .07)"
        }
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
          spacing={2}
        >

          <Box>

            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={750}
            >
              {title}
            </Typography>


            <Typography
              variant="h4"
              fontWeight={900}
              sx={{
                mt: .5,
                letterSpacing: "-.04em"
              }}
            >
              {value}
            </Typography>


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
              flexShrink: 0,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor:
                `${color}.50`,
              color:
                `${color}.main`
            }}
          >

            {Icon && (
              <Icon
                sx={{
                  fontSize: 24
                }}
              />
            )}

          </Box>

        </Stack>

      </CardContent>

    </Card>
  );
};


export default AttendanceStatCard;