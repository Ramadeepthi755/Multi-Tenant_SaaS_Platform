import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Popover,
  Stack,
  Typography
} from "@mui/material";


import ArrowForwardOutlinedIcon
  from "@mui/icons-material/ArrowForwardOutlined";


import {
  useCallback,
  useEffect,
  useState
} from "react";


import notificationService
  from "../../services/notificationService";


import NotificationItem
  from "./NotificationItem";


import NotificationEmptyState
  from "./NotificationEmptyState";


import {
  getNotificationErrorMessage,
  normalizeNotificationResponse
} from "../../utils/notificationUtils";


const NotificationMenu = ({
  anchorEl,
  open,
  onClose,
  onUnreadCountChange
}) => {

  const [
    notifications,
    setNotifications
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(false);


  const [
    error,
    setError
  ] = useState("");


  const loadNotifications =
    useCallback(
      async () => {

        setLoading(true);
        setError("");

        try {

          const response =
            await notificationService
              .getNotifications({
                page: 0,
                size: 6
              });


          const normalized =
            normalizeNotificationResponse(
              response
            );


          setNotifications(
            normalized.content
              .slice(0, 6)
          );


        } catch (requestError) {

          console.error(
            "Notification menu loading failed:",
            requestError
          );


          setError(
            getNotificationErrorMessage(
              requestError,
              "Unable to load notifications."
            )
          );

        } finally {

          setLoading(false);

        }

      },
      []
    );


  useEffect(() => {

    if (open) {
      loadNotifications();
    }

  }, [
    open,
    loadNotifications
  ]);


  const handleRead =
    async notification => {

      if (
        notification.read
      ) {
        return;
      }


      try {

        await notificationService
          .markAsRead(
            notification.id
          );


        setNotifications(
          previous =>
            previous.map(
              item =>
                item.id ===
                notification.id
                  ? {
                      ...item,
                      read: true
                    }
                  : item
            )
        );


        onUnreadCountChange?.(
          -1
        );

      } catch (requestError) {

        console.error(
          requestError
        );

      }

    };


  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            width: {
              xs: "calc(100vw - 24px)",
              sm: 410
            },
            maxWidth: 410,
            borderRadius: 3,
            overflow: "hidden"
          }
        }
      }}
    >

      <Paper
        elevation={0}
      >

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            px: 2,
            py: 1.75
          }}
        >

          <Box>

            <Typography
              fontWeight={900}
            >
              Notifications
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Recent updates and alerts
            </Typography>

          </Box>


          <IconButton
            size="small"
            onClick={
              loadNotifications
            }
            disabled={
              loading
            }
          >

            {loading
              ? (
                <CircularProgress
                  size={18}
                />
              )
              : (
                <Typography
                  variant="caption"
                  fontWeight={800}
                >
                  Refresh
                </Typography>
              )}

          </IconButton>

        </Stack>


        <Divider />


        {loading ? (

          <Stack
            alignItems="center"
            sx={{
              py: 6
            }}
          >

            <CircularProgress
              size={28}
            />

          </Stack>

        ) : error ? (

          <Stack
            alignItems="center"
            spacing={1}
            sx={{
              py: 5,
              px: 2
            }}
          >

            <Typography
              color="error"
              variant="body2"
              textAlign="center"
            >
              {error}
            </Typography>

            <Button
              size="small"
              onClick={
                loadNotifications
              }
            >
              Retry
            </Button>

          </Stack>

        ) : notifications.length ===
          0 ? (

          <NotificationEmptyState
            title="No new notifications"
            message="You're all caught up."
          />

        ) : (

          <Stack
            divider={
              <Divider />
            }
            sx={{
              maxHeight: 440,
              overflowY: "auto"
            }}
          >

            {notifications.map(
              notification => (

                <NotificationItem

                  key={
                    notification.id
                  }

                  notification={
                    notification
                  }

                  compact

                  onRead={
                    handleRead
                  }

                />

              )
            )}

          </Stack>

        )}


        <Divider />


        <Button
          fullWidth
          endIcon={
            <ArrowForwardOutlinedIcon />
          }
          onClick={() => {

            onClose();

            window.location.href =
              "/notifications";

          }}
          sx={{
            py: 1.5,
            fontWeight: 850,
            textTransform:
              "none"
          }}
        >
          View all notifications
        </Button>

      </Paper>

    </Popover>
  );
};


export default NotificationMenu;