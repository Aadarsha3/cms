import { useState } from "react";
import { Users, GraduationCap, BookOpen, ClipboardCheck, TrendingUp, Calendar, FileText, Bell, Plus, Edit, Trash2 } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { Link } from "wouter";

// todo: remove mock functionality
const mockStats = {
  admin: [
    { title: "Total Students", value: "2,847", icon: Users, trend: { value: 12, label: "this semester" } },
    { title: "Active Programs", value: "24", icon: GraduationCap, trend: { value: 4, label: "new programs" } },
    { title: "Courses", value: "186", icon: BookOpen },
    { title: "Staff Members", value: "124", icon: Users },
  ],
  staff: [
    { title: "My Students", value: "156", icon: Users },
    { title: "Courses Teaching", value: "4", icon: BookOpen },
    { title: "Avg. Attendance", value: "87%", icon: ClipboardCheck, trend: { value: 3, label: "vs last month" } },
    { title: "Pending Grades", value: "28", icon: FileText },
  ],
  student: [
    { title: "Enrolled Courses", value: "5", icon: BookOpen },
    { title: "Attendance Rate", value: "92%", icon: ClipboardCheck, trend: { value: 2, label: "this month" } },
    { title: "Current GPA", value: "3.7", icon: TrendingUp },
    { title: "Credits Earned", value: "86", icon: GraduationCap },
  ],
};

const mockRecentActivity = [
  { id: 1, type: "enrollment", message: "New student enrolled in Computer Science", time: "2 hours ago" },
  { id: 2, type: "grade", message: "Grades published for CS301 - Database Systems", time: "5 hours ago" },
  { id: 3, type: "attendance", message: "Attendance marked for Morning Batch", time: "Today, 9:00 AM" },
  { id: 4, type: "program", message: "New program added: Data Science Masters", time: "Yesterday" },
];

const mockAnnouncements = [
  { id: 1, title: "Semester Registration Open", date: "Dec 15, 2025", content: "Registration for the Spring 2026 semester is now open. Please log in to your student portal to view available courses and complete your registration before the deadline." },
  { id: 2, title: "Holiday Schedule Update", date: "Dec 14, 2025", content: "The college will be closed from December 24th to January 2nd for the winter holidays. All classes will resume on January 3rd, 2026." },
  { id: 3, title: "Library Hours Extended", date: "Dec 13, 2025", content: "Due to finals week, the library will be open 24/7 from December 16th through December 23rd. Study rooms are available on a first-come, first-served basis." },
];



interface Announcement {
  id: number;
  title: string;
  date: string;
  content?: string;
}

export function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<number | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
  });

  if (!user) return null;

  const stats = mockStats[user.role];
  const isAdmin = user.role === "admin";
  const isStaff = user.role === "staff";

  const handleOpenCreateDialog = () => {
    setEditingAnnouncementId(null);
    setAnnouncementForm({ title: "", content: "" });
    setIsAnnouncementDialogOpen(true);
  };

  const handleOpenEditDialog = (announcement: Announcement) => {
    setEditingAnnouncementId(announcement.id);
    setAnnouncementForm({
      title: announcement.title,
      content: announcement.content || "",
    });
    setIsAnnouncementDialogOpen(true);
  };

  const handleSaveAnnouncement = () => {
    if (!announcementForm.title.trim()) {
      toast({ title: "Please enter a title", variant: "destructive" });
      return;
    }

    if (editingAnnouncementId) {
      // Update existing announcement
      setAnnouncements(announcements.map(a =>
        a.id === editingAnnouncementId
          ? { ...a, title: announcementForm.title, content: announcementForm.content }
          : a
      ));
      toast({ title: "Announcement updated successfully" });
    } else {
      // Create new announcement
      const newAnnouncement: Announcement = {
        id: Date.now(),
        title: announcementForm.title,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        content: announcementForm.content,
      };
      setAnnouncements([newAnnouncement, ...announcements]);
      toast({ title: "Announcement created successfully" });
    }

    setAnnouncementForm({ title: "", content: "" });
    setEditingAnnouncementId(null);
    setIsAnnouncementDialogOpen(false);
  };

  const handleDeleteAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
    toast({ title: "Announcement deleted successfully" });
  };

  const handleViewDetails = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDetailDialogOpen(true);
  };

  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-semibold" data-testid="text-welcome">
              Welcome back, {user.name.split(" ")[0]}
            </h2>
            <p className="text-muted-foreground">
              Here's what's happening in your college today.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span data-testid="text-current-date">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.title}
              {...stat}
              testId={`stat-card-${index}`}
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {(isAdmin || isStaff) && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
                <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" data-testid="button-view-all-activity">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0"
                      data-testid={`activity-item-${activity.id}`}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                        <Bell className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
              <CardTitle className="text-lg font-medium">Announcements</CardTitle>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenCreateDialog}
                  className="gap-1"
                  data-testid="button-new-announcement"
                >
                  <Plus className="h-4 w-4" />
                  New
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="flex items-start justify-between gap-4 pb-3 border-b last:border-0 last:pb-0 group"
                    data-testid={`announcement-item-${announcement.id}`}
                  >
                    <div
                      className="flex-1 min-w-0 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleViewDetails(announcement)}
                    >
                      <p className="text-sm font-medium">{announcement.title}</p>
                      <p className="text-xs text-muted-foreground">{announcement.date}</p>
                    </div>
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleOpenEditDialog(announcement)}
                          data-testid={`button-edit-announcement-${announcement.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
                          data-testid={`button-delete-announcement-${announcement.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Link href="/programs">
                  <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-quick-programs">
                    <GraduationCap className="h-4 w-4" />
                    Manage Programs
                  </Button>
                </Link>
                <Link href="/users">
                  <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-quick-users">
                    <Users className="h-4 w-4" />
                    Manage Users
                  </Button>
                </Link>
                <Link href="/attendance">
                  <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-quick-attendance">
                    <ClipboardCheck className="h-4 w-4" />
                    View Attendance
                  </Button>
                </Link>
                <Link href="/results">
                  <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-quick-results">
                    <FileText className="h-4 w-4" />
                    View Results
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isAnnouncementDialogOpen} onOpenChange={setIsAnnouncementDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingAnnouncementId ? "Edit Announcement" : "Create New Announcement"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="announcement-title">Title</Label>
              <Input
                id="announcement-title"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                placeholder="Announcement title"
                data-testid="input-announcement-title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="announcement-content">Content</Label>
              <Textarea
                id="announcement-content"
                value={announcementForm.content}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                placeholder="Announcement details..."
                rows={4}
                data-testid="input-announcement-content"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAnnouncementDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAnnouncement} data-testid="button-save-announcement">
              {editingAnnouncementId ? "Update" : "Create"} Announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedAnnouncement?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              {selectedAnnouncement?.date}
            </p>
            <p className="text-sm whitespace-pre-wrap">
              {selectedAnnouncement?.content || "No additional details provided."}
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDetailDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout >
  );
}
