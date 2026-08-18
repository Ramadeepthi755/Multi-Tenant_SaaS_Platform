export const LEAVE_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED"
};


export const LEAVE_TYPES = [
  {
    value: "CASUAL",
    label: "Casual Leave"
  },
  {
    value: "SICK",
    label: "Sick Leave"
  },
  {
    value: "ANNUAL",
    label: "Annual Leave"
  },
  {
    value: "EARNED",
    label: "Earned Leave"
  },
  {
    value: "UNPAID",
    label: "Unpaid Leave"
  },
  {
    value: "MATERNITY",
    label: "Maternity Leave"
  },
  {
    value: "PATERNITY",
    label: "Paternity Leave"
  },
  {
    value: "OTHER",
    label: "Other"
  }
];


export const LEAVE_STATUS_OPTIONS = [
  {
    value: "PENDING",
    label: "Pending"
  },
  {
    value: "APPROVED",
    label: "Approved"
  },
  {
    value: "REJECTED",
    label: "Rejected"
  },
  {
    value: "CANCELLED",
    label: "Cancelled"
  }
];


export const getLeaveStatusLabel = (
  status
) => {

  if (!status) {
    return "Unknown";
  }

  const normalized =
    String(status)
      .trim()
      .toUpperCase();

  const found =
    LEAVE_STATUS_OPTIONS.find(
      item => item.value === normalized
    );

  return (
    found?.label ||
    normalized
      .replace(/_/g, " ")
      .replace(
        /\b\w/g,
        char => char.toUpperCase()
      )
  );
};


export const getLeaveStatusColor = (
  status
) => {

  switch (
    String(status || "")
      .trim()
      .toUpperCase()
  ) {

    case "APPROVED":
      return "success";

    case "REJECTED":
      return "error";

    case "PENDING":
      return "warning";

    case "CANCELLED":
      return "default";

    default:
      return "default";
  }
};


export const getLeaveTypeLabel = (
  type
) => {

  if (!type) {
    return "Leave";
  }

  const normalized =
    String(type)
      .trim()
      .toUpperCase();

  const found =
    LEAVE_TYPES.find(
      item => item.value === normalized
    );

  return (
    found?.label ||
    normalized
      .replace(/_/g, " ")
      .replace(
        /\b\w/g,
        char => char.toUpperCase()
      )
  );
};


export const normalizeLeaveDate = (
  value
) => {

  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};


export const formatLeaveDate = (
  value
) => {

  const date =
    normalizeLeaveDate(value);

  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  ).format(date);
};


export const calculateLeaveDays = (
  fromDate,
  toDate
) => {

  if (!fromDate || !toDate) {
    return 0;
  }

  const start =
    normalizeLeaveDate(fromDate);

  const end =
    normalizeLeaveDate(toDate);

  if (!start || !end) {
    return 0;
  }

  const startDay = Date.UTC(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );

  const endDay = Date.UTC(
    end.getFullYear(),
    end.getMonth(),
    end.getDate()
  );

  const difference =
    Math.floor(
      (endDay - startDay) /
      (1000 * 60 * 60 * 24)
    );

  if (difference < 0) {
    return 0;
  }

  return difference + 1;
};


export const getLeaveEmployeeName = (
  leave
) => {

  if (!leave) {
    return "Unknown Employee";
  }

  return (
    leave.employeeName ||
    leave.employee?.fullName ||
    leave.employee?.name ||
    [
      leave.employee?.firstName,
      leave.employee?.lastName
    ]
      .filter(Boolean)
      .join(" ") ||
    "Unknown Employee"
  );
};


export const getLeaveEmployeeId = (
  leave
) => {

  if (!leave) {
    return "";
  }

  return (
    leave.employeeId ??
    leave.employee?.employeeId ??
    leave.employee?.id ??
    ""
  );
};


export const normalizeLeave = (
  leave = {}
) => {

  const fromDate =
    leave.fromDate ??
    leave.startDate ??
    leave.leaveFrom ??
    null;

  const toDate =
    leave.toDate ??
    leave.endDate ??
    leave.leaveTo ??
    null;

  return {

    id:
      leave.id ??
      leave.leaveId ??
      null,

    employeeId:
      getLeaveEmployeeId(leave),

    employeeName:
      getLeaveEmployeeName(leave),

    employeeCode:
      leave.employeeCode ||
      leave.employee?.employeeCode ||
      "",

    department:
      leave.departmentName ||
      leave.department?.name ||
      "—",

    designation:
      leave.designationName ||
      leave.designation?.name ||
      "—",

    leaveType:
      leave.leaveType ||
      leave.type ||
      "OTHER",

    fromDate,

    toDate,

    days:
      Number(
        leave.days ??
        leave.numberOfDays ??
        calculateLeaveDays(
          fromDate,
          toDate
        )
      ),

    reason:
      leave.reason ||
      leave.remarks ||
      leave.description ||
      "",

    status:
      String(
        leave.status || "PENDING"
      ).toUpperCase(),

    rejectionReason:
      leave.rejectionReason ||
      leave.rejectReason ||
      "",

    appliedDate:
      leave.appliedDate ||
      leave.createdDate ||
      leave.createdAt ||
      null,

    approvedDate:
      leave.approvedDate ||
      null,

    approvedBy:
      leave.approvedBy ||
      ""

  };
};


export const normalizeLeaveResponse = (
  response
) => {

  const content =
    Array.isArray(response?.content)
      ? response.content
      : Array.isArray(response)
        ? response
        : [];

  return {

    content:
      content.map(normalizeLeave),

    totalPages:
      Number(
        response?.totalPages ?? 1
      ),

    totalElements:
      Number(
        response?.totalElements ??
        content.length
      ),

    page:
      Number(
        response?.number ?? 0
      ),

    size:
      Number(
        response?.size ?? 20
      )

  };
};


export const normalizeLeaveSummary = (
  summary = {}
) => {

  return {

    total:
      Number(
        summary.total ??
        summary.totalRequests ??
        0
      ),

    pending:
      Number(
        summary.pending ??
        summary.pendingCount ??
        0
      ),

    approved:
      Number(
        summary.approved ??
        summary.approvedCount ??
        0
      ),

    rejected:
      Number(
        summary.rejected ??
        summary.rejectedCount ??
        0
      ),

    cancelled:
      Number(
        summary.cancelled ??
        summary.cancelledCount ??
        0
      )

  };
};


export const getLeaveErrorMessage = (
  error,
  fallback =
    "Unable to process leave request."
) => {

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};