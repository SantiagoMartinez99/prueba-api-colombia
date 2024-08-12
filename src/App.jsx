import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/colombia_dash" />} />
        <Route path="/colombia_dash" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
