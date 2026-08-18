// src/components/common/Loading.jsx

import {
  Box,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

const Loading = ({
  text = "Loading...",
  size = 40,
  height = "250px",
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack
        spacing={2}
        alignItems="center"
      >
        <CircularProgress
          size={size}
        />

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {text}
        </Typography>
      </Stack>
    </Box>
  );
};

export default Loading;