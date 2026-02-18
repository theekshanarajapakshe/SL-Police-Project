import React, { useState } from 'react';
import { Shield, Lock, BadgeAlert } from 'lucide-react';
import { db } from '../services/db';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [badge, setBadge] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await db.login(badge, password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid Badge ID or Password');
      }
    } catch (err) {
      setError('System Error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-police-900 p-8 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-police-800 rounded-full mb-4 shadow-inner">
          <Shield className="h-12 w-12 text-police-yellow" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-wide">POLICE FIELD OPS</h2>
        <p className="text-police-yellow text-sm mt-1 uppercase tracking-wider font-semibold">Sri Lanka Police</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center gap-2">
            <BadgeAlert size={16} /> {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Police Badge ID</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Shield size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              required
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-police-900 focus:border-police-900 sm:text-sm p-2.5 border"
              placeholder="e.g. COP001"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-gray-400" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-police-900 focus:border-police-900 sm:text-sm p-2.5 border"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-police-900 bg-police-yellow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Secure Login'}
        </button>

        <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
                Demo Credentials:<br/>
                Officer: COP001 / password<br/>
                Admin: ADMIN01 / admin
            </p>
        </div>
      </form>
    </div>
  );
};