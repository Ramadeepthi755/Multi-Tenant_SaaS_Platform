// ============================================================
// AUTH STORAGE
// Centralized JWT / USER storage management
// ============================================================

const TOKEN_KEY = "hrm_access_token";
const USER_KEY = "hrm_authenticated_user";


// ============================================================
// TOKEN
// ============================================================

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};


const setToken = (token) => {

  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }

  localStorage.setItem(
    TOKEN_KEY,
    token
  );
};


const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};


// ============================================================
// USER
// ============================================================

const getUser = () => {

  const rawUser =
    localStorage.getItem(USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {

    return JSON.parse(rawUser);

  } catch (error) {

    console.error(
      "Invalid stored HRM user session.",
      error
    );

    localStorage.removeItem(USER_KEY);

    return null;
  }
};


const setUser = (user) => {

  if (!user) {
    localStorage.removeItem(USER_KEY);
    return;
  }

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(user)
  );
};


const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};


// ============================================================
// SESSION
// ============================================================

const hasSession = () => {

  return Boolean(
    getToken() &&
    getUser()
  );
};


const clear = () => {

  removeToken();
  removeUser();
};


// ============================================================
// JWT EXPIRATION
// ============================================================

const isTokenExpired = (token = getToken()) => {

  if (!token) {
    return true;
  }

  try {

    const parts =
      token.split(".");

    if (parts.length !== 3) {
      return true;
    }

    const payload =
      parts[1]
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const decoded =
      JSON.parse(
        window.atob(payload)
      );

    if (!decoded.exp) {
      return false;
    }

    const currentTime =
      Math.floor(
        Date.now() / 1000
      );

    return decoded.exp <= currentTime;

  } catch (error) {

    console.error(
      "Unable to validate JWT expiration.",
      error
    );

    return true;
  }
};


// ============================================================
// EXPORT
// ============================================================

const authStorage = {
  TOKEN_KEY,
  USER_KEY,

  getToken,
  setToken,
  removeToken,

  getUser,
  setUser,
  removeUser,

  hasSession,
  clear,

  isTokenExpired
};


export default authStorage;