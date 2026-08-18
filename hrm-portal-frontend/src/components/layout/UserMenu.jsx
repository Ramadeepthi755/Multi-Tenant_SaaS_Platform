import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography
} from "@mui/material";


import PersonOutlineOutlinedIcon
  from "@mui/icons-material/PersonOutlineOutlined";

import SettingsOutlinedIcon
  from "@mui/icons-material/SettingsOutlined";

import LogoutOutlinedIcon
  from "@mui/icons-material/LogoutOutlined";


import {
  useState
} from "react";


import {
  useNavigate
} from "react-router-dom";


import {
  useAuth
} from "../../context/AuthContext";


const UserMenu = () => {

  const navigate =
    useNavigate();


  const {
  user,
  logout,
  profilePhotoUrl,
  profilePhotoVersion
} = useAuth();


  const [
    anchorEl,
    setAnchorEl
  ] = useState(null);


  const open =
    Boolean(anchorEl);


  const fullName =
    user?.fullName ||
    "User";


  const email =
    user?.email ||
    "";


  const role =
    user?.role ||
    "USER";


  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(
        name =>
          name[0]
      )
      .join("")
      .toUpperCase();


  const handleOpen = (
    event
  ) => {

    setAnchorEl(
      event.currentTarget
    );
  };


  const handleClose = () => {

    setAnchorEl(null);
  };


  const handleProfile = () => {

    handleClose();

    navigate("/profile");
  };


  const handleSettings = () => {

    handleClose();

    navigate("/settings");
  };


  const handleLogout = async () => {

    handleClose();

    await logout();

    navigate(
      "/login",
      {
        replace: true
      }
    );
  };


  return (
    <>

      <Box
        onClick={handleOpen}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.2,
          cursor: "pointer",
          borderRadius: 2,
          px: 1,
          py: 0.5,

          "&:hover": {
            bgcolor:
              "action.hover"
          }
        }}
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
    width: 38,
    height: 38,
    bgcolor:
      "primary.main",
    fontSize: 14,
    fontWeight: 800
  }}
>
  {!profilePhotoUrl &&
    (initials || "U")}
</Avatar>


        <Box
          sx={{
            display: {
              xs: "none",
              sm: "block"
            },
            minWidth: 0
          }}
        >

          <Typography
            variant="body2"
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
            {role.replace(
              /_/g,
              " "
            )}
          </Typography>

        </Box>

      </Box>


      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 6,
          sx: {
            width: 260,
            mt: 1,
            borderRadius: 3
          }
        }}
      >

        <Box
          sx={{
            px: 2,
            py: 1.5
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

        </Box>


        <Divider />


        <MenuItem
          onClick={
            handleProfile
          }
        >

          <ListItemIcon>

            <PersonOutlineOutlinedIcon
              fontSize="small"
            />

          </ListItemIcon>

          My Profile

        </MenuItem>


        <MenuItem
          onClick={
            handleSettings
          }
        >

          <ListItemIcon>

            <SettingsOutlinedIcon
              fontSize="small"
            />

          </ListItemIcon>

          Settings

        </MenuItem>


        <Divider />


        <MenuItem
          onClick={
            handleLogout
          }
          sx={{
            color: "error.main"
          }}
        >

          <ListItemIcon>

            <LogoutOutlinedIcon
              fontSize="small"
              color="error"
            />

          </ListItemIcon>

          Logout

        </MenuItem>

      </Menu>

    </>
  );
};


export default UserMenu;