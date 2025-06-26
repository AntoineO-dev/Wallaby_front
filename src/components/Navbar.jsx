import React, { useState, useEffect } from 'react';
import roomsService from '../services/roomsService';
import logo from '../assets/logoV2wallaby.png';
import '../../styles/Navbar.css';

const Navbar = () => {
  const [rooms, setRooms] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // Récupérer les chambres pour le menu déroulant
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await roomsService.getRooms();
        setRooms(response.data.slice(0, 3)); // Limiter à 3 chambres
      } catch (error) {
        console.error('Erreur lors de la récupération des chambres:', error);
      }
    };
    fetchRooms();
  }, []);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleAuthModalToggle = () => {
    setShowAuthModal(!showAuthModal);
  };

  const switchAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      <nav className="custom-navbar">
        <div className="container-fluid">
          <div className="navbar-content">
            {/* Logo à gauche */}
            <div className="navbar-logo">
              <div className="logo-container">
                <img 
                  src={logo}
                  alt="La Cachette Sautillante" 
                  className="logo-image"
                />
              </div>
            </div>

            {/* Menu navigation au centre */}
            <div className="navbar-menu">
              {/* Dropdown Chambres */}
              <div className="nav-item dropdown">
                <button 
                  className="nav-link dropdown-toggle"
                  onClick={handleDropdownToggle}
                >
                  Chambres
                </button>
                {showDropdown && (
                  <div className="dropdown-menu show">
                    {rooms.map((room) => (
                      <a 
                        key={room.id_room}
                        href="#" 
                        className="dropdown-item"
                        onClick={() => setShowDropdown(false)}
                      >
                        {room.room_name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Services */}
              <div className="nav-item">
                <a href="#" className="nav-link">Services</a>
              </div>

              {/* Contact */}
              <div className="nav-item">
                <a href="#" className="nav-link">Contact</a>
              </div>
            </div>

            {/* Boutons connexion/inscription à droite */}
            <div className="navbar-auth">
              <button 
                className="auth-button login-btn"
                onClick={() => {
                  setIsLogin(true);
                  handleAuthModalToggle();
                }}
              >
                Se connecter
              </button>
              <button 
                className="auth-button signup-btn"
                onClick={() => {
                  setIsLogin(false);
                  handleAuthModalToggle();
                }}
              >
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal d'authentification */}
      {showAuthModal && (
        <div className="auth-modal-overlay" onClick={handleAuthModalToggle}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-header">
              <h3>{isLogin ? 'Se connecter' : 'S\'inscrire'}</h3>
              <button className="close-btn" onClick={handleAuthModalToggle}>×</button>
            </div>
            <div className="auth-modal-body">
              <form>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-control" placeholder="votre@email.com" />
                </div>
                <div className="form-group">
                  <label>Mot de passe</label>
                  <input type="password" className="form-control" placeholder="Mot de passe" />
                </div>
                {!isLogin && (
                  <div className="form-group">
                    <label>Confirmer le mot de passe</label>
                    <input type="password" className="form-control" placeholder="Confirmer le mot de passe" />
                  </div>
                )}
                <button type="submit" className="auth-submit-btn">
                  {isLogin ? 'Se connecter' : 'S\'inscrire'}
                </button>
              </form>
              <div className="auth-switch">
                <p>
                  {isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
                  <button className="switch-btn" onClick={switchAuthMode}>
                    {isLogin ? 'S\'inscrire' : 'Se connecter'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
