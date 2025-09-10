import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import UserAdminProtectedRoute from "./components/UserAdminProtectedRoute";
import authService from "./services/authService";
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
  // Gestion intelligente de l'authentification au démarrage
  useEffect(() => {
    // Vérifier si c'est vraiment un nouveau démarrage de l'app ou juste un refresh
    const isAppReload = sessionStorage.getItem('appLoaded');
    
    if (!isAppReload) {
      // Premier démarrage de l'application (pas un refresh)
      sessionStorage.setItem('appLoaded', 'true');
      
      // OPTION: Déconnecter seulement au vrai premier démarrage (pas au refresh)
      const shouldLogoutOnFirstStart = false; // Changez en true si vous voulez déconnecter au premier démarrage
      
      if (shouldLogoutOnFirstStart) {
        const currentUser = authService.getUser();
        if (currentUser) {
          console.log('🧹 Premier démarrage détecté, nettoyage de la session...', currentUser);
          authService.logout();
          console.log('✅ Session nettoyée au premier démarrage');
        } else {
          console.log('✅ Premier démarrage, aucune session à nettoyer');
        }
      } else {
        console.log('🔄 Premier démarrage, conservation des sessions existantes');
      }
    } else {
      // Refresh de la page - conserver la session
      const currentUser = authService.getUser();
      if (currentUser) {
        console.log('🔄 Refresh détecté, session conservée:', currentUser.email || currentUser.id);
      } else {
        console.log('🔄 Refresh détecté, aucune session active');
      }
    }
  }, []); // Se déclenche uniquement au montage du composant

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