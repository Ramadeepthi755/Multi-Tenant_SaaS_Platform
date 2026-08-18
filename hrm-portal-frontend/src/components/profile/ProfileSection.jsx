import {
  Box,
  Divider,
  Stack,
  Typography
} from "@mui/material";


const ProfileSection = ({
  title,
  description,
  icon,
  children
}) => {

  return (
    <Box>

      <Stack
        direction="row"
        spacing={1.5}
        alignItems="flex-start"
        sx={{
          mb: 2.5
        }}
      >

        {icon && (

          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor:
                "action.hover",
              color:
                "primary.main",
              flexShrink: 0
            }}
          >
            {icon}
          </Box>

        )}


        <Box>

          <Typography
            variant="h6"
            fontWeight={900}
          >
            {title}
          </Typography>


          {description && (

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.4,
                lineHeight: 1.6
              }}
            >
              {description}
            </Typography>

          )}

        </Box>

      </Stack>


      <Divider
        sx={{
          mb: 3
        }}
      />


      {children}

    </Box>
  );
};


export default ProfileSection;