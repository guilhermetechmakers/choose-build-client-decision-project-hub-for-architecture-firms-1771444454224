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
  pdfUrl?: string;
  costDelta?: number;
  recommended?: boolean;
}

export type DecisionStatus = "draft" | "pending" | "approved" | "changes_requested";

export interface Decision {
  id: string;
  projectId: string;
  phase?: string;
  assigneeId?: string;
  assigneeName?: string;
  title: string;
  description?: string;
  status: DecisionStatus;
  options: DecisionOption[];
  version: number;
  publishedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  costImpact?: number;
  createdAt: string;
  updatedAt: string;
  lastActivityAt?: string;
  thumbnailUrl?: string;
}

/** decision_log table (DB schema) */
export interface DecisionLog {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DecisionVersion {
  id: string;
  decisionId: string;
  version: number;
  snapshotUrl?: string;
  publishedAt: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  decisionId: string;
  userId: string;
  userName: string;
  action: string;
  details?: string;
  createdAt: string;
}

export interface DecisionComment {
  id: string;
  decisionId: string;
  userId: string;
  userName: string;
  body: string;
  createdAt: string;
  parentId?: string;
}

export interface RelatedItem {
  id: string;
  type: "drawing" | "task" | "meeting_note";
  title: string;
  url?: string;
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

/** login_signup table (auth/session metadata); DB table may be named "login_/_signup" with RLS */
export interface LoginSignup {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

/** files_and_drawings (DB: files_&_drawings or files_and_drawings) */
export interface FilesAndDrawings {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export type FileAccessLevel = "client" | "contractor" | "internal";

export interface FilePermission {
  fileId: string;
  folderId?: string;
  client: boolean;
  contractor: boolean;
  internal: boolean;
}

export interface FileVersion {
  id: string;
  fileId: string;
  version: number;
  storagePath?: string;
  thumbnailUrl?: string;
  sizeBytes?: number;
  createdAt: string;
}

export interface FileFolder {
  id: string;
  name: string;
  parentId: string | null;
  projectId?: string;
  fileCount: number;
  children?: FileFolder[];
}
