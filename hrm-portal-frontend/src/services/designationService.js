import api from "./api";

// ============================================================
// DESIGNATION SERVICE
// ============================================================

const designationService = {

  // ----------------------------------------------------------
  // GET DESIGNATIONS
  // ----------------------------------------------------------

  async getDesignations({
    search = "",
    status = "",
    companyId = "",
    departmentId = ""
  } = {}) {

    /*
     * Current backend DesignationController returns
     * List<DesignationResponseDTO>.
     *
     * Therefore we don't send fake pagination/sort
     * parameters here.
     */

    const params = {};

    if (search?.trim()) {
      params.search = search.trim();
    }

    if (status) {
      params.status = status;
    }

    if (companyId) {
      params.companyId = companyId;
    }

    if (departmentId) {
      params.departmentId = departmentId;
    }

    const response = await api.get(
      "/designations",
      {
        params
      }
    );

    return response.data;
  },


  // ----------------------------------------------------------
  // GET SINGLE
  // ----------------------------------------------------------

  async getDesignationById(
    designationId
  ) {

    if (!designationId) {
      throw new Error(
        "Designation ID is required."
      );
    }

    const response = await api.get(
      `/designations/${designationId}`
    );

    return response.data;
  },


  // ----------------------------------------------------------
  // CREATE
  // ----------------------------------------------------------

  async createDesignation(
    payload
  ) {

    const requestPayload = {
      designationCode:
        payload.designationCode,

      designationName:
        payload.designationName,

      description:
        payload.description || "",

      status:
        payload.status,

      departmentId:
        payload.departmentId
          ? Number(
              payload.departmentId
            )
          : null
    };


    const response = await api.post(
      "/designations",
      requestPayload
    );

    return response.data;
  },


  // ----------------------------------------------------------
  // UPDATE
  // ----------------------------------------------------------

  async updateDesignation(
    designationId,
    payload
  ) {

    if (!designationId) {
      throw new Error(
        "Designation ID is required for update."
      );
    }


    const requestPayload = {
      designationCode:
        payload.designationCode,

      designationName:
        payload.designationName,

      description:
        payload.description || "",

      status:
        payload.status,

      departmentId:
        payload.departmentId
          ? Number(
              payload.departmentId
            )
          : null
    };


    const response = await api.put(
      `/designations/${designationId}`,
      requestPayload
    );

    return response.data;
  },


  // ----------------------------------------------------------
  // DELETE
  // ----------------------------------------------------------

  async deleteDesignation(
    designationId
  ) {

    if (!designationId) {
      throw new Error(
        "Designation ID is required for delete."
      );
    }


    const response = await api.delete(
      `/designations/${designationId}`
    );

    return response.data;
  },


  // ----------------------------------------------------------
  // STATUS
  // ----------------------------------------------------------

  /*
   * Current backend source does not show a PATCH
   * /{id}/status endpoint.
   *
   * Therefore don't call a non-existent endpoint.
   *
   * Status changes should use the existing PUT endpoint.
   */

  async updateStatus(
    designationId,
    status,
    currentDesignation
  ) {

    if (!designationId) {
      throw new Error(
        "Designation ID is required."
      );
    }


    const payload = {
      designationCode:
        currentDesignation.designationCode,

      designationName:
        currentDesignation.designationName,

      description:
        currentDesignation.description || "",

      status,

      departmentId:
        currentDesignation.departmentId ??
        currentDesignation.department?.id ??
        null
    };


    const response = await api.put(
      `/designations/${designationId}`,
      payload
    );

    return response.data;
  }

};


export default designationService;