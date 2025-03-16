import React from "react";
import { UserProvider } from "@/context/UserContext";

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return <UserProvider>{children}</UserProvider>;
};

export default AppProvider;
