import React from "react";

import NminSite from "./assets/artifacts/NminSite.json";

export interface AppContextProps {
  // contractData: any;
  contractABI: any[];
}

const AppContext = React.createContext<AppContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const init = async () => {};

  React.useEffect(() => {
    //     init();
  }, []);

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
