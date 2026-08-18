import {
  Box,
  Button,
  Stack,
  Typography
} from "@mui/material";


import InboxOutlinedIcon
  from "@mui/icons-material/InboxOutlined";


const EmptyState = ({
  title = "No records found",
  description = "There is no data to display.",
  actionLabel,
  onAction,
  icon
}) => {

  return (
    <Box
      sx={{
        py: 8,
        px: 3,
        textAlign: "center"
      }}
    >

      <Box
        sx={{
          width: 68,
          height: 68,
          mx: "auto",
          mb: 2,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "action.hover",
          color: "text.secondary"
        }}
      >

        {icon || (
          <InboxOutlinedIcon
            fontSize="large"
          />
        )}

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
          mt: 0.75,
          maxWidth: 500,
          mx: "auto"
        }}
      >
        {description}
      </Typography>


      {actionLabel && onAction && (

        <Stack
          alignItems="center"
          sx={{
            mt: 2.5
          }}
        >

          <Button
            variant="contained"
            onClick={
              onAction
            }
            sx={{
              fontWeight: 850
            }}
          >
            {actionLabel}
          </Button>

        </Stack>

      )}

    </Box>
  );
};


export default EmptyState;