import { useState } from "react";
import { Search, Download, Edit, Save, X } from "lucide-react";
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
interface ResultRecord {
  id: string;
  studentId: string;
  studentName: string;
  course: string;
  courseCode: string;
  year: string;
  semester: string;
  grade: string;
  score: number;
  credits: number;
}

const mockResults: ResultRecord[] = [
  { id: "1", studentId: "STU2024001", studentName: "Emily Parker", course: "Introduction to Programming", courseCode: "CS101", year: "2025", semester: "Fall", grade: "A", score: 92, credits: 4 },
  { id: "2", studentId: "STU2024001", studentName: "Emily Parker", course: "Data Structures", courseCode: "CS201", year: "2025", semester: "Fall", grade: "A-", score: 88, credits: 4 },
  { id: "3", studentId: "STU2024002", studentName: "James Wilson", course: "Financial Management", courseCode: "MBA501", year: "2025", semester: "Fall", grade: "B+", score: 85, credits: 3 },
  { id: "4", studentId: "STU2023015", studentName: "Robert Lee", course: "Thermodynamics", courseCode: "ME301", year: "2025", semester: "Fall", grade: "B", score: 82, credits: 4 },
  { id: "5", studentId: "STU2024003", studentName: "Sarah Brown", course: "Introduction to Programming", courseCode: "CS101", year: "2024", semester: "Spring", grade: "A-", score: 89, credits: 4 },
  { id: "6", studentId: "STU2024004", studentName: "Michael Davis", course: "Introduction to Programming", courseCode: "CS101", year: "2024", semester: "Fall", grade: "B+", score: 86, credits: 4 },
];

const gradeColors: Record<string, string> = {
  "A+": "bg-primary text-primary-foreground",
  "A": "bg-primary text-primary-foreground",
  "A-": "bg-primary text-primary-foreground",
  "B+": "bg-primary text-primary-foreground",
  "B": "bg-primary text-primary-foreground",
  "B-": "bg-primary text-primary-foreground",
  "C+": "bg-chart-1 text-white",
  "C": "bg-chart-1 text-white",
  "C-": "bg-chart-1 text-white",
  "D": "bg-destructive text-destructive-foreground",
  "F": "bg-destructive text-destructive-foreground",
};

const years = ["2025", "2024", "2023"];
const semesters = ["Fall", "Spring"];
const courses = ["CS101", "CS201", "MBA501", "ME301"];

export function ResultsPage() {
  const { user } = useAuth();
  const [results, setResults] = useState(mockResults);
  const userRole = user?.role || "student";
  const isSuperAdmin = userRole === "super_admin";
  const isAdmin = userRole === "admin";
  const canEdit = isSuperAdmin || isAdmin;
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ grade: "", score: "" });
  const { toast } = useToast();

  const filteredResults = results.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.studentId.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = courseFilter === "all" || r.courseCode === courseFilter;
    const matchesYear = yearFilter === "all" || r.year === yearFilter;
    const matchesSemester = semesterFilter === "all" || r.semester === semesterFilter;
    return matchesSearch && matchesCourse && matchesYear && matchesSemester;
  });

  const startEdit = (result: ResultRecord) => {
    setEditingId(result.id);
    setEditData({ grade: result.grade, score: result.score.toString() });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ grade: "", score: "" });
  };

  const saveEdit = (id: string) => {
    setResults((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, grade: editData.grade, score: parseInt(editData.score) }
          : r
      )
    );
    setEditingId(null);
    toast({ title: "Result updated successfully" });
  };

  const handleExport = () => {
    toast({ title: "Exporting results data..." });
    // todo: implement real export
  };

  return (
    <MainLayout title="Academic Results">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-testid="input-search-results"
            />
          </div>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-full sm:w-40" data-testid="select-course-filter">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-full sm:w-32" data-testid="select-year-filter">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={semesterFilter} onValueChange={setSemesterFilter}>
            <SelectTrigger className="w-full sm:w-32" data-testid="select-semester-filter">
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              {semesters.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport} className="gap-2" data-testid="button-export-results">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Course</TableHead>
                  <TableHead className="w-20">Code</TableHead>
                  <TableHead className="hidden lg:table-cell w-28">Semester</TableHead>
                  <TableHead className="w-20 text-center">Score</TableHead>
                  <TableHead className="w-16 text-center">Grade</TableHead>
                  <TableHead className="w-20 text-center">Credits</TableHead>
                  <TableHead className="w-24 text-right">{canEdit && "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result) => (
                  <TableRow key={result.id} data-testid={`row-result-${result.id}`}>
                    <TableCell className="font-mono text-sm">{result.studentId}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{result.studentName}</p>
                        <p className="text-sm text-muted-foreground md:hidden">
                          {result.course}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {result.course}
                    </TableCell>
                    <TableCell className="font-mono">{result.courseCode}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {result.semester} {result.year}
                    </TableCell>
                    <TableCell className="text-center">
                      {editingId === result.id ? (
                        <Input
                          type="number"
                          value={editData.score}
                          onChange={(e) => setEditData({ ...editData, score: e.target.value })}
                          className="h-8 w-16 text-center"
                          min={0}
                          max={100}
                          data-testid={`input-score-${result.id}`}
                        />
                      ) : (
                        result.score
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {editingId === result.id ? (
                        <Select
                          value={editData.grade}
                          onValueChange={(v) => setEditData({ ...editData, grade: v })}
                        >
                          <SelectTrigger className="h-8 w-16" data-testid={`select-grade-${result.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"].map(
                              (g) => (
                                <SelectItem key={g} value={g}>
                                  {g}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={gradeColors[result.grade] || "bg-muted"}>
                          {result.grade}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{result.credits}</TableCell>
                    {canEdit && (
                      <TableCell className="text-right">
                        {editingId === result.id ? (
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => saveEdit(result.id)}
                              data-testid={`button-save-result-${result.id}`}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={cancelEdit}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEdit(result)}
                            data-testid={`button-edit-result-${result.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredResults.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No results found for the selected filters.
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
