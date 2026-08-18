import api from "./api";

// ============================================================
// ATTENDANCE SERVICE
// ============================================================

const attendanceService = {

  // ==========================================================
  // GET ATTENDANCE
  // ==========================================================

  async getAttendance({
    date = "",
    fromDate = "",
    toDate = "",
    employeeId = "",
    departmentId = "",
    status = "",
    search = "",
    page = 0,
    size = 20
  } = {}) {

    const params = {
      page,
      size
    };

    if (date) {
      params.date = date;
    }

    if (fromDate) {
      params.fromDate = fromDate;
    }

    if (toDate) {
      params.toDate = toDate;
    }

    if (employeeId) {
      params.employeeId = employeeId;
    }

    if (departmentId) {
      params.departmentId = departmentId;
    }

    if (status) {
      params.status = status;
    }

    if (search?.trim()) {
      params.search = search.trim();
    }

    const response = await api.get(
      "/attendance",
      {
        params
      }
    );

    return response.data;
  },


  // ==========================================================
  // GET ATTENDANCE BY ID
  // ==========================================================

  async getAttendanceById(attendanceId) {

    if (!attendanceId) {
      throw new Error(
        "Attendance ID is required."
      );
    }

    const response = await api.get(
      `/attendance/${attendanceId}`
    );

    return response.data;
  },


  // ==========================================================
  // GET EMPLOYEES
  // Used by Attendance employee filter
  // ==========================================================

  async getEmployees() {

    const response = await api.get(
      "/employees"
    );

    return response.data;
  },


  // ==========================================================
  // TODAY ATTENDANCE
  // ==========================================================

  async getTodayAttendance() {

    const response = await api.get(
      "/attendance/today"
    );

    return response.data;
  },


  // ==========================================================
  // SUMMARY
  // ==========================================================

  async getAttendanceSummary({
    date = ""
  } = {}) {

    const params = {};

    if (date) {
      params.date = date;
    }

    const response = await api.get(
      "/attendance/summary",
      {
        params
      }
    );

    return response.data;
  },


  // ==========================================================
  // CHECK IN
  // ==========================================================

  async checkIn(employeeId) {

    if (!employeeId) {
      throw new Error(
        "Employee ID is required."
      );
    }

    const response = await api.post(
      "/attendance/check-in",
      {
        employeeId
      }
    );

    return response.data;
  },


  // ==========================================================
  // CHECK OUT
  // ==========================================================

  async checkOut(employeeId) {

    if (!employeeId) {
      throw new Error(
        "Employee ID is required."
      );
    }

    const response = await api.post(
      "/attendance/check-out",
      {
        employeeId
      }
    );

    return response.data;
  }

};

export default attendanceService;