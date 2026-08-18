import api from "./api";


// =========================================================
// GET ALL PAYROLLS
// =========================================================

export const getPayrolls = async () => {

  const response =
    await api.get(
      "/payroll"
    );

  return response.data;
};


// =========================================================
// GET PAYROLL BY ID
// =========================================================

export const getPayrollById = async (
  payrollId
) => {

  const response =
    await api.get(
      `/payroll/${payrollId}`
    );

  return response.data;
};


// =========================================================
// CREATE / GENERATE PAYROLL
// =========================================================

export const createPayroll = async (
  payrollData
) => {

  const response =
    await api.post(
      "/payroll/generate",
      payrollData
    );

  return response.data;
};


// =========================================================
// GET PAYROLLS BY EMPLOYEE
// =========================================================

export const getPayrollsByEmployee =
  async (
    employeeId
  ) => {

    const response =
      await api.get(
        `/payroll/employee/${employeeId}`
      );

    return response.data;
  };


// =========================================================
// DELETE PAYROLL
// =========================================================

export const deletePayroll = async (
  payrollId
) => {

  const response =
    await api.delete(
      `/payroll/${payrollId}`
    );

  return response.data;
};


// =========================================================
// DOWNLOAD SALARY SLIP
// =========================================================

export const downloadSalarySlip =
  async (
    payrollId
  ) => {

    const response =
      await api.get(
        `/payroll/slip/${payrollId}`,
        {
          responseType: "blob"
        }
      );

    return response.data;
  };