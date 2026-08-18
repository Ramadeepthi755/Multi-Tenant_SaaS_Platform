import api from "./api";

// ============================================================
// LEAVE SERVICE
// ============================================================

const leaveService = {

  // ==========================================================
  // GET LEAVE REQUESTS
  // ==========================================================

  async getLeaves({
    employeeId = "",
    leaveType = "",
    status = "",
    search = "",
    fromDate = "",
    toDate = "",
    page = 0,
    size = 20
  } = {}) {

    const params = {
      page,
      size
    };

    if (employeeId) {
      params.employeeId = employeeId;
    }

    if (leaveType) {
      params.leaveType = leaveType;
    }

    if (status) {
      params.status = status;
    }

    if (search?.trim()) {
      params.search = search.trim();
    }

    if (fromDate) {
      params.fromDate = fromDate;
    }

    if (toDate) {
      params.toDate = toDate;
    }

    const response = await api.get(
      "/leave",
      {
        params
      }
    );

    return response.data;
  },


  // ==========================================================
  // GET LEAVE BY ID
  // ==========================================================

  async getLeaveById(
    leaveId
  ) {

    if (!leaveId) {
      throw new Error(
        "Leave ID is required."
      );
    }

    const response = await api.get(
      `/leave/${leaveId}`
    );

    return response.data;
  },


  // ==========================================================
  // APPLY LEAVE
  // ==========================================================

  async applyLeave({
    employeeId,
    leaveType,
    fromDate,
    toDate,
    reason
  }) {

    if (!employeeId) {
      throw new Error(
        "Employee ID is required."
      );
    }

    const response = await api.post(
      "/leave",
      {
        employeeId,
        leaveType,
        fromDate,
        toDate,
        reason
      }
    );

    return response.data;
  },


  // ==========================================================
  // APPROVE LEAVE
  // ==========================================================

  async approveLeave(
    leaveId
  ) {

    if (!leaveId) {
      throw new Error(
        "Leave ID is required."
      );
    }

    const response = await api.put(
      `/leave/${leaveId}/approve`
    );

    return response.data;
  },


  // ==========================================================
  // REJECT LEAVE
  // ==========================================================

  async rejectLeave(
    leaveId,
    rejectionReason
  ) {

    if (!leaveId) {
      throw new Error(
        "Leave ID is required."
      );
    }

    const response = await api.put(
      `/leave/${leaveId}/reject`,
      {
        rejectionReason
      }
    );

    return response.data;
  },


  // ==========================================================
  // CANCEL LEAVE
  // ==========================================================

  async cancelLeave(
    leaveId
  ) {

    if (!leaveId) {
      throw new Error(
        "Leave ID is required."
      );
    }

    const response = await api.put(
      `/leave/${leaveId}/cancel`
    );

    return response.data;
  },


  // ==========================================================
  // LEAVE SUMMARY
  // ==========================================================

  async getLeaveSummary({
    employeeId = ""
  } = {}) {

    const params = {};

    if (employeeId) {
      params.employeeId =
        employeeId;
    }

    const response = await api.get(
      "/leave/summary",
      {
        params
      }
    );

    return response.data;
  },


  // ==========================================================
  // LEAVE BALANCE
  // ==========================================================

  async getLeaveBalance(
    employeeId
  ) {

    if (!employeeId) {
      throw new Error(
        "Employee ID is required."
      );
    }

    const response = await api.get(
      `/leave/balance/${employeeId}`
    );

    return response.data;
  }

};


export default leaveService;