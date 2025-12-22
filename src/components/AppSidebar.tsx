import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  FileText,
  User,
  BookOpen,
  ClipboardList,
  Building2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth, type UserRole } from "@/lib/auth-context";

interface NavItem {
  title: string;
  url: string;
  icon: typeof LayoutDashboard;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "staff", "student"],
  },
  {
    title: "Academic Programs",
    url: "/programs",
    icon: GraduationCap,
    roles: ["admin"],
  },
  {
    title: "Departments",
    url: "/departments",
    icon: Building2,
    roles: ["admin"],
  },
  {
    title: "Courses",
    url: "/courses",
    icon: BookOpen,
    roles: ["admin", "staff"],
  },
  {
    title: "Identity Management",
    url: "/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "Attendance",
    url: "/attendance",
    icon: ClipboardList,
    roles: ["admin", "staff"],
  },
  {
    title: "Results",
    url: "/results",
    icon: FileText,
    roles: ["admin", "staff"],
  },
  {
    title: "Class Routine",
    url: "/class-routine",
    icon: ClipboardList, // Reusing icon or import Calendar if preferred, looks like user wants it prominent
    roles: ["student", "admin"],
  },
  {
    title: "My Reports",
    url: "/my-reports",
    icon: FileText,
    roles: ["student"],
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
    roles: ["admin", "staff", "student"],
  },
];

const roleLabels: Record<UserRole, string> = {
  admin: "Administrator",
  staff: "Staff Member",
  student: "Student",
};

const roleColors: Record<UserRole, string> = {
  admin: "bg-primary text-primary-foreground",
  staff: "bg-primary text-primary-foreground",
  student: "bg-primary text-primary-foreground",
};

export function AppSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const filteredItems = navItems.filter((item) =>
    item.roles.includes(user.role)
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold" data-testid="text-app-name">MetaHorizon</span>
            <span className="text-xs text-muted-foreground">College Management System</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                  >
                    <Link href={item.url} data-testid={`link-${item.url.slice(1)}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex flex-col gap-3">
          <Badge className={`${roleColors[user.role]} w-fit`} data-testid="badge-user-role">
            {roleLabels[user.role]}
          </Badge>
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium truncate" data-testid="text-user-name">{user.name}</span>
              <span className="text-xs text-muted-foreground truncate">{user.email}</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
