import React, { createContext, useState } from "react";
import { UserType } from "../types";

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

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;