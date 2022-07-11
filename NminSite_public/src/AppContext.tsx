import React from "react";
import { ethers } from "ethers";

import NminSite from "./assets/contracts/NminSite.json";

export interface AppContextProps {
  signer: ethers.providers.JsonRpcSigner | undefined;
  provider: ethers.providers.Web3Provider | undefined;
  contract: ethers.Contract | undefined;
  connect: () => Promise<void>;
}

const AppContext = React.createContext<AppContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const [signer, setSinger] = React.useState<ethers.providers.JsonRpcSigner>();
  const [provider, setProvider] = React.useState<ethers.providers.Web3Provider>();
  const [contract, setContract] = React.useState<ethers.Contract>();

  const connect = async () => {
    /* @ts-ignore */
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // MetaMask requires requesting permission to connect users accounts
    await provider.send("eth_requestAccounts", []);

    setProvider(provider);

    const signer = provider.getSigner();
    setSinger(signer);

    const contract = new ethers.Contract(
      import.meta.env.VITE_CONTRACT_ADDRESS,
      NminSite.abi,
      provider,
    );
    setContract(contract);
  };

  return (
    <AppContext.Provider
      value={{
        signer,
        provider,
        contract,
        connect,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
