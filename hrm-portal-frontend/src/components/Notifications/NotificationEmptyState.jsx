import {
  Box,
  Stack,
  Typography
} from "@mui/material";


import NotificationsNoneOutlinedIcon
  from "@mui/icons-material/NotificationsNoneOutlined";


const NotificationEmptyState = ({
  title = "You're all caught up",
  message =
    "There are no notifications to show."
}) => {

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        py: 7,
        px: 3,
        textAlign: "center"
      }}
    >

      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          bgcolor:
            "action.hover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2
        }}
      >

        <NotificationsNoneOutlinedIcon
          sx={{
            fontSize: 32,
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
          maxWidth: 400
        }}
      >
        {message}
      </Typography>

    </Stack>
  );
};


export default NotificationEmptyState;