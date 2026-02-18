import React, { useState, useEffect } from 'react';
import { Vehicle, RiskLevel, Ticket } from '../../types';
import { ArrowLeft, CheckCircle, AlertTriangle, AlertOctagon, FileText, User as UserIcon, Calendar, Car } from 'lucide-react';
import { db } from '../../services/db';
import { TicketModal } from './TicketModal';

interface VehicleReportProps {
  vehicle: Vehicle;
  onBack: () => void;
}

export const VehicleReport: React.FC<VehicleReportProps> = ({ vehicle, onBack }) => {
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [history, setHistory] = useState<Ticket[]>([]);

  useEffect(() => {
    db.getVehicleTickets(vehicle.number_plate).then(setHistory);
  }, [vehicle]);

  const getDaysRemaining = (dateStr: string) => {
    const today = new Date();
    const target = new Date(dateStr);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Logic to determine Status
  let status: RiskLevel = 'GREEN';
  const issues: string[] = [];

  if (vehicle.stolen_status || vehicle.driver?.wanted_status) status = 'RED';
  if (vehicle.driver?.license_status !== 'active') {
    status = 'RED';
    issues.push(`Driver License: ${vehicle.driver?.license_status}`);
  }

  const insDays = getDaysRemaining(vehicle.insurance_expiry_date);
  const revDays = getDaysRemaining(vehicle.revenue_license_expiry);

  if (insDays < 0) { status = 'RED'; issues.push('Insurance Expired'); }
  else if (insDays < 30 && status !== 'RED') { status = 'AMBER'; issues.push('Insurance Expiring Soon'); }

  if (revDays < 0) { status = 'RED'; issues.push('Revenue License Expired'); }
  else if (revDays < 30 && status !== 'RED') { status = 'AMBER'; issues.push('Revenue License Expiring Soon'); }

  const StatusBanner = () => {
    if (status === 'RED') {
      return (
        <div className="bg-red-600 text-white p-4 animate-pulse">
          <div className="flex items-center justify-center space-x-2 text-xl font-bold">
            <AlertOctagon /> <span>STOP IMMEDIATELY</span>
          </div>
          <p className="text-center text-red-100 text-sm mt-1">
            {vehicle.stolen_status ? 'VEHICLE REPORTED STOLEN' : 'CRITICAL VIOLATIONS FOUND'}
          </p>
        </div>
      );
    }
    if (status === 'AMBER') {
      return (
        <div className="bg-orange-500 text-white p-4">
          <div className="flex items-center justify-center space-x-2 text-xl font-bold">
            <AlertTriangle /> <span>WARNING</span>
          </div>
          <p className="text-center text-orange-100 text-sm mt-1">Documents Expiring / Minor Issues</p>
        </div>
      );
    }
    return (
      <div className="bg-green-600 text-white p-4">
        <div className="flex items-center justify-center space-x-2 text-xl font-bold">
          <CheckCircle /> <span>ALL CLEAR</span>
        </div>
        <p className="text-center text-green-100 text-sm mt-1">No active violations found</p>
      </div>
    );
  };

  const DocCard = ({ title, date, days }: { title: string, date: string, days: number }) => {
    let color = 'bg-green-100 text-green-800 border-green-200';
    if (days < 0) color = 'bg-red-100 text-red-800 border-red-200';
    else if (days < 30) color = 'bg-orange-100 text-orange-800 border-orange-200';

    return (
      <div className={`p-3 rounded-lg border ${color} text-sm`}>
        <div className="flex justify-between items-center mb-1">
          <span className="font-semibold">{title}</span>
          {days < 0 && <span className="text-xs font-bold px-1.5 py-0.5 bg-red-200 rounded">EXPIRED</span>}
        </div>
        <div className="flex justify-between items-end">
          <span className="text-xs opacity-75">{date}</span>
          <span className="font-bold">{days} days</span>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-20">
      <button onClick={onBack} className="flex items-center text-gray-500 mb-4 hover:text-police-900">
        <ArrowLeft size={20} className="mr-1" /> Back to Search
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <StatusBanner />
        
        {/* Main Info */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-mono font-bold text-police-900">{vehicle.number_plate}</h1>
              <p className="text-gray-500 font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
              <div className="flex items-center mt-2 space-x-2">
                <span className="px-2 py-1 bg-gray-200 rounded text-xs font-bold text-gray-700">{vehicle.color}</span>
                <span className="px-2 py-1 bg-gray-200 rounded text-xs font-bold text-gray-700">{vehicle.permit_type.toUpperCase()}</span>
              </div>
            </div>
            <div className="bg-gray-100 p-2 rounded-lg">
                <Car size={40} className="text-gray-400"/>
            </div>
          </div>

          {/* Owner Info */}
          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center">
              <UserIcon size={14} className="mr-1" /> Registered Owner / Driver
            </h3>
            {vehicle.driver ? (
              <div className="flex items-start">
                 <img src={vehicle.driver.photo_url} alt="Driver" className="w-16 h-16 rounded object-cover mr-4 border border-gray-300" />
                 <div>
                    <p className="font-bold text-gray-900">{vehicle.driver.full_name}</p>
                    <p className="text-sm text-gray-600">NIC: {vehicle.driver.nic}</p>
                    <p className="text-xs text-gray-500 mt-1">{vehicle.driver.address}</p>
                    {vehicle.driver.license_status !== 'active' && (
                        <p className="text-xs font-bold text-red-600 mt-1 uppercase">License {vehicle.driver.license_status}</p>
                    )}
                 </div>
              </div>
            ) : (
                <p className="text-red-500 text-sm">Owner details not found.</p>
            )}
          </div>

          {/* Documents Grid */}
          <h3 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center">
             <Calendar size={14} className="mr-1" /> Documents Validity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <DocCard title="Revenue License" date={vehicle.revenue_license_expiry} days={getDaysRemaining(vehicle.revenue_license_expiry)} />
            <DocCard title="Insurance" date={vehicle.insurance_expiry_date} days={getDaysRemaining(vehicle.insurance_expiry_date)} />
            <DocCard title="Registration" date={vehicle.registration_expiry_date} days={getDaysRemaining(vehicle.registration_expiry_date)} />
            <DocCard title="Emission Test" date={vehicle.emission_test_expiry} days={getDaysRemaining(vehicle.emission_test_expiry)} />
          </div>

          {/* Ticket History */}
          <div className="border-t pt-4">
             <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Previous Offenses ({history.length})</h3>
             {history.length === 0 ? (
                 <p className="text-sm text-gray-400 italic">No history recorded.</p>
             ) : (
                 <div className="space-y-2">
                     {history.slice(0, 3).map(t => (
                         <div key={t.ticket_id} className="text-sm flex justify-between p-2 bg-gray-50 rounded">
                             <span>{t.offense_details?.description || t.offense_code}</span>
                             <span className={`text-xs font-bold px-2 py-0.5 rounded ${t.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                 {t.status.toUpperCase()}
                             </span>
                         </div>
                     ))}
                 </div>
             )}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg flex space-x-3 z-40 max-w-4xl mx-auto">
        <button 
            onClick={() => setShowTicketModal(true)}
            className="flex-1 bg-police-900 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-police-800 flex items-center justify-center"
        >
            <FileText className="mr-2" size={20} /> Issue Ticket
        </button>
        <button className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-red-700 flex items-center justify-center">
             Alert HQ
        </button>
      </div>

      {showTicketModal && (
        <TicketModal 
            vehicle={vehicle} 
            onClose={() => setShowTicketModal(false)}
        />
      )}
    </div>
  );
};