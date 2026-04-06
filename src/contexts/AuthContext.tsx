import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner"; // For nice notifications
import { socket } from "@/hooks/usePlannerState";

interface AuthContextType {
  token: string | null;
  username: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("planner_token"));
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem("planner_username"));

  const login = (newToken: string, newUsername: string) => {
    localStorage.setItem("planner_token", newToken);
    localStorage.setItem("planner_username", newUsername);
    setToken(newToken);
    setUsername(newUsername);
  };

  const logout = () => {
    localStorage.removeItem("planner_token");
    localStorage.removeItem("planner_username");
    setToken(null);
    setUsername(null);
    if (socket.connected) {
      socket.disconnect();
    }
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
