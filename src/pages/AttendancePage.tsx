import { useState } from "react";
import { Search, Download, Check, X, Calendar, Users, Plus } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";

// todo: remove mock functionality
interface AttendanceRecord {
  id: string;
  personId: string;
  personName: string;
  course?: string;
  department?: string;
  date: string;
  status: "present" | "absent" | "late";
}

const mockStudentAttendance: AttendanceRecord[] = [
  { id: "1", personId: "STU2024001", personName: "Emily Parker", course: "CS101", date: "2025-12-15", status: "present" },
  { id: "2", personId: "STU2024002", personName: "James Wilson", course: "MBA501", date: "2025-12-15", status: "present" },
  { id: "3", personId: "STU2023015", personName: "Robert Lee", course: "ME301", date: "2025-12-15", status: "absent" },
  { id: "4", personId: "STU2024001", personName: "Emily Parker", course: "CS201", date: "2025-12-15", status: "late" },
  { id: "5", personId: "STU2024003", personName: "Sarah Brown", course: "CS101", date: "2025-12-15", status: "present" },
  { id: "6", personId: "STU2024004", personName: "Michael Davis", course: "CS101", date: "2025-12-15", status: "present" },
  { id: "7", personId: "STU2024001", personName: "Emily Parker", course: "CS101", date: "2025-12-14", status: "present" },
  { id: "8", personId: "STU2024002", personName: "James Wilson", course: "MBA501", date: "2025-12-14", status: "late" },
];

const mockStaffAttendance: AttendanceRecord[] = [
  { id: "s1", personId: "FAC001", personName: "Prof. Michael Chen", department: "Computer Science", date: "2025-12-15", status: "present" },
  { id: "s2", personId: "FAC002", personName: "Dr. Lisa Wang", department: "Computer Science", date: "2025-12-15", status: "present" },
  { id: "s3", personId: "FAC003", personName: "Prof. James Wilson", department: "Business", date: "2025-12-15", status: "late" },
  { id: "s4", personId: "FAC004", personName: "Dr. Robert Lee", department: "Mechanical Engineering", date: "2025-12-15", status: "present" },
  { id: "s5", personId: "STF001", personName: "Mary Johnson", department: "Administration", date: "2025-12-15", status: "present" },
  { id: "s6", personId: "STF002", personName: "Tom Adams", department: "IT Support", date: "2025-12-15", status: "absent" },
  { id: "s7", personId: "FAC001", personName: "Prof. Michael Chen", department: "Computer Science", date: "2025-12-14", status: "present" },
  { id: "s8", personId: "FAC002", personName: "Dr. Lisa Wang", department: "Computer Science", date: "2025-12-14", status: "present" },
];

interface LeaveRequest {
  id: number;
  personName: string;
  role: "Student" | "Staff";
  type: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: "Pending" | "Approved" | "Rejected";
}

const mockAllLeaveRequests: LeaveRequest[] = [
  { id: 1, personName: "Emily Parker", role: "Student", type: "Sick Leave", reason: "Viral fever", startDate: "2025-12-23", endDate: "2025-12-25", status: "Pending" },
  { id: 2, personName: "James Wilson", role: "Student", type: "Casual Leave", reason: "Family event", startDate: "2025-12-28", endDate: "2025-12-29", status: "Pending" },
  { id: 3, personName: "Mark Robinson", role: "Student", type: "Medical Leave", reason: "Surgery recovery", startDate: "2026-01-05", endDate: "2026-01-15", status: "Approved" },
];

const courses = ["CS101", "CS201", "MBA501", "ME301"];
const departments = ["Computer Science", "Business", "Mechanical Engineering", "Administration", "IT Support"];

// Mock student list for adding new attendance
const mockStudentList = [
  { id: "STU2024001", name: "Emily Parker", course: "CS101" },
  { id: "STU2024002", name: "James Wilson", course: "MBA501" },
  { id: "STU2024003", name: "Sarah Brown", course: "CS101" },
  { id: "STU2024004", name: "Michael Davis", course: "CS101" },
  { id: "STU2023015", name: "Robert Lee", course: "ME301" },
  { id: "STU2024005", name: "Jennifer Martinez", course: "CS201" },
  { id: "STU2024006", name: " David Anderson", course: "CS101" },
];

