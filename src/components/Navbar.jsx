import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import roomsService from '../services/roomsService';
import authService from '../services/authService';
import logo from '../assets/logoV2wallaby.png';
import '../../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showClientMenu, setShowClientMenu] = useState(false);
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
  const [authSuccess, setAuthSuccess] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
  }, []);

  // Fermer les menus quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAdminMenu && !event.target.closest('.admin-dropdown')) {
        setShowAdminMenu(false);
      }
      if (showClientMenu && !event.target.closest('.client-dropdown')) {
        setShowClientMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAdminMenu, showClientMenu]);

  // Récupérer les chambres pour le menu déroulant
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await roomsService.getRooms();
        setRooms(response.data.slice(0, 4)); // Limiter à 4 chambres
      } catch (error) {
        console.error('Erreur lors de la récupération des chambres:', error);
      }
    };
    fetchRooms();
  }, []);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleAdminMenuToggle = () => {
    setShowAdminMenu(!showAdminMenu);
  };

  const handleClientMenuToggle = () => {
    setShowClientMenu(!showClientMenu);
  };

  const handleRoomNavigation = (roomName) => {
    setShowDropdown(false);
    
    // Navigation spécifique pour "Le Nid du Wallaby"
    if (roomName === "Le Nid du Wallaby") {
      navigate('/chambre/nid-wallaby');
    } else if (roomName === "La Prairie Sautillante") {
      navigate('/chambre/prairie-sautillante');
    } else if (roomName === "L'Oasis des Marsupiaux") {
      navigate('/chambre/oasis-marsupiaux');
    } else if (roomName === "Le Repos du Kangourou") {
      navigate('/chambre/repos-kangourou');
    } else {
      // Pour les autres chambres, on peut créer une route générique
      // ou rediriger vers la homepage avec une ancre
      console.log(`Navigation vers ${roomName} - Route à définir`);
      navigate('/');
    }
  };

  const handleAuthModalToggle = () => {
    setShowAuthModal(!showAuthModal);
    setAuthError('');
    setAuthSuccess('');
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
    setAuthSuccess('');
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
    setAuthSuccess('');
    setAuthLoading(true);

    try {
      if (isLogin) {
        // Connexion
        const response = await authService.login(authForm.email, authForm.password);
        authService.saveToken(response.data.token);
        authService.saveUser(response.data.user);
        setUser(response.data.user);
        handleAuthModalToggle(); // Fermer la modal
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
        
        // Inscription réussie - NE PAS connecter automatiquement
        await authService.register(userData);
        
        // Afficher message de succès et passer en mode connexion
        setAuthSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setIsLogin(true); // Passer en mode connexion
        
        // Réinitialiser le formulaire mais garder l'email
        setAuthForm({
          email: authForm.email, // Garder l'email pour faciliter la connexion
          password: '',
          firstName: '',
          lastName: '',
          confirmPassword: ''
        });
      }
      
    } catch (err) {
      if (isLogin) {
        setAuthError('Email ou mot de passe incorrect');
      } else {
        setAuthError('Erreur lors de la création du compte. Cet email est peut-être déjà utilisé.');
      }
      console.error('Erreur d\'authentification:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setShowAdminMenu(false);
    setShowClientMenu(false);
  };

  const handleAdminAccess = () => {
    setShowAdminMenu(false);
    navigate('/admin');
  };

  const handleClientProfile = () => {
    setShowClientMenu(false);
    navigate('/profile');
  };

  const handleClientOrders = () => {
    setShowClientMenu(false);
    navigate('/mes-reservations');
  };

  return (
    <>
      <nav className="custom-navbar">
        <div className="container-fluid">
          <div className="navbar-content">
            {/* Logo à gauche */}
            <div className="navbar-logo">
              <Link to="/" className="logo-container">
                <img 
                  src={logo}
                  alt="La Cachette Sautillante" 
                  className="logo-image"
                />
              </Link>
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
                      <button 
                        key={room.id_room}
                        className="dropdown-item"
                        onClick={() => handleRoomNavigation(room.room_name)}
                      >
                        {room.room_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Services */}
              <div className="nav-item">
                <Link to="/services" className="nav-link">Services</Link>
              </div>

              {/* Contact */}
              <div className="nav-item">
                <Link to="/contact" className="nav-link">Contact</Link>
              </div>
            </div>

            {/* Boutons connexion/inscription ou profil utilisateur */}
            <div className="navbar-auth">
              {user ? (
                // Si l'utilisateur est connecté
                <div className="user-menu">
                  <span className="user-name">Bonjour {user.first_name},</span>
                  {authService.isAdmin() ? (
                    // Menu déroulant pour les administrateurs
                    <div className="admin-dropdown">
                      <button 
                        className="auth-button admin-btn"
                        onClick={handleAdminMenuToggle}
                      >
                        <i className="fas fa-cog me-1"></i>
                        Admin
                        <i className={`fas fa-chevron-${showAdminMenu ? 'up' : 'down'} ms-1`}></i>
                      </button>
                      {showAdminMenu && (
                        <div className="admin-menu">
                          <button 
                            className="admin-menu-item"
                            onClick={handleAdminAccess}
                          >
                            <i className="fas fa-tachometer-alt me-2"></i>
                            Tableau de bord
                          </button>
                          <button 
                            className="admin-menu-item logout-item"
                            onClick={handleLogout}
                          >
                            <i className="fas fa-sign-out-alt me-2"></i>
                            Se déconnecter
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Menu déroulant pour les clients normaux
                    <div className="client-dropdown">
                      <button 
                        className="auth-button client-btn"
                        onClick={handleClientMenuToggle}
                      >
                        <i className="fas fa-user me-1"></i>
                        Mon compte
                        <i className={`fas fa-chevron-${showClientMenu ? 'up' : 'down'} ms-1`}></i>
                      </button>
                      {showClientMenu && (
                        <div className="client-menu">
                          <button 
                            className="client-menu-item"
                            onClick={handleClientProfile}
                          >
                            <i className="fas fa-user-edit me-2"></i>
                            Mon profil
                          </button>
                          <button 
                            className="client-menu-item"
                            onClick={handleClientOrders}
                          >
                            <i className="fas fa-calendar-check me-2"></i>
                            Mes réservations
                          </button>
                          <button 
                            className="client-menu-item logout-item"
                            onClick={handleLogout}
                          >
                            <i className="fas fa-sign-out-alt me-2"></i>
                            Se déconnecter
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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
              {authSuccess && <div className="auth-success">{authSuccess}</div>}
              
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
