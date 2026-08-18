// ============================================================
// ATTENDANCE STATUS
// ============================================================

export const ATTENDANCE_STATUS = {
  PRESENT: "PRESENT",
  ABSENT: "ABSENT",
  LATE: "LATE",
  HALF_DAY: "HALF_DAY",
  ON_LEAVE: "ON_LEAVE",
  WEEK_OFF: "WEEK_OFF",
  HOLIDAY: "HOLIDAY",
  WORK_FROM_HOME: "WORK_FROM_HOME",
  PENDING: "PENDING"
};


// ============================================================
// STATUS OPTIONS
// ============================================================

export const ATTENDANCE_STATUS_OPTIONS = [
  {
    value: "PRESENT",
    label: "Present"
  },
  {
    value: "ABSENT",
    label: "Absent"
  },
  {
    value: "LATE",
    label: "Late"
  },
  {
    value: "HALF_DAY",
    label: "Half Day"
  },
  {
    value: "ON_LEAVE",
    label: "On Leave"
  },
  {
    value: "WEEK_OFF",
    label: "Week Off"
  },
  {
    value: "HOLIDAY",
    label: "Holiday"
  },
  {
    value: "WORK_FROM_HOME",
    label: "Work From Home"
  }
];


// ============================================================
// STATUS LABEL
// ============================================================

export const getAttendanceStatusLabel = (
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
    ATTENDANCE_STATUS_OPTIONS.find(
      item =>
        item.value === normalized
    );

  if (found) {
    return found.label;
  }

  return normalized
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      char => char.toUpperCase()
    );
};


// ============================================================
// STATUS COLOR
// ============================================================

export const getAttendanceStatusColor = (
  status
) => {

  const normalized =
    String(status || "")
      .trim()
      .toUpperCase();

  switch (normalized) {

    case "PRESENT":
      return "success";

    case "LATE":
      return "warning";

    case "ABSENT":
      return "error";

    case "HALF_DAY":
      return "warning";

    case "ON_LEAVE":
      return "info";

    case "WORK_FROM_HOME":
      return "info";

    case "WEEK_OFF":
      return "default";

    case "HOLIDAY":
      return "secondary";

    case "PENDING":
      return "warning";

    default:
      return "default";
  }
};


// ============================================================
// DATE NORMALIZER
// ============================================================

export const normalizeDate = (
  value
) => {

  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return date;
};


// ============================================================
// DATE FORMAT
// ============================================================

export const formatAttendanceDate = (
  value
) => {

  const date =
    normalizeDate(value);

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


// ============================================================
// TIME FORMAT
// ============================================================

export const formatAttendanceTime = (
  value
) => {

  if (!value) {
    return "—";
  }

  const raw =
    String(value).trim();

  if (
    /^\d{1,2}:\d{2}(:\d{2})?$/.test(
      raw
    )
  ) {

    const parts =
      raw.split(":");

    const hours =
      Number(parts[0]);

    const minutes =
      Number(parts[1]);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes)
    ) {
      return raw;
    }

    const date =
      new Date();

    date.setHours(
      hours,
      minutes,
      0,
      0
    );

    return new Intl.DateTimeFormat(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }
    ).format(date);
  }

  const date =
    normalizeDate(value);

  if (!date) {
    return raw;
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }
  ).format(date);
};


// ============================================================
// TIME TO MINUTES
// ============================================================

