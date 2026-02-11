// Mock Data for BarberShop Demo

export const BARBERS = [
  {
    id: 'barber-1',
    name: 'Enzo Rodríguez',
    role: 'Barbero Master',
    image: 'https://images.unsplash.com/photo-1703792684940-a05aa0f1188f?crop=entropy&cs=srgb&fm=jpg&q=85&w=400',
    specialties: ['Corte', 'Barba'],
    rating: 4.9,
    experience: '15 años'
  },
  {
    id: 'barber-2',
    name: 'Marco Velázquez',
    role: 'Estilista Senior',
    image: 'https://images.unsplash.com/photo-1741345980697-f3c43eba44a0?crop=entropy&cs=srgb&fm=jpg&q=85&w=400',
    specialties: ['Corte', 'Lavado'],
    rating: 4.8,
    experience: '10 años'
  },
  {
    id: 'barber-3',
    name: 'Javier Ortiz',
    role: 'Especialista en Barba',
    image: 'https://images.unsplash.com/photo-1599011176306-4a96f1516d4d?crop=entropy&cs=srgb&fm=jpg&q=85&w=400',
    specialties: ['Barba', 'Cejas'],
    rating: 4.9,
    experience: '8 años'
  },
  {
    id: 'barber-4',
    name: 'Dante Paredes',
    role: 'Colorista',
    image: 'https://images.unsplash.com/photo-1659355751282-5ca7807af9e9?crop=entropy&cs=srgb&fm=jpg&q=85&w=400',
    specialties: ['Corte', 'Lavado', 'Cejas'],
    rating: 4.7,
    experience: '12 años'
  },
  {
    id: 'barber-5',
    name: 'Silas Benítez',
    role: 'Barbero Junior',
    image: 'https://images.unsplash.com/photo-1544215897-e4a5eeae9cc1?crop=entropy&cs=srgb&fm=jpg&q=85&w=400',
    specialties: ['Corte', 'Nariz'],
    rating: 4.6,
    experience: '3 años'
  }
];

export const SERVICES = [
  {
    id: 'service-haircut',
    name: 'Corte',
    description: 'Corte clásico o moderno a tu medida',
    price: 40000,
    duration: 30,
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?crop=entropy&cs=srgb&fm=jpg&q=85&w=400',
    icon: 'Scissors'
  },
  {
    id: 'service-wash',
    name: 'Lavado',
    description: 'Lavado premium con masaje capilar',
    price: 25000,
    duration: 20,
    image: 'https://images.unsplash.com/photo-1593702233354-259d1f794ed1?crop=entropy&cs=srgb&fm=jpg&q=85&w=400',
    icon: 'Droplets'
  },
  {
    id: 'service-beard',
    name: 'Barba',
    description: 'Perfilado y arreglo de barba profesional',
    price: 35000,
    duration: 25,
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?crop=entropy&cs=srgb&fm=jpg&q=85&w=400',
    icon: 'Sparkles'
  },
  {
    id: 'service-eyebrows',
    name: 'Cejas',
    description: 'Diseño y depilación de cejas',
    price: 18000,
    duration: 15,
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?crop=entropy&cs=srgb&fm=jpg&q=85&w=400',
    icon: 'Eye'
  },
  {
    id: 'service-nose',
    name: 'Nariz',
    description: 'Depilación de vello nasal con cera',
    price: 15000,
    duration: 10,
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?crop=entropy&cs=srgb&fm=jpg&q=85&w=400',
    icon: 'Wind'
  }
];

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
];

export const DEMO_USERS = {
  manager: {
    username: 'gestor',
    password: 'demo123',
    name: 'Carlos Manager',
    role: 'manager'
  },
  client: {
    username: 'cliente',
    password: 'demo123',
    name: 'Juan Cliente',
    role: 'client'
  }
};

// Initial demo appointments
export const INITIAL_APPOINTMENTS = [
  {
    id: 'apt-1',
    clientName: 'Miguel Torres',
    clientPhone: '+34 612 345 678',
    barberId: 'barber-1',
    services: ['service-haircut', 'service-beard'],
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    status: 'confirmed',
    totalPrice: 75000,
    totalDuration: 55,
    createdAt: new Date().toISOString()
  },
  {
    id: 'apt-2',
    clientName: 'Pedro Sánchez',
    clientPhone: '+34 623 456 789',
    barberId: 'barber-2',
    services: ['service-haircut'],
    date: new Date().toISOString().split('T')[0],
    time: '11:30',
    status: 'pending',
    totalPrice: 40000,
    totalDuration: 30,
    createdAt: new Date().toISOString()
  },
  {
    id: 'apt-3',
    clientName: 'Antonio García',
    clientPhone: '+34 634 567 890',
    barberId: 'barber-3',
    services: ['service-beard', 'service-eyebrows'],
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    status: 'completed',
    totalPrice: 53000,
    totalDuration: 40,
    createdAt: new Date().toISOString()
  },
  {
    id: 'apt-4',
    clientName: 'Luis Martínez',
    clientPhone: '+34 645 678 901',
    barberId: 'barber-4',
    services: ['service-haircut', 'service-wash'],
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '09:30',
    status: 'pending',
    totalPrice: 65000,
    totalDuration: 50,
    createdAt: new Date().toISOString()
  },
  {
    id: 'apt-5',
    clientName: 'Roberto Díaz',
    clientPhone: '+34 656 789 012',
    barberId: 'barber-5',
    services: ['service-haircut', 'service-nose'],
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '16:00',
    status: 'confirmed',
    totalPrice: 55000,
    totalDuration: 40,
    createdAt: new Date().toISOString()
  }
];

export const STATUS_LABELS = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  completed: 'Completado',
  cancelled: 'Cancelado'
};
