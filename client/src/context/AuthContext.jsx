import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Distinct from a login request being in flight: this covers the one-time
  // check on mount, before we know whether there is a session at all.
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    authService
      .me()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setIsBootstrapping(false));
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    setUser(res.data);
    return res.data;
  };

  const register = async (payload) => {
    const res = await authService.register(payload);
    setUser(res.data);
    return res.data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      // The local session is dropped even if the request fails, so a network
      // error cannot leave someone stuck in a signed-in UI.
      setUser(null);
    }
  };

  const value = { user, isBootstrapping, login, register, logout };

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
