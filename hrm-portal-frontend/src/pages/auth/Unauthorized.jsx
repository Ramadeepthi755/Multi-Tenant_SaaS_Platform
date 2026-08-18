import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography
} from "@mui/material";

import BlockOutlinedIcon
  from "@mui/icons-material/BlockOutlined";

import ArrowBackOutlinedIcon
  from "@mui/icons-material/ArrowBackOutlined";

import HomeOutlinedIcon
  from "@mui/icons-material/HomeOutlined";

import {
  useNavigate
} from "react-router-dom";


const Unauthorized = () => {

  const navigate =
    useNavigate();


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
          "linear-gradient(135deg, #F8FAFC, #EFF6FF)"
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
              bgcolor: "error.50",
              color: "error.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >

            <BlockOutlinedIcon
              sx={{
                fontSize: 42
              }}
            />

          </Box>


          <Typography
            variant="h3"
            fontWeight={900}
            gutterBottom
          >
            403
          </Typography>


          <Typography
            variant="h5"
            fontWeight={800}
            gutterBottom
          >
            Access Denied
          </Typography>


          <Typography
            color="text.secondary"
            sx={{
              maxWidth: 480,
              mx: "auto",
              mb: 4,
              lineHeight: 1.7
            }}
          >
            You don't have the required permission
            to access this area. If you believe this
            is incorrect, please contact your HR
            administrator.
          </Typography>


          <Stack
            direction={{
              xs: "column",
              sm: "row"
            }}
            spacing={2}
            justifyContent="center"
          >

            <Button
              variant="outlined"
              startIcon={
                <ArrowBackOutlinedIcon />
              }
              onClick={() =>
                navigate(-1)
              }
            >
              Go Back
            </Button>


            <Button
              variant="contained"
              startIcon={
                <HomeOutlinedIcon />
              }
              onClick={() =>
                navigate(
                  "/dashboard",
                  {
                    replace: true
                  }
                )
              }
            >
              Dashboard
            </Button>

          </Stack>

        </Paper>

      </Container>

    </Box>
  );
};


export default Unauthorized;