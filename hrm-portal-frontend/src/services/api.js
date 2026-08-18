import axios from "axios";


import ENV
  from "../config/env";


import storage
  from "../utils/storage";


const api = axios.create({

  baseURL:
    ENV.API_BASE_URL,

  timeout:
    ENV.REQUEST_TIMEOUT,

  headers: {
    "Content-Type":
      "application/json",

    Accept:
      "application/json"
  }

});


/*
=========================================================
REQUEST INTERCEPTOR
=========================================================
*/

api.interceptors.request.use(

  config => {

    const token =
      storage.getToken();


    if (token) {

      config.headers =
        config.headers || {};


      config.headers.Authorization =
        `Bearer ${token}`;

    }


    return config;

  },


  error =>
    Promise.reject(
      error
    )

);


/*
=========================================================
RESPONSE INTERCEPTOR
=========================================================
*/

api.interceptors.response.use(

  response =>
    response,


  error => {

    const status =
      error?.response?.status;


    /*
    -----------------------------------------------------
    401
    -----------------------------------------------------

    Authentication is invalid/expired.
    -----------------------------------------------------
    */

    if (
      status === 401
    ) {

      const currentPath =
        window.location.pathname;


      const publicPaths = [
        "/login",
        "/forgot-password",
        "/session-expired"
      ];


      if (
        !publicPaths.includes(
          currentPath
        )
      ) {

        storage.clearAuth();


        window.location.replace(
          "/session-expired"
        );

      }

    }


    /*
    -----------------------------------------------------
    403
    -----------------------------------------------------
    */

    if (
      status === 403
    ) {

      const currentPath =
        window.location.pathname;


      if (
        currentPath !==
        "/unauthorized"
      ) {

        window.location.replace(
          "/unauthorized"
        );

      }

    }


    return Promise.reject(
      error
    );

  }

);


export default api;