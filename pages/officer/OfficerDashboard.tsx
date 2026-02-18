import React, { useState } from 'react';
import { Search, AlertTriangle, Clock, ChevronRight } from 'lucide-react';
import { VehicleReport } from './VehicleReport';
import { Vehicle } from '../../types';
import { db } from '../../services/db';

export const OfficerDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState<Vehicle | null>(null);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setSearchLoading(true);
    setError('');
    setVehicleData(null);
    setHasSearched(true);

    try {
      const data = await db.searchVehicle(searchTerm);
      if (data) {
        setVehicleData(data);
      } else {
        setError('No vehicle found with this number plate.');
      }
    } catch (err) {
      setError('Connection failed.');
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setVehicleData(null);
    setHasSearched(false);
  };

  if (vehicleData) {
    return <VehicleReport vehicle={vehicleData} onBack={clearSearch} />;
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      {/* Search Card */}
      <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-police-yellow">
        <h2 className="text-xl font-bold text-police-900 mb-4 flex items-center">
          <Search className="mr-2 text-police-yellow" />
          Field Search
        </h2>
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Vehicle Plate Number</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
              placeholder="e.g. WP-CAB-1234"
              className="block w-full text-2xl font-mono uppercase p-3 border-2 border-gray-300 rounded-lg focus:border-police-yellow focus:ring-police-yellow"
            />
            <p className="text-xs text-gray-400 mt-1">Supports: WP-CAB-1234, 19-1234, CD-123</p>
          </div>
          <button
            type="submit"
            disabled={searchLoading}
            className="w-full bg-police-900 text-white font-bold py-3 rounded-lg shadow hover:bg-police-800 transition flex justify-center items-center"
          >
            {searchLoading ? 'Searching Database...' : 'SEARCH DATABASE'}
          </button>
        </form>
        
        {hasSearched && error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg text-center font-semibold">
                {error}
            </div>
        )}
      </div>

      {/* Hotlist Ticker */}
      <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden">
        <div className="bg-red-600 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center text-white font-bold text-sm">
            <AlertTriangle size={16} className="mr-2" />
            CRITICAL HOTLIST
          </div>
          <span className="animate-pulse h-2 w-2 rounded-full bg-white"></span>
        </div>
        <div className="divide-y divide-red-100">
          <div className="p-3 flex justify-between items-center hover:bg-red-100 cursor-pointer">
            <div>
              <p className="font-bold text-red-900">WP-KX-9999</p>
              <p className="text-xs text-red-700">Honda Fit - Stolen (Colombo)</p>
            </div>
            <ChevronRight size={16} className="text-red-400" />
          </div>
          <div className="p-3 flex justify-between items-center hover:bg-red-100 cursor-pointer">
            <div>
              <p className="font-bold text-red-900">NW-BC-4512</p>
              <p className="text-xs text-red-700">Robbery Suspect</p>
            </div>
            <ChevronRight size={16} className="text-red-400" />
          </div>
        </div>
      </div>

      {/* Recent History */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3 flex items-center">
            <Clock size={12} className="mr-1" /> Recent Checks
        </h3>
        <div className="space-y-2">
            <div className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                <span className="font-mono text-gray-800">WP-CAB-1234</span>
                <span className="text-green-600 font-semibold text-xs">CLEARED</span>
            </div>
             <div className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                <span className="font-mono text-gray-800">SP-HAA-4567</span>
                <span className="text-orange-600 font-semibold text-xs">WARNING</span>
            </div>
        </div>
      </div>
    </div>
  );
};