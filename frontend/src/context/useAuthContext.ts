import { createContext, useContext } from "react";
import type { User } from "../../core/interfaces/user.interface";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);
