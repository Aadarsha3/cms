import { useState } from "react";
import { Plus, Search, Edit, Trash2, BookOpen, ChevronRight } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";

// todo: remove mock functionality
interface Program {
  id: string;
  name: string;
  level: string;
  duration: string;
  disciplines: string[];
  description: string;
  status: "active" | "inactive";
  department: string;
}

const mockPrograms: Program[] = [
  {
    id: "1",
    name: "Bachelor of Computer Science",
    level: "Undergraduate",
    duration: "4 years",
    disciplines: ["Software Engineering", "Data Science", "Cybersecurity"],
    description: "Comprehensive program covering fundamental and advanced computer science concepts, preparing students for careers in software development and technology.",
    status: "active",
    department: "Computer Science",
  },
  {
    id: "2",
    name: "Master of Business Administration",
    level: "Graduate",
    duration: "2 years",
    disciplines: ["Finance", "Marketing", "Operations"],
    description: "Professional program preparing leaders for business challenges in the modern corporate environment.",
    status: "active",
    department: "Business Administration",
  },
  {
    id: "3",
    name: "Bachelor of Mechanical Engineering",
    level: "Undergraduate",
    duration: "4 years",
    disciplines: ["Thermodynamics", "Mechanics", "Manufacturing"],
    description: "Engineering program focused on mechanical systems design, analysis, and manufacturing technologies.",
    status: "active",
    department: "Mechanical Engineering",
  },
  {
    id: "4",
    name: "Bachelor of Civil Engineering",
    level: "Undergraduate",
    duration: "4 years",
    disciplines: ["Structural Engineering", "Transportation", "Construction Management"],
    description: "Comprehensive civil engineering program covering infrastructure design and project management.",
    status: "active",
    department: "Mechanical Engineering",
  },
  {
    id: "5",
    name: "Bachelor of Information Technology",
    level: "Undergraduate",
    duration: "4 years",
    disciplines: ["Network Administration", "Cloud Computing", "IT Security"],
    description: "Technology-focused program emphasizing practical IT skills and system administration.",
    status: "active",
    department: "Computer Science",
  },
  {
    id: "6",
    name: "Master of Computer Applications",
    level: "Graduate",
    duration: "2 years",
    disciplines: ["Mobile Development", "Web Technologies", "Database Systems"],
    description: "Advanced program for developing expertise in software application development.",
    status: "active",
    department: "Computer Science",
  },
  {
    id: "7",
    name: "Bachelor of Electronics Engineering",
    level: "Undergraduate",
    duration: "4 years",
    disciplines: ["Circuit Design", "Embedded Systems", "Signal Processing"],
    description: "Electronics and communications engineering with focus on modern electronic systems.",
    status: "active",
    department: "Mechanical Engineering",
  },
  {
    id: "8",
    name: "Doctor of Philosophy in Physics",
    level: "Doctoral",
    duration: "5 years",
    disciplines: ["Quantum Mechanics", "Astrophysics", "Particle Physics"],
    description: "Research-intensive program for advanced physics studies and original research.",
    status: "inactive",
    department: "Physics",
  },
];


const levelColors = {
  Undergraduate: "bg-primary text-primary-foreground",
  Graduate: "bg-primary text-primary-foreground",
  Doctoral: "bg-primary text-primary-foreground",
};

