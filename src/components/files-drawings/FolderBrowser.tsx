import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FolderOpen,
  Folder,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFileFolders } from "@/hooks/use-files";
import type { FileFolder } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export interface FolderBrowserProps {
  projectId?: string;
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus?: string;
  onFilterStatusChange?: (value: string) => void;
  className?: string;
}

function FolderTreeItem({
  folder,
  selectedFolderId,
  onSelect,
  level = 0,
}: {
  folder: FileFolder;
  selectedFolderId: string | null;
  onSelect: (id: string) => void;
  level?: number;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = folder.children && folder.children.length > 0;
  const isSelected = selectedFolderId === folder.id;

  return (
    <div className="select-none">
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(folder.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(folder.id);
          }
          if (e.key === "ArrowRight" && hasChildren) setExpanded(true);
          if (e.key === "ArrowLeft") setExpanded(false);
        }}
        style={{ paddingLeft: `${12 + level * 16}px` }}
        className={cn(
          "flex items-center gap-2 rounded-lg py-2 px-2 text-sm transition-colors duration-200 hover:bg-muted/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isSelected && "bg-primary/10 text-primary font-medium"
        )}
        aria-label={`Folder ${folder.name}, ${folder.fileCount} files`}
      >
        <button
          type="button"
          aria-label={expanded ? "Collapse" : "Expand"}
          className="p-0.5 rounded hover:bg-muted"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )
          ) : (
            <span className="w-4 inline-block" />
          )}
        </button>
        {folder.id && !hasChildren ? (
          <Folder className="h-5 w-5 shrink-0 text-muted-foreground" />
        ) : (
          <FolderOpen className="h-5 w-5 shrink-0 text-muted-foreground" />
        )}
        <span className="flex-1 truncate">{folder.name}</span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {folder.fileCount}
        </span>
      </div>
      {hasChildren && expanded && (
        <div>
          {folder.children!.map((child) => (
            <FolderTreeItem
              key={child.id}
              folder={child}
              selectedFolderId={selectedFolderId}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FolderBrowser({
  projectId,
  selectedFolderId,
  onSelectFolder,
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  className,
}: FolderBrowserProps) {
  const { data: folders = [], isLoading, isError } = useFileFolders(projectId);
  const displayFolders = folders;

  return (
    <Card
      className={cn(
        "transition-shadow duration-300 hover:shadow-card-hover",
        className
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-primary" />
          Folders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9"
            aria-label="Search files"
          />
        </div>
        {onFilterStatusChange && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            <select
              value={filterStatus ?? "all"}
              onChange={(e) => onFilterStatusChange(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        )}
        {isLoading ? (
          <div className="space-y-2 py-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-9 w-full rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive py-2">Failed to load folders.</p>
        ) : (
          <div className="py-1">
            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelectFolder(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectFolder(null);
                }
              }}
              className={cn(
                "flex items-center gap-2 rounded-lg py-2 px-2 text-sm transition-colors duration-200 hover:bg-muted/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selectedFolderId === null && "bg-primary/10 text-primary font-medium"
              )}
              aria-label="All files"
            >
              <FolderOpen className="h-5 w-5 shrink-0 text-muted-foreground" />
              <span className="flex-1">All files</span>
            </div>
            {displayFolders.map((folder) => (
              <FolderTreeItem
                key={folder.id}
                folder={folder}
                selectedFolderId={selectedFolderId}
                onSelect={onSelectFolder}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
