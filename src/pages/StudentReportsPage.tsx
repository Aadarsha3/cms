import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


const mockGrades = [
  { course: "Introduction to Programming", code: "CS101", semester: "Fall 2025", grade: "A", score: 92, credits: 4 },
  { course: "Data Structures", code: "CS201", semester: "Fall 2025", grade: "A-", score: 88, credits: 4 },
  { course: "Calculus I", code: "MATH101", semester: "Fall 2024", grade: "B+", score: 86, credits: 4 },
  { course: "Physics I", code: "PHY101", semester: "Fall 2024", grade: "A", score: 91, credits: 4 },
  { course: "English Composition", code: "ENG101", semester: "Fall 2024", grade: "A-", score: 89, credits: 3 },
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

  return (
    <MainLayout title="My Reports">
      <div className="space-y-6">


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
      </div>
    </MainLayout>
  );
}
