export const normalizeNotification = (
  notification = {}
) => {

  const id =
    notification.id ??
    notification.notificationId ??
    notification.alertId ??
    null;


  const title =
    notification.title ??
    notification.subject ??
    "Notification";


  const message =
    notification.message ??
    notification.description ??
    notification.body ??
    "";


  const type =
    String(
      notification.type ??
      notification.notificationType ??
      notification.category ??
      "GENERAL"
    ).toUpperCase();


  const priority =
    String(
      notification.priority ??
      "NORMAL"
    ).toUpperCase();


  const read =
    notification.read ??
    notification.isRead ??
    (notification.status
      ? String(notification.status).toUpperCase() === "READ"
      : undefined) ??
    false;


  const createdAt =
    notification.createdAt ??
    notification.createdDate ??
    notification.timestamp ??
    notification.date ??
    null;


  const actionUrl =
    notification.actionUrl ??
    notification.link ??
    notification.url ??
    null;


  return {

    id,

    title,

    message,

    type,

    priority,

    read: Boolean(read),

    createdAt,

    actionUrl,

    metadata:
      notification.metadata ??
      {},

    raw:
      notification

  };

};


export const normalizeNotificationResponse =
  response => {

    if (!response) {

      return {
        content: [],
        totalPages: 1,
        totalElements: 0,
        page: 0,
        size: 20
      };

    }


    const content =
      Array.isArray(
        response.content
      )
        ? response.content
        : Array.isArray(
            response.notifications
          )
          ? response.notifications
          : Array.isArray(
              response.data
            )
            ? response.data
            : Array.isArray(
                response
              )
              ? response
              : [];


    return {

      content:
        content.map(
          normalizeNotification
        ),

      totalPages:
        Number(
          response.totalPages ??
          1
        ),

      totalElements:
        Number(
          response.totalElements ??
          content.length
        ),

      page:
        Number(
          response.number ??
          response.page ??
          0
        ),

      size:
        Number(
          response.size ??
          20
        )

    };

  };


export const extractUnreadCount =
  response => {

    if (
      typeof response ===
      "number"
    ) {
      return response;
    }


    if (
      typeof response ===
      "string"
    ) {
      const value =
        Number(response);

      return Number.isFinite(
        value
      )
        ? value
        : 0;
    }


    return Number(
      response?.unreadCount ??
      response?.count ??
      response?.data?.unreadCount ??
      0
    );

  };


export const getNotificationIconType =
  type => {

    switch (
      String(type || "")
        .toUpperCase()
    ) {

      case "LEAVE":
      case "LEAVE_REQUEST":
        return "leave";

      case "ATTENDANCE":
        return "attendance";

      case "PAYROLL":
        return "payroll";

      case "DOCUMENT":
      case "DOCUMENTS":
        return "document";

      case "EMPLOYEE":
        return "employee";

      case "COMPANY":
        return "company";

      case "SECURITY":
        return "security";

      case "SYSTEM":
        return "system";

      default:
        return "general";

    }

  };


export const getNotificationColor =
  type => {

    switch (
      String(type || "")
        .toUpperCase()
    ) {

      case "LEAVE":
      case "LEAVE_REQUEST":
        return "warning";

      case "ATTENDANCE":
        return "info";

      case "PAYROLL":
        return "success";

      case "DOCUMENT":
      case "DOCUMENTS":
        return "secondary";

      case "SECURITY":
        return "error";

      default:
        return "primary";

    }

  };


export const getPriorityColor =
  priority => {

    switch (
      String(priority || "")
        .toUpperCase()
    ) {

      case "HIGH":
      case "CRITICAL":
        return "error";

      case "MEDIUM":
        return "warning";

      default:
        return "default";

    }

  };


export const formatNotificationTime =
  value => {

    if (!value) {
      return "";
    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return String(value);
    }


    const now =
      new Date();


    const diff =
      now.getTime() -
      date.getTime();


    const seconds =
      Math.floor(
        diff / 1000
      );


    if (seconds < 30) {
      return "Just now";
    }


    if (seconds < 60) {
      return `${seconds}s ago`;
    }


    const minutes =
      Math.floor(
        seconds / 60
      );


    if (minutes < 60) {
      return `${minutes}m ago`;
    }


    const hours =
      Math.floor(
        minutes / 60
      );


    if (hours < 24) {
      return `${hours}h ago`;
    }


    const days =
      Math.floor(
        hours / 24
      );


    if (days < 7) {
      return `${days}d ago`;
    }


    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );

  };


export const getNotificationRoute =
  notification => {

    if (
      notification?.actionUrl
    ) {
      return notification.actionUrl;
    }


    const metadata =
      notification?.metadata ||
      {};


    if (
      metadata.path
    ) {
      return metadata.path;
    }


    switch (
      String(
        notification?.type ||
        ""
      ).toUpperCase()
    ) {

      case "LEAVE":
      case "LEAVE_REQUEST":
        return "/leave";

      case "ATTENDANCE":
        return "/attendance";

      case "PAYROLL":
        return "/payroll";

      case "DOCUMENT":
      case "DOCUMENTS":
        return "/documents";

      case "EMPLOYEE":
        return "/employees";

      default:
        return null;

    }

  };


export const getNotificationErrorMessage =
  (
    error,
    fallback =
      "Unable to process notification."
  ) => {

    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      fallback
    );

  };
