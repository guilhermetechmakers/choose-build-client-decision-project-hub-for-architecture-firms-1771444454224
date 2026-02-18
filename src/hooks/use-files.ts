import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ListFilesParams, UploadFilePayload } from "@/api/files";
import {
  listFiles,
  listFolders,
  getFileById,
  getFileVersions,
  getFilePermissions,
  uploadFile,
  updateFile,
  updateFilePermissions,
  deleteFile,
  linkFileToDecision,
} from "@/api/files";

export const fileKeys = {
  all: ["files"] as const,
  lists: () => [...fileKeys.all, "list"] as const,
  list: (params: ListFilesParams) => [...fileKeys.lists(), params] as const,
  folders: (projectId?: string) =>
    [...fileKeys.all, "folders", projectId ?? ""] as const,
  details: () => [...fileKeys.all, "detail"] as const,
  detail: (id: string) => [...fileKeys.details(), id] as const,
  versions: (id: string) => [...fileKeys.detail(id), "versions"] as const,
  permissions: (id: string, folderId?: string) =>
    [...fileKeys.detail(id), "permissions", folderId ?? ""] as const,
};

export function useFileList(params: ListFilesParams = {}) {
  return useQuery({
    queryKey: fileKeys.list(params),
    queryFn: () => listFiles(params),
  });
}

export function useFileFolders(projectId?: string) {
  return useQuery({
    queryKey: fileKeys.folders(projectId),
    queryFn: () => listFolders(projectId),
  });
}

export function useFile(id: string | null) {
  return useQuery({
    queryKey: fileKeys.detail(id ?? ""),
    queryFn: () => getFileById(id!),
    enabled: !!id,
  });
}

export function useFileVersions(fileId: string | null) {
  return useQuery({
    queryKey: fileKeys.versions(fileId ?? ""),
    queryFn: () => getFileVersions(fileId!),
    enabled: !!fileId,
  });
}

export function useFilePermissions(fileId: string | null, folderId?: string) {
  return useQuery({
    queryKey: fileKeys.permissions(fileId ?? "", folderId),
    queryFn: () => getFilePermissions(fileId!, folderId),
    enabled: !!fileId,
  });
}

export function useUploadFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      onProgress,
    }: {
      payload: UploadFilePayload;
      onProgress?: (percent: number) => void;
    }) => uploadFile(payload, onProgress),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: fileKeys.lists() });
      qc.invalidateQueries({ queryKey: fileKeys.folders() });
      toast.success("File uploaded.");
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? "Upload failed.");
    },
  });
}

export function useUpdateFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { title?: string; description?: string; status?: string };
    }) => updateFile(id, data),
    onSuccess: (data) => {
      qc.setQueryData(fileKeys.detail(data.id), data);
      qc.invalidateQueries({ queryKey: fileKeys.lists() });
      toast.success("File updated.");
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? "Update failed.");
    },
  });
}

export function useUpdateFilePermissions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      fileId,
      permissions,
      folderId,
    }: {
      fileId: string;
      permissions: Partial<{
        client: boolean;
        contractor: boolean;
        internal: boolean;
      }>;
      folderId?: string;
    }) => updateFilePermissions(fileId, permissions, folderId),
    onSuccess: (_, { fileId, folderId }) => {
      qc.invalidateQueries({
        queryKey: fileKeys.permissions(fileId, folderId),
      });
      toast.success("Permissions updated.");
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? "Failed to update permissions.");
    },
  });
}

export function useDeleteFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFile(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: fileKeys.lists() });
      qc.invalidateQueries({ queryKey: fileKeys.folders() });
      toast.success("File archived.");
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? "Delete failed.");
    },
  });
}

export function useLinkFileToDecision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      fileId,
      decisionId,
      milestoneId,
    }: {
      fileId: string;
      decisionId: string;
      milestoneId?: string;
    }) => linkFileToDecision(fileId, decisionId, milestoneId),
    onSuccess: (_, { fileId }) => {
      qc.invalidateQueries({ queryKey: fileKeys.detail(fileId) });
      qc.invalidateQueries({ queryKey: fileKeys.lists() });
      toast.success("Linked to decision.");
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? "Link failed.");
    },
  });
}