export const timeToMinutes = (
  value
) => {

  if (!value) {
    return null;
  }

  const raw =
    String(value).trim();

  const match =
    raw.match(
      /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/
    );

  if (!match) {
    return null;
  }

  const hours =
    Number(match[1]);

  const minutes =
    Number(match[2]);

  if (
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return (
    hours * 60 +
    minutes
  );
};


// ============================================================
// WORKING MINUTES
// ============================================================

export const calculateWorkingMinutes = (
  checkIn,
  checkOut
) => {

  const start =
    timeToMinutes(
      checkIn
    );

  const end =
    timeToMinutes(
      checkOut
    );

  if (
    start === null ||
    end === null
  ) {
    return null;
  }

  let difference =
    end - start;

  if (difference < 0) {
    difference += 24 * 60;
  }

  return difference;
};


// ============================================================
// WORKING HOURS
// ============================================================

export const formatWorkingHours = (
  minutes
) => {

  if (
    minutes === null ||
    minutes === undefined ||
    Number.isNaN(
      Number(minutes)
    )
  ) {
    return "—";
  }

  const totalMinutes =
    Math.max(
      0,
      Math.round(
        Number(minutes)
      )
    );

  const hours =
    Math.floor(
      totalMinutes / 60
    );

  const remainingMinutes =
    totalMinutes % 60;

  return `${hours}h ${String(
    remainingMinutes
  ).padStart(
    2,
    "0"
  )}m`;
};


// ============================================================
// EMPLOYEE NAME
// ============================================================

export const getAttendanceEmployeeName = (
  attendance
) => {

  if (!attendance) {
    return "Unknown Employee";
  }

  return (
    attendance.employeeName ||
    attendance.employee?.fullName ||
    attendance.employee?.name ||
    [
      attendance.employee?.firstName,
      attendance.employee?.lastName
    ]
      .filter(Boolean)
      .join(" ") ||
    "Unknown Employee"
  );
};


// ============================================================
// EMPLOYEE ID
// ============================================================

export const getAttendanceEmployeeId = (
  attendance
) => {

  if (!attendance) {
    return "";
  }

  return (
    attendance.employeeId ??
    attendance.employee?.employeeId ??
    attendance.employee?.id ??
    attendance.employeeCode ??
    ""
  );
};


// ============================================================
// DEPARTMENT
// ============================================================

export const getAttendanceDepartment = (
  attendance
) => {

  if (!attendance) {
    return "—";
  }

  return (
    attendance.departmentName ||
    attendance.department?.departmentName ||
    attendance.department?.name ||
    "—"
  );
};


// ============================================================
// DESIGNATION
// ============================================================

export const getAttendanceDesignation = (
  attendance
) => {

  if (!attendance) {
    return "—";
  }

  return (
    attendance.designationName ||
    attendance.designation?.designationName ||
    attendance.designation?.name ||
    "—"
  );
};


// ============================================================
// CHECK IN
// ============================================================

export const getCheckInTime = (
  attendance
) => {

  return (
    attendance?.checkIn ??
    attendance?.checkInTime ??
    attendance?.inTime ??
    attendance?.clockIn ??
    null
  );
};


// ============================================================
// CHECK OUT
// ============================================================

export const getCheckOutTime = (
  attendance
) => {

  return (
    attendance?.checkOut ??
    attendance?.checkOutTime ??
    attendance?.outTime ??
    attendance?.clockOut ??
    null
  );
};


// ============================================================
// DATE
// ============================================================

export const getAttendanceDate = (
  attendance
) => {

  return (
    attendance?.date ??
    attendance?.attendanceDate ??
    attendance?.attendanceDay ??
    attendance?.createdDate ??
    null
  );
};


// ============================================================
// STATUS
// ============================================================

export const getAttendanceStatus = (
  attendance
) => {

  return (
    attendance?.status ||
    attendance?.attendanceStatus ||
    "PENDING"
  )
    .toString()
    .toUpperCase();
};


// ============================================================
// WORKING MINUTES
// ============================================================

export const normalizeWorkingMinutes = (
  attendance
) => {

  if (!attendance) {
    return null;
  }

  const backendMinutes =
    attendance.workingMinutes ??
    attendance.workedMinutes ??
    attendance.totalWorkingMinutes;

  if (
    backendMinutes !== null &&
    backendMinutes !== undefined
  ) {
    return Number(
      backendMinutes
    );
  }

  return calculateWorkingMinutes(
    getCheckInTime(
      attendance
    ),
    getCheckOutTime(
      attendance
    )
  );
};


// ============================================================
// NORMALIZE ATTENDANCE
// ============================================================

export const normalizeAttendance = (
  attendance = {}
) => {

  const checkIn =
    getCheckInTime(
      attendance
    );

  const checkOut =
    getCheckOutTime(
      attendance
    );

  const status =
    getAttendanceStatus(
      attendance
    );

  const workingMinutes =
    normalizeWorkingMinutes(
      attendance
    );

  return {

    id:
      attendance.id ??
      attendance.attendanceId ??
      null,

    employeeId:
      getAttendanceEmployeeId(
        attendance
      ),

    employeeName:
      getAttendanceEmployeeName(
        attendance
      ),

    employeeCode:
      attendance.employeeCode ||
      attendance.employee?.employeeCode ||
      "",

    department:
      getAttendanceDepartment(
        attendance
      ),

    designation:
      getAttendanceDesignation(
        attendance
      ),

    date:
      getAttendanceDate(
        attendance
      ),

    checkIn,

    checkOut,

    workingMinutes,

    status,

    remarks:
      attendance.remarks ||
      attendance.remark ||
      attendance.notes ||
      "",

    location:
      attendance.location ||
      attendance.workLocation ||
      "",

    source:
      attendance.source ||
      "",

    isLate:
      Boolean(
        attendance.isLate
      )

  };
};


// ============================================================
// PAGINATION NORMALIZER
// ============================================================

export const normalizeAttendanceResponse = (
  response
) => {

  const content =
    Array.isArray(
      response?.content
    )
      ? response.content
      : Array.isArray(response)
        ? response
        : [];

  return {

    content:
      content.map(
        normalizeAttendance
      ),

    totalPages:
      Number(
        response?.totalPages ??
        1
      ),

    totalElements:
      Number(
        response?.totalElements ??
        content.length
      ),

    page:
      Number(
        response?.number ??
        0
      ),

    size:
      Number(
        response?.size ??
        20
      )

  };
};


// ============================================================
// SUMMARY NORMALIZER
// ============================================================

export const normalizeAttendanceSummary = (
  summary = {}
) => {

  return {

    total:
      Number(
        summary.total ??
        summary.totalEmployees ??
        summary.totalAttendance ??
        0
      ),

    present:
      Number(
        summary.present ??
        summary.presentCount ??
        0
      ),

    absent:
      Number(
        summary.absent ??
        summary.absentCount ??
        0
      ),

    late:
      Number(
        summary.late ??
        summary.lateCount ??
        0
      ),

    halfDay:
      Number(
        summary.halfDay ??
        summary.halfDayCount ??
        0
      ),

    onLeave:
      Number(
        summary.onLeave ??
        summary.leaveCount ??
        0
      ),

    weekOff:
      Number(
        summary.weekOff ??
        summary.weekOffCount ??
        0
      ),

    holiday:
      Number(
        summary.holiday ??
        summary.holidayCount ??
        0
      )

  };
};


// ============================================================
// TODAY
// ============================================================

export const getTodayDateString = () => {

  const date =
    new Date();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;
};


// ============================================================
// ERROR MESSAGE
// ============================================================

export const getAttendanceErrorMessage = (
  error,
  fallback =
    "Unable to process attendance request."
) => {

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};