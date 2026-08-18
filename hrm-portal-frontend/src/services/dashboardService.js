import api from "./api";

const dashboardService = {

  async getDashboard() {
    const response = await api.get("/dashboard");
    return response.data;
  },

  async getDashboardStats() {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },

  async getAttendanceOverview() {
    const response = await api.get(
      "/dashboard/attendance"
    );

    return response.data;
  },

  async getLeaveOverview() {
    const response = await api.get(
      "/dashboard/leave"
    );

    return response.data;
  },

  async getPayrollOverview() {
    const response = await api.get(
      "/dashboard/payroll"
    );

    return response.data;
  },

  async getWorkforceOverview() {
    const response = await api.get(
      "/dashboard/workforce"
    );

    return response.data;
  },

  async getRecentActivity() {
    const response = await api.get(
      "/dashboard/activity"
    );

    return response.data;
  }

};

export default dashboardService;