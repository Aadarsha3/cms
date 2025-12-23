import { useState, useRef, ChangeEvent } from "react";
import { Search, Trash2, X, UserPlus, Camera, Edit } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff" | "student";
  department: string;
  status: "active" | "inactive";
  phone?: string;
  collegeId?: string;
  universityId?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  currentClass?: string;
  semester?: string;
  guardianName?: string;
  guardianContact?: string;
  guardianRelationship?: string;
  enrollmentDate?: string;
  enrolledCourses?: string[]; // Course codes student is enrolled in
  avatarUrl?: string;
}

const mockUsers: UserRecord[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@college.edu",
    role: "admin",
    department: "Administration",
    status: "active",
    phone: "+1 555-0101",
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    email: "michael.chen@college.edu",
    role: "staff",
    department: "Computer Science",
    status: "active",
    phone: "+1 555-0102",
  },
  {
    id: "3",
    name: "Emily Parker",
    email: "emily.parker@student.college.edu",
    role: "student",
    department: "Computer Science",
    collegeId: "COL2024001",
    universityId: "UNI2024001",
    dateOfBirth: "2002-05-15",
    gender: "female",
    currentClass: "BCS Year 3",
    semester: "5",
    guardianName: "Robert Parker",
    guardianContact: "+1 555-0150",
    guardianRelationship: "Father",
    enrollmentDate: "2024-09-01",
    status: "active",
    phone: "+1 555-0103",
    enrolledCourses: ["CS101", "CS201", "CS301"], // Enrolled courses
  },
  {
    id: "4",
    name: "Dr. Lisa Wang",
    email: "lisa.wang@college.edu",
    role: "staff",
    department: "Computer Science",
    status: "active",
    phone: "+1 555-0104",
  },
  {
    id: "5",
    name: "James Wilson",
    email: "james.wilson@student.college.edu",
    role: "student",
    department: "Business Administration",
    collegeId: "COL2024002",
    universityId: "UNI2024002",
    dateOfBirth: "2001-08-22",
    gender: "male",
    currentClass: "MBA Year 1",
    semester: "2",
    guardianName: "Mary Wilson",
    guardianContact: "+1 555-0160",
    guardianRelationship: "Mother",
    enrollmentDate: "2024-09-01",
    status: "active",
    enrolledCourses: ["MBA501"], // Enrolled in MBA course only
  },
  {
    id: "6",
    name: "Robert Lee",
    email: "robert.lee@student.college.edu",
    role: "student",
    department: "Mechanical Engineering",
    collegeId: "COL2023015",
    universityId: "UNI2023015",
    dateOfBirth: "2000-11-10",
    gender: "male",
    currentClass: "BME Year 4",
    semester: "7",
    guardianName: "Jennifer Lee",
    guardianContact: "+1 555-0170",
    guardianRelationship: "Mother",
    enrollmentDate: "2023-09-01",
    status: "inactive",
    enrolledCourses: ["ME301"], // Enrolled in Mechanical Engineering course
  },
];

const departments = [
  "Administration",
  "Computer Science",
  "Business Administration",
  "Mechanical Engineering",
  "Physics",
  "Mathematics",
];

const classes = [
  "BCS Year 1",
  "BCS Year 2",
  "BCS Year 3",
  "BCS Year 4",
  "MBA Year 1",
  "MBA Year 2",
  "BME Year 1",
  "BME Year 2",
  "BME Year 3",
  "BME Year 4",
];

const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];



const roleColors = {
  admin: "bg-primary text-primary-foreground",
  staff: "bg-primary text-primary-foreground",
  student: "bg-primary text-primary-foreground",
};

const roleLabels = {
  admin: "Administrator",
  staff: "Staff",
  student: "Student",
};

interface StudentFormData {
  collegeId: string;
  universityId: string;
  dateOfBirth: string;
  gender: string;
  currentClass: string;
  semester: string;
  guardianName: string;
  guardianContact: string;
  guardianRelationship: string;
}

