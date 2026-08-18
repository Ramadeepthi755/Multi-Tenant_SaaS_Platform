import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Typography
} from "@mui/material";


import CheckOutlinedIcon
  from "@mui/icons-material/CheckOutlined";

import DeleteOutlineOutlinedIcon
  from "@mui/icons-material/DeleteOutlineOutlined";

import EventOutlinedIcon
  from "@mui/icons-material/EventOutlined";

import AccessTimeOutlinedIcon
  from "@mui/icons-material/AccessTimeOutlined";

import PaymentsOutlinedIcon
  from "@mui/icons-material/PaymentsOutlined";

import DescriptionOutlinedIcon
  from "@mui/icons-material/DescriptionOutlined";

import PeopleOutlinedIcon
  from "@mui/icons-material/PeopleOutlined";

import BusinessOutlinedIcon
  from "@mui/icons-material/BusinessOutlined";

import SecurityOutlinedIcon
  from "@mui/icons-material/SecurityOutlined";

import NotificationsNoneOutlinedIcon
  from "@mui/icons-material/NotificationsNoneOutlined";


import {
  getNotificationColor,
  getNotificationIconType,
  formatNotificationTime,
  getPriorityColor
} from "../../utils/notificationUtils";


const iconMap = {

  leave:
    EventOutlinedIcon,

  attendance:
    AccessTimeOutlinedIcon,

  payroll:
    PaymentsOutlinedIcon,

  document:
    DescriptionOutlinedIcon,

  employee:
    PeopleOutlinedIcon,

  company:
    BusinessOutlinedIcon,

  security:
    SecurityOutlinedIcon,

  system:
    NotificationsNoneOutlinedIcon,

  general:
    NotificationsNoneOutlinedIcon

};


const NotificationItem = ({
  notification,
  compact = false,
  onRead,
  onDelete,
  onOpen
}) => {

  if (!notification) {
    return null;
  }


  const iconType =
    getNotificationIconType(
      notification.type
    );


  const Icon =
    iconMap[iconType] ||
    NotificationsNoneOutlinedIcon;


  const color =
    getNotificationColor(
      notification.type
    );


  const priorityColor =
    getPriorityColor(
      notification.priority
    );


  return (
    <Box
      sx={{
        position: "relative",
        px: compact ? 1.5 : 2,
        py: compact ? 1.25 : 2,
        borderRadius: 2,
        bgcolor:
          notification.read
            ? "transparent"
            : "action.hover",
        transition:
          "background-color .2s ease",

        "&:hover": {
          bgcolor:
            "action.hover"
        }
      }}
    >

      {!notification.read && (

        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 12,
            bottom: 12,
            width: 3,
            bgcolor:
              `${color}.main`,
            borderRadius:
              "0 4px 4px 0"
          }}
        />

      )}


      <Stack
        direction="row"
        spacing={1.5}
        alignItems="flex-start"
      >

        <Avatar
          sx={{
            width:
              compact ? 36 : 42,
            height:
              compact ? 36 : 42,
            bgcolor:
              `${color}.light`,
            color:
              `${color}.main`
          }}
        >
          <Icon
            fontSize={
              compact
                ? "small"
                : "medium"
            }
          />
        </Avatar>


        <Box
          sx={{
            flex: 1,
            minWidth: 0
          }}
        >

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={1}
          >

            <Typography
              variant={
                compact
                  ? "body2"
                  : "subtitle2"
              }
              fontWeight={
                notification.read
                  ? 700
                  : 900
              }
              sx={{
                lineHeight: 1.35
              }}
            >
              {notification.title}
            </Typography>


            {!compact &&
              notification.priority &&
              notification.priority !==
                "NORMAL" && (

                <Chip
                  size="small"
                  label={
                    notification.priority
                  }
                  color={
                    priorityColor
                  }
                  variant="outlined"
                  sx={{
                    height: 22,
                    fontSize: 10,
                    fontWeight: 900
                  }}
                />

              )}

          </Stack>


          {notification.message && (

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                display:
                  "-webkit-box",
                WebkitLineClamp:
                  compact ? 2 : 4,
                WebkitBoxOrient:
                  "vertical",
                overflow:
                  "hidden"
              }}
            >
              {notification.message}
            </Typography>

          )}


          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              mt: 0.75
            }}
          >

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {
                formatNotificationTime(
                  notification.createdAt
                )
              }
            </Typography>


            {!notification.read && (

              <Typography
                variant="caption"
                color="primary.main"
                fontWeight={800}
              >
                New
              </Typography>

            )}

          </Stack>


          {!compact && (

            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                mt: 1
              }}
            >

              {!notification.read && (

                <Button
                  size="small"
                  startIcon={
                    <CheckOutlinedIcon />
                  }
                  onClick={() =>
                    onRead?.(
                      notification
                    )
                  }
                  sx={{
                    fontWeight: 800
                  }}
                >
                  Mark read
                </Button>

              )}


              {onOpen && (

                <Button
                  size="small"
                  onClick={() =>
                    onOpen(
                      notification
                    )
                  }
                  sx={{
                    fontWeight: 800
                  }}
                >
                  Open
                </Button>

              )}


              {onDelete && (

                <IconButton
                  size="small"
                  onClick={() =>
                    onDelete(
                      notification
                    )
                  }
                  sx={{
                    ml: "auto"
                  }}
                >
                  <DeleteOutlineOutlinedIcon
                    fontSize="small"
                  />
                </IconButton>

              )}

            </Stack>

          )}

        </Box>

      </Stack>

    </Box>
  );
};


export default NotificationItem;