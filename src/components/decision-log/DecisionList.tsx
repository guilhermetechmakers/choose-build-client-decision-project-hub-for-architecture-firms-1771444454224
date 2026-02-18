import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, ChevronUp, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DecisionCardPreview } from "./DecisionCardPreview";
import { Skeleton } from "@/components/ui/skeleton";
import type { Decision } from "@/types";
import type { ListDecisionsParams } from "@/api/decisions";

export interface DecisionListProps {
  decisions: Decision[];
  isLoading?: boolean;
  selectedId?: string | null;
  filters: ListDecisionsParams;
  onFiltersChange: (f: ListDecisionsParams) => void;
  total?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
}

type SortKey = "updatedAt" | "createdAt" | "title" | "costImpact" | "phase";

export function DecisionList({
  decisions,
  isLoading,
  selectedId,
  filters,
  onFiltersChange,
  total = 0,
  page = 1,
  onPageChange,
  emptyMessage = "No decisions found. Create one to get started.",
}: DecisionListProps) {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const sortBy = (filters.sortBy ?? "updatedAt") as SortKey;
  const sortOrder = filters.sortOrder ?? "desc";

  const handleSort = (key: SortKey) => {
    onFiltersChange({
      ...filters,
      sortBy: key,
      sortOrder:
        sortBy === key && sortOrder === "asc" ? "desc" : "asc",
    });
  };

  const SortIcon = ({ column }: { column: SortKey }) =>
    sortBy === column ? (
      sortOrder === "asc" ? (
        <ChevronUp className="h-4 w-4 inline-block ml-1" aria-hidden />
      ) : (
        <ChevronDown className="h-4 w-4 inline-block ml-1" aria-hidden />
      )
    ) : null;

  if (isLoading) {
    return (
      <Card className="flex flex-1 flex-col overflow-hidden md:max-w-md">
        <CardHeader className="space-y-0 pb-2">
          <Skeleton className="h-7 w-32" />
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-24" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-1 flex-col overflow-hidden md:max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Decision Log</CardTitle>
        <Button size="sm" asChild>
          <Link to="/dashboard/decisions/new">New</Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden flex flex-col gap-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            placeholder="Search decisions"
            className="pl-9"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search decisions"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
          >
            <Filter className="h-4 w-4 mr-1" aria-hidden />
            Filter
          </Button>
          {showFilters && (
            <>
              <Select
                value={filters.status ?? "all"}
                onValueChange={(v) =>
                  onFiltersChange({
                    ...filters,
                    status: v === "all" ? undefined : v,
                  })
                }
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="changes_requested">Change requested</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.phase ?? "all"}
                onValueChange={(v) =>
                  onFiltersChange({
                    ...filters,
                    phase: v === "all" ? undefined : v,
                  })
                }
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All phases</SelectItem>
                  <SelectItem value="concept">Concept</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={
                  filters.sortBy
                    ? `${filters.sortBy}-${filters.sortOrder ?? "desc"}`
                    : "updatedAt-desc"
                }
                onValueChange={(v) => {
                  const [sortBy, sortOrder] = v.split("-") as [SortKey, "asc" | "desc"];
                  onFiltersChange({ ...filters, sortBy, sortOrder });
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updatedAt-desc">Last activity</SelectItem>
                  <SelectItem value="updatedAt-asc">Oldest first</SelectItem>
                  <SelectItem value="createdAt-desc">Newest first</SelectItem>
                  <SelectItem value="title-asc">Title A–Z</SelectItem>
                  <SelectItem value="title-desc">Title Z–A</SelectItem>
                  <SelectItem value="costImpact-desc">Cost high–low</SelectItem>
                  <SelectItem value="costImpact-asc">Cost low–high</SelectItem>
                  <SelectItem value="phase-asc">Phase</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
        </div>

        {/* Desktop: table; Mobile: card list */}
        <div className="hidden md:block flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>
                  <button
                    type="button"
                    className="font-medium hover:text-foreground"
                    onClick={() => handleSort("phase")}
                  >
                    Phase
                    <SortIcon column="phase" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    className="font-medium hover:text-foreground"
                    onClick={() => handleSort("costImpact")}
                  >
                    Cost impact
                    <SortIcon column="costImpact" />
                  </button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <button
                    type="button"
                    className="font-medium hover:text-foreground"
                    onClick={() => handleSort("updatedAt")}
                  >
                    Last activity
                    <SortIcon column="updatedAt" />
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {decisions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                decisions.map((d) => (
                  <TableRow
                    key={d.id}
                    className={cn(
                      "cursor-pointer",
                      selectedId === d.id && "bg-primary/5"
                    )}
                    onClick={() => navigate(`/dashboard/decisions/${d.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate(`/dashboard/decisions/${d.id}`);
                      }
                    }}
                  >
                    <TableCell className="font-medium">
                      <span className="truncate block max-w-[180px]">{d.title}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {d.phase ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {d.costImpact != null && d.costImpact !== 0
                        ? `${d.costImpact > 0 ? "+" : ""}$${d.costImpact}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "capitalize",
                          d.status === "approved" && "text-success",
                          d.status === "pending" && "text-warning",
                          d.status === "changes_requested" && "text-destructive"
                        )}
                      >
                        {d.status === "changes_requested"
                          ? "Change requested"
                          : d.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {d.lastActivityAt ?? d.updatedAt ?? "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <ul className="md:hidden flex-1 overflow-auto space-y-2 -mx-2 px-2">
          {decisions.length === 0 ? (
            <li className="py-8 text-center text-muted-foreground text-sm">
              {emptyMessage}
            </li>
          ) : (
            decisions.map((d) => (
              <li key={d.id}>
                <DecisionCardPreview
                  decision={d}
                  isSelected={selectedId === d.id}
                />
              </li>
            ))
          )}
        </ul>

        {total > (filters.limit ?? 10) && onPageChange && (
          <div className="flex items-center justify-between border-t border-border pt-2">
            <span className="text-xs text-muted-foreground">
              Page {page} of {Math.ceil(total / (filters.limit ?? 10))}
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= Math.ceil(total / (filters.limit ?? 10))}
                onClick={() => onPageChange(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
