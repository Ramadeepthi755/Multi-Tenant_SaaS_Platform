import {
  Alert,
  Snackbar
} from "@mui/material";

import {
  useEffect,
  useState
} from "react";


const AppSnackbar = () => {

  const [
    snackbar,
    setSnackbar
  ] = useState({
    open: false,
    message: "",
    severity: "info"
  });


  useEffect(() => {

    const handleNotification = (
      event
    ) => {

      const detail =
        event?.detail || {};


      const message =
        detail.message ||
        detail.text ||
        "";


      if (!message) {
        return;
      }


      setSnackbar({
        open: true,

        message,

        severity:
          detail.severity ||
          detail.type ||
          "info"
      });

    };


    window.addEventListener(
      "hrm:notification",
      handleNotification
    );


    return () => {

      window.removeEventListener(
        "hrm:notification",
        handleNotification
      );

    };

  }, []);


  const handleClose = (
    _event,
    reason
  ) => {

    if (
      reason ===
      "clickaway"
    ) {

      return;

    }


    setSnackbar(
      previous => ({
        ...previous,
        open: false
      })
    );

  };


  return (

    <Snackbar
      open={
        snackbar.open
      }
      autoHideDuration={4000}
      onClose={
        handleClose
      }
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
    >

      <Alert
        onClose={
          handleClose
        }
        severity={
          snackbar.severity
        }
        variant="filled"
        elevation={6}
        sx={{
          minWidth: 280,
          maxWidth: 500
        }}
      >

        {snackbar.message}

      </Alert>

    </Snackbar>

  );

};


export default AppSnackbar;