import {
  Backdrop,
  Box,
  CircularProgress,
  Fade,
  Typography,
} from "@mui/material";

const Loader = ({
  open = true,
  message = "Please wait...",
  size = 40,
  fullScreen = false,
}) => {
  // =====================================================
  // SMALL LOADER
  // Used inside buttons / cards
  // =====================================================

  if (!fullScreen) {
    return (
      <CircularProgress
        size={size}
        thickness={4}
        sx={{
          color: "inherit",
        }}
      />
    );
  }

  // =====================================================
  // FULL SCREEN LOADER
  // =====================================================

  return (
    <Fade in={open}>
      <Backdrop
        open={open}
        sx={{
          color: "#fff",
          zIndex: (theme) =>
            theme.zIndex.drawer + 999,
          backdropFilter: "blur(4px)",
          backgroundColor:
            "rgba(0, 0, 0, 0.55)",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            p: 4,
            minWidth: 240,
            borderRadius: 3,
            bgcolor:
              "rgba(255, 255, 255, 0.08)",
            border:
              "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          <CircularProgress
            size={size}
            thickness={4}
            sx={{
              color: "white",
            }}
          />

          <Typography
            mt={3}
            variant="h6"
            fontWeight={600}
          >
            {message}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 1,
              opacity: 0.8,
            }}
          >
            HRM Portal
          </Typography>
        </Box>
      </Backdrop>
    </Fade>
  );
};

export default Loader;