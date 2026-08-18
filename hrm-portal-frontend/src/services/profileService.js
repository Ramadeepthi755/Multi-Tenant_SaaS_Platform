import api from "./api";

const profileService = {

  // =========================================================
  // CURRENT USER PROFILE
  // =========================================================

  async getMyProfile() {

    const response =
      await api.get(
        "/users/me"
      );

    return response.data;
  },


  // =========================================================
  // UPDATE PROFILE
  // =========================================================

  async updateMyProfile(data) {

    const response =
      await api.put(
        "/users/me",
        data
      );

    return response.data;
  },


  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  async changePassword(data) {

    const response =
      await api.put(
        "/users/change-password",
        data
      );

    return response.data;
  },


  // =========================================================
  // LOGIN HISTORY
  // =========================================================

  async getLoginHistory({
    page = 0,
    size = 10
  } = {}) {

    const response =
      await api.get(
        "/login-history",
        {
          params: {
            page,
            size
          }
        }
      );

    return response.data;
  },


  // =========================================================
  // ACTIVE SESSIONS
  // =========================================================

  async getActiveSessions() {

    const response =
      await api.get(
        "/users/me/sessions"
      );

    return response.data;
  },


  // =========================================================
  // LOGOUT OTHER SESSIONS
  // =========================================================

  async logoutOtherSessions() {

    const response =
      await api.post(
        "/users/me/sessions/logout-all"
      );

    return response.data;
  },


  // =========================================================
  // UPLOAD PROFILE PHOTO
  // =========================================================

  async uploadProfilePhoto(file) {

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const response =
      await api.post(
        "/users/me/profile-photo",
        formData
      );

    return response.data;
  },


  // =========================================================
  // GET PROFILE PHOTO AS BLOB
  // =========================================================

  async getProfilePhotoBlob() {

    const response =
      await api.get(
        "/users/me/profile-photo",
        {
          responseType: "blob"
        }
      );

    return response.data;
  }

};


export default profileService;