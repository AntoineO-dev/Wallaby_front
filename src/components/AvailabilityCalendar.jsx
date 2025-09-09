import React, { useState, useEffect } from 'react';
import reservationService from '../services/reservationService';

const AvailabilityCalendar = ({ roomId, onDateSelect }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (roomId) {
      fetchReservations();
    }
  }, [roomId]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getReservationsByRoom(roomId);
      setReservations(data);
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const isDateReserved = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return reservations.some(reservation => {
      const checkIn = new Date(reservation.check_in_date);
      const checkOut = new Date(reservation.check_out_date);
      return date >= checkIn && date < checkOut;
    });
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = firstDay.getDay();

    const days = [];
    
    // Jours vides au début
    for (let i = 0; i < startDate; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isReserved = isDateReserved(date);
      const isPast = date < new Date().setHours(0, 0, 0, 0);
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${isReserved ? 'reserved' : 'available'} ${isPast ? 'past' : ''}`}
          onClick={() => !isReserved && !isPast && onDateSelect && onDateSelect(date)}
          title={isReserved ? 'Date réservée' : isPast ? 'Date passée' : 'Date disponible'}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  if (loading) {
    return <div className="text-center">Chargement du calendrier...</div>;
  }

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  return (
    <div className="availability-calendar">
      <div className="calendar-header">
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={prevMonth}>
          ‹
        </button>
        <h5 className="mb-0">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h5>
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={nextMonth}>
          ›
        </button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>
        <div className="calendar-days">
          {renderCalendar()}
        </div>
      </div>

      <div className="calendar-legend mt-3">
        <div className="d-flex gap-3 justify-content-center">
          <div className="legend-item">
            <span className="legend-color available"></span>
            <small>Disponible</small>
          </div>
          <div className="legend-item">
            <span className="legend-color reserved"></span>
            <small>Réservé</small>
          </div>
          <div className="legend-item">
            <span className="legend-color past"></span>
            <small>Passé</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
