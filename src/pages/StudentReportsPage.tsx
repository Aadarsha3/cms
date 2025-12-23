import { useState } from "react";
import { Download, Printer, BookOpen, ClipboardCheck, TrendingUp, Calendar } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality
const mockStudentInfo = {
  name: "Emily Parker",
  studentId: "STU2024001",
  program: "Bachelor of Computer Science",
  year: "2nd Year",
  advisor: "Prof. Michael Chen",
  enrollmentDate: "2024-09-01",
  gpa: 3.7,
  totalCredits: 86,
  attendanceRate: 92,
};

const mockGrades = [
  { course: "Introduction to Programming", code: "CS101", semester: "Fall 2025", grade: "A", score: 92, credits: 4 },
  { course: "Data Structures", code: "CS201", semester: "Fall 2025", grade: "A-", score: 88, credits: 4 },
  { course: "Calculus I", code: "MATH101", semester: "Fall 2024", grade: "B+", score: 86, credits: 4 },
  { course: "Physics I", code: "PHY101", semester: "Fall 2024", grade: "A", score: 91, credits: 4 },
  { course: "English Composition", code: "ENG101", semester: "Fall 2024", grade: "A-", score: 89, credits: 3 },
];

const mockAttendance = [
  { course: "Introduction to Programming", code: "CS101", present: 28, absent: 2, late: 1, rate: 94 },
  { course: "Data Structures", code: "CS201", present: 26, absent: 3, late: 2, rate: 90 },
  { course: "Web Development", code: "CS301", present: 27, absent: 1, late: 3, rate: 93 },
];



const gradeColors: Record<string, string> = {
  "A+": "bg-primary text-primary-foreground",
  "A": "bg-primary text-primary-foreground",
  "A-": "bg-primary text-primary-foreground",
  "B+": "bg-primary text-primary-foreground",
  "B": "bg-primary text-primary-foreground",
  "B-": "bg-primary text-primary-foreground",
};

export function StudentReportsPage() {

  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("grades");

  const handleDownload = () => {
    toast({ title: "Downloading report..." });
    // todo: implement real download
  };

  const handlePrint = () => {
    window.print();
    toast({ title: "Print dialog opened" });
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
    <MainLayout title="My Reports">
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-xl">
                  {getInitials(mockStudentInfo.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-semibold" data-testid="text-student-name">{mockStudentInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Student ID</p>
                  <p className="font-mono" data-testid="text-student-id">{mockStudentInfo.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Program</p>
                  <p className="font-medium">{mockStudentInfo.program}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Year</p>
                  <p className="font-medium">{mockStudentInfo.year}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleDownload} className="gap-2" data-testid="button-download-report">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" onClick={handlePrint} className="gap-2" data-testid="button-print-report">
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-semibold" data-testid="text-gpa">{mockStudentInfo.gpa}</p>
                <p className="text-sm text-muted-foreground">Current GPA</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{mockStudentInfo.totalCredits}</p>
                <p className="text-sm text-muted-foreground">Credits Earned</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-2xl font-semibold">{mockStudentInfo.attendanceRate}%</p>
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-3/10 text-chart-3">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-semibold">5</p>
                <p className="text-sm text-muted-foreground">Enrolled Courses</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList data-testid="tabs-reports">
            <TabsTrigger value="grades" data-testid="tab-grades">Grades</TabsTrigger>
            <TabsTrigger value="attendance" data-testid="tab-attendance">Attendance</TabsTrigger>

          </TabsList>

          <TabsContent value="grades" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Academic Grades</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Code</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead className="hidden md:table-cell w-28">Semester</TableHead>
                      <TableHead className="w-20 text-center">Score</TableHead>
                      <TableHead className="w-16 text-center">Grade</TableHead>
                      <TableHead className="w-20 text-center">Credits</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockGrades.map((g, i) => (
                      <TableRow key={i} data-testid={`row-grade-${i}`}>
                        <TableCell className="font-mono">{g.code}</TableCell>
                        <TableCell className="font-medium">{g.course}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {g.semester}
                        </TableCell>
                        <TableCell className="text-center">{g.score}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={gradeColors[g.grade] || "bg-muted"}>
                            {g.grade}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">{g.credits}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Attendance Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Code</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead className="w-20 text-center">Present</TableHead>
                      <TableHead className="w-20 text-center">Absent</TableHead>
                      <TableHead className="w-20 text-center">Late</TableHead>
                      <TableHead className="w-24 text-center">Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAttendance.map((a, i) => (
                      <TableRow key={i} data-testid={`row-attendance-${i}`}>
                        <TableCell className="font-mono">{a.code}</TableCell>
                        <TableCell className="font-medium">{a.course}</TableCell>
                        <TableCell className="text-center text-chart-4">{a.present}</TableCell>
                        <TableCell className="text-center text-destructive">{a.absent}</TableCell>
                        <TableCell className="text-center text-chart-2">{a.late}</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={
                              a.rate >= 90
                                ? "bg-chart-4 text-white"
                                : a.rate >= 75
                                  ? "bg-chart-2 text-white"
                                  : "bg-destructive text-destructive-foreground"
                            }
                          >
                            {a.rate}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>


        </Tabs>
      </div>
    </MainLayout>
  );
}
