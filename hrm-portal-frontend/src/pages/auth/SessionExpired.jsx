import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography
} from "@mui/material";

import LockClockOutlinedIcon
  from "@mui/icons-material/LockClockOutlined";

import LoginOutlinedIcon
  from "@mui/icons-material/LoginOutlined";


import {
  useNavigate
} from "react-router-dom";


const SessionExpired = () => {

  const navigate =
    useNavigate();


  const handleLogin = () => {

    navigate(
      "/login",
      {
        replace: true
      }
    );
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        background:
          "linear-gradient(135deg, #EFF6FF, #F8FAFC)"
      }}
    >

      <Container
        maxWidth="sm"
      >

        <Paper
          elevation={5}
          sx={{
            p: {
              xs: 4,
              sm: 6
            },
            textAlign: "center",
            borderRadius: 4
          }}
        >

          <Box
            sx={{
              width: 84,
              height: 84,
              mx: "auto",
              mb: 3,
              borderRadius: "50%",
              bgcolor: "warning.50",
              color: "warning.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >

            <LockClockOutlinedIcon
              sx={{
                fontSize: 42
              }}
            />

          </Box>


          <Typography
            variant="h4"
            fontWeight={900}
            gutterBottom
          >
            Session Expired
          </Typography>


          <Typography
            color="text.secondary"
            sx={{
              maxWidth: 470,
              mx: "auto",
              mb: 4,
              lineHeight: 1.7
            }}
          >
            Your HRM Portal session has expired
            for security reasons. Please sign in
            again to continue.
          </Typography>


          <Stack
            direction="row"
            justifyContent="center"
          >

            <Button
              variant="contained"
              size="large"
              startIcon={
                <LoginOutlinedIcon />
              }
              onClick={handleLogin}
            >
              Sign In Again
            </Button>

          </Stack>

        </Paper>

      </Container>

    </Box>
  );
};


export default SessionExpired;