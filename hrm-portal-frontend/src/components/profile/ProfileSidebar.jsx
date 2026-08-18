import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper
} from "@mui/material";


const ProfileSidebar = ({
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
                py: 1.35,
                px: 2,

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


export default ProfileSidebar;