import {
  Box,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography
} from "@mui/material";


const SettingsSidebar = ({
  sections,
  activeSection,
  onSelect
}) => {

  return (
    <Paper
      elevation={0}
      sx={{
        border:
          "1px solid",
        borderColor:
          "divider",
        borderRadius: 3,
        overflow: "hidden"
      }}
    >

      <Box
        sx={{
          px: 2,
          py: 2,
          borderBottom:
            "1px solid",
          borderColor:
            "divider"
        }}
      >

        <Typography
          variant="subtitle1"
          fontWeight={900}
        >
          Settings
        </Typography>


        <Typography
          variant="caption"
          color="text.secondary"
        >
          Configure your HRM workspace
        </Typography>

      </Box>


      <List
        disablePadding
      >

        {sections.map(
          section => (

            <ListItemButton
              key={
                section.id
              }
              selected={
                activeSection ===
                section.id
              }
              onClick={() =>
                onSelect(
                  section.id
                )
              }
              sx={{
                px: 2,
                py: 1.25,
                borderLeft:
                  "3px solid",
                borderLeftColor:
                  activeSection ===
                  section.id
                    ? "primary.main"
                    : "transparent",

                "&.Mui-selected": {
                  bgcolor:
                    "action.selected"
                }
              }}
            >

              <ListItemIcon
                sx={{
                  minWidth: 38,
                  color:
                    activeSection ===
                    section.id
                      ? "primary.main"
                      : "text.secondary"
                }}
              >
                {section.icon}
              </ListItemIcon>


              <ListItemText

                primary={
                  section.label
                }

                secondary={
                  section.description
                }

                slotProps={{
                  primary: {
                    fontWeight: 800
                  },

                  secondary: {
                    sx: {
                      fontSize:
                        "0.72rem"
                    }
                  }
                }}

              />

            </ListItemButton>

          )
        )}

      </List>

    </Paper>
  );
};


export default SettingsSidebar;