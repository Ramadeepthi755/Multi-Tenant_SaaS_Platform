import {
  Button,
  Stack,
  Typography
} from "@mui/material";


import {
  useNavigate
} from "react-router-dom";


const NotFound = () => {

  const navigate =
    useNavigate();


  return (
    <Stack
      minHeight="70vh"
      alignItems="center"
      justifyContent="center"
      spacing={2}
      textAlign="center"
      px={3}
    >

      <Typography
        sx={{
          fontSize: {
            xs: 72,
            sm: 110
          },
          fontWeight: 950,
          lineHeight: 1
        }}
      >
        404
      </Typography>


      <Typography
        variant="h5"
        fontWeight={900}
      >
        Page not found
      </Typography>


      <Typography
        color="text.secondary"
      >
        The page you are looking for doesn't exist
        or has been moved.
      </Typography>


      <Button
        variant="contained"
        onClick={() =>
          navigate(
            "/dashboard"
          )
        }
        sx={{
          fontWeight: 850
        }}
      >
        Back to Dashboard
      </Button>

    </Stack>
  );
};


export default NotFound;