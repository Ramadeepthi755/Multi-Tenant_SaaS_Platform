import api from "./api";

const reportService = {

  // =========================================================
  // WORKFORCE OVERVIEW
  // =========================================================

async getWorkforceOverview() {

  const response = await api.get(
    "/dashboard"
  );

  return response.data;
},


  // =========================================================
  // EMPLOYEE REPORT
  // =========================================================

  async getEmployeeReport({
    page = 0,
    size = 20,
    search = "",
    departmentId = "",
    designationId = "",
    status = "",
    fromDate = "",
    toDate = ""
  } = {}) {

    const params = {
      page,
      size
    };

    if (search) {
      params.search = search;
    }

    if (departmentId) {
      params.departmentId =
        departmentId;
    }

    if (designationId) {
      params.designationId =
        designationId;
    }

    if (status) {
      params.status = status;
    }

    if (fromDate) {
      params.fromDate = fromDate;
    }

    if (toDate) {
      params.toDate = toDate;
    }

    const response = await api.get(
      "/reports/employees",
      { params }
    );

    return response.data;
  },


  // =========================================================
  // ATTENDANCE REPORT
  // =========================================================

  async getAttendanceReport({
    page = 0,
    size = 20,
    employeeId = "",
    departmentId = "",
    status = "",
    fromDate = "",
    toDate = ""
  } = {}) {

    const params = {
      page,
      size
    };

    if (employeeId) {
      params.employeeId =
        employeeId;
    }

    if (departmentId) {
      params.departmentId =
        departmentId;
    }

    if (status) {
      params.status = status;
    }

    if (fromDate) {
      params.fromDate = fromDate;
    }

    if (toDate) {
      params.toDate = toDate;
    }

    const response = await api.get(
      "/reports/attendance",
      { params }
    );

    return response.data;
  },


  // =========================================================
  // LEAVE REPORT
  // =========================================================

  async getLeaveReport({
    page = 0,
    size = 20,
    employeeId = "",
    departmentId = "",
    leaveType = "",
    status = "",
    fromDate = "",
    toDate = ""
  } = {}) {

    const params = {
      page,
      size
    };

    if (employeeId) {
      params.employeeId =
        employeeId;
    }

    if (departmentId) {
      params.departmentId =
        departmentId;
    }

    if (leaveType) {
      params.leaveType =
        leaveType;
    }

    if (status) {
      params.status =
        status;
    }

    if (fromDate) {
      params.fromDate =
        fromDate;
    }

    if (toDate) {
      params.toDate =
        toDate;
    }

    const response = await api.get(
      "/reports/leave",
      { params }
    );

    return response.data;
  },


  // =========================================================
  // PAYROLL REPORT
  // =========================================================

  async getPayrollReport({
    page = 0,
    size = 20,
    employeeId = "",
    departmentId = "",
    status = "",
    month = "",
    year = ""
  } = {}) {

    const params = {
      page,
      size
    };

    if (employeeId) {
      params.employeeId =
        employeeId;
    }

    if (departmentId) {
      params.departmentId =
        departmentId;
    }

    if (status) {
      params.status =
        status;
    }

    if (month) {
      params.month =
        month;
    }

    if (year) {
      params.year =
        year;
    }

    const response = await api.get(
      "/reports/payroll",
      { params }
    );

    return response.data;
  },


  // =========================================================
  // DEPARTMENT REPORT
  // =========================================================

  async getDepartmentReport({
    page = 0,
    size = 20,
    search = "",
    status = ""
  } = {}) {

    const params = {
      page,
      size
    };

    if (search) {
      params.search =
        search;
    }

    if (status) {
      params.status =
        status;
    }

    const response = await api.get(
      "/reports/departments",
      { params }
    );

    return response.data;
  },


  // =========================================================
  // EXPORT
  // =========================================================

  async exportReport(
    reportType,
    params = {},
    format = "xlsx"
  ) {

    if (!reportType) {
      throw new Error(
        "Report type is required."
      );
    }

    const response = await api.get(
      `/reports/${reportType}/export`,
      {
        params: {
          ...params,
          format
        },
        responseType: "blob"
      }
    );

    return response.data;
  }

};

export default reportService;