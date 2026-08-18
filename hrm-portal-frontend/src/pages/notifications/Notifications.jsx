import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Pagination,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography
} from "@mui/material";


import DoneAllOutlinedIcon
  from "@mui/icons-material/DoneAllOutlined";

import RefreshOutlinedIcon
  from "@mui/icons-material/RefreshOutlined";


import {
  useCallback,
  useEffect,
  useState
} from "react";


import NotificationItem
  from "../../components/Notifications/NotificationItem";


import NotificationEmptyState
  from "../../components/Notifications/NotificationEmptyState";

import notificationService
  from "../../services/notificationService";


import {
  getNotificationErrorMessage,
  normalizeNotificationResponse
} from "../../utils/notificationUtils";


const Notifications = () => {

  const [
    notifications,
    setNotifications
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  const [
    page,
    setPage
  ] = useState(0);


  const [
    totalPages,
    setTotalPages
  ] = useState(1);


  const [
    totalElements,
    setTotalElements
  ] = useState(0);


  const [
    tab,
    setTab
  ] = useState("ALL");


  const loadNotifications =
    useCallback(
      async () => {

        setLoading(true);
        setError("");

        try {

          const response =
            await notificationService
              .getNotifications({

                page,

                size: 20,

                unreadOnly:
                  tab === "UNREAD"

              });


          const normalized =
            normalizeNotificationResponse(
              response
            );


          setNotifications(
            normalized.content
          );

          setTotalPages(
            normalized.totalPages
          );

          setTotalElements(
            normalized.totalElements
          );

        } catch (requestError) {

          console.error(
            "Notifications loading failed:",
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
      [
        page,
        tab
      ]
    );


  useEffect(() => {

    loadNotifications();

  }, [
    loadNotifications
  ]);


  const handleTabChange =
    (
      event,
      value
    ) => {

      setTab(value);

      setPage(0);

    };


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

      } catch (requestError) {

        setError(
          getNotificationErrorMessage(
            requestError,
            "Unable to mark notification as read."
          )
        );

      }

    };


  const handleDelete =
    async notification => {

      try {

        await notificationService
          .deleteNotification(
            notification.id
          );


        setNotifications(
          previous =>
            previous.filter(
              item =>
                item.id !==
                notification.id
            )
        );


        setTotalElements(
          previous =>
            Math.max(
              0,
              previous - 1
            )
        );

      } catch (requestError) {

        setError(
          getNotificationErrorMessage(
            requestError,
            "Unable to delete notification."
          )
        );

      }

    };


  const handleMarkAllRead =
    async () => {

      try {

        await notificationService
          .markAllAsRead();


        setNotifications(
          previous =>
            previous.map(
              item => ({
                ...item,
                read: true
              })
            )
        );

      } catch (requestError) {

        setError(
          getNotificationErrorMessage(
            requestError,
            "Unable to mark notifications as read."
          )
        );

      }

    };


  const handleOpen =
    notification => {

      if (
        !notification.read
      ) {

        handleRead(
          notification
        );

      }


      if (
        notification.actionUrl
      ) {

        window.location.href =
          notification.actionUrl;

      }

    };


  return (
    <Box
      sx={{
        pb: 5
      }}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <Stack
        direction={{
          xs: "column",
          sm: "row"
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center"
        }}
        spacing={2}
        sx={{
          mb: 3
        }}
      >

        <Box>

          <Typography
            variant="h4"
            fontWeight={950}
            sx={{
              letterSpacing:
                "-.04em"
            }}
          >
            Notifications
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5
            }}
          >
            Stay updated with
            important workforce events.
          </Typography>

        </Box>


        <Stack
          direction="row"
          spacing={1}
        >

          <Button
            variant="outlined"
            startIcon={
              <RefreshOutlinedIcon />
            }
            onClick={
              loadNotifications
            }
            disabled={
              loading
            }
            sx={{
              fontWeight: 800
            }}
          >
            Refresh
          </Button>


          <Button
            variant="contained"
            startIcon={
              <DoneAllOutlinedIcon />
            }
            onClick={
              handleMarkAllRead
            }
            disabled={
              loading ||
              notifications.length === 0
            }
            sx={{
              fontWeight: 850
            }}
          >
            Mark all read
          </Button>

        </Stack>

      </Stack>


      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 3
          }}
          action={

            <Button
              size="small"
              onClick={
                loadNotifications
              }
            >
              Retry
            </Button>

          }
        >
          {error}
        </Alert>

      )}


      {/* =====================================================
          FILTERS
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          border:
            "1px solid",
          borderColor:
            "divider",
          borderRadius: 3,
          mb: 2
        }}
      >

        <Tabs
          value={tab}
          onChange={
            handleTabChange
          }
          variant="scrollable"
          scrollButtons="auto"
        >

          <Tab
            value="ALL"
            label="All"
            sx={{
              fontWeight: 800
            }}
          />

          <Tab
            value="UNREAD"
            label="Unread"
            sx={{
              fontWeight: 800
            }}
          />

        </Tabs>

      </Paper>


      {/* =====================================================
          CONTENT
      ===================================================== */}

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

        {loading ? (

          <Stack
            alignItems="center"
            sx={{
              py: 10
            }}
          >

            <CircularProgress />

            <Typography
              color="text.secondary"
              sx={{
                mt: 2
              }}
            >
              Loading notifications...
            </Typography>

          </Stack>

        ) : notifications.length ===
          0 ? (

          <NotificationEmptyState
            title={
              tab === "UNREAD"
                ? "No unread notifications"
                : "No notifications"
            }
            message={
              tab === "UNREAD"
                ? "You're completely caught up."
                : "Important updates will appear here."
            }
          />

        ) : (

          <Stack
            divider={
              <Divider />
            }
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

                  onRead={
                    handleRead
                  }

                  onDelete={
                    handleDelete
                  }

                  onOpen={
                    handleOpen
                  }

                />

              )
            )}

          </Stack>

        )}

      </Paper>


      {/* =====================================================
          PAGINATION
      ===================================================== */}

      {totalPages > 1 && (

        <Stack
          alignItems="center"
          sx={{
            mt: 3
          }}
        >

          <Pagination
            count={
              totalPages
            }
            page={
              page + 1
            }
            onChange={(
              event,
              value
            ) => {

              setPage(
                value - 1
              );

              window.scrollTo({
                top: 0,
                behavior: "smooth"
              });

            }}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />

        </Stack>

      )}


      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: "block",
          textAlign: "center",
          mt: 2
        }}
      >
        {totalElements} notification
        {totalElements === 1
          ? ""
          : "s"}
      </Typography>

    </Box>
  );
};


export default Notifications;