// src/layouts/BlankLayout.jsx

import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

const BlankLayout = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        bgcolor: "background.default",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Outlet />
    </Box>
  );
};

export default BlankLayout;