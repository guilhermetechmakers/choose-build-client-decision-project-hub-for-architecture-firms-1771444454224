import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, User, HardHat, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFilePermissions, useUpdateFilePermissions } from "@/hooks/use-files";

export interface PermissionsPanelProps {
  fileId: string | null;
  folderId?: string | null;
  /** When true, show as folder-level permissions (apply to folder and optionally children). */
  isFolder?: boolean;
  className?: string;
}

export function PermissionsPanel({
  fileId,
  folderId,
  isFolder,
  className,
}: PermissionsPanelProps) {
  const { data: permissions, isLoading, isError } = useFilePermissions(
    fileId,
    folderId ?? undefined
  );
  const updatePermissions = useUpdateFilePermissions();

  if (!fileId && !folderId) {
    return (
      <Card
        className={cn(
          "flex flex-col items-center justify-center min-h-[180px] text-muted-foreground transition-shadow duration-300",
          className
        )}
      >
        <CardContent className="flex flex-col items-center gap-2 pt-8">
          <Shield className="h-10 w-10 opacity-50" aria-hidden />
          <p className="text-sm">Select a file or folder to manage access.</p>
        </CardContent>
      </Card>
    );
  }

  const handleChange = (key: "client" | "contractor" | "internal", value: boolean) => {
    if (!fileId) return;
    updatePermissions.mutate({
      fileId,
      folderId: folderId ?? undefined,
      permissions: {
        client: permissions?.client ?? false,
        contractor: permissions?.contractor ?? false,
        internal: permissions?.internal ?? false,
        [key]: value,
      },
    });
  };

  return (
    <Card
      className={cn(
        "transition-shadow duration-300 hover:shadow-card-hover",
        className
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Access
          {isFolder && (
            <span className="text-xs font-normal text-muted-foreground">
              (folder)
            </span>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Set who can view or download this {isFolder ? "folder" : "file"}.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">Failed to load permissions.</p>
        ) : (
          <ul className="space-y-3" role="list">
            <li className="flex items-center justify-between gap-4 rounded-lg border border-border px-3 py-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" aria-hidden />
                <Label htmlFor="perm-client" className="cursor-pointer font-normal">
                  Client
                </Label>
              </div>
              <input
                id="perm-client"
                type="checkbox"
                checked={permissions?.client ?? false}
                onChange={(e) => handleChange("client", e.target.checked)}
                disabled={updatePermissions.isPending}
                className="h-4 w-4 rounded border-input accent-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Client access"
              />
            </li>
            <li className="flex items-center justify-between gap-4 rounded-lg border border-border px-3 py-2">
              <div className="flex items-center gap-2">
                <HardHat className="h-4 w-4 text-muted-foreground" aria-hidden />
                <Label htmlFor="perm-contractor" className="cursor-pointer font-normal">
                  Contractor
                </Label>
              </div>
              <input
                id="perm-contractor"
                type="checkbox"
                checked={permissions?.contractor ?? false}
                onChange={(e) => handleChange("contractor", e.target.checked)}
                disabled={updatePermissions.isPending}
                className="h-4 w-4 rounded border-input accent-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Contractor access"
              />
            </li>
            <li className="flex items-center justify-between gap-4 rounded-lg border border-border px-3 py-2">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" aria-hidden />
                <Label htmlFor="perm-internal" className="cursor-pointer font-normal">
                  Internal
                </Label>
              </div>
              <input
                id="perm-internal"
                type="checkbox"
                checked={permissions?.internal ?? false}
                onChange={(e) => handleChange("internal", e.target.checked)}
                disabled={updatePermissions.isPending}
                className="h-4 w-4 rounded border-input accent-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Internal access"
              />
            </li>
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
