import api from "./api";

// ============================================================
// EMPLOYEE SERVICE
// ============================================================

const employeeService = {

  // ==========================================================
  // GET EMPLOYEES
  // ==========================================================

  async getEmployees({
    page = 0,
    size = 20,
    sortBy = "id",
    direction = "asc",
    search = "",
    status = "",
    companyId = "",
    departmentId = "",
    designationId = ""
  } = {}) {

    const params = {
      page,
      size,
      sortBy,
      direction
    };


    // --------------------------------------------------------
    // Optional parameters
    // --------------------------------------------------------

    if (search?.trim()) {
      params.search =
        search.trim();
    }


    if (status) {
      params.status =
        status;
    }


    if (companyId) {
      params.companyId =
        companyId;
    }


    if (departmentId) {
      params.departmentId =
        departmentId;
    }


    if (designationId) {
      params.designationId =
        designationId;
    }


    const response =
      await api.get(
        "/employees",
        {
          params
        }
      );


    return response.data;
  },


  // ==========================================================
  // GET EMPLOYEE BY ID
  // ==========================================================

  async getEmployeeById(
    employeeId
  ) {

    if (!employeeId) {
      throw new Error(
        "Employee ID is required."
      );
    }


    const response =
      await api.get(
        `/employees/${employeeId}`
      );


    return response.data;
  },


  // ==========================================================
  // CREATE EMPLOYEE
  // ==========================================================

  async createEmployee(
    payload
  ) {

    if (!payload) {
      throw new Error(
        "Employee data is required."
      );
    }


    const response =
      await api.post(
        "/employees",
        payload
      );


    return response.data;
  },


  // ==========================================================
  // UPDATE EMPLOYEE
  // ==========================================================

  async updateEmployee(
    employeeId,
    payload
  ) {

    if (!employeeId) {
      throw new Error(
        "Employee ID is required."
      );
    }


    if (!payload) {
      throw new Error(
        "Employee data is required."
      );
    }


    const response =
      await api.put(
        `/employees/${employeeId}`,
        payload
      );


    return response.data;
  },


  // ==========================================================
  // DELETE EMPLOYEE
  // ==========================================================

  async deleteEmployee(
    employeeId
  ) {

    if (!employeeId) {
      throw new Error(
        "Employee ID is required."
      );
    }


    const response =
      await api.delete(
        `/employees/${employeeId}`
      );


    return response.data;
  },


  // ==========================================================
  // UPDATE EMPLOYEE STATUS
  // ==========================================================

  async updateStatus(
    employeeId,
    status
  ) {

    if (!employeeId) {
      throw new Error(
        "Employee ID is required."
      );
    }


    if (!status) {
      throw new Error(
        "Employee status is required."
      );
    }


    const response =
      await api.patch(
        `/employees/${employeeId}/status`,
        {
          status
        }
      );


    return response.data;
  },


  // ==========================================================
  // ACTIVATE EMPLOYEE
  // ==========================================================

  async activateEmployee(
    employeeId
  ) {

    return this.updateStatus(
      employeeId,
      "ACTIVE"
    );
  },


  // ==========================================================
  // DEACTIVATE EMPLOYEE
  // ==========================================================

  async deactivateEmployee(
    employeeId
  ) {

    return this.updateStatus(
      employeeId,
      "INACTIVE"
    );
  }

};


export default employeeService;