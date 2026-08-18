import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography
} from "@mui/material";


const StatCard = ({
  title,
  value = 0,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  onClick,
  loading = false
}) => {

  const clickable =
    typeof onClick ===
    "function";


  return (
    <Card
      onClick={
        clickable
          ? onClick
          : undefined
      }
      sx={{
        height: "100%",
        borderRadius: 3,
        cursor:
          clickable
            ? "pointer"
            : "default",
        transition:
          "transform 180ms ease, box-shadow 180ms ease",

        "&:hover": clickable
          ? {
              transform:
                "translateY(-3px)",
              boxShadow:
                "0 14px 30px rgba(15,23,42,0.10)"
            }
          : undefined
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

          <Box
            sx={{
              minWidth: 0
            }}
          >

            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={700}
              sx={{
                mb: 1
              }}
            >
              {title}
            </Typography>


            {loading ? (

              <Box
                sx={{
                  width: 90,
                  height: 36,
                  borderRadius: 1,
                  bgcolor:
                    "action.hover"
                }}
              />

            ) : (

              <Typography
                variant="h4"
                fontWeight={900}
                sx={{
                  letterSpacing:
                    "-0.03em"
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
              bgcolor:
                "primary.50",
              color:
                "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >

            {Icon && (
              <Icon />
            )}

          </Box>

        </Stack>


        {trend !== undefined && (

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              mt: 2
            }}
          >

            <Chip
              size="small"
              label={
                trend >= 0
                  ? `+${trend}%`
                  : `${trend}%`
              }
              color={
                trend >= 0
                  ? "success"
                  : "error"
              }
              sx={{
                fontWeight: 800
              }}
            />


            {trendLabel && (

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {trendLabel}
              </Typography>

            )}

          </Stack>

        )}

      </CardContent>

    </Card>
  );
};


export default StatCard;