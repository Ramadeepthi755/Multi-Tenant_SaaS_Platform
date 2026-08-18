const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080/api";


export const ENV = {

  API_BASE_URL,

  APP_NAME:
    "HRM Portal",

  REQUEST_TIMEOUT:
    30000

};


export default ENV;