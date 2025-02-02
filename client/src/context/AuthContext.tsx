import React, { createContext, useEffect, useState } from "react";
import { UserType } from "../types";
import Login from "../pages/Login";
import axiosInstance from "../utils/axiosInstance";

type AuthContextType = {
  user: UserType | null;
  setUser: (user: UserType) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: (): void => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    let ignore = false;

    axiosInstance.get('/me').then(({ data }) => {
      if (ignore) return;
      setUser(data);
    }).catch(() => {
      setUser(null);
    });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {user ? children : <Login />}
    </AuthContext.Provider>
  );
}

export default AuthContext;