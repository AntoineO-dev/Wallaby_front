import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/ServicesPage.css';

const ServicesPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Données des services (à remplacer par des appels API plus tard)
  const serviceCategories = [
    { id: 'all', name: 'Tous les services', icon: 'fas fa-th-large' },
    { id: 'wellness', name: 'Bien-être', icon: 'fas fa-spa' },
    { id: 'activities', name: 'Activités', icon: 'fas fa-hiking' },
    { id: 'dining', name: 'Restauration', icon: 'fas fa-utensils' },
    { id: 'transport', name: 'Transport', icon: 'fas fa-car' },
    { id: 'events', name: 'Événements', icon: 'fas fa-calendar-star' }
  ];

  const services = [
    // Services Bien-être
    {
      id: 1,
      name: 'Spa & Massage',
      category: 'wellness',
      description: 'Détendez-vous avec nos massages thérapeutiques et soins du corps dans un cadre zen.',
      price: 'À partir de 80€',
      duration: '60-90 min',
      features: ['Massage relaxant', 'Soins du visage', 'Aromathérapie', 'Jacuzzi privé'],
      imageUrl: '/api/images/services/spa-massage.jpg', // Placeholder pour l'image
      popular: true
    },
    {
      id: 2,
      name: 'Yoga & Méditation',
      category: 'wellness',
      description: 'Cours de yoga matinaux avec vue sur la nature pour commencer la journée en harmonie.',
      price: '25€/session',
      duration: '60 min',
      features: ['Cours en groupe', 'Sessions privées', 'Méditation guidée', 'Matériel fourni'],
      imageUrl: '/api/images/services/yoga-meditation.jpg'
    },
    
    // Services Activités
    {
      id: 3,
      name: 'Randonnée Guidée',
      category: 'activities',
      description: 'Explorez les sentiers secrets de la région avec nos guides experts locaux.',
      price: '45€/personne',
      duration: '3-4h',
      features: ['Guide professionnel', 'Équipement fourni', 'Collation incluse', 'Photos souvenir'],
      imageUrl: '/api/images/services/randonnee-guidee.jpg',
      popular: true
    },
    {
      id: 4,
      name: 'Observation de la Faune',
      category: 'activities',
      description: 'Découvrez la faune locale dans son habitat naturel avec nos naturalistes.',
      price: '35€/personne',
      duration: '2-3h',
      features: ['Jumelles fournies', 'Guide naturaliste', 'Carnet de terrain', 'Garantie observation'],
      imageUrl: '/api/images/services/observation-faune.jpg'
    },
    {
      id: 5,
      name: 'VTT & Cyclotourisme',
      category: 'activities',
      description: 'Parcourez les chemins forestiers et découvrez des panoramas exceptionnels.',
      price: '30€/jour',
      duration: 'Journée complète',
      features: ['VTT tout suspendu', 'Casque et protection', 'Carte des parcours', 'Kit de réparation'],
      imageUrl: '/api/images/services/vtt-cyclotourisme.jpg'
    },

    // Services Restauration
    {
      id: 6,
      name: 'Petit-déjeuner Gourmet',
      category: 'dining',
      description: 'Réveillez-vous avec un petit-déjeuner aux produits locaux servi en chambre ou en terrasse.',
      price: '25€/personne',
      duration: '8h-11h',
      features: ['Produits bio locaux', 'Service en chambre', 'Options végétariennes', 'Jus pressés minute'],
      imageUrl: '/api/images/services/petit-dejeuner-gourmet.jpg',
      popular: true
    },
    {
      id: 7,
      name: 'Dîner aux Chandelles',
      category: 'dining',
      description: 'Savourez un dîner romantique préparé par notre chef avec des ingrédients de saison.',
      price: '120€/couple',
      duration: '19h-22h',
      features: ['Menu 4 services', 'Vins locaux', 'Service privé', 'Ambiance romantique'],
      imageUrl: '/api/images/services/diner-chandelles.jpg'
    },
    {
      id: 8,
      name: 'Cours de Cuisine',
      category: 'dining',
      description: 'Apprenez à cuisiner les spécialités régionales avec notre chef expérimenté.',
      price: '65€/personne',
      duration: '3h',
      features: ['Tablier fourni', 'Recettes à emporter', 'Dégustation incluse', 'Certificat'],
      imageUrl: '/api/images/services/cours-cuisine.jpg'
    },

    // Services Transport
    {
      id: 9,
      name: 'Navette Aéroport',
      category: 'transport',
      description: 'Service de navette privée depuis et vers les principaux aéroports de la région.',
      price: '85€/trajet',
      duration: 'Variable',
      features: ['Véhicule climatisé', 'Chauffeur professionnel', 'Wi-Fi gratuit', 'Suivi en temps réel'],
      imageUrl: '/api/images/services/navette-aeroport.jpg'
    },
    {
      id: 10,
      name: 'Location de Voiture',
      category: 'transport',
      description: 'Explorez la région à votre rythme avec nos véhicules récents et économiques.',
      price: '45€/jour',
      duration: 'Flexible',
      features: ['Assurance incluse', 'GPS intégré', 'Carburant économique', 'Assistance 24h/24'],
      imageUrl: '/api/images/services/location-voiture.jpg'
    },

    // Services Événements
    {
      id: 11,
      name: 'Organisation Mariage',
      category: 'events',
      description: 'Célébrez votre union dans un cadre exceptionnel avec notre service complet.',
      price: 'Sur devis',
      duration: 'Journée complète',
      features: ['Wedding planner', 'Décoration incluse', 'Photographe professionnel', 'Menu personnalisé'],
      imageUrl: '/api/images/services/organisation-mariage.jpg',
      popular: true
    },
    {
      id: 12,
      name: 'Séminaires d\'Entreprise',
      category: 'events',
      description: 'Organisez vos événements professionnels dans un environnement stimulant.',
      price: '150€/personne',
      duration: '1-3 jours',
      features: ['Salle équipée', 'Matériel audiovisuel', 'Pauses café', 'Team building'],
      imageUrl: '/api/images/services/seminaires-entreprise.jpg'
    }
  ];

  const getFilteredServices = () => {
    if (selectedCategory === 'all') return services;
    return services.filter(service => service.category === selectedCategory);
  };

  const filteredServices = getFilteredServices();
  const popularServices = services.filter(service => service.popular);

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="container h-100">
            <div className="row justify-content-center align-items-center h-100">
              <div className="col-lg-8 text-center">
                <h1 className="hero-title">
                  <i className="fas fa-concierge-bell me-3"></i>
                  Nos Services Premium
                </h1>
                <p className="hero-subtitle">
                  Découvrez une gamme complète de services exclusifs pour enrichir votre séjour 
                  et créer des souvenirs inoubliables dans notre écrin de nature.
                </p>
                <button 
                  className="btn btn-primary btn-lg mt-4"
                  onClick={() => navigate('/reservation')}
                >
                  <i className="fas fa-calendar-plus me-2"></i>
                  Réserver votre séjour
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Placeholder pour image de fond */}
        <div className="hero-image-placeholder">
          {/* L'image de fond sera ajoutée via CSS ou API */}
        </div>
      </section>

      <div className="container py-5">
        {/* Services Populaires */}
        <section className="popular-services mb-5">
          <div className="row">
            <div className="col-12 text-center mb-4">
              <h2 className="section-title">
                <i className="fas fa-star me-2"></i>
                Services les Plus Demandés
              </h2>
              <p className="section-subtitle">
                Nos services phares plébiscités par nos clients
              </p>
            </div>
          </div>
          <div className="row popular-services-row">
            {popularServices.map((service) => (
              <div key={service.id} className="col-lg-3 col-md-6 mb-4">
                <div className="service-card popular-card">
                  <div className="popular-badge">
                    <i className="fas fa-star"></i>
                    Populaire
                  </div>
                  <div className="service-image">
                    {/* Placeholder pour l'image */}
                    <div className="image-placeholder">
                      <i className="fas fa-image"></i>
                      <span>Image à venir</span>
                    </div>
                  </div>
                  <div className="service-content">
                    <h4 className="service-title">{service.name}</h4>
                    <p className="service-description">{service.description}</p>
                    <div className="service-details">
                      <div className="service-price">{service.price}</div>
                      <div className="service-duration">
                        <i className="fas fa-clock me-1"></i>
                        {service.duration}
                      </div>
                    </div>
                    <div className="service-features">
                      {service.features.slice(0, 2).map((feature, index) => (
                        <span key={index} className="feature-tag">
                          <i className="fas fa-check me-1"></i>
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filtres */}
        <section className="services-filters mb-4">
          <div className="row">
            <div className="col-12">
              <h2 className="section-title text-center mb-4">
                <i className="fas fa-th-list me-2"></i>
                Tous Nos Services
              </h2>
              <div className="filter-buttons">
                {serviceCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <i className={`${category.icon} me-2`}></i>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="services-grid">
          <div className="row">
            {filteredServices.length === 0 ? (
              <div className="col-12 text-center py-5">
                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                <h4 className="text-muted">Aucun service trouvé</h4>
                <p className="text-muted">Essayez de sélectionner une autre catégorie.</p>
              </div>
            ) : (
              filteredServices.map((service) => (
                <div key={service.id} className="col-lg-6 col-xl-4 mb-4">
                  <div className="service-card">
                    <div className="service-image">
                      {/* Placeholder pour l'image */}
                      <div className="image-placeholder">
                        <i className="fas fa-image"></i>
                        <span>Image à venir</span>
                      </div>
                    </div>
                    <div className="service-content">
                      <h4 className="service-title">{service.name}</h4>
                      <p className="service-description">{service.description}</p>
                      <div className="service-details">
                        <div className="service-price">{service.price}</div>
                        <div className="service-duration">
                          <i className="fas fa-clock me-1"></i>
                          {service.duration}
                        </div>
                      </div>
                      <div className="service-features">
                        {service.features.map((feature, index) => (
                          <span key={index} className="feature-tag">
                            <i className="fas fa-check me-1"></i>
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="services-cta mt-5">
          <div className="cta-card">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h3 className="cta-title">
                  <i className="fas fa-concierge-bell me-2"></i>
                  Service Conciergerie 24h/24
                </h3>
                <p className="cta-description">
                  Notre équipe dédiée est à votre disposition pour organiser tous ces services 
                  et bien plus encore. Contactez-nous pour personnaliser votre séjour selon vos envies.
                </p>
              </div>
              <div className="col-lg-4 text-lg-end text-center">
                <button className="btn btn-outline-primary btn-lg me-3 mb-2">
                  <i className="fas fa-phone me-2"></i>
                  Nous Contacter
                </button>
                <button 
                  className="btn btn-primary btn-lg mb-2"
                  onClick={() => navigate('/reservation')}
                >
                  <i className="fas fa-calendar-check me-2"></i>
                  Réserver Maintenant
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServicesPage;
