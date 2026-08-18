import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography
} from "@mui/material";


import ChevronLeftOutlinedIcon
  from "@mui/icons-material/ChevronLeftOutlined";

import ChevronRightOutlinedIcon
  from "@mui/icons-material/ChevronRightOutlined";


import {
  useLocation,
  useNavigate
} from "react-router-dom";


import {
  useAuth
} from "../../context/AuthContext";


import navigation,
{
  bottomNavigation
}
from "../../config/navigation";


const DRAWER_WIDTH = 260;

const COLLAPSED_WIDTH = 78;


const Sidebar = ({
  mobileOpen = false,
  onMobileClose,
  collapsed = false,
  onToggle
}) => {

  const navigate =
    useNavigate();


  const location =
    useLocation();


  const {
    user,
    hasPermission,
    hasAnyPermission,
    hasRole
  } = useAuth();


  /*
  =========================================================
  PERMISSION CHECK
  =========================================================
  */

  const isAllowed =
    item => {

      /*
      -------------------------------------------------------
      ROLE
      -------------------------------------------------------
      */

      if (
        item.role &&
        !hasRole(
          item.role
        )
      ) {

        return false;

      }


      /*
      -------------------------------------------------------
      SINGLE PERMISSION
      -------------------------------------------------------
      */

      if (
        item.permission &&
        !hasPermission(
          item.permission
        )
      ) {

        return false;

      }


      /*
      -------------------------------------------------------
      MULTIPLE PERMISSIONS
      -------------------------------------------------------
      */

      if (
        Array.isArray(
          item.permissions
        ) &&
        item.permissions.length > 0
      ) {

        if (
          item.permissionMode ===
          "any"
        ) {

          return hasAnyPermission(
            item.permissions
          );

        }


        return item.permissions.every(
          permission =>
            hasPermission(
              permission
            )
        );

      }


      return true;

    };


  /*
  =========================================================
  FILTER NAVIGATION
  =========================================================
  */

  const visibleNavigation =
    navigation.filter(
      isAllowed
    );


  const visibleBottomNavigation =
    bottomNavigation.filter(
      isAllowed
    );


  /*
  =========================================================
  NAVIGATION
  =========================================================
  */

  const handleNavigation =
    path => {

      navigate(
        path
      );


      if (
        onMobileClose
      ) {

        onMobileClose();

      }

    };


  /*
  =========================================================
  ACTIVE ROUTE
  =========================================================
  */

  const isActive =
    path => {

      /*
      Dashboard must match exactly.
      */

      if (
        path ===
        "/dashboard"
      ) {

        return (
          location.pathname ===
          "/dashboard"
        );

      }


      /*
      Other modules also match nested pages.

      Example:

      /employees
      /employees/1
      /employees/create

      */

      return (
        location.pathname ===
          path ||
        location.pathname.startsWith(
          `${path}/`
        )
      );

    };


  /*
  =========================================================
  DRAWER CONTENT
  =========================================================
  */

  const drawerContent = (

    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor:
          "background.paper"
      }}
    >


      {/* =================================================
          BRAND
      ================================================= */}

      <Box
        sx={{
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent:
            collapsed
              ? "center"
              : "space-between",
          px:
            collapsed
              ? 1
              : 2.5
        }}
      >

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            minWidth: 0
          }}
        >

          {/* Logo */}

          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              bgcolor:
                "primary.main",
              color:
                "primary.contrastText",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 950,
              fontSize: 16,
              flexShrink: 0
            }}
          >
            H
          </Box>


          {!collapsed && (

            <Box
              sx={{
                minWidth: 0
              }}
            >

              <Typography
                fontWeight={950}
                noWrap
              >
                HRM Portal
              </Typography>


              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
              >
                Workforce Management
              </Typography>

            </Box>

          )}

        </Box>


        {/* Collapse button */}

        {!collapsed && (

          <Tooltip
            title="Collapse sidebar"
          >

            <IconButton
              size="small"
              onClick={
                onToggle
              }
            >

              <ChevronLeftOutlinedIcon />

            </IconButton>

          </Tooltip>

        )}

      </Box>


      <Divider />


      {/* =================================================
          USER / COMPANY
      ================================================= */}

      {!collapsed && user && (

        <Box
          sx={{
            mx: 1.5,
            mt: 1.5,
            mb: 0.5,
            p: 1.5,
            borderRadius: 2.5,
            bgcolor:
              "action.hover"
          }}
        >

          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={750}
          >
            CURRENT ACCOUNT
          </Typography>


          <Typography
            variant="body2"
            fontWeight={850}
            noWrap
            sx={{
              mt: 0.5
            }}
          >
            {user.fullName ||
              "User"}
          </Typography>


          {user.companyName && (

            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
            >
              {user.companyName}
            </Typography>

          )}

        </Box>

      )}


      {/* =================================================
          MAIN NAVIGATION
      ================================================= */}

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 1.2,
          py: 1.5,

          /*
          Hide scrollbar visually while preserving
          scrolling.
          */

          "&::-webkit-scrollbar": {
            width: 5
          }
        }}
      >

        {!collapsed && (

          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={850}
            sx={{
              px: 1.5,
              display: "block",
              mb: 1
            }}
          >
            WORKSPACE
          </Typography>

        )}


        <List
          disablePadding
        >

          {visibleNavigation.map(
            item => {

              const Icon =
                item.icon;


              const active =
                isActive(
                  item.path
                );


              const menuButton = (

                <ListItemButton

                  key={
                    item.id
                  }

                  selected={
                    active
                  }

                  onClick={() =>
                    handleNavigation(
                      item.path
                    )
                  }

                  sx={{
                    minHeight: 46,
                    mb: 0.5,
                    px:
                      collapsed
                        ? 1.25
                        : 1.5,
                    borderRadius: 2.2,

                    justifyContent:
                      collapsed
                        ? "center"
                        : "initial",

                    position:
                      "relative",

                    "&.Mui-selected": {
                      bgcolor:
                        "action.selected",
                      color:
                        "primary.main"
                    },

                    "&.Mui-selected::before":
                      {
                        content:
                          '""',
                        position:
                          "absolute",
                        left: 0,
                        top: 8,
                        bottom: 8,
                        width: 3,
                        borderRadius:
                          "0 4px 4px 0",
                        bgcolor:
                          "primary.main"
                      },

                    "&.Mui-selected .MuiListItemIcon-root":
                      {
                        color:
                          "primary.main"
                      },

                    "&:hover": {
                      bgcolor:
                        "action.hover"
                    }
                  }}
                >

                  <ListItemIcon
                    sx={{
                      minWidth:
                        collapsed
                          ? 0
                          : 42,

                      justifyContent:
                        "center",

                      color:
                        active
                          ? "primary.main"
                          : "text.secondary"
                    }}
                  >

                    <Icon
                      fontSize="small"
                    />

                  </ListItemIcon>


                  {!collapsed && (

                    <ListItemText

                      primary={
                        item.label
                      }

                      primaryTypographyProps={{
                        fontWeight:
                          active
                            ? 850
                            : 650,

                        fontSize: 14
                      }}

                    />

                  )}

                </ListItemButton>

              );


              if (
                collapsed
              ) {

                return (

                  <Tooltip

                    key={
                      item.id
                    }

                    title={
                      item.label
                    }

                    placement="right"

                  >

                    {menuButton}

                  </Tooltip>

                );

              }


              return menuButton;

            }
          )}

        </List>

      </Box>


      <Divider />


      {/* =================================================
          BOTTOM NAVIGATION
      ================================================= */}

      <Box
        sx={{
          px: 1.2,
          py: 1.2
        }}
      >

        {!collapsed && (

          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={850}
            sx={{
              px: 1.5,
              display: "block",
              mb: 0.7
            }}
          >
            ACCOUNT
          </Typography>

        )}


        <List
          disablePadding
        >

          {visibleBottomNavigation.map(
            item => {

              const Icon =
                item.icon;


              const active =
                isActive(
                  item.path
                );


              const menuButton = (

                <ListItemButton

                  key={
                    item.id
                  }

                  selected={
                    active
                  }

                  onClick={() =>
                    handleNavigation(
                      item.path
                    )
                  }

                  sx={{
                    minHeight: 44,
                    mb: 0.4,

                    px:
                      collapsed
                        ? 1.25
                        : 1.5,

                    borderRadius: 2.2,

                    justifyContent:
                      collapsed
                        ? "center"
                        : "initial"
                  }}
                >

                  <ListItemIcon
                    sx={{
                      minWidth:
                        collapsed
                          ? 0
                          : 42,

                      justifyContent:
                        "center"
                    }}
                  >

                    <Icon
                      fontSize="small"
                    />

                  </ListItemIcon>


                  {!collapsed && (

                    <ListItemText
                      primary={
                        item.label
                      }

                      primaryTypographyProps={{
                        fontWeight:
                          active
                            ? 850
                            : 650,

                        fontSize: 14
                      }}
                    />

                  )}

                </ListItemButton>

              );


              if (
                collapsed
              ) {

                return (

                  <Tooltip

                    key={
                      item.id
                    }

                    title={
                      item.label
                    }

                    placement="right"

                  >

                    {menuButton}

                  </Tooltip>

                );

              }


              return menuButton;

            }
          )}

        </List>


        {/* Expand button */}

        {collapsed && (

          <Tooltip
            title="Expand sidebar"
            placement="right"
          >

            <IconButton
              onClick={
                onToggle
              }
              sx={{
                width: "100%",
                mt: 0.5
              }}
            >

              <ChevronRightOutlinedIcon />

            </IconButton>

          </Tooltip>

        )}

      </Box>

    </Box>

  );


  return (

    <>

      {/* =================================================
          DESKTOP SIDEBAR
      ================================================= */}

      <Drawer

        variant="permanent"

        sx={{
          display: {
            xs: "none",
            md: "block"
          },

          width:
            collapsed
              ? COLLAPSED_WIDTH
              : DRAWER_WIDTH,

          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width:
              collapsed
                ? COLLAPSED_WIDTH
                : DRAWER_WIDTH,

            boxSizing:
              "border-box",

            borderRight:
              "1px solid",

            borderColor:
              "divider",

            transition:
              "width 180ms ease"
          }
        }}

      >

        {drawerContent}

      </Drawer>


      {/* =================================================
          MOBILE SIDEBAR
      ================================================= */}

      <Drawer

        variant="temporary"

        open={
          mobileOpen
        }

        onClose={
          onMobileClose
        }

        ModalProps={{
          keepMounted: true
        }}

        sx={{
          display: {
            xs: "block",
            md: "none"
          },

          "& .MuiDrawer-paper": {
            width:
              DRAWER_WIDTH,
            boxSizing:
              "border-box"
          }
        }}

      >

        {drawerContent}

      </Drawer>

    </>

  );
};


export default Sidebar;