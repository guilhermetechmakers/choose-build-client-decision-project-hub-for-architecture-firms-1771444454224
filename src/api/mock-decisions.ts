import type {
  Decision,
  DecisionVersion,
  AuditLogEntry,
  DecisionComment,
  RelatedItem,
} from "@/types";
import type { ListDecisionsResponse } from "./decisions";

const now = new Date().toISOString();
const yesterday = new Date(Date.now() - 864e5).toISOString();

export const mockDecisions: Decision[] = [
  {
    id: "1",
    projectId: "p1",
    phase: "design",
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
    assigneeName: "Client",
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

export function getMockListResponse(
  params: { page?: number; limit?: number }
): ListDecisionsResponse {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  return {
    items: mockDecisions,
    total: mockDecisions.length,
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
