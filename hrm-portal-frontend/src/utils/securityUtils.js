export const safeArray = value => {

  return Array.isArray(value)
    ? value
    : [];

};


export const normalizeAuditLog = (
  item = {}
) => {

  return {

    id:
      item.id ??
      item.auditId ??
      item.auditLogId ??
      null,

    userId:
      item.userId ??
      item.actorId ??
      null,

    userName:
      item.userName ??
      item.actorName ??
      item.fullName ??
      "System",

    email:
      item.email ??
      item.userEmail ??
      "",

    module:
      String(
        item.module ??
        item.entity ??
        item.entityName ??
        "SYSTEM"
      ).toUpperCase(),

    action:
      String(
        item.action ??
        item.event ??
        item.operation ??
        "UNKNOWN"
      ).toUpperCase(),

    description:
      item.description ??
      item.message ??
      item.details ??
      "",

    status:
      String(
        item.status ??
        item.result ??
        "SUCCESS"
      ).toUpperCase(),

    ipAddress:
      item.ipAddress ??
      item.ip ??
      "-",

    userAgent:
      item.userAgent ??
      item.browser ??
      "-",

    device:
      item.device ??
      item.deviceName ??
      "-",

    location:
      item.location ??
      item.city ??
      "-",

    createdAt:
      item.createdAt ??
      item.timestamp ??
      item.date ??
      null,

    oldValue:
      item.oldValue ??
      item.previousValue ??
      null,

    newValue:
      item.newValue ??
      item.currentValue ??
      null,

    metadata:
      item.metadata ??
      {},

    raw:
      item
  };

};


export const normalizeLoginHistory = (
  item = {}
) => {

  return {

    id:
      item.id ??
      item.loginHistoryId ??
      item.historyId ??
      null,

    userId:
      item.userId ??
      null,

    userName:
      item.userName ??
      item.fullName ??
      "Unknown user",

    email:
      item.email ??
      item.userEmail ??
      "",

    status:
      String(
        item.status ??
        item.loginStatus ??
        "SUCCESS"
      ).toUpperCase(),

    loginTime:
      item.loginTime ??
      item.loginAt ??
      item.createdAt ??
      item.timestamp ??
      null,

    logoutTime:
      item.logoutTime ??
      item.logoutAt ??
      null,

    ipAddress:
      item.ipAddress ??
      item.ip ??
      "-",

    device:
      item.device ??
      item.deviceName ??
      "-",

    browser:
      item.browser ??
      "-",

    operatingSystem:
      item.operatingSystem ??
      item.os ??
      "-",

    location:
      item.location ??
      item.city ??
      "-",

    userAgent:
      item.userAgent ??
      "-",

    failureReason:
      item.failureReason ??
      item.reason ??
      null,

    raw:
      item
  };

};


export const normalizePageResponse = (
  response,
  normalizer
) => {

  if (!response) {

    return {
      content: [],
      totalPages: 1,
      totalElements: 0,
      page: 0,
      size: 20
    };

  }


  let content = [];


  if (
    Array.isArray(
      response.content
    )
  ) {

    content =
      response.content;

  } else if (
    Array.isArray(
      response.data
    )
  ) {

    content =
      response.data;

  } else if (
    Array.isArray(
      response.auditLogs
    )
  ) {

    content =
      response.auditLogs;

  } else if (
    Array.isArray(
      response.loginHistory
    )
  ) {

    content =
      response.loginHistory;

  } else if (
    Array.isArray(
      response
    )
  ) {

    content =
      response;

  }


  return {

    content:
      content.map(
        normalizer
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


export const formatDateTime = value => {

  if (!value) {
    return "-";
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


  return date.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  );

};


export const formatDate = value => {

  if (!value) {
    return "-";
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


  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );

};


export const getInitials = name => {

  if (!name) {
    return "U";
  }


  return String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(
      value =>
        value
          .charAt(0)
          .toUpperCase()
    )
    .join("");

};


export const getActionLabel = action => {

  return String(
    action || "UNKNOWN"
  )
    .replace(
      /_/g,
      " "
    )
    .replace(
      /\b\w/g,
      char =>
        char.toUpperCase()
    );

};


export const getModuleLabel = module => {

  return String(
    module || "SYSTEM"
  )
    .replace(
      /_/g,
      " "
    )
    .replace(
      /\b\w/g,
      char =>
        char.toUpperCase()
    );

};


export const getAuditStatusColor =
  status => {

    switch (
      String(
        status || ""
      ).toUpperCase()
    ) {

      case "SUCCESS":
      case "COMPLETED":
      case "APPROVED":
        return "success";

      case "FAILED":
      case "ERROR":
      case "DENIED":
        return "error";

      case "PENDING":
        return "warning";

      default:
        return "default";
    }

  };


export const getLoginStatusColor =
  status => {

    switch (
      String(
        status || ""
      ).toUpperCase()
    ) {

      case "SUCCESS":
      case "LOGIN_SUCCESS":
      case "ACTIVE":
        return "success";

      case "FAILED":
      case "LOGIN_FAILED":
      case "BLOCKED":
      case "DENIED":
        return "error";

      case "LOGOUT":
        return "default";

      default:
        return "warning";

    }

  };


export const getSecurityErrorMessage = (
  error,
  fallback
) => {

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );

};