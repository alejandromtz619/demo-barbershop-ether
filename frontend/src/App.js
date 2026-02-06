import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import Login from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";
import ClientBooking from "./pages/ClientBooking";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useApp();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'manager' ? '/manager' : '/booking'} replace />;
  }
  
  return children;
};

// App Routes wrapped with context check
const AppRoutes = () => {
  const { user } = useApp();
  
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          user ? (
            <Navigate to={user.role === 'manager' ? '/manager' : '/booking'} replace />
          ) : (
            <Login />
          )
        } 
      />
      <Route 
        path="/manager" 
        element={
          <ProtectedRoute allowedRole="manager">
            <ManagerDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/booking" 
        element={
          <ProtectedRoute allowedRole="client">
            <ClientBooking />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <div className="App">
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </div>
  );
}

export default App;
