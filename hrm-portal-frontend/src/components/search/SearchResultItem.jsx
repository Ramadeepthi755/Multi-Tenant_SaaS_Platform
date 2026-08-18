import {
  Avatar,
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material";


const SearchResultItem = ({
  result,
  onClick
}) => {

  const title =
    result?.title ||
    result?.name ||
    result?.label ||
    "Untitled";


  const description =
    result?.description ||
    result?.subtitle ||
    result?.email ||
    result?.code ||
    "";


  const type =
    result?.type ||
    "OTHER";


  const getInitials =
    value => {

      return String(value)
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

    };


  return (
    <ListItemButton
      onClick={() =>
        onClick?.(result)
      }
      sx={{
        px: 2,
        py: 1.25,
        borderRadius: 2
      }}
    >

      <ListItemIcon
        sx={{
          minWidth: 48
        }}
      >

        <Avatar
          sx={{
            width: 38,
            height: 38,
            fontSize: 13,
            fontWeight: 900
          }}
        >
          {getInitials(title)}
        </Avatar>

      </ListItemIcon>


      <ListItemText

        primary={title}

        secondary={description}

        slotProps={{
          primary: {
            fontWeight: 800
          },

          secondary: {
            sx: {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }
          }
        }}

      />


      <Box
        sx={{
          ml: 1,
          fontSize: 11,
          fontWeight: 800,
          color: "text.secondary"
        }}
      >
        {type}
      </Box>

    </ListItemButton>
  );
};


export default SearchResultItem;