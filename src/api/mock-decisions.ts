import type {
  Decision,
  DecisionVersion,
  AuditLogEntry,
  DecisionComment,
  RelatedItem,
} from "@/types";
import type { ListDecisionsResponse, ListDecisionsParams } from "./decisions";

const now = new Date().toISOString();
const yesterday = new Date(Date.now() - 864e5).toISOString();
const assigneeIdClient = "assignee-client";
const assigneeIdArchitect = "assignee-architect";

export const mockDecisions: Decision[] = [
  {
    id: "1",
    projectId: "p1",
    phase: "design",
    assigneeId: assigneeIdClient,
    assigneeName: "Client",
    title: "Kitchen finish options",
    description: "Select cabinet and counter finishes for the kitchen.",
    status: "approved",
    options: [
      {
        id: "o1",
        title: "Option A — laminate",
        description: "Standard laminate finish.",
        costDelta: 0,
        recommended: true,
      },
      {
        id: "o2",
        title: "Option B — quartz",
        description: "Quartz countertops.",
        costDelta: 1200,
        recommended: false,
      },
    ],
    version: 1,
    publishedAt: yesterday,
    approvedAt: now,
    costImpact: 0,
    createdAt: yesterday,
    updatedAt: now,
    lastActivityAt: "2 hours ago",
  },
  {
    id: "2",
    projectId: "p1",
    phase: "concept",
    assigneeId: assigneeIdClient,
    assigneeName: "Client",
    title: "Exterior material selection",
    description: "Cladding and roofing materials.",
    status: "pending",
    options: [
      { id: "o3", title: "Timber", costDelta: 0, recommended: true },
      { id: "o4", title: "Metal panels", costDelta: 3500, recommended: false },
    ],
    version: 1,
    publishedAt: yesterday,
    costImpact: 0,
    createdAt: yesterday,
    updatedAt: yesterday,
    lastActivityAt: "1 day ago",
  },
  {
    id: "3",
    projectId: "p1",
    phase: "design",
    assigneeId: assigneeIdArchitect,
    assigneeName: "Architect",
    title: "Flooring type",
    description: "Main floor finish.",
    status: "changes_requested",
    options: [
      { id: "o5", title: "Engineered wood", costDelta: -500, recommended: true },
      { id: "o6", title: "Tile", costDelta: 0, recommended: false },
    ],
    version: 1,
    publishedAt: yesterday,
    costImpact: -500,
    createdAt: yesterday,
    updatedAt: now,
    lastActivityAt: "3 hours ago",
  },
];

function parseDate(s: string | undefined): number | undefined {
  if (!s) return undefined;
  const t = new Date(s).getTime();
  return Number.isNaN(t) ? undefined : t;
}

export function getMockListResponse(
  params: ListDecisionsParams = {}
): ListDecisionsResponse {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  let items = [...mockDecisions];

  if (params.status) {
    items = items.filter((d) => d.status === params.status);
  }
  if (params.phase) {
    items = items.filter((d) => d.phase === params.phase);
  }
  if (params.assigneeId) {
    items = items.filter((d) => d.assigneeId === params.assigneeId);
  }
  const fromTs = parseDate(params.fromDate);
  if (fromTs != null) {
    items = items.filter((d) => new Date(d.updatedAt).getTime() >= fromTs);
  }
  const toTs = parseDate(params.toDate);
  if (toTs != null) {
    items = items.filter((d) => new Date(d.updatedAt).getTime() <= toTs);
  }
  if (params.search?.trim()) {
    const q = params.search.trim().toLowerCase();
    items = items.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        (d.description ?? "").toLowerCase().includes(q)
    );
  }
  if (params.costImpactMin != null) {
    items = items.filter((d) => (d.costImpact ?? 0) >= params.costImpactMin!);
  }
  if (params.costImpactMax != null) {
    items = items.filter((d) => (d.costImpact ?? 0) <= params.costImpactMax!);
  }

  const sortBy = params.sortBy ?? "updatedAt";
  const order = params.sortOrder ?? "desc";
  const mult = order === "asc" ? 1 : -1;
  items.sort((a, b) => {
    let av: string | number | undefined =
      sortBy === "title"
        ? a.title
        : sortBy === "phase"
          ? a.phase ?? ""
          : sortBy === "costImpact"
            ? a.costImpact ?? 0
            : sortBy === "createdAt"
              ? new Date(a.createdAt).getTime()
              : new Date(a.updatedAt).getTime();
    let bv: string | number | undefined =
      sortBy === "title"
        ? b.title
        : sortBy === "phase"
          ? b.phase ?? ""
          : sortBy === "costImpact"
            ? b.costImpact ?? 0
            : sortBy === "createdAt"
              ? new Date(b.createdAt).getTime()
              : new Date(b.updatedAt).getTime();
    if (typeof av === "string" && typeof bv === "string")
      return mult * av.localeCompare(bv);
    return mult * (Number(av) - Number(bv));
  });

  const total = items.length;
  const start = (page - 1) * limit;
  const paginated = items.slice(start, start + limit);

  return {
    items: paginated,
    total,
    page,
    limit,
  };
}

export function getMockDecision(id: string): Decision | undefined {
  return mockDecisions.find((d) => d.id === id);
}

export const mockVersions: DecisionVersion[] = [
  {
    id: "v1",
    decisionId: "1",
    version: 1,
    publishedAt: yesterday,
    createdAt: yesterday,
  },
];

export const mockAudit: AuditLogEntry[] = [
  {
    id: "a1",
    decisionId: "1",
    userId: "u1",
    userName: "Architect",
    action: "Published version 1",
    createdAt: yesterday,
  },
  {
    id: "a2",
    decisionId: "1",
    userId: "u2",
    userName: "Client",
    action: "Approved",
    createdAt: now,
  },
];

export const mockComments: DecisionComment[] = [
  {
    id: "c1",
    decisionId: "1",
    userId: "u2",
    userName: "Client",
    body: "Confirming Option A for kitchen.",
    createdAt: now,
  },
];

export const mockRelated: RelatedItem[] = [
  { id: "r1", type: "drawing", title: "Kitchen plan — A-101", url: "/dashboard/files" },
  { id: "r2", type: "task", title: "Finalize kitchen specs", url: "/dashboard/projects" },
];
