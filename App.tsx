import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { OfficerDashboard } from './pages/officer/OfficerDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { VehicleManagement } from './pages/admin/VehicleManagement';
import { Layout } from './components/Layout';
import { User, UserRole } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Protected Route Wrapper
  const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactElement, allowedRoles: UserRole[] }) => {
    if (!user) return <Navigate to="/" replace />;
    if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <HashRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={
            !user ? <Login onLogin={handleLogin} /> : 
            user.role === UserRole.OFFICER ? <Navigate to="/officer" /> : 
            <Navigate to="/admin" />
          } />

          <Route path="/officer" element={
            <ProtectedRoute allowedRoles={[UserRole.OFFICER]}>
              <OfficerDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/vehicles" element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
              <VehicleManagement />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;