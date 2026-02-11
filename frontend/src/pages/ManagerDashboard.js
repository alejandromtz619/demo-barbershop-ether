import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Calendar } from '../components/ui/calendar';
import { 
  Scissors, LogOut, Calendar as CalendarIcon, Users, 
  Clock, DollarSign, CheckCircle, XCircle, AlertCircle,
  ChevronRight, User
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { STATUS_LABELS } from '../data/mockData';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { 
    user, logout, appointments, getAppointmentsByDate, 
    getBarberById, getServiceById, updateAppointmentStatus,
    getAppointmentStats, barbers
  } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const stats = getAppointmentStats();
  const dayAppointments = getAppointmentsByDate(selectedDate);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleStatusChange = (appointmentId, newStatus) => {
    updateAppointmentStatus(appointmentId, newStatus);
    setSelectedAppointment(null);
  };

  // Get dates that have appointments for calendar highlighting
  const appointmentDates = [...new Set(appointments.map(apt => apt.date))];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <AlertCircle className="w-4 h-4 text-[#D4AF37]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#121212]/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#C5A059] flex items-center justify-center">
              <Scissors className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="font-heading text-xl text-white">BARBERSHOP</h1>
              <p className="text-[#D4AF37] text-xs tracking-wider">Panel de Gestión</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-white text-sm">{user?.name}</p>
              <p className="text-white/50 text-xs">Gestor</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-white/10 transition-colors"
              data-testid="logout-button"
            >
              <LogOut className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="card-luxury p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#D4AF37]/20">
                <CalendarIcon className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-white/50 text-xs">Citas Hoy</p>
                <p className="text-2xl font-heading text-white" data-testid="stats-today">{stats.today}</p>
              </div>
            </div>
          </div>
          
          <div className="card-luxury p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-white/50 text-xs">Pendientes</p>
                <p className="text-2xl font-heading text-white" data-testid="stats-pending">{stats.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="card-luxury p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-white/50 text-xs">Confirmados</p>
                <p className="text-2xl font-heading text-white" data-testid="stats-confirmed">{stats.confirmed}</p>
              </div>
            </div>
          </div>
          
          <div className="card-luxury p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#D4AF37]/20">
                <DollarSign className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-white/50 text-xs">Ingresos Hoy</p>
                <p className="text-2xl font-heading text-white" data-testid="stats-revenue">₲{stats.todayRevenue.toLocaleString('es-PY')}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="card-luxury p-4">
              <h2 className="font-heading text-lg text-white mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#D4AF37]" />
                Calendario
              </h2>
              <div className="flex justify-center" data-testid="calendar-container">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  locale={es}
                  className="bg-transparent"
                  modifiers={{
                    booked: (date) => appointmentDates.includes(date.toISOString().split('T')[0])
                  }}
                  modifiersStyles={{
                    booked: { 
                      backgroundColor: 'rgba(212, 175, 55, 0.2)',
                      borderRadius: '0'
                    }
                  }}
                />
              </div>
              
              {/* Barbers Quick View */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <h3 className="text-sm text-white/50 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Equipo
                </h3>
                <div className="space-y-2">
                  {barbers.map(barber => (
                    <div key={barber.id} className="flex items-center gap-3 p-2 hover:bg-white/5 transition-colors">
                      <img 
                        src={barber.image} 
                        alt={barber.name}
                        className="w-8 h-8 object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{barber.name}</p>
                        <p className="text-xs text-white/40">{barber.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Appointments List */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="card-luxury">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-heading text-lg text-white">
                  Citas del {format(selectedDate, "d 'de' MMMM", { locale: es })}
                </h2>
                <span className="text-[#D4AF37] text-sm font-mono">
                  {dayAppointments.length} citas
                </span>
              </div>
              
              <div className="divide-y divide-white/5" data-testid="appointments-list">
                {dayAppointments.length === 0 ? (
                  <div className="p-8 text-center">
                    <CalendarIcon className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40">No hay citas para este día</p>
                  </div>
                ) : (
                  dayAppointments
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map(apt => {
                      const barber = getBarberById(apt.barberId);
                      const services = apt.services.map(sid => getServiceById(sid));
                      
                      return (
                        <motion.div 
                          key={apt.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-4 hover:bg-white/5 transition-colors cursor-pointer"
                          onClick={() => setSelectedAppointment(apt)}
                          data-testid={`appointment-${apt.id}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-center min-w-[60px]">
                              <p className="font-mono text-lg text-[#D4AF37]">{apt.time}</p>
                              <p className="text-xs text-white/40">{apt.totalDuration} min</p>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-white font-medium truncate">{apt.clientName}</p>
                                <span className={`px-2 py-0.5 text-xs status-${apt.status}`}>
                                  {STATUS_LABELS[apt.status]}
                                </span>
                              </div>
                              <p className="text-sm text-white/50 truncate">
                                {services.map(s => s?.name).join(', ')}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              {barber && (
                                <img 
                                  src={barber.image} 
                                  alt={barber.name}
                                  className="w-10 h-10 object-cover hidden sm:block"
                                />
                              )}
                              <div className="text-right">
                                <p className="font-mono text-[#D4AF37]">₲{apt.totalPrice.toLocaleString('es-PY')}</p>
                                <p className="text-xs text-white/40 hidden sm:block">{barber?.name}</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-white/30" />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      <AnimatePresence>
        {selectedAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAppointment(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#121212] border border-[#D4AF37]/30 w-full max-w-md"
              onClick={e => e.stopPropagation()}
              data-testid="appointment-modal"
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl text-white">Detalle de Cita</h3>
                  <span className={`px-3 py-1 text-sm status-${selectedAppointment.status}`}>
                    {STATUS_LABELS[selectedAppointment.status]}
                  </span>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <p className="text-white">{selectedAppointment.clientName}</p>
                    <p className="text-sm text-white/50">{selectedAppointment.clientPhone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <p className="text-white font-mono">{selectedAppointment.time}</p>
                    <p className="text-sm text-white/50">{selectedAppointment.totalDuration} minutos</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Scissors className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <p className="text-white">
                      {selectedAppointment.services.map(sid => getServiceById(sid)?.name).join(', ')}
                    </p>
                    <p className="text-sm text-white/50">
                      Barbero: {getBarberById(selectedAppointment.barberId)?.name}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-[#D4AF37]" />
                  <p className="text-white font-mono text-xl">₲{selectedAppointment.totalPrice.toLocaleString('es-PY')}</p>
                </div>
              </div>
              
              <div className="p-6 border-t border-white/10 space-y-3">
                <p className="text-sm text-white/50 mb-2">Cambiar estado:</p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedAppointment.status !== 'confirmed' && (
                    <button
                      onClick={() => handleStatusChange(selectedAppointment.id, 'confirmed')}
                      className="btn-outline-gold py-2 text-sm flex items-center justify-center gap-2"
                      data-testid="status-confirm-btn"
                    >
                      <CheckCircle className="w-4 h-4" /> Confirmar
                    </button>
                  )}
                  {selectedAppointment.status !== 'completed' && (
                    <button
                      onClick={() => handleStatusChange(selectedAppointment.id, 'completed')}
                      className="py-2 text-sm bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center gap-2 hover:bg-blue-500/30 transition-colors"
                      data-testid="status-complete-btn"
                    >
                      <CheckCircle className="w-4 h-4" /> Completar
                    </button>
                  )}
                  {selectedAppointment.status !== 'cancelled' && (
                    <button
                      onClick={() => handleStatusChange(selectedAppointment.id, 'cancelled')}
                      className="py-2 text-sm bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center gap-2 hover:bg-red-500/30 transition-colors col-span-2"
                      data-testid="status-cancel-btn"
                    >
                      <XCircle className="w-4 h-4" /> Cancelar Cita
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManagerDashboard;
