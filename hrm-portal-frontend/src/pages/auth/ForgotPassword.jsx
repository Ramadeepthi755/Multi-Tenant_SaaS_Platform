import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import Loader from "../../components/common/Loader";
import { forgotPassword } from "../../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  // =====================================================
  // VALIDATION
  // =====================================================

  const validate = () => {
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return false;
    }

    const emailRegex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email.");
      return false;
    }

    return true;
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      const response = await forgotPassword(
        email.trim()
      );

      setSuccess(
        response?.message ||
          "Password reset link has been sent to your email."
      );

      setEmail("");
    } catch (err) {
      console.error(
        "Forgot password error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to process your request."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <Typography
        variant="h4"
        fontWeight="bold"
        align="center"
        mb={1}
      >
        Forgot Password
      </Typography>

      <Typography
        align="center"
        color="text.secondary"
        mb={4}
      >
        Enter your registered email address.
      </Typography>

      {/* SUCCESS MESSAGE */}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
        >
          {success}
        </Alert>
      )}

      {/* ERROR MESSAGE */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {/* FORM */}

      <Box
        component="form"
        onSubmit={handleSubmit}
      >
        <Stack spacing={3}>
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            autoFocus
            value={email}
            disabled={loading}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <Button
            variant="contained"
            size="large"
            type="submit"
            disabled={loading}
            sx={{
              height: 52,
              fontWeight: "bold",
              borderRadius: 2,
            }}
          >
            {loading ? (
              <Loader size={24} />
            ) : (
              "Send Reset Link"
            )}
          </Button>

          <Typography align="center">
            <Link
              to="/login"
              style={{
                textDecoration: "none",
              }}
            >
              Back to Login
            </Link>
          </Typography>
        </Stack>
      </Box>

      {/* FOOTER */}

      <Box
        mt={5}
        textAlign="center"
      >
        <Typography
          variant="body2"
          color="text.secondary"
        >
          HRM Portal
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          Enterprise Human Resource Management System
        </Typography>
      </Box>
    </>
  );
};

export default ForgotPassword;