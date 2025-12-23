import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MapPin, User, Plus, Trash2, Edit, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

interface ClassSession {
    id: string;
    startTime: string;
    endTime: string;
    courseCode: string;
    courseName: string;
    room: string;
    lecturer: string;
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    daysOfWeek: string[]; // e.g., ["Sunday", "Monday"]
    program: string; // Academic program
}

// Store all class sessions in a flat array with comprehensive demo data
const initialClassSessions: ClassSession[] = [
    // Sunday classes
    {
        id: "1",
        startTime: "07:00",
        endTime: "08:30",
        courseCode: "CIS092-1",
        courseName: "Fundamentals of Software Engineering",
        room: "A-201",
        lecturer: "Anand Gautam",
        startDate: "2025-07-01",
        endDate: "2026-01-30",
        daysOfWeek: ["Sunday"],
        program: "Bachelor of Computer Science",
    },
    {
        id: "2",
        startTime: "09:15",
        endTime: "10:45",
        courseCode: "CIS093-1",
        courseName: "Mathematics and Concepts for Computational Thinking",
        room: "A-201",
        lecturer: "Nujan Shrestha",
        startDate: "2025-07-01",
        endDate: "2026-01-30",
        daysOfWeek: ["Sunday"],
        program: "Bachelor of Computer Science",
    },
    {
        id: "3",
        startTime: "11:00",
        endTime: "12:30",
        courseCode: "CIS094-1",
        courseName: "Database Management Systems",
        room: "B-105",
        lecturer: "Rajesh Kumar",
        startDate: "2025-07-01",
        endDate: "2026-01-30",
        daysOfWeek: ["Sunday"],
        program: "Bachelor of Computer Science",
    },
    // Monday classes
    {
        id: "4",
        startTime: "07:00",
        endTime: "08:30",
        courseCode: "CIS091-1",
        courseName: "Academic Skills and Team Based Learning",
        room: "A-201",
        lecturer: "Lecture Team",
        startDate: "2025-07-01",
        endDate: "2026-01-30",
        daysOfWeek: ["Monday"],
        program: "Bachelor of Computer Science",
    },
    {
        id: "5",
        startTime: "09:15",
        endTime: "10:45",
        courseCode: "CIS095-1",
        courseName: "Object-Oriented Programming",
        room: "C-303",
        lecturer: "Priya Sharma",
        startDate: "2025-07-01",
        endDate: "2026-01-30",
        daysOfWeek: ["Monday"],
        program: "Bachelor of Computer Science",
    },
    {
        id: "6",
        startTime: "11:00",
        endTime: "12:30",
        courseCode: "CIS096-1",
        courseName: "Computer Networks",
        room: "B-204",
        lecturer: "Suman Adhikari",
        startDate: "2025-07-01",
        endDate: "2026-01-30",
        daysOfWeek: ["Monday"],
        program: "Bachelor of Computer Science",
    },
    // Tuesday classes
    {
        id: "7",
        startTime: "07:00",
        endTime: "08:30",
        courseCode: "CIS092-1",
        courseName: "Fundamentals of Software Engineering",
        room: "A-201",
        lecturer: "Anand Gautam",
        startDate: "2025-07-01",
        endDate: "2026-01-30",
        daysOfWeek: ["Tuesday"],
        program: "Bachelor of Computer Science",
    },
    {
        id: "8",
        startTime: "09:15",
        endTime: "10:45",
        courseCode: "CIS097-1",
        courseName: "Web Development",
        room: "D-101",
        lecturer: "Binod Thapa",
        startDate: "2025-07-01",
        endDate: "2026-01-30",
        daysOfWeek: ["Tuesday"],
        program: "Bachelor of Computer Science",
    },
    {
        id: "9",
        startTime: "11:00",
        endTime: "12:30",
        courseCode: "CIS098-1",
        courseName: "Operating Systems",
        room: "C-205",
        lecturer: "Meera Rai",
        startDate: "2025-07-01",
        endDate: "2026-01-30",
        daysOfWeek: ["Tuesday"],
        program: "Bachelor of Computer Science",
    },
    // Wednesday classes
    {
        id: "10",
        startTime: "07:00",
        endTime: "08:30",
        courseCode: "CIS093-1",
        courseName: "Mathematics and Concepts for Computational Thinking",
        room: "A-201",
        lecturer: "Nujan Shrestha",
        startDate: "2025-07-01",
        endDate: "2026-01-30",
        daysOfWeek: ["Wednesday"],
        program: "Bachelor of Computer Science",
    },
    {
        id: "11",
        startTime: "09:15",
        endTime: "10:45",
        courseCode: "CIS099-1",
        courseName: "Data Structures and Algorithms",
        room: "B-302",
        lecturer: "Anil Thapa",
        startDate: "2025-07-01",
        endDate: "2026-01-30",
        daysOfWeek: ["Wednesday"],
        program: "Bachelor of Computer Science",
    },
    {
        id: "12",
        startTime: "11:00",
        endTime: "12:30",
        courseCode: "CIS100-1",
        courseName: "Artificial Intelligence",
        room: "D-201",
        lecturer: "Deepak Sharma",
        startDate: "2025-07-01",
        endDate: "2026-01-30",
        daysOfWeek: ["Wednesday"],
        program: "Bachelor of Computer Science",
    },
    // Thursday classes
    {
        id: "13",
        startTime: "07:00",
        endTime: "08:30",
        courseCode: "CIS095-1",
        courseName: "Object-Oriented Programming",
        room: "C-303",
        lecturer: "Priya Sharma",
        startDate: "2025-07-01",
        endDate: "2026-01-30",
        daysOfWeek: ["Thursday"],
        program: "Bachelor of Computer Science",
    },
    {
        id: "14",
        startTime: "09:15",
        endTime: "10:45",
        courseCode: "CIS101-1",
        courseName: "Mobile Application Development",
        room: "A-102",
        lecturer: "Ramesh Gurung",
        startDate: "2025-07-01",
        endDate: "2026-01-30",
        daysOfWeek: ["Thursday"],
        program: "Bachelor of Computer Science",
    },
    {
        id: "15",
        startTime: "11:00",
        endTime: "12:30",
        courseCode: "CIS094-1",
        courseName: "Database Management Systems",
        room: "B-105",
        lecturer: "Rajesh Kumar",
        startDate: "2025-07-01",
        endDate: "2026-01-30",
        daysOfWeek: ["Thursday"],
        program: "Bachelor of Computer Science",
    },
    // Friday classes
    {
        id: "16",
        startTime: "07:00",
        endTime: "08:30",
        courseCode: "CIS102-1",
        courseName: "Software Testing and Quality Assurance",
        room: "C-401",
        lecturer: "Sarita Lama",
        startDate: "2025-07-01",
        endDate: "2026-01-30",
        daysOfWeek: ["Friday"],
        program: "Bachelor of Computer Science",
    },
    {
        id: "17",
        startTime: "09:15",
        endTime: "10:45",
        courseCode: "CIS096-1",
        courseName: "Computer Networks",
        room: "B-204",
        lecturer: "Suman Adhikari",
        startDate: "2025-07-01",
        endDate: "2026-01-30",
        daysOfWeek: ["Friday"],
        program: "Bachelor of Computer Science",
    },
    {
        id: "18",
        startTime: "11:00",
        endTime: "12:30",
        courseCode: "CIS097-1",
        courseName: "Web Development",
        room: "D-101",
        lecturer: "Binod Thapa",
        startDate: "2025-07-01",
        endDate: "2026-01-30",
        daysOfWeek: ["Friday"],
        program: "Bachelor of Computer Science",
    },
];

