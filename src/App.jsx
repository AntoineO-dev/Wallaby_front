import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserAdminProtectedRoute from "./components/UserAdminProtectedRoute";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/HomePage.css'; // Import du CSS global
import HomePage from "./pages/HomePage";
import NidWallabyPage from "./pages/NidWallabyPage";
import PrairieSautillantePage from "./pages/PrairieSautillantePage";
import OasisMarsupiauxPage from "./pages/OasisMarsupiauxPage";
import ReposKangourouPage from "./pages/ReposKangourouPage";
import ReservationPage from "./pages/ReservationPage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import MyReservationsPage from "./pages/MyReservationsPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";

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
          <Route path="/reservation" element={<ReservationPage />} />
          
          {/* Page Services */}
          <Route path="/services" element={<ServicesPage />} />
          
          {/* Page Contact */}
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Pages Client */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/mes-reservations" element={<MyReservationsPage />} />
          
          {/* Route Admin Protégée */}
          <Route 
            path="/admin" 
            element={
              <UserAdminProtectedRoute>
                <AdminPage />
              </UserAdminProtectedRoute>
            } 
          />
          
          {/* Redirections pour les anciennes routes */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;