import React, { useState } from 'react';
import type { ViewState, Issue } from './types';
import { ArrowLeft, ShieldCheck, AlertTriangle, Users, MapPin, CheckCircle, Clock, Search, Filter, User } from 'lucide-react';
import IssueMap from './components/IssueMap';

interface AuthorityDashboardProps {
  onNavigate: (view: ViewState) => void;
  issues: Issue[];
  onUpdateStatus: (id: string, status: Issue['status']) => void;
  loggedInUser: string;
}

const AuthorityDashboard: React.FC<AuthorityDashboardProps> = ({ onNavigate, issues, onUpdateStatus, loggedInUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const getPriorityColor = (priority: Issue['priority']) => {
    switch (priority) {
      case 'High': return 'bg-red-50 text-red-700 border-red-200';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const getTrustBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (score >= 70) return 'bg-blue-50 text-blue-700 border-blue-100';
    return 'bg-rose-50 text-rose-700 border-rose-100';
  };

  const priorityOrder: Record<Issue['priority'], number> = {
    High: 1,
    Medium: 2,
    Low: 3
  };

  // Filter issues based on search term & status
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || issue.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Sort issues: High Priority first
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => onNavigate('landing')}
              className="flex items-center text-slate-300 hover:text-white transition-colors mr-6"
            >
              <ArrowLeft size={20} className="mr-2" />
              Logout
            </button>
            <ShieldCheck className="text-blue-400 mr-2" size={24} />
            <h1 className="font-semibold text-lg tracking-wide hidden sm:block">Authority Triage Center</h1>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-slate-300">
            <div className="hidden md:flex items-center bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
              <User size={14} className="mr-1.5 text-blue-400" />
              <span>Agent: {loggedInUser}</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              Live Feed Active
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Incoming Reports</h2>
            <p className="text-sm text-slate-500 mt-1">Sorted by priority level (High to Low)</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search issues..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Resolved">Resolved</option>
                <option value="Flagged">Flagged</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" size={16} />
            </div>
          </div>
        </div>

        <div className="mb-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <MapPin className="text-blue-500 mr-2" size={20} />
            Civic Triage Map
          </h3>
          <IssueMap issues={sortedIssues} />
        </div>

        {/* Issue Grid */}
        {sortedIssues.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <AlertTriangle className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-slate-700">No issues found</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedIssues.map(issue => (
              <div key={issue.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md">
                
                {/* Card Header (Smart Triage Data) */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold border uppercase tracking-wider w-fit ${getPriorityColor(issue.priority)}`}>
                      {issue.priority} Priority
                    </span>
                    <div className="flex items-center space-x-3 text-xs font-medium text-slate-500">
                      <span className="flex items-center">
                        <Users size={14} className="mr-1 text-slate-400" />
                        {issue.reportCount || issue.duplicateCount || 1} Reports
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xs text-slate-400 mb-1">Trust Score</div>
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-bold border ${getTrustBadgeColor(issue.reporterTrustScore)}`}>
                      {issue.reporterTrustScore}%
                    </span>
                  </div>
                </div>

                {/* Card Body (Issue Details) */}
                <div className="flex-1 flex flex-col">
                  {issue.imageUrl && (
                    <div className="w-full h-44 bg-slate-100 border-b border-slate-100 relative">
                      <img src={issue.imageUrl} alt={issue.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
                        {issue.category}
                      </span>
                    </div>
                  )}
                  
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Reporter Name Banner */}
                    <div className="text-xs text-slate-400 mb-2 flex items-center">
                      <User size={12} className="mr-1" />
                      Reported by: <span className="font-semibold text-slate-600 ml-1">{issue.reporterName || 'Anonymous User'}</span>
                    </div>
                    
                    <h3 className="font-bold text-lg text-slate-900 leading-tight mb-2">{issue.title}</h3>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-1">{issue.description}</p>
                    
                    {issue.location && (
                      <div className="flex items-center text-xs text-slate-500 mt-auto bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 font-mono">
                        <MapPin size={14} className="mr-1.5 text-slate-400 min-w-[14px]" />
                        <span className="truncate">{issue.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Panel */}
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <div className="mb-3 flex justify-between items-center text-sm font-medium">
                    <span className="text-slate-600">Current Status:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white border border-slate-200 shadow-sm ${
                      issue.status === 'Resolved' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 
                      issue.status === 'Flagged' ? 'text-rose-700 bg-rose-50 border-rose-200' : 
                      issue.status === 'Under Review' ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-slate-800'
                    }`}>
                      {issue.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => onUpdateStatus(issue.id, 'Under Review')}
                      disabled={issue.status === 'Under Review'}
                      className="flex flex-col items-center justify-center py-2 rounded-lg bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200 text-[11px] font-semibold text-slate-600 disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <Clock size={15} className="mb-1" />
                      Review
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(issue.id, 'Resolved')}
                      disabled={issue.status === 'Resolved'}
                      className="flex flex-col items-center justify-center py-2 rounded-lg bg-white border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all duration-200 text-[11px] font-semibold text-slate-600 disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <CheckCircle size={15} className="mb-1" />
                      Resolve
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(issue.id, 'Flagged')}
                      disabled={issue.status === 'Flagged'}
                      className="flex flex-col items-center justify-center py-2 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 transition-all duration-200 text-[11px] font-semibold text-slate-600 disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <AlertTriangle size={15} className="mb-1" />
                      Flag
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

export default AuthorityDashboard;
