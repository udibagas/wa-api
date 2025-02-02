import React, { createContext, useEffect, useState } from "react";
import { UserType } from "../types";
import Login from "../pages/Login";
import axiosInstance from "../utils/axiosInstance";

type AuthContextType = {
  isAuthenticated: boolean;
  user: UserType | null;
  token: string | null;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setUser: (user: UserType) => void;
  setToken: (token: string) => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  setIsAuthenticated: (): void => { },
  setUser: (): void => { },
  setToken: (): void => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    axiosInstance.get('/me').then(({ data }) => {
      if (ignore) return;
      setIsAuthenticated(true);
      setUser(data);
    }).catch(() => {
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
    });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, setIsAuthenticated, setUser, setToken }}>
      {isAuthenticated ? children : <Login />}
    </AuthContext.Provider>
  );
}

export default AuthContext;