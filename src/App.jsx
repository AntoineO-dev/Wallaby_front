import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/HomePage.css'; // Import du CSS global
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <div className="app-container">
      <BrowserRouter>
       {/* Navbar */}
            <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Redirections pour les anciennes routes */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;