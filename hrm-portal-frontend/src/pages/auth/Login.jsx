import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography
} from "@mui/material";

import EmailOutlinedIcon
  from "@mui/icons-material/EmailOutlined";

import LockOutlinedIcon
  from "@mui/icons-material/LockOutlined";

import VisibilityOutlinedIcon
  from "@mui/icons-material/VisibilityOutlined";

import VisibilityOffOutlinedIcon
  from "@mui/icons-material/VisibilityOffOutlined";

import LoginOutlinedIcon
  from "@mui/icons-material/LoginOutlined";

import {
  useState
} from "react";

import {
  Navigate,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../../context/AuthContext";


const Login = () => {

  const navigate =
    useNavigate();

  const location =
    useLocation();


  const {
    login,
    isAuthenticated,
    authError,
    clearAuthError,
    loading
  } = useAuth();


  const [
    formData,
    setFormData
  ] = useState({
    email: "",
    password: ""
  });


  const [
    showPassword,
    setShowPassword
  ] = useState(false);


  const [
    submitting,
    setSubmitting
  ] = useState(false);


  const [
    validationError,
    setValidationError
  ] = useState("");


  // ==========================================================
  // ALREADY LOGGED IN
  // ==========================================================

  if (
    !loading &&
    isAuthenticated
  ) {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }


  // ==========================================================
  // INPUT CHANGE
  // ==========================================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value
    } = event.target;


    setFormData(
      previous => ({
        ...previous,
        [name]: value
      })
    );


    if (validationError) {
      setValidationError("");
    }


    if (authError) {
      clearAuthError();
    }
  };


  // ==========================================================
  // VALIDATION
  // ==========================================================

  const validate = () => {

    const email =
      formData.email.trim();

    const password =
      formData.password;


    if (!email) {

      setValidationError(
        "Please enter your email address."
      );

      return false;
    }


    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email)
    ) {

      setValidationError(
        "Please enter a valid email address."
      );

      return false;
    }


    if (!password) {

      setValidationError(
        "Please enter your password."
      );

      return false;
    }


    return true;
  };


  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();


    clearAuthError();
    setValidationError("");


    if (!validate()) {
      return;
    }


    setSubmitting(true);


    try {

      const response =
        await login({
          email:
            formData.email.trim(),

          password:
            formData.password
        });


      const destination =
        location.state?.from ||
        "/dashboard";


      /*
       * Prevent redirecting to auth pages.
       */

      const safeDestination =
        destination === "/login" ||
        destination === "/unauthorized"
          ? "/dashboard"
          : destination;


      if (response?.user) {

        navigate(
          safeDestination,
          {
            replace: true
          }
        );
      }

    } catch (error) {

      /*
       * AuthContext already handles
       * the backend error message.
       */

      console.error(
        "Login request failed.",
        error
      );

    } finally {

      setSubmitting(false);
    }
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 5,

        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.16), transparent 35%), linear-gradient(135deg, #F8FAFC 0%, #EEF4FF 50%, #F8FAFC 100%)"
      }}
    >

      <Container
        maxWidth="sm"
      >

        <Paper
          elevation={10}
          sx={{
            p: {
              xs: 3,
              sm: 5
            },
            borderRadius: 4,
            border:
              "1px solid",
            borderColor:
              "rgba(226,232,240,0.8)"
          }}
        >

          {/* =================================================
              BRAND
          ================================================= */}

          <Box
            sx={{
              textAlign: "center",
              mb: 4
            }}
          >

            <Box
              sx={{
                width: 68,
                height: 68,
                mx: "auto",
                mb: 2,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "primary.main",
                color: "#FFFFFF",
                boxShadow:
                  "0 12px 30px rgba(37,99,235,0.25)"
              }}
            >

              <Typography
                sx={{
                  fontSize: 30,
                  fontWeight: 900
                }}
              >
                H
              </Typography>

            </Box>


            <Typography
              variant="h4"
              fontWeight={900}
              sx={{
                letterSpacing: "-0.03em"
              }}
            >
              Welcome Back
            </Typography>


            <Typography
              color="text.secondary"
              sx={{
                mt: 1
              }}
            >
              Sign in to your HRM Portal
            </Typography>

          </Box>


          {/* =================================================
              ERROR
          ================================================= */}

          {(validationError ||
            authError) && (

            <Alert
              severity="error"
              sx={{
                mb: 3
              }}
            >
              {validationError ||
                authError}
            </Alert>

          )}


          {/* =================================================
              FORM
          ================================================= */}

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
          >

            {/* EMAIL */}

            <TextField
              fullWidth
              required
              label="Email Address"
              name="email"
              type="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              autoComplete="email"
              disabled={submitting}
              sx={{
                mb: 2
              }}

              slotProps={{
                input: {

                  startAdornment: (
                    <InputAdornment
                      position="start"
                    >
                      <EmailOutlinedIcon
                        fontSize="small"
                      />
                    </InputAdornment>
                  )
                }
              }}
            />


            {/* PASSWORD */}

            <TextField
              fullWidth
              required
              label="Password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              autoComplete="current-password"
              disabled={submitting}
              sx={{
                mb: 3
              }}

              slotProps={{
                input: {

                  startAdornment: (
                    <InputAdornment
                      position="start"
                    >
                      <LockOutlinedIcon
                        fontSize="small"
                      />
                    </InputAdornment>
                  ),

                  endAdornment: (
                    <InputAdornment
                      position="end"
                    >

                      <IconButton
                        edge="end"
                        disabled={
                          submitting
                        }
                        onClick={() =>
                          setShowPassword(
                            previous =>
                              !previous
                          )
                        }
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >

                        {showPassword ? (
                          <VisibilityOffOutlinedIcon />
                        ) : (
                          <VisibilityOutlinedIcon />
                        )}

                      </IconButton>

                    </InputAdornment>
                  )
                }
              }}
            />


            {/* LOGIN BUTTON */}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={
                submitting ||
                loading
              }
              startIcon={
                submitting ? (
                  <CircularProgress
                    size={20}
                    color="inherit"
                  />
                ) : (
                  <LoginOutlinedIcon />
                )
              }
              sx={{
                minHeight: 50,
                borderRadius: 2.5,
                fontWeight: 800,
                fontSize: 15
              }}
            >

              {submitting
                ? "Signing in..."
                : "Sign In"}

            </Button>

          </Box>


          {/* =================================================
              SECURITY MESSAGE
          ================================================= */}

          <Box
            sx={{
              mt: 4,
              textAlign: "center"
            }}
          >

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Secure workforce management platform
            </Typography>

          </Box>

        </Paper>

      </Container>

    </Box>
  );
};


export default Login;