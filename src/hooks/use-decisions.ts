import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ListDecisionsParams } from "@/api/decisions";
import {
  listDecisions,
  getDecisionById,
  getDecisionVersions,
  getDecisionAuditLog,
  getDecisionComments,
  getDecisionRelatedItems,
  approveDecision,
  requestChange,
  askQuestion,
  deleteDecision,
} from "@/api/decisions";

export const decisionKeys = {
  all: ["decisions"] as const,
  lists: () => [...decisionKeys.all, "list"] as const,
  list: (params: ListDecisionsParams) =>
    [...decisionKeys.lists(), params] as const,
  details: () => [...decisionKeys.all, "detail"] as const,
  detail: (id: string) => [...decisionKeys.details(), id] as const,
  versions: (id: string) => [...decisionKeys.detail(id), "versions"] as const,
  audit: (id: string) => [...decisionKeys.detail(id), "audit"] as const,
  comments: (id: string) => [...decisionKeys.detail(id), "comments"] as const,
  related: (id: string) => [...decisionKeys.detail(id), "related"] as const,
};

const defaultListParams: ListDecisionsParams = {
  sortBy: "updatedAt",
  sortOrder: "desc",
  page: 1,
  limit: 20,
};

export function useDecisionList(params: ListDecisionsParams = defaultListParams) {
  return useQuery({
    queryKey: decisionKeys.list(params),
    queryFn: () => listDecisions(params),
  });
}

export function useDecision(id: string | null) {
  return useQuery({
    queryKey: decisionKeys.detail(id ?? ""),
    queryFn: () => getDecisionById(id!),
    enabled: !!id,
  });
}

export function useDecisionVersions(decisionId: string | null) {
  return useQuery({
    queryKey: decisionKeys.versions(decisionId ?? ""),
    queryFn: () => getDecisionVersions(decisionId!),
    enabled: !!decisionId,
  });
}

export function useDecisionAuditLog(decisionId: string | null) {
  return useQuery({
    queryKey: decisionKeys.audit(decisionId ?? ""),
    queryFn: () => getDecisionAuditLog(decisionId!),
    enabled: !!decisionId,
  });
}

export function useDecisionComments(decisionId: string | null) {
  return useQuery({
    queryKey: decisionKeys.comments(decisionId ?? ""),
    queryFn: () => getDecisionComments(decisionId!),
    enabled: !!decisionId,
  });
}

export function useDecisionRelatedItems(decisionId: string | null) {
  return useQuery({
    queryKey: decisionKeys.related(decisionId ?? ""),
    queryFn: () => getDecisionRelatedItems(decisionId!),
    enabled: !!decisionId,
  });
}

export function useApproveDecision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      decisionId,
      comment,
      eSign,
    }: {
      decisionId: string;
      comment?: string;
      eSign?: boolean;
    }) => approveDecision(decisionId, { comment, eSignRequired: eSign }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: decisionKeys.list({}) });
      qc.setQueryData(decisionKeys.detail(data.id), data);
      qc.invalidateQueries({ queryKey: decisionKeys.audit(data.id) });
      toast.success("Decision approved.");
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? "Failed to approve decision.");
    },
  });
}

export function useRequestChange() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ decisionId, comment }: { decisionId: string; comment: string }) =>
      requestChange(decisionId, comment),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: decisionKeys.list({}) });
      qc.setQueryData(decisionKeys.detail(data.id), data);
      qc.invalidateQueries({ queryKey: decisionKeys.audit(data.id) });
      toast.success("Change request sent.");
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? "Failed to request change.");
    },
  });
}

export function useAskQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      decisionId,
      body,
    }: {
      decisionId: string;
      body: string;
    }) => askQuestion(decisionId, body),
    onSuccess: (_, { decisionId }) => {
      qc.invalidateQueries({ queryKey: decisionKeys.comments(decisionId) });
      toast.success("Comment added.");
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? "Failed to add comment.");
    },
  });
}

export function useDeleteDecision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (decisionId: string) => deleteDecision(decisionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: decisionKeys.lists() });
      toast.success("Decision deleted.");
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? "Failed to delete decision.");
    },
  });
}
