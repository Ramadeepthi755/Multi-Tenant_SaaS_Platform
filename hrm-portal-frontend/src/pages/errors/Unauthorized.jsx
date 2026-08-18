import {
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import {
  useNavigate,
} from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        background: "#f8fafc",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          maxWidth: 500,
          width: "100%",
          p: 5,
          borderRadius: 4,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            mx: "auto",
            mb: 3,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fee2e2",
            color: "#dc2626",
          }}
        >
          <LockOutlinedIcon
            fontSize="large"
          />
        </Box>

        <Typography
          variant="h4"
          fontWeight={800}
          gutterBottom
        >
          Access Restricted
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mb: 3,
          }}
        >
          You do not have permission to
          access this page.
        </Typography>

        <Button
          variant="contained"
          onClick={() =>
            navigate("/dashboard")
          }
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Back to Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default Unauthorized;