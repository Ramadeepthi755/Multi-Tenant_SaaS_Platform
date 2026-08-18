import {
  Backdrop,
  CircularProgress,
  Stack,
  Typography
} from "@mui/material";


const LoadingOverlay = ({
  open = false,
  message = "Please wait..."
}) => {

  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: theme =>
          theme.zIndex.modal + 10,
        bgcolor:
          "rgba(0, 0, 0, 0.35)"
      }}
    >

      <Stack
        spacing={2}
        alignItems="center"
      >

        <CircularProgress
          size={42}
          thickness={4}
        />


        <Typography
          color="white"
          fontWeight={800}
        >
          {message}
        </Typography>

      </Stack>

    </Backdrop>
  );
};


export default LoadingOverlay;