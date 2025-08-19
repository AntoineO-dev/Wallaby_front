import React, { useState } from 'react';
import '../../styles/Carousel.css';

const Carousel = ({ images, roomName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="carousel-container">
        <div className="carousel-placeholder">
          <p>Aucune image disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <div className="carousel-slides">
          {images.map((image, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
            >
              <img
                src={image}
                alt={`${roomName} - Image ${index + 1}`}
                className="carousel-image"
              />
            </div>
          ))}
        </div>

        {/* Boutons de navigation */}
        <button className="carousel-btn carousel-btn-prev" onClick={prevSlide}>
          &#8249;
        </button>
        <button className="carousel-btn carousel-btn-next" onClick={nextSlide}>
          &#8250;
        </button>

        {/* Indicateurs */}
        <div className="carousel-indicators">
          {images.map((_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
