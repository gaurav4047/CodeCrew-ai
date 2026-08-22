export interface TrackingConfig {
  id: number;
  name: string;
  tracking_type: 'research' | 'patent' | 'news' | 'social_media' | 'competitor';
  keywords: string[];
  sources: Record<string, any>;
  check_interval_minutes: number;
  is_active: boolean;
}

export interface Insight {
  id: number;
  title: string;
  summary: string;
  full_content?: string;
  source_url?: string;
  source_type?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category?: 'trend' | 'competitor_activity' | 'breakthrough' | 'market_shift' | 'regulatory' | 'partnership';
  relevance_score?: number;
  entities: string[];
  published_at?: string;
  discovered_at: string;
  is_read: boolean;
  alerted: boolean;
}

export interface InsightStats {
  total_insights: number;
  unread_insights: number;
  recent_insights: number;
  high_priority_insights: number;
}
