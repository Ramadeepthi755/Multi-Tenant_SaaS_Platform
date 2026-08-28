// ============================================================
// DASHBOARD UTILITIES
// ============================================================

export const safeNumber = (
  value,
  fallback = 0
) => {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};


// ============================================================
// PERCENTAGE
// ============================================================

export const percentage = (
  value,
  total
) => {

  const numericValue =
    safeNumber(value);

  const numericTotal =
    safeNumber(total);

  if (numericTotal === 0) {
    return 0;
  }

  return Math.round(
    (numericValue / numericTotal) * 100
  );

};


// ============================================================
// INITIALS
// ============================================================

export const getInitials = (
  name
) => {

  if (
    !name ||
    typeof name !== "string"
  ) {
    return "—";
  }

  const words =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (words.length === 0) {
    return "—";
  }

  if (words.length === 1) {
    return words[0]
      .charAt(0)
      .toUpperCase();
  }

  return (
    words[0].charAt(0) +
    words[words.length - 1].charAt(0)
  ).toUpperCase();

};


// ============================================================
// FORMAT DATE
// ============================================================

export const formatDate = (
  date
) => {

  if (!date) {
    return "—";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "—";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );

};


// ============================================================
// FORMAT STATUS
// ============================================================

export const formatStatus = (
  status
) => {

  if (!status) {
    return "—";
  }

  return String(status)
    .trim()
    .toLowerCase()
    .split("_")
    .map(
      word =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");

};


// ============================================================
// FORMAT NUMBER
// ============================================================

export const formatNumber = (
  value
) => {

  return safeNumber(value)
    .toLocaleString("en-IN");

};


// ============================================================
// DISPLAY VALUE
// ============================================================

export const displayValue = (
  value,
  fallback = "—"
) => {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  return value;

};


// ============================================================
// GET STAT VALUE
// ============================================================

export const getStatValue = (
  source,
  keys = [],
  fallback = 0
) => {

  if (
    source === null ||
    source === undefined
  ) {
    return fallback;
  }

  if (
    typeof source === "number" &&
    Number.isFinite(source)
  ) {
    return source;
  }

  if (
    typeof source === "string" &&
    source.trim() !== ""
  ) {

    const number =
      Number(source);

    if (
      Number.isFinite(number)
    ) {
      return number;
    }

  }

  if (
    !Array.isArray(keys) ||
    keys.length === 0
  ) {
    return fallback;
  }

  for (
    const key of keys
  ) {

    if (
      key === null ||
      key === undefined
    ) {
      continue;
    }

    const parts =
      String(key)
        .split(".")
        .filter(Boolean);

    let current =
      source;

    for (
      const part of parts
    ) {

      if (
        current === null ||
        current === undefined
      ) {
        current = undefined;
        break;
      }

      current =
        current[part];

    }

    if (
      current === null ||
      current === undefined
    ) {
      continue;
    }

    if (
      typeof current === "object" &&
      !Array.isArray(current)
    ) {

      const nestedValue =
        current.value ??
        current.count ??
        current.total ??
        current.amount;

      if (
        nestedValue !== null &&
        nestedValue !== undefined
      ) {

        const number =
          Number(nestedValue);

        if (
          Number.isFinite(number)
        ) {
          return number;
        }

      }

      continue;

    }

    const number =
      Number(current);

    if (
      Number.isFinite(number)
    ) {
      return number;
    }

  }

  return fallback;

};


// ============================================================
// NORMALIZE DASHBOARD DATA
// ============================================================
//
// Backend response:
//
// {
//   totalEmployees,
//   activeEmployees,
//   totalDepartments,
//   totalDesignations,
//   todayAttendance,
//   todayLeaves,
//   currentMonthPayroll,
//   totalHolidays,
//   recentEmployees,
//   upcomingHolidays,
//   genderDistribution,
//   departmentDistribution,
//   employeeGrowth,
//   resignationTrend,
//   companyWiseEmployees
// }
//
// Dashboard components expect:
//
// data.stats
// data.attendance
// data.leave
// data.employees
// data.approvals
// data.holidays
//
// So we explicitly bridge those two structures.
// ============================================================

export const normalizeDashboardData = (
  data
) => {

  if (
    data === null ||
    data === undefined
  ) {
    return {};
  }


  if (
    Array.isArray(data)
  ) {
    return {
      stats: {},
      attendance: {},
      leave: {},
      payroll: {},
      employees: data,
      approvals: {},
      holidays: [],
      recentEmployees: data,
      recentActivities: []
    };
  }


  let source =
    data;


  /*
   * Support wrapped API responses.
   */

  if (
    data.data &&
    typeof data.data === "object" &&
    !Array.isArray(data.data)
  ) {

    source =
      data.data;

  }


  /*
   * Preserve backend fields.
   */

  const normalized = {
    ...source
  };


  // ==========================================================
  // RAW BACKEND VALUES
  // ==========================================================

  const totalEmployees =
    getStatValue(
      source,
      ["totalEmployees"],
      0
    );


  const activeEmployees =
    getStatValue(
      source,
      ["activeEmployees"],
      0
    );


  const totalDepartments =
    getStatValue(
      source,
      ["totalDepartments"],
      0
    );


  const totalDesignations =
    getStatValue(
      source,
      ["totalDesignations"],
      0
    );


  const todayAttendance =
    getStatValue(
      source,
      ["todayAttendance"],
      0
    );

  const todayPresent =
    getStatValue(
      source,
      ["todayPresent", "todayAttendance"],
      0
    );


  const todayLeaves =
    getStatValue(
      source,
      ["todayLeaves"],
      0
    );


  const currentMonthPayroll =
    getStatValue(
      source,
      ["currentMonthPayroll"],
      0
    );


  const totalHolidays =
    getStatValue(
      source,
      ["totalHolidays"],
      0
    );


  // ==========================================================
  // BACKEND FIELDS
  // ==========================================================

  normalized.totalEmployees =
    totalEmployees;


  normalized.activeEmployees =
    activeEmployees;


  normalized.totalDepartments =
    totalDepartments;


  normalized.totalDesignations =
    totalDesignations;


  normalized.todayAttendance =
    todayAttendance;

  normalized.todayPresent =
    todayPresent;


  normalized.todayLeaves =
    todayLeaves;


  normalized.currentMonthPayroll =
    currentMonthPayroll;


  normalized.totalHolidays =
    totalHolidays;


  // ==========================================================
  // RECENT EMPLOYEES
  // ==========================================================

  normalized.recentEmployees =
    Array.isArray(
      source.recentEmployees
    )
      ? source.recentEmployees
      : [];


  normalized.employees =
    normalized.recentEmployees;


  // ==========================================================
  // HOLIDAYS
  // ==========================================================

  normalized.upcomingHolidays =
    Array.isArray(
      source.upcomingHolidays
    )
      ? source.upcomingHolidays
      : [];


  normalized.holidays =
    normalized.upcomingHolidays;


  // ==========================================================
  // CHART DATA
  // ==========================================================

  normalized.genderDistribution =
    Array.isArray(
      source.genderDistribution
    )
      ? source.genderDistribution
      : [];


  normalized.departmentDistribution =
    Array.isArray(
      source.departmentDistribution
    )
      ? source.departmentDistribution
      : [];


  normalized.employeeGrowth =
    Array.isArray(
      source.employeeGrowth
    )
      ? source.employeeGrowth
      : [];


  normalized.resignationTrend =
    Array.isArray(
      source.resignationTrend
    )
      ? source.resignationTrend
      : [];


  normalized.companyWiseEmployees =
    Array.isArray(
      source.companyWiseEmployees
    )
      ? source.companyWiseEmployees
      : [];


  // ==========================================================
  // STATS
  // ==========================================================
  //
  // DashboardCards.jsx reads data.stats.
  // ==========================================================

  normalized.stats = {

    totalEmployees,

    activeEmployees,

    inactiveEmployees:
      Math.max(
        totalEmployees -
        activeEmployees,
        0
      ),

    totalDepartments,

    totalDesignations,

    todayAttendance,

    todayPresent,

    todayLeaves,

    currentMonthPayroll,

    totalHolidays

  };


  // ==========================================================
  // ATTENDANCE
  // ==========================================================
  //
  // Existing Dashboard components can use
  // data.attendance.present / absent / leave.
  //
  // Backend currently gives only todayAttendance.
  // We therefore don't invent absent/present numbers.
  // ==========================================================

  normalized.attendance = {

    total:
      todayAttendance,

    today:
      todayAttendance,

    present:
      todayPresent,

    absent:
      source.absentToday ??
      0,

    onLeave:
      todayLeaves

  };


  // ==========================================================
  // LEAVE
  // ==========================================================

  normalized.leave = {

    today:
      todayLeaves,

    total:
      todayLeaves,

    pending:
      source.pendingLeaves ??
      source.pendingLeave ??
      0

  };


  // ==========================================================
  // PAYROLL
  // ==========================================================

  normalized.payroll = {

    currentMonth:
      currentMonthPayroll,

    total:
      currentMonthPayroll

  };


  // ==========================================================
  // APPROVALS
  // ==========================================================
  //
  // Current backend DTO doesn't provide approval counts.
  // Keep them safely at zero rather than causing undefined
  // errors in the UI.
  // ==========================================================

  normalized.approvals = {

    pending:
      source.pendingApprovals ??
      0,

    leaves:
      source.pendingLeaves ??
      0,

    payroll:
      source.pendingPayroll ??
      0

  };


  // ==========================================================
  // RECENT ACTIVITIES
  // ==========================================================

  normalized.recentActivities =
    Array.isArray(
      source.recentActivities
    )
      ? source.recentActivities
      : Array.isArray(
          source.activities
        )
        ? source.activities
        : [];


  return normalized;

};


// ============================================================
// COMPATIBILITY ALIAS
// ============================================================

export const calculatePercentage = (
  value,
  total
) => {

  return percentage(
    value,
    total
  );

};
