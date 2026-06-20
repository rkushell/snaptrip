import { createContext, useContext } from "react";

// Separate context object — keeps AuthProvider and useAuth in their own files
// to satisfy react-refresh/only-export-components rule
export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}
