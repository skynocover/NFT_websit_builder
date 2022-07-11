import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AppProvider } from "./AppContext";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { MoralisProvider } from "react-moralis";

import { ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MoralisProvider
      appId={import.meta.env.VITE_APP_ID}
      serverUrl={import.meta.env.VITE_SERVER_URL}
    >
      <AppProvider>
        <BrowserRouter>
          <ChakraProvider theme={theme}>
            <App />
          </ChakraProvider>
        </BrowserRouter>
      </AppProvider>
    </MoralisProvider>
  </React.StrictMode>,
);
