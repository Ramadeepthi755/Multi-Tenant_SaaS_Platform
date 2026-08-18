import api from "./api";

// ==============================
// Get All Holidays
// ==============================
export const getHolidays = async () => {

  const response =
    await api.get("/holidays");

  return response.data;
};


// ==============================
// Get Holiday By ID
// ==============================
export const getHolidayById = async (id) => {

  const response =
    await api.get(`/holidays/${id}`);

  return response.data;
};


// ==============================
// Create Holiday
// ==============================
export const createHoliday = async (
  holidayData
) => {

  console.log(
    "========== CREATE HOLIDAY =========="
  );

  console.log(
    "Holiday payload:",
    holidayData
  );

  console.log(
    "Holiday payload JSON:",
    JSON.stringify(holidayData)
  );

  console.log(
    "Token exists:",
    Boolean(
      localStorage.getItem("token")
    )
  );

  console.log(
    "===================================="
  );


  try {

    const response =
      await api.post(
        "/holidays",
        holidayData
      );

    console.log(
      "CREATE HOLIDAY RESPONSE:",
      response.status,
      response.data
    );

    return response.data;

  } catch (error) {

    console.error(
      "CREATE HOLIDAY FAILED"
    );

    console.error(
      "Status:",
      error?.response?.status
    );

    console.error(
      "Response:",
      error?.response?.data
    );

    console.error(
      "Request data:",
      error?.config?.data
    );

    throw error;

  }
};


// ==============================
// Update Holiday
// ==============================
export const updateHoliday = async (
  id,
  holidayData
) => {

  const response =
    await api.put(
      `/holidays/${id}`,
      holidayData
    );

  return response.data;
};


// ==============================
// Delete Holiday
// ==============================
export const deleteHoliday = async (
  id
) => {

  const response =
    await api.delete(
      `/holidays/${id}`
    );

  return response.data;
};


// ==============================
// Get Holidays By Year
// ==============================
export const getHolidaysByYear = async (
  year
) => {

  const response =
    await api.get(
      `/holidays/year/${year}`
    );

  return response.data;
};


// ==============================
// Get Holidays By Type
// ==============================
export const getHolidaysByType = async (
  type
) => {

  const response =
    await api.get(
      `/holidays/type/${type}`
    );

  return response.data;
};