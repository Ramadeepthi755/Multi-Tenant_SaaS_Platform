// ============================================================
// COMPANY UTILITIES
// ============================================================


export const normalizeCompany = (
  company = {}
) => {

  return {
    id:
      company.id ??
      company.companyId ??
      null,

    companyName:
      company.companyName ??
      company.name ??
      "",

    companyCode:
      company.companyCode ??
      company.code ??
      "",

    email:
      company.email ??
      "",

    phone:
      company.phone ??
      company.phoneNumber ??
      "",

    status:
      company.status ??
      "UNKNOWN",

    active:
      company.active ??
      false,

    address:
      company.address ??
      "",

    website:
      company.website ??
      "",

    createdDate:
      company.createdDate ??
      company.createdAt ??
      null,

    updatedDate:
      company.updatedDate ??
      company.updatedAt ??
      null
  };
};


// ============================================================
// PAGE RESPONSE
// ============================================================

export const normalizeCompanyPage = (
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
          normalizeCompany
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

export const isCompanyActive = (
  company
) => {

  if (!company) {
    return false;
  }

  return (
    company.active === true &&
    String(
      company.status || ""
    ).toUpperCase() ===
      "ACTIVE"
  );
};


// ============================================================
// DISPLAY DATE
// ============================================================

export const formatCompanyDate = (
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
// COMPANY INITIALS
// ============================================================

export const getCompanyInitials = (
  companyName
) => {

  if (!companyName) {
    return "CO";
  }


  const words =
    companyName
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
// FORM DEFAULTS
// ============================================================

export const emptyCompanyForm = {
  companyName: "",
  companyCode: "",
  email: "",
  phone: "",
  status: "ACTIVE",
  active: true
};