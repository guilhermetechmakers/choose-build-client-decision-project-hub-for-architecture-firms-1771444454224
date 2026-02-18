import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Upload, FileText, Trash2, Link2 } from "lucide-react";
import { useFileList, useDeleteFile } from "@/hooks/use-files";
import {
  FolderBrowser,
  FilePreview,
  UploadControls,
  PermissionsPanel,
  LinkToDecision,
} from "@/components/files-drawings";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function FilesPage() {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useFileList({
    folderId: selectedFolderId ?? undefined,
    search: searchQuery || undefined,
    status: filterStatus === "all" ? undefined : filterStatus,
    sortBy: "updated_at",
    sortOrder: "desc",
    page: 1,
    limit: 20,
  });
  const deleteFile = useDeleteFile();

  const items = data?.items ?? [];
  const hasItems = items.length > 0;

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteFile.mutate(deleteTargetId, {
        onSettled: () => setDeleteTargetId(null),
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Files & Drawings</h1>
          <p className="text-muted-foreground">
            Project repository with versioning, preview, and access controls.
          </p>
        </div>
        <Button
          onClick={() => setShowUpload(true)}
          className="transition-transform hover:scale-[1.02] hover:shadow-md"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-3 xl:col-span-2">
          <FolderBrowser
            selectedFolderId={selectedFolderId}
            onSelectFolder={setSelectedFolderId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
          />
        </aside>

        <div className="lg:col-span-9 xl:col-span-10 space-y-6">
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {isLoading ? (
              <div className="p-4 space-y-3">
                <Skeleton className="h-10 w-full" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded" />
                ))}
              </div>
            ) : isError ? (
              <div className="p-8 text-center">
                <p className="text-destructive font-medium">Failed to load files.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {(error as { message?: string })?.message ?? "Try again later."}
                </p>
              </div>
            ) : !hasItems ? (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <p className="font-medium mt-2">No files yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload drawings, PDFs, or deliverables to get started.
                </p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => setShowUpload(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload files
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[40%]">Name</TableHead>
                      <TableHead className="hidden sm:table-cell">Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((file) => (
                      <TableRow
                        key={file.id}
                        className={cn(
                          "cursor-pointer transition-colors",
                          selectedFileId === file.id && "bg-primary/5"
                        )}
                        onClick={() => setSelectedFileId(file.id)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
                            <div className="min-w-0">
                              <p className="font-medium truncate">{file.title}</p>
                              {file.description && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {file.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                          {new Date(file.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setSelectedFileId(file.id)}
                              aria-label={`Link ${file.title} to decision`}
                            >
                              <Link2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => setDeleteTargetId(file.id)}
                              aria-label={`Archive ${file.title}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {selectedFileId && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <FilePreview fileId={selectedFileId} />
              </div>
              <div className="space-y-6">
                <PermissionsPanel fileId={selectedFileId} />
                <LinkToDecision fileId={selectedFileId} />
              </div>
            </div>
          )}
        </div>
      </div>

      {showUpload && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="upload-dialog-title"
          onClick={() => setShowUpload(false)}
        >
          <div
            className="bg-card rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 id="upload-dialog-title" className="text-lg font-semibold">
                Upload files
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setShowUpload(false)}>
                Close
              </Button>
            </div>
            <div className="p-4">
              <UploadControls
                folderId={selectedFolderId}
                onUploadComplete={() => {
                  setShowUpload(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <AlertDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive file?</AlertDialogTitle>
            <AlertDialogDescription>
              This will archive the file. You can restore it later from archived items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
