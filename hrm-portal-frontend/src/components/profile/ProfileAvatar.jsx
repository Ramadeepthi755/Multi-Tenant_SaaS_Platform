import {
  Avatar,
  Box,
  IconButton,
  Tooltip
} from "@mui/material";


import CameraAltOutlinedIcon
  from "@mui/icons-material/CameraAltOutlined";


import {
  useRef
} from "react";


const ProfileAvatar = ({
  name = "User",
  image,
  onUpload,
  size = 110
}) => {

  const inputRef =
    useRef(null);


  const initials =
    name
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


  const handleFile =
    event => {

      const file =
        event.target.files?.[0];


      if (!file) {
        return;
      }


      onUpload?.(
        file
      );


      /*
       * Allow selecting the same file again
       * later if necessary.
       */
      event.target.value = "";

    };


  return (
    <Box
      sx={{
        position: "relative",
        width: size,
        height: size
      }}
    >

      <Avatar
        src={
          image || undefined
        }
        alt={
          name
        }
        sx={{
          width: size,
          height: size,
          fontSize:
            size * 0.32,
          fontWeight: 900
        }}
      >

        {!image &&
          initials}

      </Avatar>


      <Tooltip
        title="Change profile photo"
      >

        <IconButton
          onClick={() =>
            inputRef.current?.click()
          }
          sx={{
            position: "absolute",
            right: -4,
            bottom: -4,
            width: 38,
            height: 38,
            bgcolor:
              "background.paper",
            border:
              "1px solid",
            borderColor:
              "divider",
            boxShadow: 2,

            "&:hover": {
              bgcolor:
                "action.hover"
            }
          }}
        >

          <CameraAltOutlinedIcon
            fontSize="small"
          />

        </IconButton>

      </Tooltip>


      <input
        ref={
          inputRef
        }
        type="file"
        hidden
        accept="image/png,image/jpeg,image/webp"
        onChange={
          handleFile
        }
      />

    </Box>
  );
};


export default ProfileAvatar;