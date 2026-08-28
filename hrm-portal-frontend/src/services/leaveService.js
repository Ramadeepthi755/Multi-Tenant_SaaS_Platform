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

    const response = await api.post("/leave", {
      employeeId,
      leaveType,
      startDate: fromDate,
      endDate: toDate,
      reason
    });

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
    _rejectionReason
  ) {

    if (!leaveId) {
      throw new Error(
        "Leave ID is required."
      );
    }

    const response = await api.put(
      `/leave/${leaveId}/reject`
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

    throw new Error(
      "Cancelling leave is not available in the current backend."
    );
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

    throw new Error(
      "Leave balances are not configured in the current backend."
    );
  },

  async getLeavesByStatus(status, options = {}) {
    return this.getLeaves({ ...options, status });
  },

  async updateLeave(leaveId, payload) {
    if (!leaveId) {
      throw new Error("Leave ID is required.");
    }

    const response = await api.put(`/leave/${leaveId}`, {
      employeeId: payload.employeeId,
      leaveType: payload.leaveType,
      startDate: payload.startDate ?? payload.fromDate,
      endDate: payload.endDate ?? payload.toDate,
      reason: payload.reason
    });

    return response.data;
  },

  getLeaveTypes() {
    return Promise.resolve([
      "CASUAL_LEAVE",
      "SICK_LEAVE",
      "EARNED_LEAVE",
      "MATERNITY_LEAVE",
      "PATERNITY_LEAVE",
      "LOSS_OF_PAY",
      "WORK_FROM_HOME"
    ]);
  }

};


export default leaveService;
