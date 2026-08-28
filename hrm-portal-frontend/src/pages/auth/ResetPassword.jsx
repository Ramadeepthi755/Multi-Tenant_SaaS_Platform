import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { resetPassword } from "../../services/authService";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(
    () => searchParams.get("token") || ""
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!token.trim()) {
      setError("A password reset token is required.");
      return;
    }

    if (password.length < 8) {
      setError("Your new password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await resetPassword(
        token.trim(),
        password
      );

      setMessage(response);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Reset Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(circle at top left, rgba(37,99,235,.14), transparent 35%), #f8fafc",
      }}
    >
      <Paper sx={{ p: { xs: 3, sm: 4 }, width: "100%", maxWidth: 440, border: "1px solid #e2e8f0" }}>
        <Typography variant="h5" mb={3}>
          Reset Password
        </Typography>

        {message && (
          <Alert severity="success">{message}</Alert>
        )}

        {error && (
          <Alert severity="error">{error}</Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
        >
          <Stack spacing={3}>
            <TextField
              label="Reset Token"
              fullWidth
              value={token}
              onChange={(e) =>
                setToken(e.target.value)
              }
            />

            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />

            <Button
              variant="contained"
              type="submit"
              disabled={loading}
            >
              {loading ? "Resetting…" : "Reset Password"}
            </Button>

            <Link to="/login">
              Back to sign in
            </Link>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