export function ProgramsPage() {
  const [programs, setPrograms] = useState(mockPrograms);
  const [search, setSearch] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const userRole = user?.role || "student";
  const canManage = userRole === "super_admin" || userRole === "admin";

  const [formData, setFormData] = useState({
    level: "",
    degreeType: "",
    name: "",
    duration: "",
    description: "",
    department: "",
  });

  const degreeOptions: Record<string, string[]> = {
    Undergraduate: ["Bachelor Degree", "Associate Degree"],
    Graduate: ["Master's Degree", "Doctoral Degree"],
  };

  const isSuperAdmin = userRole === "super_admin";
  const isAdmin = userRole === "admin";
  const userDepartment = user?.department;

  const filteredPrograms = programs.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.level.toLowerCase().includes(search.toLowerCase());

    // Admin can only see programs from their department
    const matchesDepartment = isSuperAdmin || (isAdmin && p.department === userDepartment);

    return matchesSearch && matchesDepartment;
  });

  const openCreateDialog = () => {
    setFormData({ level: "", degreeType: "", name: "", duration: "", description: "", department: "" });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (program: Program) => {
    setFormData({
      level: program.level,
      degreeType: "", // Will need to extract from name or store separately
      name: program.name,
      duration: program.duration,
      description: program.description,
      department: program.department,
    });
    setSelectedProgram(program);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (isEditing && selectedProgram) {
      setPrograms((prev) =>
        prev.map((p) =>
          p.id === selectedProgram.id
            ? {
              ...p,
              ...formData,
              disciplines: [], // Keep empty for now
              department: isAdmin ? (userDepartment || "") : formData.department,
            }
            : p
        )
      );
      toast({ title: "Program updated successfully" });
    } else {
      const newProgram: Program = {
        id: Date.now().toString(),
        ...formData,
        disciplines: [], // Keep empty for now
        status: "active",
        department: isAdmin ? (userDepartment || "") : formData.department,
      };
      setPrograms((prev) => [...prev, newProgram]);
      toast({ title: "Program created successfully" });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setPrograms((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Program deleted", variant: "destructive" });
  };

  return (
    <MainLayout title="Academic Programs">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search programs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-testid="input-search-programs"
            />
          </div>
          {canManage && (
            <Button onClick={openCreateDialog} className="gap-2" data-testid="button-add-program">
              <Plus className="h-4 w-4" />
              Add Program
            </Button>
          )}
        </div>

        {/* Statistics */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 text-purple-600">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{filteredPrograms.length}</p>
                <p className="text-sm text-muted-foreground">{isAdmin ? "My Department Programs" : "Total Programs"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          {filteredPrograms.map((program) => (
            <Card key={program.id} className="hover-elevate" data-testid={`card-program-${program.id}`}>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary flex-shrink-0">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium">{program.name}</h3>
                          {program.status === "inactive" && (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`${levelColors[program.level as keyof typeof levelColors]} px-2 py-0.5 text-xs font-normal`}
                          >
                            {program.level}
                          </Badge>
                          <span className="text-sm text-muted-foreground">• {program.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:flex-1">
                    {program.disciplines.slice(0, 3).map((d) => (
                      <Badge key={d} variant="secondary">
                        {d}
                      </Badge>
                    ))}
                    {program.disciplines.length > 3 && (
                      <Badge variant="outline">
                        +{program.disciplines.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {canManage && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(program)}
                          data-testid={`button-edit-program-${program.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(program.id)}
                          data-testid={`button-delete-program-${program.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon" data-testid={`button-view-program-${program.id}`}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPrograms.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No programs found. Try adjusting your search or create a new program.
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Program" : "Create New Program"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="level">Academic Level</Label>
              <Select
                value={formData.level}
                onValueChange={(v) => setFormData({ ...formData, level: v, degreeType: "" })}
              >
                <SelectTrigger data-testid="select-program-level">
                  <SelectValue placeholder="Select academic level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="Graduate">Graduate/Postgraduate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.level && (
              <div className="grid gap-2">
                <Label htmlFor="degreeType">Degree Type</Label>
                <Select
                  value={formData.degreeType}
                  onValueChange={(v) => setFormData({ ...formData, degreeType: v })}
                >
                  <SelectTrigger data-testid="select-degree-type">
                    <SelectValue placeholder="Select degree type" />
                  </SelectTrigger>
                  <SelectContent>
                    {degreeOptions[formData.level]?.map((degree) => (
                      <SelectItem key={degree} value={degree}>
                        {degree}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="name">Program Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Bachelor of Computer Science"
                data-testid="input-program-name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="duration">Duration</Label>
              <Select
                value={formData.duration}
                onValueChange={(v) => setFormData({ ...formData, duration: v })}
              >
                <SelectTrigger data-testid="select-program-duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 year">1 Year</SelectItem>
                  <SelectItem value="2 years">2 Years</SelectItem>
                  <SelectItem value="3 years">3 Years</SelectItem>
                  <SelectItem value="4 years">4 Years</SelectItem>
                  <SelectItem value="5 years">5 Years</SelectItem>
                  <SelectItem value="6 years">6 Years</SelectItem>
                  <SelectItem value="2 semesters">2 Semesters</SelectItem>
                  <SelectItem value="4 semesters">4 Semesters</SelectItem>
                  <SelectItem value="6 semesters">6 Semesters</SelectItem>
                  <SelectItem value="8 semesters">8 Semesters</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Program Details</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Program description and details..."
                rows={3}
                data-testid="input-program-description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} data-testid="button-save-program">
              {isEditing ? "Save Changes" : "Create Program"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
