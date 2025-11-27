import { createContext, useContext } from "react";
import type { User } from "../types/user.interface";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);