// Mock staff list for marking staff attendance
const mockStaffList = [
  { id: "FAC001", name: "Prof. Michael Chen", department: "Computer Science" },
  { id: "FAC002", name: "Dr. Lisa Wang", department: "Computer Science" },
  { id: "FAC003", name: "Prof. James Wilson", department: "Business" },
  { id: "FAC004", name: "Dr. Robert Lee", department: "Mechanical Engineering" },
  { id: "STF001", name: "Mary Johnson", department: "Administration" },
  { id: "STF002", name: "Tom Adams", department: "IT Support" },
];

const statusColors = {
  present: "bg-primary text-primary-foreground",
  absent: "bg-destructive text-destructive-foreground",
  late: "bg-primary text-primary-foreground",
};

export function AttendancePage() {
  const { user } = useAuth();
  const [studentRecords, setStudentRecords] = useState(mockStudentAttendance);
  const [staffRecords, setStaffRecords] = useState(mockStaffAttendance);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("students");
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [isMarkingStaffAttendance, setIsMarkingStaffAttendance] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [studentAttendanceMap, setStudentAttendanceMap] = useState<Record<string, "present" | "absent" | "late">>({});
  const [staffAttendanceMap, setStaffAttendanceMap] = useState<Record<string, "present" | "absent" | "late">>({});

  // State for full-page marking mode
  const [isInMarkingMode, setIsInMarkingMode] = useState(false);
  const [markingType, setMarkingType] = useState<"student" | "staff" | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockAllLeaveRequests);
  const { toast } = useToast();

  const userRole = user?.role || "student";
  const isAdmin = userRole === "admin";
  const isStaff = userRole === "staff";
  const isStudent = userRole === "student";

  // Staff can only see their assigned courses
  const staffAssignedCourses = user?.assignedCourses || [];

  const handleAuditLeave = (id: number, status: "Approved" | "Rejected") => {
    setLeaveRequests(leaveRequests.map(req =>
      req.id === id ? { ...req, status } : req
    ));
    toast({ title: `Leave request ${status.toLowerCase()} successfully` });
  };

  const pendingLeaveRequests = leaveRequests.filter(req => req.status === "Pending");

  const getFilteredStudentRecords = () => {
    let filtered = studentRecords.filter((r) => {
      const matchesSearch =
        r.personName.toLowerCase().includes(search.toLowerCase()) ||
        r.personId.toLowerCase().includes(search.toLowerCase());
      const matchesCourse = courseFilter === "all" || r.course === courseFilter;
      const matchesDate = !dateFilter || r.date === dateFilter;
      return matchesSearch && matchesCourse && matchesDate;
    });

    // Staff can only see their assigned courses
    if (isStaff) {
      filtered = filtered.filter((r) => r.course && staffAssignedCourses.includes(r.course));
    }

    // Students can only see their own attendance
    if (isStudent && user) {
      filtered = filtered.filter((r) => r.personName === user.name);
    }

    return filtered;
  };

  const getFilteredStaffRecords = () => {
    return staffRecords.filter((r) => {
      const matchesSearch =
        r.personName.toLowerCase().includes(search.toLowerCase()) ||
        r.personId.toLowerCase().includes(search.toLowerCase());
      const matchesDepartment = departmentFilter === "all" || r.department === departmentFilter;
      const matchesDate = !dateFilter || r.date === dateFilter;
      return matchesSearch && matchesDepartment && matchesDate;
    });
  };

  const filteredStudentRecords = getFilteredStudentRecords();
  const filteredStaffRecords = getFilteredStaffRecords();

  const updateStudentStatus = (id: string, status: AttendanceRecord["status"]) => {
    setStudentRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const updateStaffStatus = (id: string, status: AttendanceRecord["status"]) => {
    setStaffRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({ title: "Attendance records saved" });
  };

  const handleExport = () => {
    toast({ title: "Exporting attendance data..." });
  };

  const handleMarkAttendance = () => {
    if (!selectedCourse || !attendanceDate) {
      toast({ title: "Please select course and date", variant: "destructive" });
      return;
    }

    // Navigate to full-page marking mode
    setIsMarkingAttendance(false);
    setMarkingType("student");
    setIsInMarkingMode(true);
  };

  const handleMarkStaffAttendance = () => {
    if (!selectedDepartment || !attendanceDate) {
      toast({ title: "Please select department and date", variant: "destructive" });
      return;
    }

    // Navigate to full-page marking mode
    setIsMarkingStaffAttendance(false);
    setMarkingType("staff");
    setIsInMarkingMode(true);
  };

  const handleSaveMarkedAttendance = () => {
    if (markingType === "student") {
      const newRecords: AttendanceRecord[] = Object.entries(studentAttendanceMap).map(([studentId, status]) => {
        const student = mockStudentList.find(s => s.id === studentId);
        return {
          id: `${studentId}-${attendanceDate}-${Date.now()}`,
          personId: studentId,
          personName: student?.name || "Unknown",
          course: selectedCourse,
          date: attendanceDate,
          status,
        };
      });

      setStudentRecords(prev => [...prev, ...newRecords]);
      toast({ title: `Attendance marked for ${newRecords.length} students` });
    } else if (markingType === "staff") {
      const newRecords: AttendanceRecord[] = Object.entries(staffAttendanceMap).map(([staffId, status]) => {
        const staff = mockStaffList.find(s => s.id === staffId);
        return {
          id: `${staffId}-${attendanceDate}-${Date.now()}`,
          personId: staffId,
          personName: staff?.name || "Unknown",
          department: staff?.department,
          date: attendanceDate,
          status,
        };
      });

      setStaffRecords(prev => [...prev, ...newRecords]);
      toast({ title: `Staff attendance marked for ${newRecords.length} members` });
    }

    // Reset and exit
    setIsInMarkingMode(false);
    setStudentAttendanceMap({});
    setStaffAttendanceMap({});
    setSelectedCourse("");
    setSelectedDepartment("");
    setMarkingType(null);
  };

  const markAllAs = (status: "present" | "absent" | "late") => {
    if (markingType === "student") {
      const allStudents = mockStudentList.filter(s => s.course === selectedCourse);
      const newMap: Record<string, "present" | "absent" | "late"> = {};
      allStudents.forEach(student => {
        newMap[student.id] = status;
      });
      setStudentAttendanceMap(newMap);
    } else if (markingType === "staff") {
      const allStaff = mockStaffList.filter(s => s.department === selectedDepartment);
      const newMap: Record<string, "present" | "absent" | "late"> = {};
      allStaff.forEach(staff => {
        newMap[staff.id] = status;
      });
      setStaffAttendanceMap(newMap);
    }
  };

  const toggleStudentAttendance = (studentId: string, status: "present" | "absent" | "late") => {
    setStudentAttendanceMap(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const toggleStaffAttendance = (staffId: string, status: "present" | "absent" | "late") => {
    setStaffAttendanceMap(prev => ({
      ...prev,
      [staffId]: status,
    }));
  };

  const currentRecords = activeTab === "students" ? filteredStudentRecords : filteredStaffRecords;
  const presentCount = currentRecords.filter((r) => r.status === "present").length;
  const absentCount = currentRecords.filter((r) => r.status === "absent").length;
  const lateCount = currentRecords.filter((r) => r.status === "late").length;

  // Determine if user can edit based on role and tab
  const canEditStudents = isStaff;
  const canEditStaff = isAdmin;

  // Full-page attendance marking interface
  if (isInMarkingMode) {
    const listToDisplay = markingType === "student"
      ? mockStudentList.filter(s => s.course === selectedCourse)
      : mockStaffList.filter(s => s.department === selectedDepartment);

    const attendanceMap = markingType === "student" ? studentAttendanceMap : staffAttendanceMap;
    const markedCount = Object.keys(attendanceMap).length;
    const presentCount = Object.values(attendanceMap).filter(s => s === "present").length;
    const absentCount = Object.values(attendanceMap).filter(s => s === "absent").length;
    const lateCount = Object.values(attendanceMap).filter(s => s === "late").length;

    return (
      <MainLayout title="Mark Attendance">
        <div className="space-y-6">
          {/* Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Mark Attendance</h2>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span><strong>{markingType === "student" ? "Course:" : "Department:"}</strong> {markingType === "student" ? selectedCourse : selectedDepartment}</span>
                    <span><strong>Date:</strong> {new Date(attendanceDate).toLocaleDateString()}</span>
                    <span><strong>Total:</strong> {listToDisplay.length}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsInMarkingMode(false);
                    setStudentAttendanceMap({});
                    setStaffAttendanceMap({});
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Marked</p>
                <p className="text-2xl font-bold">{markedCount}/{listToDisplay.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-4/20 text-chart-4">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Present</p>
                  <p className="text-2xl font-bold">{presentCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20 text-destructive">
                  <X className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Absent</p>
                  <p className="text-2xl font-bold">{absentCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Late</p>
                <p className="text-2xl font-bold">{lateCount}</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Quick Actions:</span>
                <Button size="sm" onClick={() => markAllAs("present")} className="gap-2">
                  <Check className="h-4 w-4" />
                  Mark All Present
                </Button>
                <Button size="sm" variant="destructive" onClick={() => markAllAs("absent")} className="gap-2">
                  <X className="h-4 w-4" />
                  Mark All Absent
                </Button>
                <Button size="sm" variant="secondary" onClick={() => markAllAs("late")} className="gap-2">
                  Mark All Late
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">No.</TableHead>
                    <TableHead className="w-32">{markingType === "student" ? "Student ID" : "Staff ID"}</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-80">Mark Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listToDisplay.map((person, index) => {
                    const currentStatus = attendanceMap[person.id];
                    return (
                      <TableRow key={person.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="font-mono text-sm">{person.id}</TableCell>
                        <TableCell className="font-medium">{person.name}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={currentStatus === "present" ? "default" : "outline"}
                              onClick={() => {
                                const toggle = markingType === "student" ? toggleStudentAttendance : toggleStaffAttendance;
                                toggle(person.id, "present");
                              }}
                              className="flex-1">
                              <Check className="h-4 w-4 mr-1" />
                              Present
                            </Button>
                            <Button
                              size="sm"
                              variant={currentStatus === "absent" ? "destructive" : "outline"}
                              onClick={() => {
                                const toggle = markingType === "student" ? toggleStudentAttendance : toggleStaffAttendance;
                                toggle(person.id, "absent");
                              }}
                              className="flex-1">
                              <X className="h-4 w-4 mr-1" />
                              Absent
                            </Button>
                            <Button
                              size="sm"
                              variant={currentStatus === "late" ? "secondary" : "outline"}
                              onClick={() => {
                                const toggle = markingType === "student" ? toggleStudentAttendance : toggleStaffAttendance;
                                toggle(person.id, "late");
                              }}
                              className="flex-1">
                              Late
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsInMarkingMode(false);
                setStudentAttendanceMap({});
                setStaffAttendanceMap({});
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveMarkedAttendance}
              disabled={markedCount === 0}
              size="lg"
            >
              Save Attendance ({markedCount}/{listToDisplay.length})
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Attendance Management">
      <div className="space-y-6">
        {/* Tabs for Admin */}
        {isAdmin && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="students">Student Attendance</TabsTrigger>
              <TabsTrigger value="staff">Staff/Faculty Attendance</TabsTrigger>
              <TabsTrigger value="leave">Leave Applications</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {/* Filter and Action Bar - Hide filters for Leave tab for simplicity or adapt */}
        {activeTab !== "leave" && (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {activeTab === "students" ? "Student Attendance Records" : "Staff Attendance Records"}
                    </h3>
                    {/* Mark New Attendance Buttons */}
                    <div className="flex gap-2">
                      {isStaff && activeTab === "students" && (
                        <Dialog open={isMarkingAttendance} onOpenChange={setIsMarkingAttendance}>
                          <DialogTrigger asChild>
                            <Button className="gap-2">
                              <Plus className="h-4 w-4" />
                              Mark New Attendance
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Select Course & Date</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="course">Course</Label>
                                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select course" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {(isStaff ? staffAssignedCourses : courses).map((c) => (
                                      <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="attendanceDate">Date</Label>
                                <Input
                                  id="attendanceDate"
                                  type="date"
                                  value={attendanceDate}
                                  onChange={(e) => setAttendanceDate(e.target.value)}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsMarkingAttendance(false)}>Cancel</Button>
                              <Button onClick={handleMarkAttendance}>Start Marking</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                      {isAdmin && activeTab === "staff" && (
                        <Dialog open={isMarkingStaffAttendance} onOpenChange={setIsMarkingStaffAttendance}>
                          <DialogTrigger asChild>
                            <Button className="gap-2">
                              <Plus className="h-4 w-4" />
                              Mark Staff Attendance
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Select Department & Date</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="department">Department</Label>
                                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {departments.map((d) => (
                                      <SelectItem key={d} value={d}>{d}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="staffAttendanceDate">Date</Label>
                                <Input
                                  id="staffAttendanceDate"
                                  type="date"
                                  value={attendanceDate}
                                  onChange={(e) => setAttendanceDate(e.target.value)}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsMarkingStaffAttendance(false)}>Cancel</Button>
                              <Button onClick={handleMarkStaffAttendance}>Start Marking</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    {activeTab === "students" ? (
                      <Select value={courseFilter} onValueChange={setCourseFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Courses</SelectItem>
                          {(isStaff ? staffAssignedCourses : courses).map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          {departments.map((d) => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <Input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      placeholder="Filter by date"
                    />
                    <div className="flex gap-2">
                      {((canEditStudents && activeTab === "students") || (canEditStaff && activeTab === "staff")) && (
                        <>
                          {isEditing ? (
                            <>
                              <Button onClick={handleSave} size="sm" className="flex-1">
                                Save Changes
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <Button variant="outline" onClick={() => setIsEditing(true)} size="sm" className="flex-1">
                              Edit Mode
                            </Button>
                          )}
                        </>
                      )}
                      <Button variant="outline" onClick={handleExport} size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-4/20 text-chart-4">
                    <Check className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{presentCount}</p>
                    <p className="text-sm text-muted-foreground">Present</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20 text-destructive">
                    <X className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{absentCount}</p>
                    <p className="text-sm text-muted-foreground">Absent</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-2/20 text-chart-2">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{lateCount}</p>
                    <p className="text-sm text-muted-foreground">Late</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Attendance Table */}
            <Card>
              <CardContent className="p-0">
                {activeTab === "students" ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-32">Student ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="w-28">Course</TableHead>
                        <TableHead className="w-32">Date</TableHead>
                        <TableHead className="w-28">Status</TableHead>
                        {isEditing && canEditStudents && <TableHead className="w-40">Change Status</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudentRecords.length > 0 ? (
                        filteredStudentRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-mono text-sm">{record.personId}</TableCell>
                            <TableCell className="font-medium">{record.personName}</TableCell>
                            <TableCell>{record.course}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(record.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge className={statusColors[record.status]}>
                                {record.status}
                              </Badge>
                            </TableCell>
                            {isEditing && canEditStudents && (
                              <TableCell>
                                <Select
                                  value={record.status}
                                  onValueChange={(v) =>
                                    updateStudentStatus(record.id, v as AttendanceRecord["status"])
                                  }
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="present">Present</SelectItem>
                                    <SelectItem value="absent">Absent</SelectItem>
                                    <SelectItem value="late">Late</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={isEditing && canEditStudents ? 6 : 5} className="h-32 text-center text-muted-foreground">
                            No attendance records found for the selected filters.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-32">Staff ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="w-44">Department</TableHead>
                        <TableHead className="w-32">Date</TableHead>
                        <TableHead className="w-28">Status</TableHead>
                        {isEditing && isAdmin && <TableHead className="w-40">Change Status</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStaffRecords.length > 0 ? (
                        filteredStaffRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-mono text-sm">{record.personId}</TableCell>
                            <TableCell className="font-medium">{record.personName}</TableCell>
                            <TableCell>{record.department}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(record.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge className={statusColors[record.status]}>
                                {record.status}
                              </Badge>
                            </TableCell>
                            {isEditing && isAdmin && (
                              <TableCell>
                                <Select
                                  value={record.status}
                                  onValueChange={(v) =>
                                    updateStaffStatus(record.id, v as AttendanceRecord["status"])
                                  }
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="present">Present</SelectItem>
                                    <SelectItem value="absent">Absent</SelectItem>
                                    <SelectItem value="late">Late</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={isEditing && isAdmin ? 6 : 5} className="h-32 text-center text-muted-foreground">
                            No attendance records found for the selected filters.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "leave" && (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.personName}</TableCell>
                      <TableCell>{req.role}</TableCell>
                      <TableCell>{req.type}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{req.startDate} to {req.endDate}</TableCell>
                      <TableCell className="text-sm max-w-[200px] truncate" title={req.reason}>{req.reason}</TableCell>
                      <TableCell>
                        <Badge
                          variant={req.status === 'Approved' ? 'default' : req.status === 'Rejected' ? 'destructive' : 'secondary'}
                        >
                          {req.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {req.status === "Pending" && (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="default" onClick={() => handleAuditLeave(req.id, "Approved")}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleAuditLeave(req.id, "Rejected")}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {leaveRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">No leave requests found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout >
  );
}
