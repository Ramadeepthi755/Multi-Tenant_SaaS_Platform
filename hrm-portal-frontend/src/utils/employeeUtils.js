// ============================================================
// EMPTY FORM
// ============================================================

export const emptyEmployeeForm = {

  employeeCode: "",

  firstName: "",

  lastName: "",

  email: "",

  phone: "",

  gender: "",

  dateOfBirth: "",

  joiningDate: "",

  companyId: "",

  departmentId: "",

  designationId: "",

  reportingManagerId: "",

  employmentType: "FULL_TIME",

  status: "ACTIVE",

  address: "",

  city: "",

  state: "",

  country: "India",

  postalCode: ""

};


// ============================================================
// NORMALIZE EMPLOYEE
// ============================================================

export const normalizeEmployee = (
  employee = {}
) => {

  const company =
    employee.company || {};

  const department =
    employee.department || {};

  const designation =
    employee.designation || {};

  const reportingManager =
    employee.reportingManager || {};


  return {

    id:
      employee.id ??
      employee.employeeId ??
      null,

    employeeId:
      employee.employeeId ??
      employee.id ??
      null,

    employeeCode:
      employee.employeeCode ??
      employee.empCode ??
      employee.employeeNumber ??
      "",

    firstName:
      employee.firstName ??
      "",

    lastName:
      employee.lastName ??
      "",

    fullName:
      employee.fullName ??
      [
        employee.firstName,
        employee.lastName
      ]
        .filter(Boolean)
        .join(" "),

    email:
      employee.email ??
      "",

    phone:
      employee.phone ??
      employee.mobileNumber ??
      "",

    gender:
      employee.gender ??
      "",

    dateOfBirth:
      employee.dateOfBirth ??
      "",

    joiningDate:
      employee.joiningDate ??
      employee.dateOfJoining ??
      "",

    salary:
      employee.salary ??
      employee.basicSalary ??
      0,

    companyId:
      employee.companyId ??
      company.id ??
      company.companyId ??
      "",

    companyName:
      employee.companyName ??
      company.companyName ??
      company.name ??
      "",

    departmentId:
      employee.departmentId ??
      department.id ??
      department.departmentId ??
      "",

    departmentName:
      employee.departmentName ??
      department.departmentName ??
      department.name ??
      "",

    designationId:
      employee.designationId ??
      designation.id ??
      designation.designationId ??
      "",

    designationName:
      employee.designationName ??
      designation.designationName ??
      designation.name ??
      "",

    reportingManagerId:
      employee.reportingManagerId ??
      reportingManager.id ??
      reportingManager.employeeId ??
      "",

    reportingManagerName:
      employee.reportingManagerName ??
      reportingManager.fullName ??
      "",

    employmentType:
      employee.employmentType ??
      "FULL_TIME",

    status:
      employee.status ??
      "ACTIVE",

    active:
      employee.active ??
      employee.status === "ACTIVE",

    address:
      employee.address ??
      "",

    city:
      employee.city ??
      "",

    state:
      employee.state ??
      "",

    country:
      employee.country ??
      "India",

    postalCode:
      employee.postalCode ??
      "",

    profilePhoto:
      employee.profilePhoto ??
      employee.profileImage ??
      employee.photoUrl ??
      "",

    createdDate:
      employee.createdDate ??
      employee.createdAt ??
      null,

    updatedDate:
      employee.updatedDate ??
      employee.updatedAt ??
      null

  };

};


// ============================================================
// NORMALIZE PAGE
//
// Backend currently returns a plain array:
//
// [
//   {
//     employeeId: 1,
//     employeeCode: "EMP001",
//     ...
//   }
// ]
//
// Frontend was previously expecting:
//
// {
//   content: [...],
//   totalElements: 1,
//   totalPages: 1
// }
//
// This function now supports BOTH formats.
// ============================================================

export const normalizeEmployeePage = (
  response
) => {

  /*
  |--------------------------------------------------------------------------
  | CASE 1: BACKEND RETURNS PLAIN ARRAY
  |--------------------------------------------------------------------------
  */

  if (Array.isArray(response)) {

    const content =
      response.map(
        normalizeEmployee
      );


    const totalElements =
      content.length;


    return {

      content,

      totalElements,

      totalPages:
        totalElements > 0
          ? 1
          : 0,

      number: 0,

      size:
        totalElements > 0
          ? totalElements
          : 20,

      first: true,

      last: true

    };

  }


  /*
  |--------------------------------------------------------------------------
  | CASE 2: BACKEND RETURNS SPRING PAGE
  |--------------------------------------------------------------------------
  */

  if (
    response &&
    typeof response === "object"
  ) {

    const content =
      Array.isArray(
        response.content
      )
        ? response.content.map(
            normalizeEmployee
          )
        : [];


    return {

      content,

      totalElements:
        Number(
          response.totalElements ??
          content.length ??
          0
        ),

      totalPages:
        Number(
          response.totalPages ??
          (
            content.length > 0
              ? 1
              : 0
          )
        ),

      number:
        Number(
          response.number ??
          0
        ),

      size:
        Number(
          response.size ??
          20
        ),

      first:
        Boolean(
          response.first ??
          true
        ),

      last:
        Boolean(
          response.last ??
          true
        )

    };

  }


  /*
  |--------------------------------------------------------------------------
  | CASE 3: INVALID / EMPTY RESPONSE
  |--------------------------------------------------------------------------
  */

  return {

    content: [],

    totalElements: 0,

    totalPages: 0,

    number: 0,

    size: 20,

    first: true,

    last: true

  };

};


// ============================================================
// DISPLAY NAME
// ============================================================

export const getEmployeeName = (
  employee
) => {

  if (!employee) {
    return "Unknown Employee";
  }


  return (

    employee.fullName ||

    [
      employee.firstName,
      employee.lastName
    ]
      .filter(Boolean)
      .join(" ") ||

    "Unknown Employee"

  );

};


// ============================================================
// INITIALS
// ============================================================

export const getEmployeeInitials = (
  employee
) => {

  const name =
    getEmployeeName(
      employee
    );


  if (!name) {
    return "EM";
  }


  const words =
    name
      .trim()
      .split(/\s+/);


  if (
    words.length === 1
  ) {

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
// DATE FORMAT
// ============================================================

export const formatEmployeeDate = (
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
// EMPLOYMENT TYPE LABEL
// ============================================================

export const formatEmploymentType = (
  value
) => {

  if (!value) {
    return "—";
  }


  return String(value)
    .replaceAll(
      "_",
      " "
    )
    .replace(
      /\b\w/g,
      character =>
        character.toUpperCase()
    );

};


// ============================================================
// API ERROR
// ============================================================

export const getEmployeeErrorMessage = (
  error,
  fallback = "Something went wrong."
) => {

  return (

    error?.response?.data?.message ||

    error?.response?.data?.error ||

    error?.response?.data?.errors?.message ||

    fallback

  );

};