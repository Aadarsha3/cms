import { useState } from "react";
import { Plus, Search, Edit, Trash2, Upload, FileText, X, BookOpen } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";

// todo: remove mock functionality
interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  program: string;
  instructor: string;
  syllabus?: string;
  description: string;
}

const mockCourses: Course[] = [
  {
    id: "1",
    code: "CS101",
    name: "Introduction to Programming",
    credits: 4,
    program: "Bachelor of Computer Science",
    instructor: "Prof. Michael Chen",
    syllabus: "cs101_syllabus.pdf",
    description: "Fundamental programming concepts using Python.",
  },
  {
    id: "2",
    code: "CS201",
    name: "Data Structures",
    credits: 4,
    program: "Bachelor of Computer Science",
    instructor: "Dr. Lisa Wang",
    syllabus: "cs201_syllabus.pdf",
    description: "Advanced data structures and algorithms.",
  },
  {
    id: "3",
    code: "CS301",
    name: "Database Management Systems",
    credits: 4,
    program: "Bachelor of Computer Science",
    instructor: "Dr. Rajesh Kumar",
    syllabus: "cs301_syllabus.pdf",
    description: "Relational database design, SQL, and database administration.",
  },
  {
    id: "4",
    code: "CS401",
    name: "Web Development",
    credits: 3,
    program: "Bachelor of Computer Science",
    instructor: "Prof. Sarah Johnson",
    description: "Modern web development with React, Node.js, and databases.",
  },
  {
    id: "5",
    code: "CS501",
    name: "Artificial Intelligence",
    credits: 4,
    program: "Bachelor of Computer Science",
    instructor: "Dr. Deepak Sharma",
    syllabus: "cs501_syllabus.pdf",
    description: "Machine learning, neural networks, and AI applications.",
  },
  {
    id: "6",
    code: "MBA501",
    name: "Financial Management",
    credits: 3,
    program: "Master of Business Administration",
    instructor: "Prof. James Wilson",
    syllabus: "mba501_syllabus.pdf",
    description: "Corporate finance and investment analysis.",
  },
  {
    id: "7",
    code: "MBA502",
    name: "Strategic Management",
    credits: 3,
    program: "Master of Business Administration",
    instructor: "Dr. Emily Carter",
    description: "Business strategy formulation and competitive analysis.",
  },
  {
    id: "8",
    code: "MBA503",
    name: "Marketing Analytics",
    credits: 3,
    program: "Master of Business Administration",
    instructor: "Prof. Robert Brown",
    syllabus: "mba503_syllabus.pdf",
    description: "Data-driven marketing strategies and consumer behavior.",
  },
  {
    id: "9",
    code: "ME301",
    name: "Thermodynamics",
    credits: 4,
    program: "Bachelor of Mechanical Engineering",
    instructor: "Dr. Robert Lee",
    syllabus: "me301_syllabus.pdf",
    description: "Laws of thermodynamics and applications.",
  },
  {
    id: "10",
    code: "ME302",
    name: "Fluid Mechanics",
    credits: 4,
    program: "Bachelor of Mechanical Engineering",
    instructor: "Prof. Jennifer Davis",
    description: "Principles of fluid statics and dynamics.",
  },
  {
    id: "11",
    code: "ME401",
    name: "Machine Design",
    credits: 4,
    program: "Bachelor of Mechanical Engineering",
    instructor: "Dr. Ahmed Khan",
    syllabus: "me401_syllabus.pdf",
    description: "Design principles for mechanical components and systems.",
  },
  {
    id: "12",
    code: "CE201",
    name: "Structural Analysis",
    credits: 4,
    program: "Bachelor of Civil Engineering",
    instructor: "Prof. Maria Rodriguez",
    syllabus: "ce201_syllabus.pdf",
    description: "Analysis of structures under various loading conditions.",
  },
  {
    id: "13",
    code: "CE301",
    name: "Geotechnical Engineering",
    credits: 3,
    program: "Bachelor of Civil Engineering",
    instructor: "Dr. William Thompson",
    description: "Soil mechanics and foundation engineering.",
  },
  {
    id: "14",
    code: "IT201",
    name: "Computer Networks",
    credits: 3,
    program: "Bachelor of Information Technology",
    instructor: "Prof. Suman Adhikari",
    syllabus: "it201_syllabus.pdf",
    description: "Network protocols, architecture, and security fundamentals.",
  },
  {
    id: "15",
    code: "IT301",
    name: "Cloud Computing",
    credits: 4,
    program: "Bachelor of Information Technology",
    instructor: "Dr. Priya Sharma",
    description: "Cloud platforms, services, and deployment models.",
  },
];

