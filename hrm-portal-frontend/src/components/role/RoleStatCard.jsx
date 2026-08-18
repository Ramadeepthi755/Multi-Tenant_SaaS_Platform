import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography
} from "@mui/material";


const RoleStatCard = ({
  title,
  value,
  subtitle,
  icon: Icon
}) => {

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        transition:
          "transform .2s ease, box-shadow .2s ease",

        "&:hover": {
          transform:
            "translateY(-2px)",
          boxShadow:
            "0 12px 30px rgba(15,23,42,.08)"
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

            <Typography
              variant="h4"
              fontWeight={900}
              sx={{
                mt: 0.5,
                letterSpacing: "-.04em"
              }}
            >
              {value}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {subtitle}
            </Typography>

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
                "action.hover",
              color:
                "primary.main"
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


export default RoleStatCard;