import api from "./api";

const securityService = {

  async getAuditLogs({
    page = 0,
    size = 20,
    search = "",
    module = "",
    action = "",
    status = "",
    userId = "",
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

    if (module) {
      params.module = module;
    }

    if (action) {
      params.action = action;
    }

    if (status) {
      params.status = status;
    }

    if (userId) {
      params.userId = userId;
    }

    if (fromDate) {
      params.fromDate = fromDate;
    }

    if (toDate) {
      params.toDate = toDate;
    }

    const response = await api.get(
      "/audit-logs",
      { params }
    );

    return response.data;
  },


  async getAuditLogById(id) {

    if (!id) {
      throw new Error(
        "Audit log ID is required."
      );
    }

    const response = await api.get(
      `/audit-logs/${id}`
    );

    return response.data;
  },


  async getLoginHistory({
    page = 0,
    size = 20,
    search = "",
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
      "/login-history",
      { params }
    );

    return response.data;
  },


  async getLoginHistoryById(id) {

    if (!id) {
      throw new Error(
        "Login history ID is required."
      );
    }

    const response = await api.get(
      `/login-history/${id}`
    );

    return response.data;
  }

};

export default securityService;