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

    const requestUrl =
      config.url || "";

    /*
     * A login or password-reset request must never inherit a stale bearer
     * token. That lets a user establish a fresh session after an expiration
     * instead of asking the JWT filter to process the old session first.
     */
    const isPublicAuthRequest =
      config.skipAuth === true ||
      /^\/?(?:api\/)?auth(?:\/|$)/.test(
        requestUrl
      );


    if (
      isPublicAuthRequest
    ) {

      if (
        config.headers
      ) {

        if (
          typeof config.headers.delete === "function"
        ) {

          config.headers.delete(
            "Authorization"
          );

        } else {

          delete config.headers.Authorization;

        }

      }

      return config;

    }


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
      status === 401 &&
      !error?.config?.skipAuthRedirect
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
