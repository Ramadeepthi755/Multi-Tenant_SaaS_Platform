// src/services/departmentService.js

import api from "./api";


/*
|--------------------------------------------------------------------------
| DEPARTMENT SERVICE
|--------------------------------------------------------------------------
|
| Backend:
|
| GET    /api/departments
| GET    /api/departments/{id}
| POST   /api/departments
| PUT    /api/departments/{id}
| DELETE /api/departments/{id}
| GET    /api/departments/company/{companyId}
|
|--------------------------------------------------------------------------
*/

const departmentService = {

  /*
  |--------------------------------------------------------------------------
  | GET ALL DEPARTMENTS
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  | Backend returns List<DepartmentResponseDTO>
  | NOT Page<DepartmentResponseDTO>.
  |
  */

  getDepartments: async () => {

    const response =
      await api.get(
        "/departments"
      );

    return response.data;
  },


  /*
  |--------------------------------------------------------------------------
  | GET DEPARTMENT BY ID
  |--------------------------------------------------------------------------
  */

  getDepartmentById: async (
    departmentId
  ) => {

    const response =
      await api.get(
        `/departments/${departmentId}`
      );

    return response.data;
  },


  /*
  |--------------------------------------------------------------------------
  | GET DEPARTMENTS BY COMPANY
  |--------------------------------------------------------------------------
  */

  getDepartmentsByCompany: async (
    companyId
  ) => {

    const response =
      await api.get(
        `/departments/company/${companyId}`
      );

    return response.data;
  },


  /*
  |--------------------------------------------------------------------------
  | CREATE DEPARTMENT
  |--------------------------------------------------------------------------
  */

  createDepartment: async (
    payload
  ) => {

    const response =
      await api.post(
        "/departments",
        payload
      );

    return response.data;
  },


  /*
  |--------------------------------------------------------------------------
  | UPDATE DEPARTMENT
  |--------------------------------------------------------------------------
  */

  updateDepartment: async (
    departmentId,
    payload
  ) => {

    const response =
      await api.put(
        `/departments/${departmentId}`,
        payload
      );

    return response.data;
  },


  /*
  |--------------------------------------------------------------------------
  | DELETE DEPARTMENT
  |--------------------------------------------------------------------------
  */

  deleteDepartment: async (
    departmentId
  ) => {

    const response =
      await api.delete(
        `/departments/${departmentId}`
      );

    return response.data;
  }

};


export default departmentService;