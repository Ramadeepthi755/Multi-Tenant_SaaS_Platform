import api from "./api";

// ============================================================
// COMPANY SERVICE
// ============================================================

const companyService = {

  // ==========================================================
  // GET COMPANIES
  // ==========================================================

  async getCompanies({
    page = 0,
    size = 100,
    sortBy = "companyName",
    direction = "asc",
    search = "",
    status = ""
  } = {}) {

    const params = {
      page,
      size,
      sort: `${sortBy},${direction}`
    };

    if (search?.trim()) {
      params.search = search.trim();
    }

    if (status) {
      params.status = status;
    }

    const response = await api.get(
      "/companies",
      {
        params
      }
    );

    return response.data;
  },

  // ==========================================================
  // GET SINGLE COMPANY
  // ==========================================================

  async getCompanyById(
    companyId
  ) {

    if (!companyId) {
      throw new Error(
        "Company ID is required."
      );
    }

    const response =
      await api.get(
        `/companies/${companyId}`
      );

    return response.data;
  },

  // ==========================================================
  // CREATE COMPANY
  // ==========================================================

  async createCompany(
    payload
  ) {

    const response =
      await api.post(
        "/companies",
        payload
      );

    return response.data;
  },

  // ==========================================================
  // UPDATE COMPANY
  // ==========================================================

  async updateCompany(
    companyId,
    payload
  ) {

    if (!companyId) {
      throw new Error(
        "Company ID is required for update."
      );
    }

    const response =
      await api.put(
        `/companies/${companyId}`,
        payload
      );

    return response.data;
  },

  // ==========================================================
  // DELETE COMPANY
  // ==========================================================

  async deleteCompany(
    companyId
  ) {

    if (!companyId) {
      throw new Error(
        "Company ID is required for delete."
      );
    }

    const response =
      await api.delete(
        `/companies/${companyId}`
      );

    return response.data;
  }

};

export default companyService;