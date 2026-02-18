import React, { useEffect, useState } from 'react';
import { db } from '../../services/db';
import { Vehicle } from '../../types';
import { Plus, Search, Edit2, AlertTriangle, CheckCircle, Car } from 'lucide-react';
import { VehicleFormModal } from './VehicleFormModal';

export const VehicleManagement: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const fetchVehicles = async () => {
    setLoading(true);
    const data = await db.getAllVehicles();
    setVehicles(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSave = async (vehicle: Vehicle) => {
    await db.upsertVehicle(vehicle);
    setIsModalOpen(false);
    fetchVehicles(); // Refresh list
  };

  const openAddModal = () => {
    setEditingVehicle(null);
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  const filteredVehicles = vehicles.filter(v => 
    v.number_plate.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.owner_nic.includes(searchTerm) ||
    v.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (v: Vehicle) => {
    if (v.stolen_status) {
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertTriangle size={12} className="mr-1"/> Stolen</span>;
    }
    const today = new Date();
    const revExp = new Date(v.revenue_license_expiry);
    if (revExp < today) {
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Expired Docs</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle size={12} className="mr-1"/> Active</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Vehicle Registry</h1>
            <p className="text-sm text-gray-500">Manage fleet database and ownership records</p>
        </div>
        <button 
            onClick={openAddModal}
            className="bg-police-900 text-white px-4 py-2 rounded-lg flex items-center hover:bg-police-800 transition shadow-sm"
        >
            <Plus size={20} className="mr-2" /> Add Vehicle
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Search by Plate, NIC, or Model..." 
                className="pl-10 w-full border-gray-300 rounded-lg focus:ring-police-900 focus:border-police-900 p-2 border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="text-sm text-gray-500">
            Showing {filteredVehicles.length} of {vehicles.length} vehicles
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                        <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">Loading database...</td></tr>
                    ) : filteredVehicles.length === 0 ? (
                        <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">No vehicles found matching your search.</td></tr>
                    ) : (
                        filteredVehicles.map((vehicle) => (
                            <tr key={vehicle.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                            <Car size={20} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-bold text-gray-900">{vehicle.number_plate}</div>
                                            <div className="text-xs text-gray-500">ID: #{vehicle.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{vehicle.make} {vehicle.model}</div>
                                    <div className="text-xs text-gray-500">{vehicle.year} • {vehicle.color}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{vehicle.driver?.full_name || 'Unknown'}</div>
                                    <div className="text-xs text-gray-500">NIC: {vehicle.owner_nic}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(vehicle)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => openEditModal(vehicle)}
                                        className="text-police-700 hover:text-police-900 bg-police-50 px-3 py-1 rounded-md"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {isModalOpen && (
        <VehicleFormModal 
            vehicle={editingVehicle} 
            onClose={() => setIsModalOpen(false)} 
            onSave={handleSave} 
        />
      )}
    </div>
  );
};