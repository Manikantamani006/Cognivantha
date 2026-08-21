import React, { useState } from 'react';
import type { ViewState } from './types';
import { ShieldCheck, UserCircle, Building2, LogIn } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: ViewState) => void;
  onLogin: (view: ViewState, username: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [publicName, setPublicName] = useState('');
  const [publicPassword, setPublicPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  const handlePublicLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (publicName && publicPassword) {
      onLogin('public', publicName);
    }
  };

  const handleAuthLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authName && authPassword) {
      onLogin('authority', authName);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white mb-4 shadow-lg">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
          Civic<span className="text-blue-600">Connect</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-md mx-auto">
          Report issues, track progress, and help build a better community together.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* Public Login Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-8 bg-blue-50/50 border-b border-slate-100 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <UserCircle size={32} />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">Public Portal</h2>
            <p className="text-sm text-slate-500">Report infrastructure issues and earn points.</p>
          </div>
          
          <form onSubmit={handlePublicLogin} className="p-8 flex-1 flex flex-col justify-between">
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input 
                  type="text" 
                  value={publicName}
                  onChange={(e) => setPublicName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input 
                  type="password" 
                  value={publicPassword}
                  onChange={(e) => setPublicPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <LogIn size={18} className="mr-2" />
              Public Login
            </button>
          </form>
        </div>

        {/* Authority Login Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-8 bg-emerald-50/50 border-b border-slate-100 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <Building2 size={32} />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">Authority Portal</h2>
            <p className="text-sm text-slate-500">Triage, manage, and resolve civic reports.</p>
          </div>
          
          <form onSubmit={handleAuthLogin} className="p-8 flex-1 flex flex-col justify-between">
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Agent Name</label>
                <input 
                  type="text" 
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                  placeholder="Enter authority name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input 
                  type="password" 
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full flex items-center justify-center px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              <LogIn size={18} className="mr-2" />
              Authority Login
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
