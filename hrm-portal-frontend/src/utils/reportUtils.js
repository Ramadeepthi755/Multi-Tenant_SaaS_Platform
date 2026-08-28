export const normalizePageResponse = (
  response,
  normalizer = item => item
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
      response.items
    )
  ) {

    content =
      response.items;

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


export const normalizeEmployeeReport = (
  item = {}
) => {

  return {

    id:
      item.id ??
      item.employeeId ??
      null,

    employeeCode:
      item.employeeCode ??
      item.employeeNumber ??
      "-",

    employeeName:
      item.employeeName ??
      item.fullName ??
      item.name ??
      "-",

    email:
      item.email ??
      "-",

    department:
      item.departmentName ??
      item.department ??
      "-",

    designation:
      item.designationName ??
      item.designation ??
      "-",

    status:
      String(
        item.status ??
        "ACTIVE"
      ).toUpperCase(),

    joiningDate:
      item.joiningDate ??
      item.dateOfJoining ??
      null

  };

};


export const normalizeAttendanceReport = (
  item = {}
) => {

  return {

    id:
      item.id ??
      item.attendanceId ??
      null,

    employeeName:
      item.employeeName ??
      item.fullName ??
      "-",

    employeeCode:
      item.employeeCode ??
      "-",

    department:
      item.departmentName ??
      item.department ??
      "-",

    date:
      item.date ??
      item.attendanceDate ??
      null,

    checkIn:
      item.checkIn ??
      item.checkInTime ??
      null,

    checkOut:
      item.checkOut ??
      item.checkOutTime ??
      null,

    status:
      String(
        item.status ??
        "UNKNOWN"
      ).toUpperCase(),

    workingHours:
      item.workingHours ??
      item.hours ??
      "-"

  };

};


export const normalizeLeaveReport = (
  item = {}
) => {

  return {

    id:
      item.id ??
      item.leaveId ??
      null,

    employeeName:
      item.employeeName ??
      item.fullName ??
      "-",

    employeeCode:
      item.employeeCode ??
      "-",

    department:
      item.departmentName ??
      item.department ??
      "-",

    leaveType:
      item.leaveType ??
      item.type ??
      "-",

    fromDate:
      item.fromDate ??
      item.startDate ??
      null,

    toDate:
      item.toDate ??
      item.endDate ??
      null,

    days:
      item.days ??
      item.numberOfDays ??
      0,

    status:
      String(
        item.status ??
        "PENDING"
      ).toUpperCase()

  };

};


export const normalizePayrollReport = (
  item = {}
) => {

  return {

    id:
      item.id ??
      item.payrollId ??
      null,

    employeeName:
      item.employeeName ??
      item.fullName ??
      "-",

    employeeCode:
      item.employeeCode ??
      "-",

    department:
      item.departmentName ??
      item.department ??
      "-",

    month:
      item.month ??
      "-",

    year:
      item.year ??
      "-",

    grossSalary:
      Number(
        item.grossSalary ??
        item.gross ??
        0
      ),

    deductions:
      Number(
        item.deductions ??
        item.totalDeductions ??
        0
      ),

    netSalary:
      Number(
        item.netSalary ??
        item.net ??
        0
      ),

    status:
      String(
        item.status ??
        "PROCESSED"
      ).toUpperCase()

  };

};


export const normalizeDepartmentReport = (
  item = {}
) => {

  return {

    id:
      item.id ??
      item.departmentId ??
      null,

    departmentName:
      item.departmentName ??
      item.name ??
      "-",

    departmentCode:
      item.departmentCode ??
      item.code ??
      "-",

    employeeCount:
      Number(
        item.employeeCount ??
        item.totalEmployees ??
        0
      ),

    activeEmployees:
      Number(
        item.activeEmployees ??
        0
      ),

    inactiveEmployees:
      Number(
        item.inactiveEmployees ??
        0
      ),

    status:
      String(
        item.status ??
        "ACTIVE"
      ).toUpperCase()

  };

};


export const normalizeRecruitmentReport = (
  item = {}
) => ({
  id: item.candidateId ?? item.id ?? null,
  candidateName: item.candidateName ?? item.fullName ?? "-",
  email: item.email ?? "-",
  experience: item.experience ?? "-",
  currentCompany: item.currentCompany ?? "-",
  appliedAt: item.appliedAt ?? item.createdAt ?? null,
  status: String(item.status ?? "APPLIED").toUpperCase()
});


export const normalizePerformanceReport = (
  item = {}
) => ({
  id: item.performanceReviewId ?? item.id ?? null,
  employeeCode: item.employeeCode ?? "-",
  employeeName: item.employeeName ?? "-",
  department: item.departmentName ?? item.department ?? "-",
  cycleName: item.cycleName ?? "-",
  reviewDate: item.reviewDate ?? null,
  rating: item.rating ?? "-",
  status: String(item.status ?? "DRAFT").toUpperCase()
});


export const formatReportDate = (
  value
) => {

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


export const formatCurrency = (
  value
) => {

  const amount =
    Number(value || 0);


  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }
  ).format(amount);

};


export const formatNumber = (
  value
) => {

  return new Intl.NumberFormat(
    "en-IN"
  ).format(
    Number(value || 0)
  );

};


export const getReportStatusColor =
  status => {

    switch (
      String(
        status || ""
      ).toUpperCase()
    ) {

      case "ACTIVE":
      case "APPROVED":
      case "PRESENT":
      case "PROCESSED":
      case "COMPLETED":
        return "success";

      case "INACTIVE":
      case "ABSENT":
      case "REJECTED":
      case "FAILED":
        return "error";

      case "PENDING":
      case "HALF_DAY":
      case "ON_HOLD":
        return "warning";

      case "LATE":
        return "info";

      default:
        return "default";

    }

  };


export const getReportErrorMessage = (
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


export const downloadBlob = (
  blob,
  fileName
) => {

  if (!blob) {
    return;
  }


  const url =
    window.URL.createObjectURL(
      blob
    );


  const anchor =
    document.createElement(
      "a"
    );


  anchor.href = url;

  anchor.download =
    fileName;


  document.body.appendChild(
    anchor
  );


  anchor.click();


  anchor.remove();


  window.URL.revokeObjectURL(
    url
  );

};
