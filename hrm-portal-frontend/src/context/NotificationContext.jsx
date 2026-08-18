import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";


const NotificationContext =
  createContext(null);


export const NotificationProvider = ({
  children
}) => {

  const [
    notification,
    setNotification
  ] = useState({
    open: false,
    message: "",
    severity: "info"
  });


  const showNotification =
    useCallback(
      (
        message,
        severity = "info"
      ) => {

        setNotification({
          open: true,
          message,
          severity
        });

      },
      []
    );


  const success =
    useCallback(
      message => {

        showNotification(
          message,
          "success"
        );

      },
      [
        showNotification
      ]
    );


  const error =
    useCallback(
      message => {

        showNotification(
          message,
          "error"
        );

      },
      [
        showNotification
      ]
    );


  const warning =
    useCallback(
      message => {

        showNotification(
          message,
          "warning"
        );

      },
      [
        showNotification
      ]
    );


  const info =
    useCallback(
      message => {

        showNotification(
          message,
          "info"
        );

      },
      [
        showNotification
      ]
    );


  const closeNotification =
    useCallback(
      () => {

        setNotification(
          previous => ({
            ...previous,
            open: false
          })
        );

      },
      []
    );


  const value =
    useMemo(
      () => ({
        notification,
        showNotification,
        success,
        error,
        warning,
        info,
        closeNotification
      }),
      [
        notification,
        showNotification,
        success,
        error,
        warning,
        info,
        closeNotification
      ]
    );


  return (
    <NotificationContext.Provider
      value={value}
    >
      {children}
    </NotificationContext.Provider>
  );
};


export const useNotification = () => {

  const context =
    useContext(
      NotificationContext
    );


  if (!context) {

    throw new Error(
      "useNotification must be used inside NotificationProvider."
    );

  }


  return context;
};


export default NotificationContext;