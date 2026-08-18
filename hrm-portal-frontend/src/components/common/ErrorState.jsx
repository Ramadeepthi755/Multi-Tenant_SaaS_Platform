import {
  Alert,
  Box,
  Button,
  Stack,
  Typography
} from "@mui/material";


import ErrorOutlineOutlinedIcon
  from "@mui/icons-material/ErrorOutlineOutlined";


const ErrorState = ({
  title = "Something went wrong",
  message = "We couldn't load this information.",
  onRetry
}) => {

  return (
    <Box
      sx={{
        py: 7,
        px: 3,
        textAlign: "center"
      }}
    >

      <ErrorOutlineOutlinedIcon
        sx={{
          fontSize: 52,
          color: "error.main",
          mb: 1
        }}
      />


      <Typography
        variant="h6"
        fontWeight={900}
      >
        {title}
      </Typography>


      <Typography
        color="text.secondary"
        sx={{
          mt: 0.75,
          maxWidth: 520,
          mx: "auto"
        }}
      >
        {message}
      </Typography>


      {onRetry && (

        <Stack
          alignItems="center"
          sx={{
            mt: 2.5
          }}
        >

          <Button
            variant="outlined"
            onClick={
              onRetry
            }
            sx={{
              fontWeight: 800
            }}
          >
            Try Again
          </Button>

        </Stack>

      )}

    </Box>
  );
};


export default ErrorState;