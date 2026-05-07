import { AuthContext } from "./authContext";
import { useContext } from "react";

export function useAuth() {
  return useContext(AuthContext);
}
