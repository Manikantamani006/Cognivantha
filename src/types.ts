export type IssueStatus = 'Pending' | 'Under Review' | 'Resolved' | 'Flagged';
export type PriorityLevel = 'Low' | 'Medium' | 'High';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: IssueStatus;
  priority: PriorityLevel;
  reporterName?: string;
  reporterTrustScore: number;
  dateReported: string;
  imageUrl?: string;
  location?: string;
  reportCount?: number;
  duplicateCount?: number;
  incidentScale?: string;
}

export type ViewState = 'landing' | 'public' | 'authority';
