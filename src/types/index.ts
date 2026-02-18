export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: string;
  firmId?: string;
}

export interface Project {
  id: string;
  name: string;
  status: "active" | "on_hold" | "completed";
  phase: string;
  progress: number;
  pendingApprovals: number;
  updatedAt: string;
}

export interface DecisionOption {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  costDelta?: number;
  recommended?: boolean;
}

export interface Decision {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: "draft" | "pending" | "approved" | "changes_requested";
  options: DecisionOption[];
  version: number;
  publishedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageThread {
  id: string;
  subject: string;
  resourceType?: string;
  resourceId?: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  type: "project" | "decision_set";
  updatedAt: string;
}
