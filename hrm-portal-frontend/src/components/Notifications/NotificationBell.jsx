import {
  IconButton,
  Tooltip
} from "@mui/material";


import NotificationsNoneOutlinedIcon
  from "@mui/icons-material/NotificationsNoneOutlined";


import {
  useEffect,
  useState
} from "react";


import notificationService
  from "../../services/notificationService";


import NotificationBadge
  from "./NotificationBadge";


import NotificationMenu
  from "./NotificationMenu";


import {
  extractUnreadCount
} from "../../utils/notificationUtils";


const NotificationBell = () => {

  const [
    anchorEl,
    setAnchorEl
  ] = useState(null);


  const [
    unreadCount,
    setUnreadCount
  ] = useState(0);


  const loadUnreadCount =
    async () => {

      try {

        const response =
          await notificationService
            .getUnreadCount();


        setUnreadCount(
          Math.max(
            0,
            extractUnreadCount(
              response
            )
          )
        );

      } catch (error) {

        /*
         * Notifications should never
         * break the Navbar.
         */

        console.warn(
          "Unable to load notification count:",
          error
        );

      }

    };


  useEffect(() => {

    loadUnreadCount();

    const interval =
      setInterval(
        loadUnreadCount,
        60000
      );

    return () =>
      clearInterval(
        interval
      );

  }, []);


  const handleOpen =
    event => {

      setAnchorEl(
        event.currentTarget
      );

    };


  const handleClose =
    () => {

      setAnchorEl(null);

    };


  const handleUnreadChange =
    delta => {

      setUnreadCount(
        previous =>
          Math.max(
            0,
            previous + delta
          )
      );

    };


  return (
    <>
      <Tooltip
        title="Notifications"
      >

        <IconButton
          onClick={
            handleOpen
          }
          aria-label="Notifications"
        >

          <NotificationBadge
            count={
              unreadCount
            }
          >

            <NotificationsNoneOutlinedIcon />

          </NotificationBadge>

        </IconButton>

      </Tooltip>


      <NotificationMenu

        anchorEl={
          anchorEl
        }

        open={
          Boolean(anchorEl)
        }

        onClose={
          handleClose
        }

        onUnreadCountChange={
          handleUnreadChange
        }

      />

    </>
  );
};


export default NotificationBell;