// src/hooks/useAuth.js

import { useContext } from "react";
import AuthContext from "../context/AuthContext";

/*
|--------------------------------------------------------------------------
| Custom Authentication Hook
|--------------------------------------------------------------------------
| Usage:
|
| const {
|   user,
|   login,
|   logout,
|   authenticated,
|   loading,
|   hasRole
| } = useAuth();
|
|--------------------------------------------------------------------------
*/

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
};

export default useAuth;