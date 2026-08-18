import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography
} from "@mui/material";


const DashboardKpiCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  loading = false
}) => {

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid",
        borderColor:
          "divider",
        borderRadius: 3,
        transition:
          "transform .2s ease, box-shadow .2s ease",

        "&:hover": {
          transform:
            "translateY(-2px)",
          boxShadow:
            "0 14px 35px rgba(15,23,42,.08)"
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
        >

          <Box>

            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={750}
            >
              {title}
            </Typography>


            {loading ? (

              <Box
                sx={{
                  width: 100,
                  height: 42,
                  mt: 1,
                  borderRadius: 1,
                  bgcolor:
                    "action.hover"
                }}
              />

            ) : (

              <Typography
                variant="h4"
                fontWeight={950}
                sx={{
                  mt: 0.5,
                  letterSpacing:
                    "-.04em"
                }}
              >
                {value}
              </Typography>

            )}


            <Typography
              variant="caption"
              color="text.secondary"
            >
              {subtitle}
            </Typography>


            {trendLabel && (

              <Typography
                variant="caption"
                color={
                  trend === "down"
                    ? "error.main"
                    : "success.main"
                }
                fontWeight={800}
                sx={{
                  display: "block",
                  mt: 0.75
                }}
              >
                {trendLabel}
              </Typography>

            )}

          </Box>


          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              bgcolor:
                "action.hover",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color:
                "primary.main"
            }}
          >

            {Icon && (
              <Icon />
            )}

          </Box>

        </Stack>

      </CardContent>

    </Card>
  );
};


export default DashboardKpiCard;