import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography
} from "@mui/material";


import MenuOutlinedIcon
  from "@mui/icons-material/MenuOutlined";


const MobileHeader = ({
  onMenuClick
}) => {

  return (
    <AppBar

      position="sticky"

      elevation={0}

      sx={{
        display: {
          xs: "block",
          md: "none"
        },

        bgcolor:
          "background.paper",

        color:
          "text.primary",

        borderBottom:
          "1px solid",

        borderColor:
          "divider"
      }}

    >

      <Toolbar>

        <IconButton
          edge="start"
          onClick={
            onMenuClick
          }
          sx={{
            mr: 1
          }}
        >

          <MenuOutlinedIcon />

        </IconButton>


        <Box>

          <Typography
            fontWeight={950}
          >
            HRM Portal
          </Typography>


          <Typography
            variant="caption"
            color="text.secondary"
          >
            Workforce Management
          </Typography>

        </Box>

      </Toolbar>

    </AppBar>
  );
};


export default MobileHeader;