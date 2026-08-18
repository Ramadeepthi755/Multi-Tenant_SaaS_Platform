export const PAYROLL_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  PROCESSED: "PROCESSED",
  PAID: "PAID",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED"
};


export const PAYROLL_STATUS_OPTIONS = [
  {
    value: "PENDING",
    label: "Pending"
  },
  {
    value: "PROCESSING",
    label: "Processing"
  },
  {
    value: "PROCESSED",
    label: "Processed"
  },
  {
    value: "PAID",
    label: "Paid"
  },
  {
    value: "FAILED",
    label: "Failed"
  },
  {
    value: "CANCELLED",
    label: "Cancelled"
  }
];


export const MONTH_OPTIONS = [
  {
    value: 1,
    label: "January"
  },
  {
    value: 2,
    label: "February"
  },
  {
    value: 3,
    label: "March"
  },
  {
    value: 4,
    label: "April"
  },
  {
    value: 5,
    label: "May"
  },
  {
    value: 6,
    label: "June"
  },
  {
    value: 7,
    label: "July"
  },
  {
    value: 8,
    label: "August"
  },
  {
    value: 9,
    label: "September"
  },
  {
    value: 10,
    label: "October"
  },
  {
    value: 11,
    label: "November"
  },
  {
    value: 12,
    label: "December"
  }
];


export const getPayrollStatusLabel = status => {

  if (!status) {
    return "Unknown";
  }

  const normalized =
    String(status)
      .trim()
      .toUpperCase();

  const found =
    PAYROLL_STATUS_OPTIONS.find(
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


export const getPayrollStatusColor = status => {

  switch (
    String(status || "")
      .trim()
      .toUpperCase()
  ) {

    case "PAID":
      return "success";

    case "PROCESSED":
      return "info";

    case "PROCESSING":
      return "warning";

    case "PENDING":
      return "warning";

    case "FAILED":
      return "error";

    case "CANCELLED":
      return "default";

    default:
      return "default";
  }
};


export const formatCurrency = (
  value,
  currency = "INR"
) => {

  const amount =
    Number(value ?? 0);

  if (!Number.isFinite(amount)) {
    return "₹0.00";
  }

  try {

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency,
        maximumFractionDigits: 2
      }
    ).format(amount);

  } catch {

    return `₹${amount.toFixed(2)}`;

  }
};


export const formatDate = value => {

  if (!value) {
    return "—";
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
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


export const getEmployeeName = payroll => {

  if (!payroll) {
    return "Unknown Employee";
  }

  return (
    payroll.employeeName ||
    payroll.employee?.fullName ||
    payroll.employee?.name ||
    [
      payroll.employee?.firstName,
      payroll.employee?.lastName
    ]
      .filter(Boolean)
      .join(" ") ||
    "Unknown Employee"
  );
};


export const getEmployeeId = payroll => {

  if (!payroll) {
    return "";
  }

  return (
    payroll.employeeId ??
    payroll.employee?.employeeId ??
    payroll.employee?.id ??
    ""
  );
};


export const normalizePayroll = (
  payroll = {}
) => {

  const grossSalary = Number(
    payroll.grossSalary ??
    payroll.grossPay ??
    payroll.gross ??
    0
  );

  const deductions = Number(
    payroll.totalDeductions ??
    payroll.deductions ??
    payroll.deductionAmount ??
    0
  );

  const netSalary = Number(
    payroll.netSalary ??
    payroll.netPay ??
    payroll.net ??
    (
      grossSalary -
      deductions
    )
  );

  return {

    id:
      payroll.id ??
      payroll.payrollId ??
      null,

    employeeId:
      getEmployeeId(payroll),

    employeeName:
      getEmployeeName(payroll),

    employeeCode:
      payroll.employeeCode ||
      payroll.employee?.employeeCode ||
      "",

    department:
      payroll.departmentName ||
      payroll.department?.name ||
      "—",

    designation:
      payroll.designationName ||
      payroll.designation?.name ||
      "—",

    month:
      payroll.month ??
      payroll.payMonth ??
      "",

    year:
      payroll.year ??
      payroll.payYear ??
      "",

    grossSalary,

    basicSalary: Number(
      payroll.basicSalary ??
      payroll.basic ??
      0
    ),

    allowances: Number(
      payroll.allowances ??
      payroll.totalAllowances ??
      0
    ),

    deductions,

    netSalary,

    tax: Number(
      payroll.tax ??
      payroll.incomeTax ??
      0
    ),

    providentFund: Number(
      payroll.providentFund ??
      payroll.pf ??
      0
    ),

    otherDeductions: Number(
      payroll.otherDeductions ??
      0
    ),

    workingDays: Number(
      payroll.workingDays ??
      0
    ),

    paidDays: Number(
      payroll.paidDays ??
      0
    ),

    status:
      String(
        payroll.status ||
        "PENDING"
      ).toUpperCase(),

    paymentDate:
      payroll.paymentDate ||
      payroll.paidDate ||
      null,

    createdDate:
      payroll.createdDate ||
      payroll.createdAt ||
      null

  };
};


export const normalizePayrollResponse =
  response => {

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
          normalizePayroll
        ),

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


export const normalizePayrollSummary =
  summary => {

    const gross =
      Number(
        summary?.grossPayroll ??
        summary?.totalGross ??
        summary?.grossSalary ??
        0
      );

    const deductions =
      Number(
        summary?.totalDeductions ??
        summary?.deductions ??
        0
      );

    const net =
      Number(
        summary?.netPayroll ??
        summary?.totalNet ??
        summary?.netSalary ??
        (
          gross -
          deductions
        )
      );

    return {

      totalEmployees:
        Number(
          summary?.totalEmployees ??
          summary?.employeeCount ??
          0
        ),

      grossPayroll: gross,

      deductions,

      netPayroll: net,

      pending:
        Number(
          summary?.pending ??
          summary?.pendingCount ??
          0
        ),

      processed:
        Number(
          summary?.processed ??
          summary?.processedCount ??
          0
        ),

      paid:
        Number(
          summary?.paid ??
          summary?.paidCount ??
          0
        )

    };
  };


export const getPayrollErrorMessage = (
  error,
  fallback =
    "Unable to process payroll request."
) => {

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};


export const getCurrentYear = () =>
  new Date().getFullYear();


export const getYearOptions = (
  range = 5
) => {

  const current =
    getCurrentYear();

  return Array.from(
    { length: range + 1 },
    (_, index) =>
      current - index
  );
};


export const getMonthLabel = month => {

  const found =
    MONTH_OPTIONS.find(
      item =>
        Number(item.value) ===
        Number(month)
    );

  return found?.label || "—";
};