import React, { useState } from 'react';
import type { ViewState, Issue } from './types';
import { ArrowLeft, Award, Camera, MapPin, Send, AlertCircle, Clock, CheckCircle2, Flag, Loader2, User } from 'lucide-react';

interface PublicDashboardProps {
  onNavigate: (view: ViewState) => void;
  issues: Issue[];
  rewardPoints: number;
  onAddIssue: (issue: Omit<Issue, 'id' | 'status' | 'priority' | 'reporterTrustScore' | 'dateReported' | 'reporterName' | 'reportCount'>) => void;
  loggedInUser: string;
}

const PublicDashboard: React.FC<PublicDashboardProps> = ({ onNavigate, issues, rewardPoints, onAddIssue, loggedInUser }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isCapturingLocation, setIsCapturingLocation] = useState(false);
  const [locationText, setLocationText] = useState<string | null>(null);

  const handleCapturePhoto = () => {
    setIsCapturingPhoto(true);
    
    const potholeImage = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400';
    const streetlightImage = 'https://images.unsplash.com/photo-1509024644558-2f56ce76c490?auto=format&fit=crop&q=80&w=400';
    const infraImage = 'https://images.unsplash.com/photo-1595841696660-181c4feb22c6?auto=format&fit=crop&q=80&w=400';
    
    setTimeout(() => {
      const lowerTitle = title.toLowerCase();
      let selectedImage = infraImage;
      
      if (lowerTitle.includes('pothole')) {
        selectedImage = potholeImage;
      } else if (lowerTitle.includes('streetlight')) {
        selectedImage = streetlightImage;
      }
      
      setPhotoUrl(selectedImage);
      setIsCapturingPhoto(false);
    }, 1000);
  };

  const handleCaptureLocation = () => {
    setIsCapturingLocation(true);
    setTimeout(() => {
      const lat = (12.9 + Math.random() * 0.1).toFixed(4); // Local Bangalore coordinates roughly
      const lng = (77.5 + Math.random() * 0.1).toFixed(4);
      setLocationText(`Lat ${lat}, Lng ${lng}`);
      setIsCapturingLocation(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    
    onAddIssue({
      title,
      description,
      category: 'Infrastructure and Roads',
      imageUrl: photoUrl || undefined,
      location: locationText || undefined,
    });

    setTitle('');
    setDescription('');
    setPhotoUrl(null);
    setLocationText(null);
  };

  const getStatusIcon = (status: Issue['status']) => {
    switch (status) {
      case 'Pending': return <Clock size={16} className="text-orange-500" />;
      case 'Under Review': return <AlertCircle size={16} className="text-blue-500" />;
      case 'Resolved': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'Flagged': return <Flag size={16} className="text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onNavigate('landing')}
              className="flex items-center text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Logout
            </button>
            <div className="hidden sm:flex items-center text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              <User size={14} className="mr-1.5 text-slate-400" />
              <span>{loggedInUser}</span>
            </div>
          </div>
          
          <div className="flex items-center bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
            <Award className="text-blue-600 mr-2" size={20} />
            <span className="font-semibold text-blue-900">
              {rewardPoints} <span className="font-normal text-blue-700">Civic Points</span>
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Report Form Area */}
        <div className="md:col-span-7">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Report an Issue</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Issue Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Deep pothole on 5th Avenue"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe the issue in detail..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none resize-none"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <div className="flex-1">
                  <button 
                    type="button"
                    onClick={handleCapturePhoto}
                    disabled={isCapturingPhoto || !!photoUrl}
                    className={`w-full flex justify-center items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      photoUrl 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {isCapturingPhoto ? (
                      <><Loader2 size={18} className="mr-2 animate-spin" /> Capturing...</>
                    ) : photoUrl ? (
                      <><CheckCircle2 size={18} className="mr-2" /> Photo Captured</>
                    ) : (
                      <><Camera size={18} className="mr-2" /> Capture Photo</>
                    )}
                  </button>
                  {photoUrl && (
                    <div className="mt-3 relative rounded-lg overflow-hidden border border-slate-200 h-32 bg-slate-50">
                      <img src={photoUrl} alt="Captured issue" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setPhotoUrl(null)}
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                      >
                        <ArrowLeft size={14} className="rotate-45" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <button 
                    type="button"
                    onClick={handleCaptureLocation}
                    disabled={isCapturingLocation || !!locationText}
                    className={`w-full flex justify-center items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      locationText 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {isCapturingLocation ? (
                      <><Loader2 size={18} className="mr-2 animate-spin" /> Fetching GPS...</>
                    ) : locationText ? (
                      <><CheckCircle2 size={18} className="mr-2" /> Location Captured</>
                    ) : (
                      <><MapPin size={18} className="mr-2" /> Capture Location</>
                    )}
                  </button>
                  {locationText && (
                    <div className="mt-3 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg flex items-center text-xs text-slate-600 font-mono">
                      <MapPin size={14} className="mr-2 text-slate-400" />
                      {locationText}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <button 
                  type="submit"
                  disabled={!title || !description}
                  className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  <Send size={18} className="mr-2" />
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* History Area */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">My Recent Reports</h3>
            
            <div className="space-y-4">
              {issues.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-8">You haven't reported any issues yet.</p>
              ) : (
                issues.map(issue => (
                  <div key={issue.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-slate-800 line-clamp-1">{issue.title}</h4>
                      <span className="flex items-center text-xs font-medium px-2 py-1 rounded-full bg-white border border-slate-200 shadow-sm whitespace-nowrap ml-2">
                        {getStatusIcon(issue.status)}
                        <span className="ml-1.5">{issue.status}</span>
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2">{issue.description}</p>
                    {issue.location && (
                      <div className="mt-2 text-xs text-slate-400 font-mono">
                        📍 {issue.location}
                      </div>
                    )}
                    <div className="mt-3 flex items-center text-xs text-slate-400">
                      <span>{new Date(issue.dateReported).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default PublicDashboard;
