import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/colombia_dash" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
