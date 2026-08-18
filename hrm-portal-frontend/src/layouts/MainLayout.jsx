import {
  Box
} from "@mui/material";


import {
  useState
} from "react";


import {
  Outlet
} from "react-router-dom";


import Sidebar
  from "../components/layout/Sidebar";


import Navbar
  from "../components/layout/Navbar";


import MobileHeader
  from "../components/layout/MobileHeader";


import Breadcrumbs
  from "../components/layout/Breadcrumbs";


const MainLayout = () => {

  const [
    mobileOpen,
    setMobileOpen
  ] = useState(false);


  const [
    collapsed,
    setCollapsed
  ] = useState(false);


  return (
    <Box
      sx={{
        minHeight:
          "100vh",
        display:
          "flex",
        bgcolor:
          "background.default"
      }}
    >

      {/* =============================================
          SIDEBAR
      ============================================== */}

      <Sidebar

        mobileOpen={
          mobileOpen
        }

        onMobileClose={() =>
          setMobileOpen(
            false
          )
        }

        collapsed={
          collapsed
        }

        onToggle={() =>
          setCollapsed(
            previous =>
              !previous
          )
        }

      />


      {/* =============================================
          MAIN CONTENT
      ============================================== */}

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column"
        }}
      >

        {/* Mobile Header */}

        <MobileHeader
          onMenuClick={() =>
            setMobileOpen(
              true
            )
          }
        />


        {/* Desktop Navbar */}

        <Box
          sx={{
            display: {
              xs: "none",
              md: "block"
            }
          }}
        >

          <Navbar />

        </Box>


        {/* Mobile account/header */}

        <Box
          sx={{
            display: {
              xs: "block",
              md: "none"
            }
          }}
        >

          <Navbar />

        </Box>


        {/* =========================================
            PAGE CONTENT
        ========================================== */}

        <Box
          component="main"
          sx={{
            flex: 1,
            width: "100%",
            px: {
              xs: 2,
              sm: 3,
              lg: 4
            },
            py: {
              xs: 2.5,
              sm: 3,
              lg: 4
            }
          }}
        >

          <Breadcrumbs />


          <Outlet />

        </Box>


        {/* =========================================
            FOOTER
        ========================================== */}

        <Box
          component="footer"
          sx={{
            px: {
              xs: 2,
              sm: 3,
              lg: 4
            },
            py: 2,
            borderTop:
              "1px solid",
            borderColor:
              "divider",
            color:
              "text.secondary"
          }}
        >

          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              flexWrap:
                "wrap",
              gap: 1
            }}
          >

            <Box
              component="span"
              sx={{
                fontSize: 12
              }}
            >
              © {new Date().getFullYear()} HRM Portal
            </Box>


            <Box
              component="span"
              sx={{
                fontSize: 12
              }}
            >
              Workforce Management System
            </Box>

          </Box>

        </Box>

      </Box>

    </Box>
  );
};


export default MainLayout;