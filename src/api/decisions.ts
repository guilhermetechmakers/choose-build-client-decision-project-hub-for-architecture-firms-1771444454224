import { api } from "@/lib/api";
import type {
  Decision,
  DecisionVersion,
  AuditLogEntry,
  DecisionComment,
  RelatedItem,
} from "@/types";
import {
  getMockListResponse,
  getMockDecision,
  mockVersions,
  mockAudit,
  mockComments,
  mockRelated,
} from "@/api/mock-decisions";

export interface ListDecisionsParams {
  status?: string;
  phase?: string;
  assigneeId?: string;
  costImpactMin?: number;
  costImpactMax?: number;
  fromDate?: string;
  toDate?: string;
  sortBy?: "updatedAt" | "createdAt" | "title" | "costImpact" | "phase";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ListDecisionsResponse {
  items: Decision[];
  total: number;
  page: number;
  limit: number;
}

/** List/filter decisions by project/phase/audience and params. */
export async function listDecisions(
  params: ListDecisionsParams = {}
): Promise<ListDecisionsResponse> {
  try {
    const search = new URLSearchParams();
    if (params.status) search.set("status", params.status);
    if (params.phase) search.set("phase", params.phase);
    if (params.assigneeId) search.set("assigneeId", params.assigneeId);
    if (params.costImpactMin != null) search.set("costImpactMin", String(params.costImpactMin));
    if (params.costImpactMax != null) search.set("costImpactMax", String(params.costImpactMax));
    if (params.fromDate) search.set("fromDate", params.fromDate);
    if (params.toDate) search.set("toDate", params.toDate);
    if (params.sortBy) search.set("sortBy", params.sortBy);
    if (params.sortOrder) search.set("sortOrder", params.sortOrder);
    if (params.page != null) search.set("page", String(params.page));
    if (params.limit != null) search.set("limit", String(params.limit));
    const q = search.toString();
    return await api.get<ListDecisionsResponse>(`/decisions${q ? `?${q}` : ""}`);
  } catch {
    return getMockListResponse(params);
  }
}

/** Get a single decision by id. */
export async function getDecisionById(id: string): Promise<Decision> {
  try {
    return await api.get<Decision>(`/decisions/${id}`);
  } catch {
    const mock = getMockDecision(id);
    if (mock) return mock;
    throw new Error("Decision not found");
  }
}

/** Get version history for a decision. */
export async function getDecisionVersions(decisionId: string): Promise<DecisionVersion[]> {
  try {
    return await api.get<DecisionVersion[]>(`/decisions/${decisionId}/versions`);
  } catch {
    return decisionId === "1" ? mockVersions : [];
  }
}

/** Get audit log for a decision. */
export async function getDecisionAuditLog(decisionId: string): Promise<AuditLogEntry[]> {
  try {
    return await api.get<AuditLogEntry[]>(`/decisions/${decisionId}/audit`);
  } catch {
    return decisionId === "1" ? mockAudit : [];
  }
}

/** Get comments for a decision. */
export async function getDecisionComments(decisionId: string): Promise<DecisionComment[]> {
  try {
    return await api.get<DecisionComment[]>(`/decisions/${decisionId}/comments`);
  } catch {
    return decisionId === "1" ? mockComments : [];
  }
}

/** Get related items (drawings, tasks, meeting notes) for a decision. */
export async function getDecisionRelatedItems(decisionId: string): Promise<RelatedItem[]> {
  try {
    return await api.get<RelatedItem[]>(`/decisions/${decisionId}/related`);
  } catch {
    return decisionId === "1" ? mockRelated : [];
  }
}

export interface ApprovalPayload {
  comment?: string;
  eSignRequired?: boolean;
}

/** Approve a decision. */
export async function approveDecision(
  decisionId: string,
  payload?: ApprovalPayload
): Promise<Decision> {
  try {
    return await api.post<Decision>(`/decisions/${decisionId}/approve`, payload);
  } catch {
    const mock = getMockDecision(decisionId);
    if (mock) return { ...mock, status: "approved" as const, approvedAt: new Date().toISOString() };
    throw new Error("Failed to approve");
  }
}

/** Request change on a decision. */
export async function requestChange(
  decisionId: string,
  comment: string
): Promise<Decision> {
  try {
    return await api.post<Decision>(`/decisions/${decisionId}/request-change`, { comment });
  } catch {
    const mock = getMockDecision(decisionId);
    if (mock) return { ...mock, status: "changes_requested" as const };
    throw new Error("Failed to request change");
  }
}

/** Ask question (add comment / trigger thread). */
export async function askQuestion(
  decisionId: string,
  body: string,
  parentId?: string
): Promise<DecisionComment> {
  try {
    return await api.post<DecisionComment>(`/decisions/${decisionId}/comments`, {
      body,
      parentId,
    });
  } catch {
    return {
      id: `c-${Date.now()}`,
      decisionId,
      userId: "current",
      userName: "You",
      body,
      createdAt: new Date().toISOString(),
      parentId,
    };
  }
}

/** Delete a decision. */
export async function deleteDecision(decisionId: string): Promise<void> {
  try {
    await api.delete(`/decisions/${decisionId}`);
  } catch {
    // Mock: no-op when backend unavailable
  }
}

/** Download a specific version snapshot. */
export function getVersionDownloadUrl(decisionId: string, versionId: string): string {
  const base = import.meta.env.VITE_API_URL ?? "/api";
  return `${base}/decisions/${decisionId}/versions/${versionId}/download`;
}
