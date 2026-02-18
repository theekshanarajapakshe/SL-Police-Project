import React, { useState, useEffect } from 'react';
import { X, Save, Car } from 'lucide-react';
import { Vehicle } from '../../types';

interface VehicleFormModalProps {
  vehicle?: Vehicle | null;
  onClose: () => void;
  onSave: (vehicle: Vehicle) => void;
}

const emptyVehicle: Vehicle = {
  id: 0,
  number_plate: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  color: '',
  owner_nic: '',
  permit_type: 'private',
  registered_date: new Date().toISOString().split('T')[0],
  registration_expiry_date: '',
  insurance_provider: '',
  insurance_expiry_date: '',
  revenue_license_expiry: '',
  emission_test_expiry: '',
  stolen_status: false
};

export const VehicleFormModal: React.FC<VehicleFormModalProps> = ({ vehicle, onClose, onSave }) => {
  const [formData, setFormData] = useState<Vehicle>(emptyVehicle);

  useEffect(() => {
    if (vehicle) {
      setFormData(vehicle);
    } else {
      setFormData(emptyVehicle);
    }
  }, [vehicle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="bg-police-900 px-6 py-4 flex justify-between items-center text-white shrink-0">
          <h2 className="text-xl font-bold flex items-center">
            <Car className="mr-2" size={24} /> 
            {vehicle ? 'Edit Vehicle' : 'Register New Vehicle'}
          </h2>
          <button onClick={onClose} className="hover:text-gray-300"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Identity */}
            <div className="col-span-2">
              <h3 className="text-sm font-bold text-gray-500 uppercase border-b pb-1 mb-3">Vehicle Identity</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Number Plate</label>
              <input type="text" name="number_plate" required value={formData.number_plate} onChange={handleChange} 
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 uppercase" placeholder="e.g. WP-CAB-1234" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Owner NIC</label>
              <input type="text" name="owner_nic" required value={formData.owner_nic} onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 uppercase" placeholder="e.g. 851234567V" />
            </div>

            {/* Specs */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Make</label>
              <input type="text" name="make" required value={formData.make} onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="e.g. Toyota" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Model</label>
              <input type="text" name="model" required value={formData.model} onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="e.g. Corolla" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <input type="number" name="year" required value={formData.year} onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Color</label>
              <input type="text" name="color" required value={formData.color} onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="e.g. White" />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700">Permit Type</label>
                <select name="permit_type" value={formData.permit_type} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                    <option value="private">Private</option>
                    <option value="commercial">Commercial</option>
                    <option value="three-wheeler">Three-Wheeler</option>
                    <option value="diplomatic">Diplomatic</option>
                </select>
            </div>

            {/* Dates */}
             <div className="col-span-2">
              <h3 className="text-sm font-bold text-gray-500 uppercase border-b pb-1 mb-3 mt-4">Validations & Status</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Insurance Provider</label>
              <input type="text" name="insurance_provider" value={formData.insurance_provider} onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Insurance Expiry</label>
              <input type="date" name="insurance_expiry_date" required value={formData.insurance_expiry_date} onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Revenue License Expiry</label>
              <input type="date" name="revenue_license_expiry" required value={formData.revenue_license_expiry} onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Emission Test Expiry</label>
              <input type="date" name="emission_test_expiry" required value={formData.emission_test_expiry} onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>

             <div className="col-span-2 bg-red-50 p-4 rounded-lg border border-red-200 mt-2">
                <div className="flex items-center">
                    <input 
                        id="stolen_status"
                        name="stolen_status" 
                        type="checkbox" 
                        checked={formData.stolen_status} 
                        onChange={handleChange}
                        className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded" 
                    />
                    <label htmlFor="stolen_status" className="ml-2 block text-md font-bold text-red-700">
                        Mark as STOLEN / WANTED
                    </label>
                </div>
                <p className="text-xs text-red-500 mt-1 ml-7">Checking this will trigger instant alerts for officers in the field.</p>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-police-900 text-white rounded-md hover:bg-police-800 flex items-center">
                <Save size={18} className="mr-2" /> Save Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};