export function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState(mockCourses);
  const [search, setSearch] = useState("");
  const [programFilter, setProgramFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { toast } = useToast();

  const userRole = user?.role || "student";
  const isAdmin = userRole === "admin";
  const isStaff = userRole === "staff";

  // Staff and students cannot create/edit/delete courses, only admin can
  const canManageCourses = isAdmin;

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    credits: "3",
    program: "",
    instructor: "",
    description: "",
    syllabus: "",
  });
  const [syllabusFileName, setSyllabusFileName] = useState("");

  const programs = Array.from(new Set(courses.map((c) => c.program)));

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase());
    const matchesProgram = programFilter === "all" || c.program === programFilter;
    return matchesSearch && matchesProgram;
  });

  const openCreateDialog = () => {
    setFormData({ code: "", name: "", credits: "3", program: "", instructor: "", description: "", syllabus: "" });
    setSyllabusFileName("");
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (course: Course) => {
    setFormData({
      code: course.code,
      name: course.name,
      credits: course.credits.toString(),
      program: course.program,
      instructor: course.instructor,
      description: course.description,
      syllabus: course.syllabus || "",
    });
    setSyllabusFileName(course.syllabus || "");
    setSelectedCourse(course);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (isEditing && selectedCourse) {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === selectedCourse.id
            ? { ...c, ...formData, credits: parseInt(formData.credits), syllabus: syllabusFileName || undefined }
            : c
        )
      );
      toast({ title: "Course updated successfully" });
    } else {
      const newCourse: Course = {
        id: Date.now().toString(),
        ...formData,
        credits: parseInt(formData.credits),
        syllabus: syllabusFileName || undefined,
      };
      setCourses((prev) => [...prev, newCourse]);
      toast({ title: "Course created successfully" });
    }
    setIsDialogOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSyllabusFileName(file.name);
      toast({ title: `File "${file.name}" selected` });
    }
  };

  const removeSyllabus = () => {
    setSyllabusFileName("");
    setFormData({ ...formData, syllabus: "" });
  };

  const handleDelete = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Course deleted", variant: "destructive" });
  };

  const handleUploadSyllabus = (courseId: string) => {
    // todo: remove mock functionality - implement real file upload
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, syllabus: `syllabus_${c.code}.pdf` } : c
      )
    );
    toast({ title: "Syllabus uploaded successfully" });
  };

  return (
    <MainLayout title="Courses">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-testid="input-search-courses"
            />
          </div>
          <Select value={programFilter} onValueChange={setProgramFilter}>
            <SelectTrigger className="w-full sm:w-64" data-testid="select-program-filter">
              <SelectValue placeholder="Filter by program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              {programs.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {canManageCourses && (
            <Button onClick={openCreateDialog} className="gap-2" data-testid="button-add-course">
              <Plus className="h-4 w-4" />
              Add Course
            </Button>
          )}
        </div>

        {/* Statistics */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-600">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{courses.length}</p>
                <p className="text-sm text-muted-foreground">Total Courses</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role indicator for staff */}
        {isStaff && (
          <div className="text-sm text-muted-foreground">
            As staff, you can upload documents (syllabus) but cannot create, edit, or delete courses.
          </div>
        )}

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Code</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead className="hidden md:table-cell">Program</TableHead>
                  <TableHead className="hidden lg:table-cell">Instructor</TableHead>
                  <TableHead className="w-20 text-center">Credits</TableHead>
                  <TableHead className="w-24 text-center">Syllabus</TableHead>
                  {canManageCourses && <TableHead className="w-24 text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id} data-testid={`row-course-${course.id}`}>
                    <TableCell className="font-mono text-sm">{course.code}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{course.name}</p>
                        <p className="text-sm text-muted-foreground md:hidden">
                          {course.program}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {course.program}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {course.instructor}
                    </TableCell>
                    <TableCell className="text-center">{course.credits}</TableCell>
                    <TableCell className="text-center">
                      {course.syllabus ? (
                        <Badge variant="secondary" className="gap-1">
                          <FileText className="h-3 w-3" />
                          PDF
                        </Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUploadSyllabus(course.id)}
                          data-testid={`button-upload-syllabus-${course.id}`}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                    {canManageCourses && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(course)}
                            data-testid={`button-edit-course-${course.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(course.id)}
                            data-testid={`button-delete-course-${course.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredCourses.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No courses found. Try adjusting your filters{canManageCourses ? " or add a new course" : ""}.
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Course" : "Create New Course"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Course Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., CS101"
                  data-testid="input-course-code"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="credits">Credits</Label>
                <Select
                  value={formData.credits}
                  onValueChange={(v) => setFormData({ ...formData, credits: v })}
                >
                  <SelectTrigger data-testid="select-course-credits">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n} Credits
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Course Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Introduction to Programming"
                data-testid="input-course-name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="program">Program</Label>
              <Select
                value={formData.program}
                onValueChange={(v) => setFormData({ ...formData, program: v })}
              >
                <SelectTrigger data-testid="select-course-program">
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="instructor">Instructor</Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                placeholder="e.g., Prof. John Smith"
                data-testid="input-course-instructor"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Course description..."
                rows={3}
                data-testid="input-course-description"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="syllabus">Syllabus (PDF)</Label>
              <div className="flex items-center gap-2">
                {syllabusFileName ? (
                  <div className="flex items-center gap-2 flex-1 p-2 border rounded-md bg-muted/50">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm flex-1 truncate">{syllabusFileName}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={removeSyllabus}
                      data-testid="button-remove-syllabus"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex-1">
                    <label
                      htmlFor="syllabus-upload"
                      className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-md cursor-pointer hover-elevate transition-colors"
                    >
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Click to upload syllabus PDF</span>
                    </label>
                    <input
                      id="syllabus-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      data-testid="input-syllabus-upload"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} data-testid="button-save-course">
              {isEditing ? "Save Changes" : "Create Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
