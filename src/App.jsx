import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/HomePage.css'; // Import du CSS global
import HomePage from "./pages/HomePage";
import NidWallabyPage from "./pages/NidWallabyPage";
import PrairieSautillantePage from "./pages/PrairieSautillantePage";
import OasisMarsupiauxPage from "./pages/OasisMarsupiauxPage";
import ReposKangourouPage from "./pages/ReposKangourouPage";

const App = () => {
  return (
    <div className="app-container">
      <BrowserRouter>
       {/* Navbar */}
            <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chambre/nid-wallaby" element={<NidWallabyPage />} />
          <Route path="/chambre/prairie-sautillante" element={<PrairieSautillantePage />} />
          <Route path="/chambre/oasis-marsupiaux" element={<OasisMarsupiauxPage />} />
          <Route path="/chambre/repos-kangourou" element={<ReposKangourouPage />} />
          {/* Redirections pour les anciennes routes */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;