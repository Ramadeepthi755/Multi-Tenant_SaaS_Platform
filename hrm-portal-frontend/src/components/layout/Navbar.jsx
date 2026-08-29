import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";

import NotificationsNoneOutlinedIcon
  from "@mui/icons-material/NotificationsNoneOutlined";

import LogoutOutlinedIcon
  from "@mui/icons-material/LogoutOutlined";

import PersonOutlineOutlinedIcon
  from "@mui/icons-material/PersonOutlineOutlined";

import SettingsOutlinedIcon
  from "@mui/icons-material/SettingsOutlined";

import {
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../../context/AuthContext";

import CommandPalette
  from "./CommandPalette";

import LogoutDialog
  from "./LogoutDialog";

import AiCopilotDialog
  from "../ui/AiCopilotDialog";

import GlobalSearch
  from "../search/GlobalSearch";

import KeyboardCommandKeyOutlinedIcon
  from "@mui/icons-material/KeyboardCommandKeyOutlined";
import AutoAwesomeOutlinedIcon
  from "@mui/icons-material/AutoAwesomeOutlined";
import Button from "@mui/material/Button";


const Navbar = () => {

  const navigate =
    useNavigate();


  // =========================================================
  // AUTH
  // =========================================================

  const {
    user,
    logout,
    profilePhotoUrl,
    profilePhotoVersion
  } = useAuth();


  // =========================================================
  // MENU STATE
  // =========================================================

  const [
    anchorEl,
    setAnchorEl
  ] = useState(null);


  const [
    logoutDialogOpen,
    setLogoutDialogOpen
  ] = useState(false);

  const [
    commandPaletteOpen,
    setCommandPaletteOpen
  ] = useState(false);

  const [
    aiDialogOpen,
    setAiDialogOpen
  ] = useState(false);


  const menuOpen =
    Boolean(anchorEl);


  // =========================================================
  // USER INFORMATION
  // =========================================================

  const fullName =
    user?.fullName ||
    "User";


  const email =
    user?.email ||
    "";


  const role =
    user?.role ||
    "USER";


  // =========================================================
  // INITIALS
  // =========================================================

  const initials =
    fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(
        part =>
          part
            .charAt(0)
            .toUpperCase()
      )
      .join("");


  // =========================================================
  // MENU OPEN
  // =========================================================

  const handleMenuOpen =
    event => {

      setAnchorEl(
        event.currentTarget
      );

    };


  // =========================================================
  // MENU CLOSE
  // =========================================================

  const handleMenuClose =
    () => {

      setAnchorEl(
        null
      );

    };


  // =========================================================
  // PROFILE
  // =========================================================

  const handleProfile =
    () => {

      handleMenuClose();

      navigate(
        "/profile"
      );

    };


  // =========================================================
  // SETTINGS
  // =========================================================

  const handleSettings =
    () => {

      handleMenuClose();

      navigate(
        "/settings"
      );

    };


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogoutClick =
    () => {

      handleMenuClose();

      setLogoutDialogOpen(
        true
      );

    };


  const handleLogoutConfirm =
    () => {

      setLogoutDialogOpen(
        false
      );

      logout();

      navigate(
        "/login",
        {
          replace: true
        }
      );

    };


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>

      <Box
        component="header"
        sx={{
          width: "100%",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: {
            xs: 2,
            md: 3
          },
          borderBottom:
            "1px solid",
          borderColor:
            "divider",
          bgcolor:
            "background.paper"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <GlobalSearch />
          <Button
            size="small"
            variant="outlined"
            onClick={() => setCommandPaletteOpen(true)}
            startIcon={<KeyboardCommandKeyOutlinedIcon fontSize="small" />}
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              borderRadius: 2,
              borderColor: "divider",
              color: "text.secondary",
              textTransform: "none",
              fontWeight: 650,
              fontSize: 12,
              px: 1.5,
              py: 0.5
            }}
          >
            Quick Actions <Typography component="span" variant="caption" sx={{ ml: 1, px: 0.75, py: 0.2, borderRadius: 1, bgcolor: "action.selected", fontWeight: 800 }}>⌘K</Typography>
          </Button>
        </Box>

        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
        >

          {/* =================================================
              AI COPILOT
              ================================================= */}
          <Tooltip title="HR AI Copilot">
            <IconButton
              onClick={() => setAiDialogOpen(true)}
              sx={{
                bgcolor: "primary.light",
                color: "primary.dark",
                "&:hover": { bgcolor: "primary.main", color: "primary.contrastText" }
              }}
            >
              <AutoAwesomeOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* =================================================
              NOTIFICATIONS
              ================================================= */}

          <Tooltip
            title="Notifications"
          >

            <IconButton
              onClick={() =>
                navigate(
                  "/notifications"
                )
              }
            >

              <NotificationsNoneOutlinedIcon />

            </IconButton>

          </Tooltip>


          {/* =================================================
              USER AVATAR
              ================================================= */}

          <Tooltip
            title="Account"
          >

            <IconButton
              onClick={
                handleMenuOpen
              }
              sx={{
                p: 0.5
              }}
            >

              <Avatar
  src={
    profilePhotoUrl || undefined
  }
  alt={fullName}
  sx={{
    width: 42,
    height: 42,
    fontWeight: 850
  }}
>
  {!profilePhotoUrl && initials}
</Avatar>

            </IconButton>

          </Tooltip>

        </Stack>


        {/* ===================================================
            USER MENU
            =================================================== */}

        <Menu
          anchorEl={
            anchorEl
          }
          open={
            menuOpen
          }
          onClose={
            handleMenuClose
          }
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
        >

          <Box
            sx={{
              px: 2,
              py: 1.5,
              minWidth: 230
            }}
          >

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
            >

              <Avatar
                src={
                  profilePhotoUrl
                    ? `${profilePhotoUrl}?v=${profilePhotoVersion}`
                    : undefined
                }
                alt={
                  fullName
                }
                sx={{
                  width: 42,
                  height: 42,
                  fontWeight: 850
                }}
              >
                {!profilePhotoUrl &&
                  initials}

              </Avatar>


              <Box
                sx={{
                  minWidth: 0
                }}
              >

                <Typography
                  fontWeight={800}
                  noWrap
                >
                  {fullName}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                >
                  {email}
                </Typography>

                <Typography
                  variant="caption"
                  color="primary"
                  display="block"
                >
                  {role}
                </Typography>

              </Box>

            </Stack>

          </Box>


          <Divider />


          <MenuItem
            onClick={
              handleProfile
            }
          >

            <PersonOutlineOutlinedIcon
              fontSize="small"
              sx={{
                mr: 1.5
              }}
            />

            Profile

          </MenuItem>


          <MenuItem
            onClick={
              handleSettings
            }
          >

            <SettingsOutlinedIcon
              fontSize="small"
              sx={{
                mr: 1.5
              }}
            />

            Settings

          </MenuItem>


          <Divider />


          <MenuItem
            onClick={
              handleLogoutClick
            }
          >

            <LogoutOutlinedIcon
              fontSize="small"
              sx={{
                mr: 1.5
              }}
            />

            Logout

          </MenuItem>

        </Menu>

      </Box>


      {/* =====================================================
          LOGOUT DIALOG
          ===================================================== */}

      <LogoutDialog
        open={
          logoutDialogOpen
        }
        onClose={() =>
          setLogoutDialogOpen(
            false
          )
        }
        onConfirm={
          handleLogoutConfirm
        }
      />

      <CommandPalette
        open={commandPaletteOpen}
        onClose={setCommandPaletteOpen}
      />

      <AiCopilotDialog
        open={aiDialogOpen}
        onClose={() => setAiDialogOpen(false)}
      />

    </>
  );

};


export default Navbar;