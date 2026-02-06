import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_APPOINTMENTS, BARBERS, SERVICES, TIME_SLOTS } from '../data/mockData';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);

  // Load appointments from localStorage on mount
  useEffect(() => {
    const savedAppointments = localStorage.getItem('barbershop_appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    } else {
      setAppointments(INITIAL_APPOINTMENTS);
      localStorage.setItem('barbershop_appointments', JSON.stringify(INITIAL_APPOINTMENTS));
    }

    const savedUser = localStorage.getItem('barbershop_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    if (appointments.length > 0) {
      localStorage.setItem('barbershop_appointments', JSON.stringify(appointments));
    }
  }, [appointments]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('barbershop_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('barbershop_user');
  };

  const addAppointment = (appointment) => {
    const newAppointment = {
      ...appointment,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setAppointments(prev => [...prev, newAppointment]);
    return newAppointment;
  };

  const updateAppointmentStatus = (appointmentId, status) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId ? { ...apt, status } : apt
      )
    );
  };

  const getAvailableSlots = (date, barberId) => {
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    
    // Get all appointments for this date and barber
    const bookedSlots = appointments
      .filter(apt => 
        apt.date === dateStr && 
        apt.barberId === barberId &&
        apt.status !== 'cancelled'
      )
      .map(apt => apt.time);

    return TIME_SLOTS.filter(slot => !bookedSlots.includes(slot));
  };

  const getBarberById = (id) => BARBERS.find(b => b.id === id);
  
  const getServiceById = (id) => SERVICES.find(s => s.id === id);

  const getAppointmentsByDate = (date) => {
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  const getAppointmentStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(apt => apt.date === today);
    
    return {
      total: appointments.length,
      today: todayAppointments.length,
      pending: appointments.filter(apt => apt.status === 'pending').length,
      confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
      completed: appointments.filter(apt => apt.status === 'completed').length,
      cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
      todayRevenue: todayAppointments
        .filter(apt => apt.status !== 'cancelled')
        .reduce((sum, apt) => sum + apt.totalPrice, 0)
    };
  };

  const value = {
    user,
    login,
    logout,
    appointments,
    addAppointment,
    updateAppointmentStatus,
    getAvailableSlots,
    getBarberById,
    getServiceById,
    getAppointmentsByDate,
    getAppointmentStats,
    barbers: BARBERS,
    services: SERVICES,
    timeSlots: TIME_SLOTS
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
