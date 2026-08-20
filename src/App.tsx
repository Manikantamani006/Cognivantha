import { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import PublicDashboard from './PublicDashboard';
import AuthorityDashboard from './AuthorityDashboard';
import type { Issue, ViewState } from './types';

const INITIAL_ISSUES: Issue[] = [
  {
    id: '1',
    reporterName: 'Rahul T.',
    reporterTrustScore: 92,
    title: 'Massive Sinkhole on Main Arterial Road',
    category: 'Roads',
    description: 'Large portion of the asphalt has collapsed in the center lane. Highly dangerous for two-wheelers.',
    location: 'Lat 12.9716, Lng 77.5946',
    reportCount: 14,
    duplicateCount: 14,
    priority: 'High',
    status: 'Pending',
    dateReported: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '2',
    reporterName: 'Priya S.',
    reporterTrustScore: 85,
    title: 'Flickering Streetlight at Crosswalk',
    category: 'Infrastructure',
    description: 'Streetlight at the pedestrian crossing keeps flickering and turning off, making it hard to see people crossing at night.',
    location: 'Lat 12.9352, Lng 77.6245',
    reportCount: 2,
    duplicateCount: 2,
    priority: 'Low',
    status: 'Pending',
    dateReported: new Date(Date.now() - 3600000 * 8).toISOString(), // 8 hours ago
    imageUrl: 'https://images.unsplash.com/photo-1509024644558-2f56ce76c490?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '3',
    reporterName: 'Amit K.',
    reporterTrustScore: 98,
    title: 'Missing Manhole Cover',
    category: 'Infrastructure',
    description: 'The heavy iron cover is missing right outside the primary school gate. Currently marked with a tree branch.',
    location: 'Lat 12.9279, Lng 77.6271',
    reportCount: 8,
    duplicateCount: 8,
    priority: 'High',
    status: 'Under Review',
    dateReported: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    imageUrl: 'https://images.unsplash.com/photo-1595841696660-181c4feb22c6?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '4',
    reporterName: 'Sneha M.',
    reporterTrustScore: 74,
    title: 'Severe Waterlogging Under Underpass',
    category: 'Roads / Drainage',
    description: 'Drainage seems completely blocked. Over 2 feet of water accumulated after yesterday\'s rain, causing massive traffic.',
    location: 'Lat 12.9569, Lng 77.7011',
    reportCount: 22,
    duplicateCount: 22,
    priority: 'Medium',
    status: 'Pending',
    dateReported: new Date(Date.now() - 86400000 * 1.5).toISOString(), // 1.5 days ago
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '5',
    reporterName: 'Vikram D.',
    reporterTrustScore: 60,
    title: 'Faded Zebra Crossing',
    category: 'Roads',
    description: 'The paint on the zebra crossing is completely worn out. Cars are not stopping for pedestrians.',
    location: 'Lat 12.9141, Lng 77.6101',
    reportCount: 1,
    duplicateCount: 1,
    priority: 'Low',
    status: 'Resolved',
    dateReported: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    imageUrl: 'https://images.unsplash.com/photo-1619894991209-9f70de39103c?auto=format&fit=crop&q=80&w=400'
  }
];

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [loggedInUser, setLoggedInUser] = useState<string>('');
  const [issues, setIssues] = useState<Issue[]>(() => {
    const saved = localStorage.getItem('civicIssues');
    return saved ? JSON.parse(saved) : INITIAL_ISSUES;
  });
  const [rewardPoints, setRewardPoints] = useState<number>(() => {
    const saved = localStorage.getItem('civicPoints');
    return saved ? parseInt(saved, 10) : 150;
  });

  useEffect(() => {
    localStorage.setItem('civicIssues', JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem('civicPoints', rewardPoints.toString());
  }, [rewardPoints]);

  const handleLogin = (view: ViewState, username: string) => {
    setLoggedInUser(username);
    setCurrentView(view);
  };

  const handleAddIssue = (newIssue: Omit<Issue, 'id' | 'status' | 'priority' | 'reporterTrustScore' | 'dateReported' | 'reporterName' | 'reportCount'>) => {
    const issue: Issue = {
      ...newIssue,
      id: Math.random().toString(36).substr(2, 9),
      reporterName: loggedInUser || 'Anonymous User',
      status: 'Pending',
      priority: 'Medium',
      reporterTrustScore: 80, // Default trust score
      dateReported: new Date().toISOString(),
      reportCount: 1,
      duplicateCount: 1,
      incidentScale: 'Small'
    };
    setIssues(prev => [issue, ...prev]);
  };

  const handleUpdateIssueStatus = (id: string, newStatus: Issue['status']) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === id) {
        if (newStatus === 'Resolved' && issue.status !== 'Resolved') {
          // Award points when issue is newly resolved
          setRewardPoints(points => points + 50);
        }
        return { ...issue, status: newStatus };
      }
      return issue;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {currentView === 'landing' && <LandingPage onNavigate={(view) => setCurrentView(view)} onLogin={handleLogin} />}
      {currentView === 'public' && (
        <PublicDashboard 
          onNavigate={(view) => setCurrentView(view)} 
          issues={issues} 
          rewardPoints={rewardPoints}
          onAddIssue={handleAddIssue}
          loggedInUser={loggedInUser}
        />
      )}
      {currentView === 'authority' && (
        <AuthorityDashboard 
          onNavigate={(view) => setCurrentView(view)} 
          issues={issues}
          onUpdateStatus={handleUpdateIssueStatus}
          loggedInUser={loggedInUser}
        />
      )}
    </div>
  );
}

export default App;
