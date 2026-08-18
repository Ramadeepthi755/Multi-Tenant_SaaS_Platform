// ============================================================
// DEPARTMENT UTILITIES
// ============================================================


export const emptyDepartmentForm = {
  departmentName: "",
  departmentCode: "",
  description: "",
  companyId: "",
  status: "ACTIVE",
  active: true
};


// ============================================================
// NORMALIZE DEPARTMENT
// ============================================================

export const normalizeDepartment = (
  department = {}
) => {

  const company =
    department.company || {};


  return {

    id:
      department.id ??
      department.departmentId ??
      null,


    departmentName:
      department.departmentName ??
      department.name ??
      "",


    departmentCode:
      department.departmentCode ??
      department.code ??
      "",


    description:
      department.description ??
      "",


    companyId:
      department.companyId ??
      company.id ??
      company.companyId ??
      "",


    companyName:
      department.companyName ??
      company.companyName ??
      company.name ??
      "",


    status:
      department.status ??
      "UNKNOWN",


    active:
      department.active ??
      false,


    employeeCount:
      Number(
        department.employeeCount ??
        department.totalEmployees ??
        department.employeesCount ??
        0
      ),


    createdDate:
      department.createdDate ??
      department.createdAt ??
      null,


    updatedDate:
      department.updatedDate ??
      department.updatedAt ??
      null
  };
};


// ============================================================
// NORMALIZE PAGE
// ============================================================

export const normalizeDepartmentPage = (
  response
) => {

  if (
    !response ||
    typeof response !== "object"
  ) {

    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 20,
      first: true,
      last: true
    };
  }


  const content =
    Array.isArray(
      response.content
    )
      ? response.content.map(
          normalizeDepartment
        )
      : [];


  return {

    content,

    totalElements:
      Number(
        response.totalElements || 0
      ),

    totalPages:
      Number(
        response.totalPages || 0
      ),

    number:
      Number(
        response.number || 0
      ),

    size:
      Number(
        response.size || 20
      ),

    first:
      Boolean(
        response.first ?? true
      ),

    last:
      Boolean(
        response.last ?? true
      )
  };
};


// ============================================================
// STATUS
// ============================================================

export const isDepartmentActive = (
  department
) => {

  if (!department) {
    return false;
  }


  const status =
    String(
      department.status || ""
    ).toUpperCase();


  return (
    department.active === true &&
    status === "ACTIVE"
  );
};


// ============================================================
// DATE
// ============================================================

export const formatDepartmentDate = (
  value
) => {

  if (!value) {
    return "—";
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
// INITIALS
// ============================================================

export const getDepartmentInitials = (
  name
) => {

  if (!name) {
    return "DP";
  }


  const words =
    name
      .trim()
      .split(/\s+/);


  if (words.length === 1) {

    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }


  return words
    .slice(0, 2)
    .map(
      word =>
        word.charAt(0)
    )
    .join("")
    .toUpperCase();
};


// ============================================================
// SAFE ERROR
// ============================================================

export const getApiErrorMessage = (
  error,
  fallback
) => {

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    fallback
  );
};