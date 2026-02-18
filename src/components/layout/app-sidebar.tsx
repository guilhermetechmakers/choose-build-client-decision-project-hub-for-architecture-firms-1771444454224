import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  PlusCircle,
  MessageSquare,
  FileText,
  Calendar,
  LayoutTemplate,
  BarChart3,
  CreditCard,
  Settings,
  Users,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/contexts/sidebar-context";

const navMain = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { to: "/dashboard/decisions", label: "Decision Log", icon: ClipboardList },
  { to: "/dashboard/decisions/new", label: "New Decision", icon: PlusCircle },
  { to: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { to: "/dashboard/files", label: "Files & Drawings", icon: FileText },
  { to: "/dashboard/meetings", label: "Meetings", icon: Calendar },
  { to: "/dashboard/templates", label: "Templates", icon: LayoutTemplate },
  { to: "/dashboard/reports", label: "Reports", icon: BarChart3 },
];

const navSecondary = [
  { to: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

const navAdmin = [
  { to: "/dashboard/admin", label: "Admin", icon: Settings },
  { to: "/dashboard/admin/users", label: "User Management", icon: Users },
];

export function AppSidebar() {
  const { collapsed, setCollapsed, isMobile, open, setOpen } = useSidebar();
  const location = useLocation();

  const isActive = (to: string) =>
    to === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname === to || location.pathname.startsWith(to + "/");
  const linkClass = (to: string) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      isActive(to)
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    );

  const content = (
    <>
      <div className="flex h-14 items-center border-b border-border px-4">
        {!collapsed && (
          <NavLink to="/dashboard" className="flex items-center gap-2 font-semibold text-primary">
            <span>Choose & Build</span>
          </NavLink>
        )}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="flex flex-col gap-1">
          {navMain.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={linkClass(to)}
              onClick={() => isMobile && setOpen(false)}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
        <Separator className="my-4" />
        <nav className="flex flex-col gap-1">
          {navSecondary.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={linkClass(to)}
              onClick={() => isMobile && setOpen(false)}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
        <Separator className="my-4" />
        <nav className="flex flex-col gap-1">
          {navAdmin.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={linkClass(to)}
              onClick={() => isMobile && setOpen(false)}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
      {!isMobile && (
        <div className="border-t border-border p-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-full"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </>
  );

  if (isMobile) {
    return (
      <>
        <div
          className={cn(
            "fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden",
            open ? "opacity-100" : "pointer-events-none opacity-0"
          )}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
        <aside
          className={cn(
            "fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-border bg-card transition-transform duration-300 md:hidden",
            open ? "translate-x-0" : "-translate-x-full"
          )}
          role="dialog"
          aria-label="Sidebar"
        >
          {content}
        </aside>
      </>
    );
  }

  return (
    <aside
      className={cn(
        "hidden flex-col border-r border-border bg-card transition-[width] duration-300 md:flex",
        collapsed ? "w-[60px]" : "w-64"
      )}
    >
      {content}
    </aside>
  );
}

export function SidebarTrigger() {
  const { isMobile, setOpen } = useSidebar();
  if (!isMobile) return null;
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setOpen(true)}
      aria-label="Open menu"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
