import {
  Box,
  Stack,
  Typography
} from "@mui/material";


const SecurityPageHeader = ({
  title,
  subtitle,
  icon,
  actions
}) => {

  return (
    <Stack
      direction={{
        xs: "column",
        sm: "row"
      }}
      justifyContent="space-between"
      alignItems={{
        xs: "flex-start",
        sm: "center"
      }}
      spacing={2}
      sx={{
        mb: 3
      }}
    >

      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
      >

        {icon && (

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
            {icon}
          </Box>

        )}


        <Box>

          <Typography
            variant="h4"
            fontWeight={950}
            sx={{
              letterSpacing:
                "-.04em"
            }}
          >
            {title}
          </Typography>


          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5
            }}
          >
            {subtitle}
          </Typography>

        </Box>

      </Stack>


      {actions && (
        <Stack
          direction="row"
          spacing={1}
        >
          {actions}
        </Stack>
      )}

    </Stack>
  );
};


export default SecurityPageHeader;