import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Calendar } from '../components/ui/calendar';
import { 
  Scissors, LogOut, ArrowLeft, ArrowRight, Check, 
  Clock, DollarSign, User, Phone, Shuffle
} from 'lucide-react';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

const STEPS = ['services', 'barber', 'datetime', 'confirm'];

const ClientBooking = () => {
  const navigate = useNavigate();
  const { 
    user, logout, services, barbers, 
    addAppointment, getAvailableSlots 
  } = useApp();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [clientName, setClientName] = useState(user?.name || '');
  const [clientPhone, setClientPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleService = (serviceId) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const selectRandomBarber = () => {
    const randomIndex = Math.floor(Math.random() * barbers.length);
    setSelectedBarber(barbers[randomIndex]);
  };

  const totals = useMemo(() => {
    const selected = services.filter(s => selectedServices.includes(s.id));
    return {
      price: selected.reduce((sum, s) => sum + s.price, 0),
      duration: selected.reduce((sum, s) => sum + s.duration, 0)
    };
  }, [selectedServices, services]);

  const availableSlots = useMemo(() => {
    if (!selectedDate || !selectedBarber) return [];
    return getAvailableSlots(selectedDate, selectedBarber.id);
  }, [selectedDate, selectedBarber, getAvailableSlots]);

  const canProceed = () => {
    switch (currentStep) {
      case 0: return selectedServices.length > 0;
      case 1: return selectedBarber !== null;
      case 2: return selectedDate && selectedTime;
      case 3: return clientName.trim() && clientPhone.trim();
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addAppointment({
      clientName,
      clientPhone,
      barberId: selectedBarber.id,
      services: selectedServices,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      status: 'pending',
      totalPrice: totals.price,
      totalDuration: totals.duration
    });
    
    setIsSubmitting(false);
    setBookingComplete(true);
  };

  const resetBooking = () => {
    setCurrentStep(0);
    setSelectedServices([]);
    setSelectedBarber(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setClientPhone('');
    setBookingComplete(false);
  };

  const stepTitles = [
    'Selecciona tus Servicios',
    'Elige tu Barbero',
    'Fecha y Hora',
    'Confirmar Reserva'
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#121212]/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#C5A059] flex items-center justify-center">
              <Scissors className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="font-heading text-xl text-white">BARBERSHOP</h1>
              <p className="text-[#D4AF37] text-xs tracking-wider">Reservar Turno</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-white text-sm">{user?.name}</p>
              <p className="text-white/50 text-xs">Cliente</p>
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

      {/* Progress Bar */}
      {!bookingComplete && (
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((step, index) => (
              <div key={step} className="flex items-center">
                <div 
                  className={`w-8 h-8 flex items-center justify-center text-sm font-mono transition-colors ${
                    index <= currentStep 
                      ? 'bg-[#D4AF37] text-black' 
                      : 'bg-[#2A2A2A] text-white/40'
                  }`}
                >
                  {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                {index < STEPS.length - 1 && (
                  <div 
                    className={`w-12 sm:w-24 h-0.5 transition-colors ${
                      index < currentStep ? 'bg-[#D4AF37]' : 'bg-[#2A2A2A]'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <h2 className="font-heading text-2xl text-white text-center mt-6" data-testid="step-title">
            {stepTitles[currentStep]}
          </h2>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 pb-32">
        <AnimatePresence mode="wait">
          {bookingComplete ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-12"
              data-testid="booking-complete"
            >
              <div className="w-20 h-20 bg-[#D4AF37] flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-black" />
              </div>
              <h2 className="font-heading text-3xl text-white mb-2">¡Reserva Confirmada!</h2>
              <p className="text-white/60 mb-8">Tu cita ha sido registrada exitosamente</p>
              
              <div className="card-luxury p-6 max-w-sm mx-auto text-left mb-8">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/50">Fecha:</span>
                    <span className="text-white font-mono">
                      {format(selectedDate, "d 'de' MMMM", { locale: es })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Hora:</span>
                    <span className="text-white font-mono">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Barbero:</span>
                    <span className="text-white">{selectedBarber?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Total:</span>
                    <span className="text-[#D4AF37] font-mono text-lg">${totals.price}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={resetBooking}
                className="btn-outline-gold px-8 py-3"
                data-testid="new-booking-btn"
              >
                Nueva Reserva
              </button>
            </motion.div>
          ) : (
            <>
              {/* Step 0: Services */}
              {currentStep === 0 && (
                <motion.div
                  key="services"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  data-testid="services-grid"
                >
                  {services.map(service => (
                    <motion.div
                      key={service.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleService(service.id)}
                      className={`card-luxury overflow-hidden cursor-pointer transition-all ${
                        selectedServices.includes(service.id) 
                          ? 'border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
                          : ''
                      }`}
                      data-testid={`service-${service.id}`}
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img 
                          src={service.image} 
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent" />
                        {selectedServices.includes(service.id) && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-[#D4AF37] flex items-center justify-center">
                            <Check className="w-4 h-4 text-black" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-heading text-lg text-white">{service.name}</h3>
                        <p className="text-sm text-white/50 mb-3">{service.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[#D4AF37]">${service.price}</span>
                          <span className="text-xs text-white/40 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {service.duration} min
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Step 1: Barber Selection */}
              {currentStep === 1 && (
                <motion.div
                  key="barber"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  data-testid="barber-selection"
                >
                  {/* Random Option */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={selectRandomBarber}
                    className="card-luxury p-4 mb-6 cursor-pointer flex items-center gap-4 hover:border-[#D4AF37]/50"
                    data-testid="random-barber-btn"
                  >
                    <div className="w-16 h-16 bg-[#D4AF37]/20 flex items-center justify-center">
                      <Shuffle className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg text-white">Barbero Aleatorio</h3>
                      <p className="text-sm text-white/50">Mayor disponibilidad horaria</p>
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {barbers.map(barber => (
                      <motion.div
                        key={barber.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedBarber(barber)}
                        className={`card-luxury overflow-hidden cursor-pointer transition-all ${
                          selectedBarber?.id === barber.id 
                            ? 'border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
                            : ''
                        }`}
                        data-testid={`barber-${barber.id}`}
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={barber.image} 
                            alt={barber.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent" />
                          {selectedBarber?.id === barber.id && (
                            <div className="absolute top-3 right-3 w-6 h-6 bg-[#D4AF37] flex items-center justify-center">
                              <Check className="w-4 h-4 text-black" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-heading text-lg text-white">{barber.name}</h3>
                          <p className="text-sm text-[#D4AF37]">{barber.role}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-white/40">{barber.experience}</span>
                            <span className="text-xs text-white/20">•</span>
                            <span className="text-xs text-yellow-500">★ {barber.rating}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Date & Time */}
              {currentStep === 2 && (
                <motion.div
                  key="datetime"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid md:grid-cols-2 gap-6"
                  data-testid="datetime-selection"
                >
                  {/* Calendar */}
                  <div className="card-luxury p-4">
                    <h3 className="font-heading text-lg text-white mb-4">Selecciona Fecha</h3>
                    <div className="flex justify-center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setSelectedTime(null);
                        }}
                        locale={es}
                        disabled={(date) => isBefore(date, startOfDay(new Date())) || date > addDays(new Date(), 30)}
                        className="bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div className="card-luxury p-4">
                    <h3 className="font-heading text-lg text-white mb-4">
                      {selectedDate 
                        ? `Horarios - ${format(selectedDate, "d 'de' MMMM", { locale: es })}`
                        : 'Selecciona una fecha primero'
                      }
                    </h3>
                    {selectedDate && (
                      <div className="grid grid-cols-4 gap-2" data-testid="time-slots">
                        {availableSlots.length === 0 ? (
                          <p className="col-span-4 text-white/50 text-center py-8">
                            No hay horarios disponibles
                          </p>
                        ) : (
                          availableSlots.map(slot => (
                            <button
                              key={slot}
                              onClick={() => setSelectedTime(slot)}
                              className={`py-2 font-mono text-sm transition-all ${
                                selectedTime === slot
                                  ? 'bg-[#D4AF37] text-black'
                                  : 'bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]'
                              }`}
                              data-testid={`time-slot-${slot}`}
                            >
                              {slot}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-lg mx-auto"
                  data-testid="confirmation-step"
                >
                  <div className="card-luxury p-6 mb-6">
                    <h3 className="font-heading text-lg text-white mb-4 border-b border-white/10 pb-3">
                      Resumen de tu Cita
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Scissors className="w-5 h-5 text-[#D4AF37] mt-0.5" />
                        <div>
                          <p className="text-white/50 text-sm">Servicios</p>
                          <p className="text-white">
                            {selectedServices.map(id => 
                              services.find(s => s.id === id)?.name
                            ).join(', ')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-[#D4AF37] mt-0.5" />
                        <div>
                          <p className="text-white/50 text-sm">Barbero</p>
                          <p className="text-white">{selectedBarber?.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-[#D4AF37] mt-0.5" />
                        <div>
                          <p className="text-white/50 text-sm">Fecha y Hora</p>
                          <p className="text-white font-mono">
                            {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })} - {selectedTime}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-[#D4AF37] mt-0.5" />
                        <div>
                          <p className="text-white/50 text-sm">Total ({totals.duration} min)</p>
                          <p className="text-[#D4AF37] font-mono text-2xl">${totals.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-luxury p-6">
                    <h3 className="font-heading text-lg text-white mb-4">Tus Datos</h3>
                    
                    <div className="space-y-4">
                      <div className="relative">
                        <User className="absolute left-0 top-3 w-5 h-5 text-white/40" />
                        <input
                          type="text"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="Tu nombre completo"
                          className="input-gold w-full pl-8"
                          data-testid="client-name-input"
                        />
                      </div>
                      
                      <div className="relative">
                        <Phone className="absolute left-0 top-3 w-5 h-5 text-white/40" />
                        <input
                          type="tel"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="Tu teléfono"
                          className="input-gold w-full pl-8"
                          data-testid="client-phone-input"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      {!bookingComplete && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#121212]/95 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              {selectedServices.length > 0 && (
                <div className="text-sm">
                  <span className="text-white/50">Total: </span>
                  <span className="text-[#D4AF37] font-mono text-lg">${totals.price}</span>
                  <span className="text-white/30 ml-2">({totals.duration} min)</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="btn-outline-gold px-4 py-2 flex items-center gap-2"
                  data-testid="back-btn"
                >
                  <ArrowLeft className="w-4 h-4" /> Atrás
                </button>
              )}
              
              {currentStep < STEPS.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="btn-gold px-6 py-2 flex items-center gap-2 disabled:opacity-50"
                  data-testid="next-btn"
                >
                  Siguiente <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                  className="btn-gold px-6 py-2 flex items-center gap-2 disabled:opacity-50"
                  data-testid="submit-btn"
                >
                  {isSubmitting ? 'Reservando...' : 'Confirmar Reserva'}
                  {!isSubmitting && <Check className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientBooking;