// Course reference data for dropdowns
const availableCourses = [
    { code: "CIS091-1", name: "Academic Skills and Team Based Learning", lecturer: "Lecture Team", program: "Bachelor of Computer Science" },
    { code: "CIS092-1", name: "Fundamentals of Software Engineering", lecturer: "Anand Gautam", program: "Bachelor of Computer Science" },
    { code: "CIS093-1", name: "Mathematics and Concepts for Computational Thinking", lecturer: "Nujan Shrestha", program: "Bachelor of Computer Science" },
    { code: "CIS094-1", name: "Database Management Systems", lecturer: "Rajesh Kumar", program: "Bachelor of Computer Science" },
    { code: "CIS095-1", name: "Object-Oriented Programming", lecturer: "Priya Sharma", program: "Bachelor of Computer Science" },
    { code: "CIS096-1", name: "Computer Networks", lecturer: "Suman Adhikari", program: "Bachelor of Computer Science" },
    { code: "CIS097-1", name: "Web Development", lecturer: "Binod Thapa", program: "Bachelor of Computer Science" },
    { code: "CIS098-1", name: "Operating Systems", lecturer: "Meera Rai", program: "Bachelor of Computer Science" },
    { code: "CIS099-1", name: "Data Structures and Algorithms", lecturer: "Anil Thapa", program: "Bachelor of Computer Science" },
    { code: "CIS100-1", name: "Artificial Intelligence", lecturer: "Deepak Sharma", program: "Bachelor of Computer Science" },
    { code: "CIS101-1", name: "Mobile Application Development", lecturer: "Ramesh Gurung", program: "Bachelor of Computer Science" },
    { code: "CIS102-1", name: "Software Testing and Quality Assurance", lecturer: "Sarita Lama", program: "Bachelor of Computer Science" },
];

