import api from "./api";

const roleService = {

  async getRoles({
    search = "",
    page = 0,
    size = 20
  } = {}) {

    const params = {
      page,
      size
    };

    if (search?.trim()) {
      params.search = search.trim();
    }

    const response = await api.get(
      "/roles",
      { params }
    );

    return response.data;
  },


  async getRoleById(roleId) {

    if (!roleId) {
      throw new Error("Role ID is required.");
    }

    const response = await api.get(
      `/roles/${roleId}`
    );

    return response.data;
  },


  async getPermissions() {

    const response = await api.get(
      "/permissions"
    );

    return response.data;
  },


  async createRole(payload) {

    const response = await api.post(
      "/roles",
      payload
    );

    return response.data;
  },


  async updateRole(
    roleId,
    payload
  ) {

    if (!roleId) {
      throw new Error("Role ID is required.");
    }

    const response = await api.put(
      `/roles/${roleId}`,
      payload
    );

    return response.data;
  },


  async updateRolePermissions(
    roleId,
    permissions
  ) {

    if (!roleId) {
      throw new Error("Role ID is required.");
    }

    const response = await api.put(
      `/roles/${roleId}/permissions`,
      {
        permissions
      }
    );

    return response.data;
  },


  async updateRoleStatus(
    roleId,
    active
  ) {

    if (!roleId) {
      throw new Error("Role ID is required.");
    }

    const response = await api.patch(
      `/roles/${roleId}/status`,
      {
        active
      }
    );

    return response.data;
  },


  async deleteRole(roleId) {

    if (!roleId) {
      throw new Error("Role ID is required.");
    }

    const response = await api.delete(
      `/roles/${roleId}`
    );

    return response.data;
  }

};


export default roleService;