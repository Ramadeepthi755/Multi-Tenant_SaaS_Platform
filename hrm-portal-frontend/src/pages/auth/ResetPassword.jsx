import { useState } from "react";
import { Link } from "react-router-dom";

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
  const [token, setToken] = useState("");

  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await resetPassword(
        token,
        password
      );

      setMessage(response);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Reset Failed"
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f6f9",
      }}
    >
      <Paper sx={{ p: 4, width: 420 }}>
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

            <Button
              variant="contained"
              type="submit"
            >
              Reset Password
            </Button>

            <Link to="/">
              Back to Login
            </Link>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default ResetPassword;