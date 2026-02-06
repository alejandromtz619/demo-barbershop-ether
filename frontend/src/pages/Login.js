import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { DEMO_USERS } from '../data/mockData';
import { Lock, User, Scissors, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = Object.values(DEMO_USERS).find(
      u => u.username === username && u.password === password
    );

    if (user) {
      login(user);
      navigate(user.role === 'manager' ? '/manager' : '/booking');
    } else {
      setError('Credenciales incorrectas');
    }
    setIsLoading(false);
  };

  const quickLogin = (role) => {
    const user = DEMO_USERS[role];
    setUsername(user.username);
    setPassword(user.password);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-[60%] relative overflow-hidden"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1588349297539-6915a426001e?crop=entropy&cs=srgb&fm=jpg&q=85)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0A0A0A]" />
        <div className="absolute inset-0 bg-[#D4AF37]/10" />
        
        {/* Logo Overlay */}
        <div className="absolute top-8 left-8 z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-none bg-gradient-to-br from-[#D4AF37] to-[#C5A059] flex items-center justify-center">
              <Scissors className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="font-heading text-2xl text-white tracking-wider">BARBERSHOP</h1>
              <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase">Demo</p>
            </div>
          </div>
        </div>

        {/* Credentials Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="absolute bottom-8 left-8 glass p-6 max-w-sm"
        >
          <h3 className="font-heading text-lg text-[#D4AF37] mb-4">Credenciales Demo</h3>
          <div className="space-y-3">
            <div 
              onClick={() => quickLogin('manager')}
              className="flex items-center justify-between p-3 bg-black/30 cursor-pointer hover:bg-black/50 transition-colors group"
              data-testid="quick-login-manager"
            >
              <div>
                <p className="text-sm text-white/60">Gestor</p>
                <p className="font-mono text-sm text-white">gestor / demo123</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div 
              onClick={() => quickLogin('client')}
              className="flex items-center justify-between p-3 bg-black/30 cursor-pointer hover:bg-black/50 transition-colors group"
              data-testid="quick-login-client"
            >
              <div>
                <p className="text-sm text-white/60">Cliente</p>
                <p className="font-mono text-sm text-white">cliente / demo123</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Side - Form */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-[40%] flex items-center justify-center p-8 bg-[#0A0A0A]"
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-none bg-gradient-to-br from-[#D4AF37] to-[#C5A059] flex items-center justify-center">
              <Scissors className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="font-heading text-2xl text-white tracking-wider">BARBERSHOP</h1>
              <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase">Demo</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className="font-heading text-4xl text-white mb-2">Bienvenido</h2>
            <p className="text-white/50 mb-8">Ingresa tus credenciales para continuar</p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <User className="absolute left-0 top-3 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Usuario"
                  className="input-gold w-full pl-8"
                  data-testid="login-username"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-0 top-3 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="input-gold w-full pl-8"
                  data-testid="login-password"
                />
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-gold w-full py-4 disabled:opacity-50"
                data-testid="login-submit"
              >
                {isLoading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>

            {/* Mobile Credentials */}
            <div className="lg:hidden mt-8 p-4 glass">
              <h3 className="font-heading text-sm text-[#D4AF37] mb-3">Credenciales Demo</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => quickLogin('manager')}
                  className="p-2 bg-black/30 text-left"
                  data-testid="mobile-quick-login-manager"
                >
                  <p className="text-xs text-white/60">Gestor</p>
                  <p className="font-mono text-xs text-white">gestor</p>
                </button>
                <button
                  onClick={() => quickLogin('client')}
                  className="p-2 bg-black/30 text-left"
                  data-testid="mobile-quick-login-client"
                >
                  <p className="text-xs text-white/60">Cliente</p>
                  <p className="font-mono text-xs text-white">cliente</p>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
