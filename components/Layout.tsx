import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, LogOut, Menu, Car, Users, LayoutDashboard, FileText } from 'lucide-react';
import { User, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  if (!user) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">{children}</div>;
  }

  const isOfficer = user.role === UserRole.OFFICER;
  const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;

  const isActive = (path: string) => location.pathname === path ? 'text-police-yellow bg-police-800' : 'text-slate-300 hover:text-white hover:bg-police-700';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-police-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <Shield className="h-8 w-8 text-police-yellow" />
            <div>
              <h1 className="font-bold text-lg leading-none">SL POLICE</h1>
              <span className="text-xs text-slate-400 tracking-wider">TRAFFIC OPS</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1">
            {isOfficer && (
              <button onClick={() => navigate('/officer')} className={`px-4 py-2 rounded-md flex items-center space-x-2 transition ${isActive('/officer')}`}>
                <Car size={18} /> <span>Field Ops</span>
              </button>
            )}
            {isAdmin && (
              <>
                <button onClick={() => navigate('/admin')} className={`px-4 py-2 rounded-md flex items-center space-x-2 transition ${isActive('/admin')}`}>
                  <LayoutDashboard size={18} /> <span>Dashboard</span>
                </button>
                <button onClick={() => navigate('/admin/vehicles')} className={`px-4 py-2 rounded-md flex items-center space-x-2 transition ${isActive('/admin/vehicles')}`}>
                  <Car size={18} /> <span>Vehicles</span>
                </button>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold">{user.full_name}</p>
              <p className="text-xs text-police-yellow">{user.rank} | {user.police_id}</p>
            </div>
            <button onClick={onLogout} className="p-2 hover:bg-police-800 rounded-full text-slate-300 hover:text-white" title="Logout">
              <LogOut size={20} />
            </button>
            <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-police-800 p-4 space-y-2 border-t border-police-700">
            {isOfficer && (
              <button onClick={() => { navigate('/officer'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded text-white hover:bg-police-700">
                Field Operations
              </button>
            )}
            {isAdmin && (
              <button onClick={() => { navigate('/admin'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded text-white hover:bg-police-700">
                Admin Dashboard
              </button>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};