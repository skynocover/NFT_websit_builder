import "./App.css";
import { Routes, Route } from "react-router-dom";

import Contract from "./pages/Contract";
import Mint from "./pages/Mint";

const NotFound = () => {
  return <div>This is wrong way</div>;
};

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Mint />} />
        <Route path="/Contract/:tokenId" element={<Contract />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
