import React, { createContext, useEffect, useState } from "react";
import { UserType } from "../types";
import Login from "../pages/Login";
import axiosInstance from "../utils/axiosInstance";
import Loading from "../pages/Loading";

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
  const [page, setPage] = useState<React.ReactNode>(<Loading />);

  useEffect(() => {
    let ignore = false;

    axiosInstance.get('/me').then(({ data }) => {
      if (ignore) return;
      setUser(data);
      setPage(children);
    }).catch(() => {
      setUser(null);
      setPage(<Login />);
    });

    return () => {
      ignore = true;
    };
  }, [children]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {page}
    </AuthContext.Provider>
  );
}

export default AuthContext;