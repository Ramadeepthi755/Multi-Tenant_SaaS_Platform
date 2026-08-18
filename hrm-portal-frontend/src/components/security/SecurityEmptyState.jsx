import {
  Box,
  Stack,
  Typography
} from "@mui/material";


import SecurityOutlinedIcon
  from "@mui/icons-material/SecurityOutlined";


const SecurityEmptyState = ({
  title,
  message
}) => {

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        py: 9,
        px: 3,
        textAlign: "center"
      }}
    >

      <Box
        sx={{
          width: 68,
          height: 68,
          borderRadius: "50%",
          bgcolor:
            "action.hover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2
        }}
      >

        <SecurityOutlinedIcon
          sx={{
            fontSize: 34,
            color:
              "text.secondary"
          }}
        />

      </Box>


      <Typography
        variant="h6"
        fontWeight={900}
      >
        {title}
      </Typography>


      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mt: 0.5,
          maxWidth: 480
        }}
      >
        {message}
      </Typography>

    </Stack>
  );
};


export default SecurityEmptyState;