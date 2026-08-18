import api from "./api";


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

    /*
     * Session is restored locally from JWT + user.
     *
     * Future backend /auth/me endpoint can be
     * connected here.
     */

    return null;
  }
};


export default authService;