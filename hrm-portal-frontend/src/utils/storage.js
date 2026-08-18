const TOKEN_KEY =
  "token";


const USER_KEY =
  "user";


export const storage = {

  getToken() {

    return localStorage.getItem(
      TOKEN_KEY
    );

  },


  setToken(token) {

    if (!token) {
      return;
    }


    localStorage.setItem(
      TOKEN_KEY,
      token
    );

  },


  removeToken() {

    localStorage.removeItem(
      TOKEN_KEY
    );

  },


  getUser() {

    try {

      const value =
        localStorage.getItem(
          USER_KEY
        );


      if (!value) {
        return null;
      }


      return JSON.parse(
        value
      );

    } catch {

      return null;

    }

  },


  setUser(user) {

    if (!user) {

      localStorage.removeItem(
        USER_KEY
      );

      return;

    }


    localStorage.setItem(
      USER_KEY,
      JSON.stringify(user)
    );

  },


  removeUser() {

    localStorage.removeItem(
      USER_KEY
    );

  },


  clearAuth() {

    this.removeToken();

    this.removeUser();

  }

};


export default storage;