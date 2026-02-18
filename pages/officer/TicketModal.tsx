import React, { useState, useEffect } from 'react';
import { Vehicle, Offense } from '../../types';
import { db } from '../../services/db';
import { X, Check } from 'lucide-react';

interface TicketModalProps {
  vehicle: Vehicle;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ vehicle, onClose }) => {
  const [offenses, setOffenses] = useState<Offense[]>([]);
  const [selectedOffense, setSelectedOffense] = useState<string>('');
  const [location, setLocation] = useState('Galle Road, Colombo 3');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    db.getOffenses().then(setOffenses);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffense) return;
    setIsSubmitting(true);

    try {
      await db.issueTicket({
        offense_code: selectedOffense,
        vehicle_plate: vehicle.number_plate,
        officer_id: 'COP001', // Hardcoded for session
        nic_of_driver: vehicle.owner_nic,
        ticket_date: new Date().toISOString().split('T')[0],
        location: location,
        status: 'issued',
        notes: notes
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (e) {
      alert('Failed to issue ticket');
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white rounded-lg p-8 text-center max-w-sm w-full animate-bounce-in">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Ticket Issued Successfully</h3>
          <p className="text-sm text-gray-500 mt-2">SMS notification sent to driver.</p>
        </div>
      </div>
    );
  }

  const selectedOffenseDetails = offenses.find(o => o.offense_code === selectedOffense);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-50 sm:p-4">
      <div className="bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full max-w-lg overflow-hidden h-[90vh] sm:h-auto flex flex-col">
        <div className="bg-police-900 px-4 py-3 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Issue e-Ticket</h3>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <p className="text-sm text-gray-500">Vehicle</p>
            <p className="font-bold text-gray-900">{vehicle.number_plate}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Offense Type</label>
            <select 
                required
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-police-900 focus:border-police-900 p-2 border"
                value={selectedOffense}
                onChange={(e) => setSelectedOffense(e.target.value)}
            >
                <option value="">Select Offense...</option>
                {offenses.map(o => (
                    <option key={o.offense_code} value={o.offense_code}>
                        [{o.offense_code}] {o.description}
                    </option>
                ))}
            </select>
          </div>

          {selectedOffenseDetails && (
              <div className="bg-red-50 p-3 rounded text-sm text-red-800 border border-red-100">
                  <div className="flex justify-between">
                    <span>Fine Amount:</span>
                    <span className="font-bold">LKR {selectedOffenseDetails.fine_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Penalty Points:</span>
                    <span className="font-bold">{selectedOffenseDetails.penalty_points}</span>
                  </div>
              </div>
          )}

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
             <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2 border"
             />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Officer Notes</label>
             <textarea 
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                placeholder="Details of the incident..."
             />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-police-yellow text-police-900 font-bold py-3 rounded-lg hover:bg-yellow-400 mt-4"
          >
            {isSubmitting ? 'Processing...' : 'CONFIRM & PRINT TICKET'}
          </button>
        </form>
      </div>
    </div>
  );
};