import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography
} from "@mui/material";


const DepartmentStatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  loading = false,
  onClick
}) => {

  return (
    <Card
      onClick={
        onClick
          ? onClick
          : undefined
      }
      sx={{
        height: "100%",
        borderRadius: 3,
        cursor:
          onClick
            ? "pointer"
            : "default",
        transition:
          "transform .18s ease, box-shadow .18s ease",

        "&:hover":
          onClick
            ? {
                transform:
                  "translateY(-3px)",
                boxShadow:
                  "0 14px 30px rgba(15,23,42,.10)"
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
                  width: 80,
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
                    "-.035em"
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
              justifyContent: "center"
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


export default DepartmentStatCard;