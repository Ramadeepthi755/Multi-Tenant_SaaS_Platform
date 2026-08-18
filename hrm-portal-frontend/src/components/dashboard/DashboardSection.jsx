import {
  Box,
  Stack,
  Typography
} from "@mui/material";


const DashboardSection = ({
  title,
  subtitle,
  action,
  children
}) => {

  return (
    <Box
      sx={{
        height: "100%"
      }}
    >

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{
          mb: 1.5
        }}
      >

        <Box>

          <Typography
            fontWeight={900}
            variant="h6"
          >
            {title}
          </Typography>

          {subtitle && (

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.25
              }}
            >
              {subtitle}
            </Typography>

          )}

        </Box>


        {action}

      </Stack>


      {children}

    </Box>
  );
};


export default DashboardSection;