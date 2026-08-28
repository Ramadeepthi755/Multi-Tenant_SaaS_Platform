import api from "./api";

export const forgotPassword = async (email) => {
  await api.post("/auth/forgot-password", { email }, {
    skipAuth: true,
  });
  return {
    message: "If an account exists for that email, a reset link is on its way.",
  };
};

export const resetPassword = async (token, newPassword) => {
  await api.post("/auth/reset-password", { token, newPassword }, {
    skipAuth: true,
  });
  return "Your password has been reset. You can now sign in.";
};


// ============================================================
// AUTH SERVICE
// ============================================================

const authService = {

  // ----------------------------------------------------------
  // LOGIN
  // ----------------------------------------------------------

  async login(credentials) {

    const response =
      await api.post(
        "/auth/login",
        {
          email:
            credentials.email,

          password:
            credentials.password
        },
        {
          skipAuth: true
        }
      );

    return response.data;
  },


  // ----------------------------------------------------------
  // LOGOUT
  // ----------------------------------------------------------

  async logout() {

    /*
     * Current backend authentication is JWT based
     * and STATELESS.
     *
     * Therefore logout is handled client-side by
     * removing the JWT and user session.
     *
     * If backend logout/revocation endpoint is added
     * later, it can be called here without changing
     * the rest of the application.
     */

    return true;
  },


  // ----------------------------------------------------------
  // CURRENT SESSION
  // ----------------------------------------------------------

  async getCurrentSession() {
    const response = await api.get("/users/me", {
      skipAuthRedirect: true,
    });

    return response.data;
  }
};


export default authService;
