import {
  Avatar,
  Box,
  Paper,
  Stack,
  Typography
} from "@mui/material";


const ReportSummaryCard = ({
  title,
  value,
  subtitle,
  icon,
  color = "primary"
}) => {

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.25,
        height: "100%",
        border:
          "1px solid",
        borderColor:
          "divider",
        borderRadius: 3,
        transition:
          "transform .2s ease, box-shadow .2s ease",

        "&:hover": {
          transform:
            "translateY(-2px)",
          boxShadow:
            3
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
            fontWeight={700}
          >
            {title}
          </Typography>


          <Typography
            variant="h4"
            fontWeight={950}
            sx={{
              mt: 0.75,
              letterSpacing:
                "-.04em"
            }}
          >
            {value}
          </Typography>


          {subtitle && (

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display:
                  "block",
                mt: 0.5
              }}
            >
              {subtitle}
            </Typography>

          )}

        </Box>


        {icon && (

          <Avatar
            sx={{
              width: 46,
              height: 46,
              bgcolor:
                `${color}.lighter`,
              color:
                `${color}.main`
            }}
          >
            {icon}
          </Avatar>

        )}

      </Stack>

    </Paper>
  );
};


export default ReportSummaryCard;