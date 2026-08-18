import api from "./api";

const settingsService = {

  // =========================================================
  // GET SETTINGS
  // =========================================================

  async getSettings() {

    const response = await api.get(
      "/settings"
    );

    return response.data;
  },


  // =========================================================
  // GET COMPANY SETTINGS
  // =========================================================

  async getCompanySettings() {

    const response = await api.get(
      "/settings/company"
    );

    return response.data;
  },


  // =========================================================
  // UPDATE COMPANY SETTINGS
  // =========================================================

  async updateCompanySettings(
    data
  ) {

    const response = await api.put(
      "/settings/company",
      data
    );

    return response.data;
  },


  // =========================================================
  // GENERAL
  // =========================================================

  async getGeneralSettings() {

    const response = await api.get(
      "/settings/general"
    );

    return response.data;
  },


  async updateGeneralSettings(
    data
  ) {

    const response = await api.put(
      "/settings/general",
      data
    );

    return response.data;
  },


  // =========================================================
  // ATTENDANCE
  // =========================================================

  async getAttendanceSettings() {

    const response = await api.get(
      "/settings/attendance"
    );

    return response.data;
  },


  async updateAttendanceSettings(
    data
  ) {

    const response = await api.put(
      "/settings/attendance",
      data
    );

    return response.data;
  },


  // =========================================================
  // LEAVE
  // =========================================================

  async getLeaveSettings() {

    const response = await api.get(
      "/settings/leave"
    );

    return response.data;
  },


  async updateLeaveSettings(
    data
  ) {

    const response = await api.put(
      "/settings/leave",
      data
    );

    return response.data;
  },


  // =========================================================
  // PAYROLL
  // =========================================================

  async getPayrollSettings() {

    const response = await api.get(
      "/settings/payroll"
    );

    return response.data;
  },


  async updatePayrollSettings(
    data
  ) {

    const response = await api.put(
      "/settings/payroll",
      data
    );

    return response.data;
  },


  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  async getNotificationSettings() {

    const response = await api.get(
      "/settings/notifications"
    );

    return response.data;
  },


  async updateNotificationSettings(
    data
  ) {

    const response = await api.put(
      "/settings/notifications",
      data
    );

    return response.data;
  },


  // =========================================================
  // SECURITY
  // =========================================================

  async getSecuritySettings() {

    const response = await api.get(
      "/settings/security"
    );

    return response.data;
  },


  async updateSecuritySettings(
    data
  ) {

    const response = await api.put(
      "/settings/security",
      data
    );

    return response.data;
  }

};


export default settingsService;