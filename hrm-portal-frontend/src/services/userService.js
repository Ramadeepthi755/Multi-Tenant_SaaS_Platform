import api from "./api";

// ===============================
// Get All Users
// ===============================
export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

// ===============================
// Get User By ID
// ===============================
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// ===============================
// Create User
// ===============================
export const createUser = async (user) => {
  const response = await api.post("/users", user);
  return response.data;
};

// ===============================
// Update User
// ===============================
export const updateUser = async (id, user) => {
  const response = await api.put(`/users/${id}`, user);
  return response.data;
};

// ===============================
// Delete User
// ===============================
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// ===============================
// Activate User
// ===============================
export const activateUser = async (id) => {
  const response = await api.put(`/users/${id}/activate`);
  return response.data;
};

// ===============================
// Deactivate User
// ===============================
export const deactivateUser = async (id) => {
  const response = await api.put(`/users/${id}/deactivate`);
  return response.data;
};

// ===============================
// Search Users
// ===============================
export const searchUsers = async (keyword) => {
  const response = await api.get(
    `/users/search?keyword=${keyword}`
  );
  return response.data;
};

// ===============================
// Get Users By Role
// ===============================
export const getUsersByRole = async (role) => {
  const response = await api.get(
    `/users/role/${role}`
  );
  return response.data;
};

// ===============================
// Get Active Users
// ===============================
export const getActiveUsers = async () => {
  const response = await api.get("/users/active");
  return response.data;
};