export function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();

  const userRole = user?.role || "admin";
  const isStaff = userRole === "staff";
  const staffAssignedCourses = user?.assignedCourses || [];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student" as UserRecord["role"],
    department: "",
    phone: "",
    status: "active" as "active" | "inactive",
    collegeId: "",
  });

  const [studentFormData, setStudentFormData] = useState<StudentFormData>({
    collegeId: "", // Legacy support, will sync
    universityId: "",
    dateOfBirth: "",
    gender: "",
    currentClass: "",
    semester: "",
    guardianName: "",
    guardianContact: "",
    guardianRelationship: "",
  });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [avatarUpload, setAvatarUpload] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Image size should be less than 5MB", variant: "destructive" });
        return;
      }
      const url = URL.createObjectURL(file);
      setAvatarUpload(url);
      toast({ title: "Photo selected" });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.collegeId && u.collegeId.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesDept = deptFilter === "all" || u.department === deptFilter;

    // Faculty can only see students enrolled in their assigned courses
    if (isStaff && u.role === "student") {
      const studentEnrolledCourses = u.enrolledCourses || [];
      const hasCommonCourse = studentEnrolledCourses.some(course =>
        staffAssignedCourses.includes(course)
      );
      if (!hasCommonCourse) return false;
    }

    return matchesSearch && matchesRole && matchesDept;
  });

  const openCreateDialog = () => {
    setEditingUserId(null);
    setFormData({ name: "", email: "", role: "student", department: "", phone: "", status: "active", collegeId: "" });
    setStudentFormData({
      collegeId: "",
      universityId: "",
      dateOfBirth: "",
      gender: "",
      currentClass: "",
      semester: "",
      guardianName: "",
      guardianContact: "",
      guardianRelationship: "",
    });
    setAvatarUpload(null);
    setIsDialogOpen(true);
  };

  const openUserDetails = (user: UserRecord) => {
    setSelectedUser(user);
    setIsSheetOpen(true);
  };

  const handleEdit = (user: UserRecord) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      phone: user.phone || "",
      status: user.status,
      collegeId: user.collegeId || "",
    });

    setStudentFormData({
      collegeId: user.collegeId || "",
      universityId: user.universityId || "",
      dateOfBirth: user.dateOfBirth || "",
      gender: user.gender || "",
      currentClass: user.currentClass || "",
      semester: user.semester || "",
      guardianName: user.guardianName || "",
      guardianContact: user.guardianContact || "",
      guardianRelationship: user.guardianRelationship || "",
    });
    setAvatarUpload(user.avatarUrl || null);
    setIsDialogOpen(true);
    setIsSheetOpen(false); // Close sheet if open
  };

  const handleSave = () => {
    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.department || !formData.collegeId.trim()) {
      const idLabel = formData.role === "staff" ? "Staff_Id" : formData.role === "student" ? "Student_Id" : "Admin_Id";
      toast({ title: `Please fill in all basic information fields including ${idLabel}`, variant: "destructive" });
      return;
    }

    if (formData.role === "student") {
      if (
        !studentFormData.dateOfBirth ||
        !studentFormData.gender ||
        !studentFormData.currentClass ||
        !studentFormData.semester ||
        !studentFormData.guardianName.trim() ||
        !studentFormData.guardianContact.trim() ||
        !studentFormData.guardianRelationship.trim()
      ) {
        toast({ title: "Please fill in all student details", variant: "destructive" });
        return;
      }
    }

    const baseUser = {
      // If editing, keep ID, else create new
      id: editingUserId || Date.now().toString(),
      ...formData,
      status: formData.status, // Explicitly set status from form
    };

    const newUser: UserRecord = formData.role === "student"
      ? {
        ...baseUser,
        collegeId: formData.collegeId, // Use common College ID
        universityId: studentFormData.universityId || `UNI${Date.now().toString().slice(-7)}`,
        dateOfBirth: studentFormData.dateOfBirth,
        gender: studentFormData.gender as UserRecord["gender"],
        currentClass: studentFormData.currentClass,
        semester: studentFormData.semester,
        guardianName: studentFormData.guardianName,
        guardianContact: studentFormData.guardianContact,
        guardianRelationship: studentFormData.guardianRelationship,
        enrollmentDate: editingUserId ? (users.find(u => u.id === editingUserId)?.enrollmentDate || new Date().toISOString().split("T")[0]) : new Date().toISOString().split("T")[0],
        avatarUrl: avatarUpload || undefined,
      }
      : { ...baseUser, collegeId: formData.collegeId, avatarUrl: avatarUpload || undefined };

    if (editingUserId) {
      setUsers((prev) => prev.map((u) => u.id === editingUserId ? newUser : u));
      toast({ title: "User updated successfully" });
    } else {
      setUsers((prev) => [...prev, newUser]);
      toast({ title: `${roleLabels[formData.role]} enrolled successfully` });
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast({ title: "User removed", variant: "destructive" });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <MainLayout title="Identity Management">
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                data-testid="input-search-users"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40" data-testid="select-role-filter">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-dept-filter">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={openCreateDialog} className="gap-2" data-testid="button-add-user">
              <UserPlus className="h-4 w-4" />
              Enroll User
            </Button>
          </div>

          {(roleFilter !== "all" || deptFilter !== "all") && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Filters:</span>
              {roleFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  onClick={() => setRoleFilter("all")}
                >
                  Role: {roleLabels[roleFilter as keyof typeof roleLabels]}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {deptFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  onClick={() => setDeptFilter("all")}
                >
                  Dept: {deptFilter}
                  <X className="h-3 w-3" />
                </Badge>
              )}
            </div>
          )}
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden lg:table-cell">Department</TableHead>
                  <TableHead className="hidden xl:table-cell">ID</TableHead>
                  <TableHead className="w-20 text-center">Status</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="cursor-pointer"
                    onClick={() => openUserDetails(user)}
                    data-testid={`row-user-${user.id}`}
                  >
                    <TableCell>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback className="text-xs">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground md:hidden">
                          {user.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge className={roleColors[user.role]}>
                        {roleLabels[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {user.department}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell font-mono text-sm text-muted-foreground">
                      {user.collegeId || "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={user.status === "active" ? "secondary" : "outline"}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(user)}
                          data-testid={`button-edit-user-${user.id}`}
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user.id)}
                          data-testid={`button-delete-user-${user.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{editingUserId ? "Edit User" : "Enroll New User"}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUpload || ""} />
                  <AvatarFallback className="text-2xl">
                    {formData.name ? getInitials(formData.name) : "?"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute -bottom-2 -right-2 rounded-full"
                  onClick={triggerFileInput}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(v) => setFormData({ ...formData, role: v as UserRecord["role"] })}
                >
                  <SelectTrigger data-testid="select-user-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />
              <p className="text-sm font-medium text-muted-foreground">Basic Information</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., John Smith"
                    data-testid="input-user-name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g., john.smith@college.edu"
                    data-testid="input-user-email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(v) => setFormData({ ...formData, department: v })}
                  >
                    <SelectTrigger data-testid="select-user-department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g., +1 555-0100"
                    data-testid="input-user-phone"
                  />
                </div>
              </div>



              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="collegeId">
                    {formData.role === "staff" ? "Staff_Id" :
                      formData.role === "student" ? "Student_Id" :
                        formData.role === "admin" ? "Admin_Id" : "College ID"}
                  </Label>
                  <Input
                    id="collegeId"
                    value={formData.collegeId}
                    onChange={(e) => setFormData({ ...formData, collegeId: e.target.value })}
                    placeholder="e.g., COL2024001"
                    data-testid="input-college-id"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => setFormData({ ...formData, status: v as "active" | "inactive" })}
                  >
                    <SelectTrigger data-testid="select-user-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.role === "student" && (
                <>
                  <Separator />
                  <p className="text-sm font-medium text-muted-foreground">Student Identification</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="universityId">University ID</Label>
                      <Input
                        id="universityId"
                        value={studentFormData.universityId}
                        onChange={(e) => setStudentFormData({ ...studentFormData, universityId: e.target.value })}
                        placeholder="e.g., UNI2024001"
                        data-testid="input-university-id"
                      />
                    </div>
                  </div>

                  <Separator />
                  <p className="text-sm font-medium text-muted-foreground">Personal Details</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={studentFormData.dateOfBirth}
                        onChange={(e) => setStudentFormData({ ...studentFormData, dateOfBirth: e.target.value })}
                        data-testid="input-dob"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={studentFormData.gender}
                        onValueChange={(v) => setStudentFormData({ ...studentFormData, gender: v })}
                      >
                        <SelectTrigger data-testid="select-gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />
                  <p className="text-sm font-medium text-muted-foreground">Academic Details</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="currentClass">Class</Label>
                      <Select
                        value={studentFormData.currentClass}
                        onValueChange={(v) => setStudentFormData({ ...studentFormData, currentClass: v })}
                      >
                        <SelectTrigger data-testid="select-class">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="semester">Semester</Label>
                      <Select
                        value={studentFormData.semester}
                        onValueChange={(v) => setStudentFormData({ ...studentFormData, semester: v })}
                      >
                        <SelectTrigger data-testid="select-semester">
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {semesters.map((s) => (
                            <SelectItem key={s} value={s}>
                              Semester {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />
                  <p className="text-sm font-medium text-muted-foreground">Guardian Information</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="guardianName">Guardian Name</Label>
                      <Input
                        id="guardianName"
                        value={studentFormData.guardianName}
                        onChange={(e) => setStudentFormData({ ...studentFormData, guardianName: e.target.value })}
                        placeholder="e.g., Robert Smith"
                        data-testid="input-guardian-name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="guardianContact">Guardian Contact</Label>
                      <Input
                        id="guardianContact"
                        value={studentFormData.guardianContact}
                        onChange={(e) => setStudentFormData({ ...studentFormData, guardianContact: e.target.value })}
                        placeholder="e.g., +1 555-0100"
                        data-testid="input-guardian-contact"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="guardianRelationship">Relationship</Label>
                    <Input
                      id="guardianRelationship"
                      value={studentFormData.guardianRelationship}
                      onChange={(e) =>
                        setStudentFormData({ ...studentFormData, guardianRelationship: e.target.value })
                      }
                      placeholder="e.g., Father"
                      data-testid="input-guardian-relationship"
                    />
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} data-testid="button-save-user">
              {editingUserId ? "Update User" : "Enroll User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog >

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>User Details</SheetTitle>
          </SheetHeader>
          {selectedUser && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatarUrl} alt={selectedUser.name} />
                  <AvatarFallback className="text-lg">
                    {getInitials(selectedUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold" data-testid="text-detail-name">{selectedUser.name}</h3>
                  <Badge className={roleColors[selectedUser.role]}>
                    {roleLabels[selectedUser.role]}
                  </Badge>
                </div>
              </div>

              <Separator />
              <p className="text-sm font-medium">Contact Information</p>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                {selectedUser.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{selectedUser.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{selectedUser.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={selectedUser.status === "active" ? "secondary" : "outline"}>
                    {selectedUser.status}
                  </Badge>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  className="w-full"
                  onClick={() => handleEdit(selectedUser)}
                  data-testid="button-edit-from-sheet"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit User Details
                </Button>
              </div>

              {selectedUser.role === "student" && (
                <>
                  <Separator />
                  <p className="text-sm font-medium">Student Identification</p>
                  <div className="space-y-3">
                    {selectedUser.collegeId && (
                      <div>
                        <p className="text-sm text-muted-foreground">College ID</p>
                        <p className="font-mono">{selectedUser.collegeId}</p>
                      </div>
                    )}
                    {selectedUser.universityId && (
                      <div>
                        <p className="text-sm text-muted-foreground">University ID</p>
                        <p className="font-mono">{selectedUser.universityId}</p>
                      </div>
                    )}
                  </div>

                  <Separator />
                  <p className="text-sm font-medium">Personal Details</p>
                  <div className="space-y-3">
                    {selectedUser.dateOfBirth && (
                      <div>
                        <p className="text-sm text-muted-foreground">Date of Birth</p>
                        <p>{new Date(selectedUser.dateOfBirth).toLocaleDateString()}</p>
                      </div>
                    )}
                    {selectedUser.gender && (
                      <div>
                        <p className="text-sm text-muted-foreground">Gender</p>
                        <p className="capitalize">{selectedUser.gender}</p>
                      </div>
                    )}
                  </div>

                  <Separator />
                  <p className="text-sm font-medium">Academic Details</p>
                  <div className="space-y-3">
                    {selectedUser.currentClass && (
                      <div>
                        <p className="text-sm text-muted-foreground">Class</p>
                        <p>{selectedUser.currentClass}</p>
                      </div>
                    )}
                    {selectedUser.semester && (
                      <div>
                        <p className="text-sm text-muted-foreground">Semester</p>
                        <p>Semester {selectedUser.semester}</p>
                      </div>
                    )}
                    {selectedUser.enrollmentDate && (
                      <div>
                        <p className="text-sm text-muted-foreground">Enrollment Date</p>
                        <p>{new Date(selectedUser.enrollmentDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>

                  {selectedUser.guardianName && (
                    <>
                      <Separator />
                      <p className="text-sm font-medium">Guardian Information</p>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Guardian Name</p>
                          <p>{selectedUser.guardianName}</p>
                        </div>
                        {selectedUser.guardianContact && (
                          <div>
                            <p className="text-sm text-muted-foreground">Guardian Contact</p>
                            <p>{selectedUser.guardianContact}</p>
                          </div>
                        )}
                        {selectedUser.guardianRelationship && (
                          <div>
                            <p className="text-sm text-muted-foreground">Relationship</p>
                            <p>{selectedUser.guardianRelationship}</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </MainLayout>
  );
}
