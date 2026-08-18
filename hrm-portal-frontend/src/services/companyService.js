// src/services/companyService.js

import api from "./api";

/*
|--------------------------------------------------------------------------
| GET COMPANIES
|--------------------------------------------------------------------------
*/

export const getCompanies = async ({
  page = 0,
  size = 20,
  search = "",
  status = "",
  sortBy = "id",
  direction = "asc"
} = {}) => {

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
};


/*
|--------------------------------------------------------------------------
| GET COMPANY BY ID
|--------------------------------------------------------------------------
*/

export const getCompanyById =
  async (companyId) => {

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
  };


/*
|--------------------------------------------------------------------------
| CREATE COMPANY
|--------------------------------------------------------------------------
*/

export const createCompany =
  async (payload) => {

    if (!payload) {
      throw new Error(
        "Company data is required."
      );
    }


    const response =
      await api.post(
        "/companies",
        payload
      );


    return response.data;
  };


/*
|--------------------------------------------------------------------------
| UPDATE COMPANY
|--------------------------------------------------------------------------
*/

export const updateCompany =
  async (
    companyId,
    payload
  ) => {

    if (!companyId) {
      throw new Error(
        "Company ID is required."
      );
    }


    if (!payload) {
      throw new Error(
        "Company data is required."
      );
    }


    const response =
      await api.put(
        `/companies/${companyId}`,
        payload
      );


    return response.data;
  };


/*
|--------------------------------------------------------------------------
| DELETE COMPANY
|--------------------------------------------------------------------------
*/

export const deleteCompany =
  async (companyId) => {

    if (!companyId) {
      throw new Error(
        "Company ID is required."
      );
    }


    const response =
      await api.delete(
        `/companies/${companyId}`
      );


    return response.data;
  };


/*
|--------------------------------------------------------------------------
| DEFAULT EXPORT
|--------------------------------------------------------------------------
|
| Keep this because existing pages/components may use:
|
| import companyService from "../../services/companyService";
|
|--------------------------------------------------------------------------
*/

const companyService = {

  getCompanies,

  getCompanyById,

  createCompany,

  updateCompany,

  deleteCompany

};


export default companyService;