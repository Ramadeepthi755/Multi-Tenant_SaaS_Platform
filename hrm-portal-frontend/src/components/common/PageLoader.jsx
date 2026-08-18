import {
  Box,
  CircularProgress,
  Stack,
  Typography
} from "@mui/material";


const PageLoader = ({
  message = "Loading..."
}) => {

  return (
    <Box
      sx={{
        minHeight: 360,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >

      <Stack
        spacing={1.5}
        alignItems="center"
      >

        <CircularProgress />

        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={650}
        >
          {message}
        </Typography>

      </Stack>

    </Box>
  );
};


export default PageLoader;