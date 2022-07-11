import React from "react";

import NminSite from "./assets/contracts/NminSite.json";

export interface AppContextProps {
  // contractData: any;
  contractABI: any[];
}

const AppContext = React.createContext<AppContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  React.useEffect(() => {}, []);

  return (
    <AppContext.Provider
      value={{
        contractABI: NminSite.abi,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
