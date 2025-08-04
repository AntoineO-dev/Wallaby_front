import React, { useState, useEffect } from 'react';
import roomsService from '../services/roomsService';
import authService from '../services/authService';
import logo from '../assets/logoV2wallaby.png';
import '../../styles/Navbar.css';

const Navbar = () => {
  const [rooms, setRooms] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
  }, []);

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
    setAuthError('');
    setAuthForm({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      confirmPassword: ''
    });
  };

  const switchAuthMode = () => {
    setIsLogin(!isLogin);
    setAuthError('');
  };

  const handleAuthInputChange = (e) => {
    setAuthForm({
      ...authForm,
      [e.target.name]: e.target.value
    });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (isLogin) {
        // Connexion
        const response = await authService.login(authForm.email, authForm.password);
        authService.saveToken(response.data.token);
        authService.saveUser(response.data.user);
        setUser(response.data.user);
      } else {
        // Inscription
        if (authForm.password !== authForm.confirmPassword) {
          setAuthError('Les mots de passe ne correspondent pas');
          setAuthLoading(false);
          return;
        }
        if (authForm.password.length < 6) {
          setAuthError('Le mot de passe doit contenir au moins 6 caractères');
          setAuthLoading(false);
          return;
        }
        
        const userData = {
          firstName: authForm.firstName,
          lastName: authForm.lastName,
          email: authForm.email,
          password: authForm.password
        };
        
        const response = await authService.register(userData);
        authService.saveToken(response.data.token);
        authService.saveUser(response.data.user);
        setUser(response.data.user);
      }
      
      handleAuthModalToggle(); // Fermer la modal
      
    } catch (err) {
      if (isLogin) {
        setAuthError('Email ou mot de passe incorrect');
      } else {
        setAuthError('Erreur lors de la création du compte');
      }
      console.error('Erreur d\'authentification:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
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

            {/* Boutons connexion/inscription ou profil utilisateur */}
            <div className="navbar-auth">
              {user ? (
                // Si l'utilisateur est connecté
                <div className="user-menu">
                  <span className="user-name">Bonjour, {user.firstName}</span>
                  <button 
                    className="auth-button logout-btn"
                    onClick={handleLogout}
                  >
                    Se déconnecter
                  </button>
                </div>
              ) : (
                // Si l'utilisateur n'est pas connecté
                <>
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
                </>
              )}
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
              {authError && <div className="auth-error">{authError}</div>}
              
              <form onSubmit={handleAuthSubmit}>
                {!isLogin && (
                  <>
                    <div className="form-group">
                      <label>Prénom</label>
                      <input 
                        type="text" 
                        name="firstName"
                        className="form-control" 
                        placeholder="Votre prénom"
                        value={authForm.firstName}
                        onChange={handleAuthInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Nom</label>
                      <input 
                        type="text" 
                        name="lastName"
                        className="form-control" 
                        placeholder="Votre nom"
                        value={authForm.lastName}
                        onChange={handleAuthInputChange}
                        required
                      />
                    </div>
                  </>
                )}
                
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    name="email"
                    className="form-control" 
                    placeholder="votre@email.com"
                    value={authForm.email}
                    onChange={handleAuthInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Mot de passe</label>
                  <input 
                    type="password" 
                    name="password"
                    className="form-control" 
                    placeholder="Mot de passe"
                    value={authForm.password}
                    onChange={handleAuthInputChange}
                    required
                  />
                </div>
                
                {!isLogin && (
                  <div className="form-group">
                    <label>Confirmer le mot de passe</label>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      className="form-control" 
                      placeholder="Confirmer le mot de passe"
                      value={authForm.confirmPassword}
                      onChange={handleAuthInputChange}
                      required
                    />
                  </div>
                )}
                
                <button type="submit" className="auth-submit-btn" disabled={authLoading}>
                  {authLoading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'S\'inscrire')}
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
