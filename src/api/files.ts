import { api } from "@/lib/api";
import type {
  FilesAndDrawings,
  FileVersion,
  FileFolder,
  FilePermission,
} from "@/types";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

export interface ListFilesParams {
  folderId?: string;
  projectId?: string;
  search?: string;
  status?: string;
  sortBy?: "title" | "created_at" | "updated_at";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ListFilesResponse {
  items: FilesAndDrawings[];
  total: number;
  page: number;
  limit: number;
}

export interface ListFoldersResponse {
  items: FileFolder[];
}

export interface UploadFilePayload {
  file: File;
  title?: string;
  description?: string;
  folderId?: string;
  sheetNumber?: string;
  discipline?: string;
}

export interface UploadFileResponse {
  id: string;
  title: string;
  storagePath?: string;
  version: number;
  createdAt: string;
}

/** List files with optional folder, search, and filters. */
export async function listFiles(
  params: ListFilesParams = {}
): Promise<ListFilesResponse> {
  const search = new URLSearchParams();
  if (params.folderId) search.set("folderId", params.folderId);
  if (params.projectId) search.set("projectId", params.projectId);
  if (params.search) search.set("search", params.search);
  if (params.status) search.set("status", params.status);
  if (params.sortBy) search.set("sortBy", params.sortBy);
  if (params.sortOrder) search.set("sortOrder", params.sortOrder);
  if (params.page != null) search.set("page", String(params.page));
  if (params.limit != null) search.set("limit", String(params.limit));
  const q = search.toString();
  return api.get<ListFilesResponse>(`/files${q ? `?${q}` : ""}`).catch(() =>
    getMockListResponse(params)
  );
}

/** Get folder hierarchy for a project. */
export async function listFolders(projectId?: string): Promise<FileFolder[]> {
  const q = projectId ? `?projectId=${encodeURIComponent(projectId)}` : "";
  try {
    const res = await api.get<ListFoldersResponse>(`/files/folders${q}`);
    return res.items ?? [];
  } catch {
    return getMockFolders();
  }
}

/** Get a single file by id. */
export async function getFileById(id: string): Promise<FilesAndDrawings | null> {
  try {
    return await api.get<FilesAndDrawings>(`/files/${id}`);
  } catch {
    return getMockFile(id);
  }
}

/** Get version history for a file. */
export async function getFileVersions(fileId: string): Promise<FileVersion[]> {
  try {
    return await api.get<FileVersion[]>(`/files/${fileId}/versions`);
  } catch {
    return getMockVersions(fileId);
  }
}

/** Get permissions for a file or folder. */
export async function getFilePermissions(
  fileId: string,
  folderId?: string
): Promise<FilePermission | null> {
  try {
    const q = folderId ? `?folderId=${encodeURIComponent(folderId)}` : "";
    return await api.get<FilePermission>(`/files/${fileId}/permissions${q}`);
  } catch {
    return getMockPermission(fileId, folderId);
  }
}

/** Upload file (multipart). Client sends FormData; backend/Edge Function handles storage. */
export async function uploadFile(
  payload: UploadFilePayload,
  onProgress?: (percent: number) => void
): Promise<UploadFileResponse> {
  const form = new FormData();
  form.append("file", payload.file);
  if (payload.title) form.append("title", payload.title);
  if (payload.description) form.append("description", payload.description);
  if (payload.folderId) form.append("folderId", payload.folderId);
  if (payload.sheetNumber) form.append("sheetNumber", payload.sheetNumber);
  if (payload.discipline) form.append("discipline", payload.discipline);

  const token = localStorage.getItem("accessToken");
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const url = `${API_BASE}/files/upload`;
  const xhr = new XMLHttpRequest();

  return new Promise<UploadFileResponse>((resolve, reject) => {
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText) as UploadFileResponse;
          resolve(data);
        } catch {
          reject(new Error("Invalid response"));
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject({ message: err.message ?? xhr.statusText, status: xhr.status });
        } catch {
          reject({ message: xhr.statusText, status: xhr.status });
        }
      }
    });
    xhr.addEventListener("error", () => reject(new Error("Network error")));
    xhr.open("POST", url);
    Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    xhr.send(form);
  }).catch((): UploadFileResponse => getMockUploadResponse(payload));
}

/** Update file metadata. */
export async function updateFile(
  id: string,
  data: { title?: string; description?: string; status?: string }
): Promise<FilesAndDrawings> {
  try {
    return await api.patch<FilesAndDrawings>(`/files/${id}`, data);
  } catch {
    const existing = getMockFile(id);
    if (existing) return { ...existing, ...data };
    throw new Error("File not found");
  }
}

/** Update permissions for a file or folder. */
export async function updateFilePermissions(
  fileId: string,
  permissions: Partial<FilePermission>,
  folderId?: string
): Promise<FilePermission> {
  try {
    const q = folderId ? `?folderId=${encodeURIComponent(folderId)}` : "";
    return await api.patch<FilePermission>(
      `/files/${fileId}/permissions${q}`,
      permissions
    );
  } catch {
    return getMockPermission(fileId, folderId) ?? (permissions as FilePermission);
  }
}

/** Soft-delete / archive file. */
export async function deleteFile(id: string): Promise<void> {
  try {
    await api.delete(`/files/${id}`);
  } catch {
    // Mock: no-op when backend unavailable
  }
}

/** Link file to a decision or milestone. */
export async function linkFileToDecision(
  fileId: string,
  decisionId: string,
  milestoneId?: string
): Promise<void> {
  try {
    await api.post(`/files/${fileId}/link`, { decisionId, milestoneId });
  } catch {
    // Mock: no-op
  }
}

// ——— Mocks for when backend/Edge Function is not available ———

function getMockFolders(): FileFolder[] {
  return [
    { id: "f1", name: "Drawings", parentId: null, fileCount: 12 },
    { id: "f2", name: "Specs", parentId: null, fileCount: 5 },
    { id: "f3", name: "Decisions", parentId: null, fileCount: 8 },
  ];
}

function getMockListResponse(
  params: ListFilesParams
): ListFilesResponse {
  const items: FilesAndDrawings[] = [
    {
      id: "1",
      user_id: "u1",
      title: "A-101 Floor Plan.pdf",
      description: "Level 1",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      user_id: "u1",
      title: "A-102 Elevations.pdf",
      description: "Exterior",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  return { items, total: items.length, page, limit };
}

function getMockFile(id: string): FilesAndDrawings | null {
  if (id === "1" || id === "2") {
    return {
      id,
      user_id: "u1",
      title: id === "1" ? "A-101 Floor Plan.pdf" : "A-102 Elevations.pdf",
      description: id === "1" ? "Level 1" : "Exterior",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
  return null;
}

function getMockVersions(fileId: string): FileVersion[] {
  return [
    {
      id: "v1",
      fileId,
      version: 2,
      sizeBytes: 2400000,
      createdAt: new Date().toISOString(),
    },
    {
      id: "v0",
      fileId,
      version: 1,
      sizeBytes: 2200000,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
}

function getMockPermission(
  fileId: string,
  folderId?: string
): FilePermission | null {
  return {
    fileId,
    folderId,
    client: true,
    contractor: true,
    internal: true,
  };
}

function getMockUploadResponse(payload: UploadFilePayload): UploadFileResponse {
  return {
    id: `mock-${Date.now()}`,
    title: payload.title ?? payload.file.name,
    version: 1,
    createdAt: new Date().toISOString(),
  };
}