export function ClassRoutinePage() {
    const { user } = useAuth();
    const { toast } = useToast();

    const isAdmin = user?.role === "super_admin";
    const isStudent = user?.role === "student";

    // Map student's currentClass to program name
    const getStudentProgram = (currentClass: string | undefined): string => {
        if (!currentClass) return "all";
        if (currentClass.includes("BCS")) return "Bachelor of Computer Science";
        if (currentClass.includes("BIT")) return "Bachelor of Information Technology";
        if (currentClass.includes("MBA")) return "Master of Business Administration";
        if (currentClass.includes("BME")) return "Bachelor of Mechanical Engineering";
        if (currentClass.includes("BCE")) return "Bachelor of Civil Engineering";
        if (currentClass.includes("BEE")) return "Bachelor of Electronics Engineering";
        if (currentClass.includes("MCA")) return "Master of Computer Applications";
        return "all";
    };

    // Auto-select program for students
    const studentProgram = isStudent ? getStudentProgram(user?.currentClass) : "all";

    const [selectedDay, setSelectedDay] = useState("Sunday");
    const [selectedProgram, setSelectedProgram] = useState(studentProgram);
    const [classSessions, setClassSessions] = useState<ClassSession[]>(initialClassSessions);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
    const [newSession, setNewSession] = useState<Partial<ClassSession>>({
        startTime: "",
        endTime: "",
        courseCode: "",
        courseName: "",
        room: "",
        lecturer: "",
        startDate: "",
        endDate: "",
        daysOfWeek: [],
        program: "",
    });

    // Get unique programs from class sessions
    const programs = Array.from(new Set(classSessions.map(s => s.program)));

    // Filter sessions for the selected day, program, and check if they're currently active
    const getSessionsForDay = (day: string) => {
        const today = new Date().toISOString().split('T')[0];
        return classSessions
            .filter(session =>
                session.daysOfWeek.includes(day) &&
                session.startDate <= today &&
                session.endDate >= today &&
                (selectedProgram === "all" || session.program === selectedProgram)
            )
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
    };

    const handleEditSession = (session: ClassSession) => {
        setEditingSessionId(session.id);
        setNewSession({
            startTime: session.startTime,
            endTime: session.endTime,
            courseCode: session.courseCode,
            courseName: session.courseName,
            room: session.room,
            lecturer: session.lecturer,
            startDate: session.startDate,
            endDate: session.endDate,
            daysOfWeek: session.daysOfWeek,
            program: session.program,
        });
        setIsDialogOpen(true);
    };

    const handleAddSession = () => {
        if (!newSession.startTime || !newSession.endTime || !newSession.courseName ||
            !newSession.startDate || !newSession.endDate || !newSession.daysOfWeek?.length || !newSession.program) {
            toast({ title: "Please fill in all required fields including program, days and dates", variant: "destructive" });
            return;
        }

        if (editingSessionId) {
            // Update existing session
            const updatedSession: ClassSession = {
                id: editingSessionId,
                startTime: newSession.startTime!,
                endTime: newSession.endTime!,
                courseCode: newSession.courseCode || "N/A",
                courseName: newSession.courseName!,
                room: newSession.room || "TBD",
                lecturer: newSession.lecturer || "TBD",
                startDate: newSession.startDate!,
                endDate: newSession.endDate!,
                daysOfWeek: newSession.daysOfWeek!,
                program: newSession.program!,
            };

            setClassSessions(prev => prev.map(s => s.id === editingSessionId ? updatedSession : s));
            toast({ title: "Class schedule updated successfully" });
        } else {
            // Create new session
            const session: ClassSession = {
                id: Date.now().toString(),
                startTime: newSession.startTime!,
                endTime: newSession.endTime!,
                courseCode: newSession.courseCode || "N/A",
                courseName: newSession.courseName!,
                room: newSession.room || "TBD",
                lecturer: newSession.lecturer || "TBD",
                startDate: newSession.startDate!,
                endDate: newSession.endDate!,
                daysOfWeek: newSession.daysOfWeek!,
                program: newSession.program!,
            };

            setClassSessions(prev => [...prev, session]);
            toast({ title: "Class schedule created successfully" });
        }

        setIsDialogOpen(false);
        setEditingSessionId(null);
        setNewSession({
            startTime: "",
            endTime: "",
            courseCode: "",
            courseName: "",
            room: "",
            lecturer: "",
            startDate: "",
            endDate: "",
            daysOfWeek: [],
            program: "",
        });
    };

    const handleDeleteSession = (sessionId: string) => {
        setClassSessions(prev => prev.filter(s => s.id !== sessionId));
        toast({ title: "Class removed" });
    };

    const toggleDaySelection = (day: string) => {
        setNewSession(prev => {
            const currentDays = prev.daysOfWeek || [];
            const newDays = currentDays.includes(day)
                ? currentDays.filter(d => d !== day)
                : [...currentDays, day];
            return { ...prev, daysOfWeek: newDays };
        });
    };

    return (
        <MainLayout title="Class Routine">
            <div className="space-y-6">
                <div className="flex flex-col gap-6">
                    {/* Welcome Header */}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-xl font-semibold">Welcome to MetaHorizon Life 👋</h1>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    {new Date().toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                        {isAdmin && (
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Add Class
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{editingSessionId ? "Edit Class Schedule" : "Schedule New Class"}</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="program">Academic Program</Label>
                                            <Select
                                                value={newSession.program}
                                                onValueChange={(v) => setNewSession({ ...newSession, program: v })}
                                            >
                                                <SelectTrigger id="program">
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

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="courseCode">Course Code</Label>
                                                <Select
                                                    value={newSession.courseCode}
                                                    onValueChange={(code) => {
                                                        const course = availableCourses.find(c => c.code === code);
                                                        if (course) {
                                                            setNewSession({
                                                                ...newSession,
                                                                courseCode: course.code,
                                                                courseName: course.name,
                                                                lecturer: course.lecturer,
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger id="courseCode">
                                                        <SelectValue placeholder="Select course code" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {availableCourses
                                                            .filter(c => !newSession.program || c.program === newSession.program)
                                                            .map((course) => (
                                                                <SelectItem key={course.code} value={course.code}>
                                                                    {course.code}
                                                                </SelectItem>
                                                            ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="courseName">Course Name</Label>
                                                <Select
                                                    value={newSession.courseName}
                                                    onValueChange={(name) => {
                                                        const course = availableCourses.find(c => c.name === name);
                                                        if (course) {
                                                            setNewSession({
                                                                ...newSession,
                                                                courseCode: course.code,
                                                                courseName: course.name,
                                                                lecturer: course.lecturer,
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger id="courseName">
                                                        <SelectValue placeholder="Select course name" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {availableCourses
                                                            .filter(c => !newSession.program || c.program === newSession.program)
                                                            .map((course) => (
                                                                <SelectItem key={course.name} value={course.name}>
                                                                    {course.name}
                                                                </SelectItem>
                                                            ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="startTime">Start Time</Label>
                                                <Input
                                                    id="startTime"
                                                    type="time"
                                                    value={newSession.startTime}
                                                    onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                                                    onClick={(e) => e.currentTarget.showPicker?.()}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="endTime">End Time</Label>
                                                <Input
                                                    id="endTime"
                                                    type="time"
                                                    value={newSession.endTime}
                                                    onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
                                                    onClick={(e) => e.currentTarget.showPicker?.()}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="room">Room</Label>
                                                <Input
                                                    id="room"
                                                    placeholder="e.g. 301"
                                                    value={newSession.room}
                                                    onChange={(e) => setNewSession({ ...newSession, room: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="lecturer">Lecturer</Label>
                                                <Input
                                                    id="lecturer"
                                                    value={newSession.lecturer}
                                                    onChange={(e) => setNewSession({ ...newSession, lecturer: e.target.value })}
                                                    readOnly
                                                    className="bg-muted"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="startDate">Start Date</Label>
                                                <Input
                                                    id="startDate"
                                                    type="date"
                                                    value={newSession.startDate}
                                                    onChange={(e) => setNewSession({ ...newSession, startDate: e.target.value })}
                                                    onClick={(e) => e.currentTarget.showPicker?.()}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="endDate">End Date</Label>
                                                <Input
                                                    id="endDate"
                                                    type="date"
                                                    value={newSession.endDate}
                                                    onChange={(e) => setNewSession({ ...newSession, endDate: e.target.value })}
                                                    onClick={(e) => e.currentTarget.showPicker?.()}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label>Days of Week</Label>
                                            <div className="grid grid-cols-4 gap-3">
                                                {days.map((day) => (
                                                    <div key={day} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`day-${day}`}
                                                            checked={newSession.daysOfWeek?.includes(day)}
                                                            onCheckedChange={() => toggleDaySelection(day)}
                                                        />
                                                        <Label
                                                            htmlFor={`day-${day}`}
                                                            className="text-sm font-normal cursor-pointer"
                                                        >
                                                            {day.slice(0, 3)}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => { setIsDialogOpen(false); setEditingSessionId(null); }}>Cancel</Button>
                                        <Button onClick={handleAddSession}>{editingSessionId ? "Update Class" : "Schedule Class"}</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>

                    {/* Program Filter */}
                    <div className="flex items-center gap-4">
                        <Label htmlFor="program-filter" className="text-sm font-medium">Academic Program:</Label>
                        <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                            <SelectTrigger className="w-full sm:w-80" id="program-filter">
                                <SelectValue placeholder="Select program" />
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
                    </div>

                    {/* Days Navigation */}
                    <div className="flex flex-wrap gap-2">
                        {days.map((day) => (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(day)}
                                className={cn(
                                    "px-4 py-2 rounded-md text-sm font-medium transition-colors border",
                                    selectedDay === day
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background hover:bg-muted text-muted-foreground border-border"
                                )}
                            >
                                {day}
                            </button>
                        ))}
                    </div>

                    {/* Schedule Content */}
                    <Card className="p-6 bg-card border shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 mb-4 px-4 text-sm font-medium text-muted-foreground">
                            <div className="hidden md:block">Time</div>
                            <div className="hidden md:block">Courses</div>
                        </div>

                        <div className="space-y-2">
                            {(() => {
                                const sessions = getSessionsForDay(selectedDay);
                                const formatTime = (time: string) => {
                                    // Convert 24h to 12h format if needed
                                    if (!time.includes('AM') && !time.includes('PM')) {
                                        const [hours, minutes] = time.split(':');
                                        const h = parseInt(hours);
                                        const suffix = h >= 12 ? 'PM' : 'AM';
                                        const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
                                        return `${displayHour.toString().padStart(2, '0')}:${minutes} ${suffix}`;
                                    }
                                    return time;
                                };

                                return sessions.length > 0 ? (
                                    sessions.map((session) => (
                                        <div key={session.id} className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-3 group">
                                            {/* Time Column */}
                                            <div className="flex flex-row md:flex-col gap-2 md:gap-0 text-sm font-medium text-muted-foreground md:pt-2">
                                                <span>{formatTime(session.startTime)}</span>
                                                <span className="hidden md:inline text-xs opacity-70">{formatTime(session.endTime)}</span>
                                                <span className="md:hidden">- {formatTime(session.endTime)}</span>
                                            </div>

                                            {/* Course Card */}
                                            <Card className="bg-card hover:bg-accent/5 transition-colors border-border/50">
                                                <CardContent className="p-3 relative">
                                                    {isAdmin && (
                                                        <div className="absolute top-1.5 right-1.5 flex gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-primary hover:text-primary hover:bg-primary/10 h-7 w-7"
                                                                onClick={() => handleEditSession(session)}
                                                            >
                                                                <Edit className="h-3.5 w-3.5" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7"
                                                                onClick={() => handleDeleteSession(session.id)}
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                    <div className="pr-14">
                                                        <h3 className="font-semibold text-base leading-tight mb-1.5">
                                                            {session.courseName}
                                                        </h3>
                                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                                            <span className="font-mono text-xs font-semibold">{session.courseCode}</span>
                                                            <div className="flex items-center gap-1.5">
                                                                <MapPin className="h-3.5 w-3.5" />
                                                                <span>{session.room}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <User className="h-3.5 w-3.5" />
                                                                <span>{session.lecturer}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center text-muted-foreground">
                                        No classes scheduled for {selectedDay}
                                    </div>
                                );
                            })()}
                        </div>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
