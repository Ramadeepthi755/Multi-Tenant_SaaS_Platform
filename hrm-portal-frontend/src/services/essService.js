import api from "./api";

// ==========================================
// Employee Dashboard
// ==========================================

// Dashboard Summary
export const getEmployeeDashboard = async () => {
  const response = await api.get("/ess/dashboard");
  return response.data;
};

// ==========================================
// Profile
// ==========================================

// Get My Profile
export const getMyProfile = async () => {
  const response = await api.get("/ess/profile");
  return response.data;
};

// Update My Profile
export const updateMyProfile = async (profileData) => {
  const response = await api.put("/ess/profile", profileData);
  return response.data;
};

// Upload Profile Photo
export const uploadProfilePhoto = async (file) => {

  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    "/ess/profile/photo",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Change Password
export const changeMyPassword = async (passwordData) => {
  const response = await api.put(
    "/ess/profile/change-password",
    passwordData
  );
  return response.data;
};

// ==========================================
// Attendance
// ==========================================

// Get Attendance History
export const getMyAttendance = async (params = {}) => {
  const response = await api.get(
    "/ess/attendance",
    {
      params,
    }
  );
  return response.data;
};

// Check In
export const checkIn = async () => {
  const response = await api.post(
    "/ess/attendance/check-in"
  );
  return response.data;
};

// Check Out
export const checkOut = async () => {
  const response = await api.post(
    "/ess/attendance/check-out"
  );
  return response.data;
};

// ==========================================
// Leave
// ==========================================

// Get Leave History
export const getMyLeaves = async (params = {}) => {
  const response = await api.get(
    "/ess/leaves",
    {
      params,
    }
  );
  return response.data;
};

// Apply Leave
export const applyLeave = async (leaveData) => {
  const response = await api.post(
    "/ess/leaves",
    leaveData
  );
  return response.data;
};

// Cancel Leave
export const cancelLeave = async (id) => {
  const response = await api.delete(
    `/ess/leaves/${id}`
  );
  return response.data;
};

// Leave Balance
export const getLeaveBalance = async () => {
  const response = await api.get(
    "/ess/leaves/balance"
  );
  return response.data;
};

// ==========================================
// Payroll
// ==========================================

// Get Payroll History
export const getMyPayroll = async () => {
  const response = await api.get(
    "/ess/payroll"
  );
  return response.data;
};

// Download Payslip
export const downloadPayslip = async (payrollId) => {

  const response = await api.get(
    `/ess/payroll/${payrollId}/download`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};

// ==========================================
// Documents
// ==========================================

// Get Documents
export const getMyDocuments = async () => {
  const response = await api.get(
    "/ess/documents"
  );
  return response.data;
};

// Upload Document
export const uploadDocument = async ({
  file,
  category,
  description,
}) => {

  const formData = new FormData();

  formData.append("file", file);
  formData.append("category", category);
  formData.append("description", description);

  const response = await api.post(
    "/ess/documents",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Delete Document
export const deleteDocument = async (id) => {
  const response = await api.delete(
    `/ess/documents/${id}`
  );
  return response.data;
};

// ==========================================
// Announcements
// ==========================================

// Get Announcements
export const getAnnouncements = async () => {
  const response = await api.get(
    "/ess/announcements"
  );
  return response.data;
};

// ==========================================
// Holidays
// ==========================================

// Get Holiday List
export const getHolidays = async () => {
  const response = await api.get(
    "/ess/holidays"
  );
  return response.data;
};