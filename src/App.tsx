import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./auth/login";
import Register from "./auth/register";
import Inicio from "./home/inicio";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/inicio" element={<Inicio />} />
      </Routes>
    </Router>
  );
}

export default App;
