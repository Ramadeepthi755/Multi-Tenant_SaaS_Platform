import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import api
  from "../services/api";

import storage
  from "../utils/storage";

import authService
  from "../services/authService";


const AuthContext =
  createContext(null);


export const AuthProvider = ({
  children
}) => {

  // =========================================================
  // AUTH STATE
  // =========================================================

  const [
    token,
    setToken
  ] = useState(
    () =>
      storage.getToken()
  );


  const [
    user,
    setUser
  ] = useState(
    () =>
      storage.getUser()
  );


  const [
    authError,
    setAuthError
  ] = useState("");

  const [
    loading,
    setLoading
  ] = useState(true);

  // Validate the stored token before rendering protected content. Local
  // storage is only a cache; the API remains the authority for a session.
  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      const storedToken = storage.getToken();

      if (!storedToken) {
        if (active) setLoading(false);
        return;
      }

      try {
        const currentUser = await authService.getCurrentSession();

        if (!active) return;

        storage.setUser(currentUser);
        setToken(storedToken);
        setUser(currentUser);
      } catch {
        if (!active) return;

        storage.clearAuth();
        setToken(null);
        setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    restoreSession();

    return () => {
      active = false;
    };
  }, []);


  // =========================================================
  // PROFILE PHOTO STATE
  // =========================================================

  const [
    profilePhotoUrl,
    setProfilePhotoUrl
  ] = useState(null);


  const [
    profilePhotoVersion,
    setProfilePhotoVersion
  ] = useState(
    Date.now()
  );


  // =========================================================
  // CLEAR AUTH ERROR
  // =========================================================

  const clearAuthError =
    useCallback(
      () => {

        setAuthError("");

      },
      []
    );


  // =========================================================
  // LOAD PROFILE PHOTO
  // =========================================================

  const loadProfilePhoto =
    useCallback(
      async () => {

        if (!token || !user) {

          setProfilePhotoUrl(
            null
          );

          return;

        }


        try {

          const response =
            await api.get(
              "/users/me/profile-photo",
              {
                responseType:
                  "blob"
              }
            );


          const blob =
            response?.data;


          if (
            !blob ||
            blob.size === 0
          ) {

            setProfilePhotoUrl(
              null
            );

            return;

          }


          const objectUrl =
            URL.createObjectURL(
              blob
            );


          setProfilePhotoUrl(
            previousUrl => {

              if (
                previousUrl
              ) {

                URL.revokeObjectURL(
                  previousUrl
                );

              }

              return objectUrl;

            }
          );


          setProfilePhotoVersion(
            Date.now()
          );

        } catch (error) {

          /*
           * A missing photo is not an
           * authentication error.
           */

          if (
            error?.response?.status ===
            404
          ) {

            setProfilePhotoUrl(
              null
            );

            return;

          }


          console.error(
            "Profile photo loading failed:",
            error
          );

        }

      },
      [
        token,
        user
      ]
    );


  // =========================================================
  // LOAD PHOTO AFTER LOGIN / TOKEN CHANGE
  // =========================================================

  useEffect(() => {

    if (!loading) {
      loadProfilePhoto();
    }

  }, [
    loadProfilePhoto,
    loading
  ]);


  // =========================================================
  // REFRESH PROFILE PHOTO
  // =========================================================

  const refreshProfilePhoto =
    useCallback(
      async () => {

        await loadProfilePhoto();

      },
      [
        loadProfilePhoto
      ]
    );


  // =========================================================
  // CLEAR PROFILE PHOTO
  // =========================================================

  const clearProfilePhoto =
    useCallback(
      () => {

        setProfilePhotoUrl(
          previousUrl => {

            if (
              previousUrl
            ) {

              URL.revokeObjectURL(
                previousUrl
              );

            }

            return null;

          }
        );


        setProfilePhotoVersion(
          Date.now()
        );

      },
      []
    );


  // =========================================================
  // LOGIN
  // =========================================================

  const login =
    useCallback(
      async credentials => {

        setAuthError("");


        try {

          const response =
            await authService.login(
              credentials
            );


          const data =
            response;


          if (
            !data?.token
          ) {

            throw new Error(
              "Invalid login response."
            );

          }


          storage.setToken(
            data.token
          );


          if (
            data.user
          ) {

            storage.setUser(
              data.user
            );

          }


          setToken(
            data.token
          );


          setUser(
            data.user || null
          );

          setLoading(false);


          return data;

        } catch (
          error
        ) {

          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Login failed.";


          setAuthError(
            message
          );


          throw error;

        }

      },
      []
    );


  // =========================================================
  // LOGOUT
  // =========================================================

  const logout =
    useCallback(
      () => {

        clearProfilePhoto();


        storage.clearAuth();


        setToken(
          null
        );


        setUser(
          null
        );


        setAuthError("");

        setLoading(false);

      },
      [
        clearProfilePhoto
      ]
    );


  // =========================================================
  // PERMISSIONS
  // =========================================================

  const hasPermission =
    useCallback(
      permission => {

        if (
          !permission
        ) {

          return false;

        }


        return Boolean(
          user?.permissions?.includes(
            permission
          )
        );

      },
      [
        user
      ]
    );


  const hasAnyPermission =
    useCallback(
      permissions => {

        if (
          !Array.isArray(
            permissions
          )
        ) {

          return false;

        }


        return permissions.some(
          permission =>
            user?.permissions?.includes(
              permission
            )
        );

      },
      [
        user
      ]
    );


  const hasAllPermissions =
    useCallback(
      permissions => {

        if (
          !Array.isArray(
            permissions
          )
        ) {

          return false;

        }


        return permissions.every(
          permission =>
            user?.permissions?.includes(
              permission
            )
        );

      },
      [
        user
      ]
    );


  const hasRole =
    useCallback(
      role => {

        return (
          user?.role ===
          role
        );

      },
      [
        user
      ]
    );


  // =========================================================
  // CONTEXT VALUE
  // =========================================================

  const value =
    useMemo(
      () => ({

        token,

        user,

        profilePhotoUrl,

        profilePhotoVersion,

        loading,

        isAuthenticated:
          Boolean(
            token
          ),

        authError,

        login,

        logout,

        clearAuthError,

        loadProfilePhoto,

        refreshProfilePhoto,

        clearProfilePhoto,

        hasPermission,

        hasAnyPermission,

        hasAllPermissions,

        hasRole

      }),
      [
        token,
        user,
        profilePhotoUrl,
        profilePhotoVersion,
        loading,
        authError,
        login,
        logout,
        clearAuthError,
        loadProfilePhoto,
        refreshProfilePhoto,
        clearProfilePhoto,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole
      ]
    );


  return (
    <AuthContext.Provider
      value={
        value
      }
    >
      {children}
    </AuthContext.Provider>
  );

};


export const useAuth = () => {

  const context =
    useContext(
      AuthContext
    );


  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider."
    );

  }


  return context;

};


export default AuthContext;
