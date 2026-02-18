import React, { useEffect, useState } from 'react';
import { db } from '../../services/db';
import { Users, Car, FileText, TrendingUp } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalDrivers: 0,
    ticketsIssued: 0,
    revenue: 0
  });

  useEffect(() => {
    db.getStats().then(setStats);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Command Center Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Registered Vehicles" value={stats.totalVehicles} icon={Car} color="bg-blue-500" />
        <StatCard title="Total Drivers" value={stats.totalDrivers} icon={Users} color="bg-indigo-500" />
        <StatCard title="Tickets Issued" value={stats.ticketsIssued} icon={FileText} color="bg-orange-500" />
        <StatCard title="Revenue (LKR)" value={`Rs ${stats.revenue}`} icon={TrendingUp} color="bg-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-gray-800 mb-4">Recent System Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 text-sm">
                <div className="w-2 h-2 mt-1.5 bg-green-500 rounded-full"></div>
                <div>
                    <p className="font-medium">Officer COP001 logged in</p>
                    <p className="text-gray-500 text-xs">2 minutes ago</p>
                </div>
            </div>
             <div className="flex items-start space-x-3 text-sm">
                <div className="w-2 h-2 mt-1.5 bg-red-500 rounded-full"></div>
                <div>
                    <p className="font-medium">Ticket Issued #1002 (Speeding)</p>
                    <p className="text-gray-500 text-xs">15 minutes ago</p>
                </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                    <span className="block font-bold text-police-900">Add Vehicle</span>
                </button>
                 <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                    <span className="block font-bold text-police-900">Blacklist Alert</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};