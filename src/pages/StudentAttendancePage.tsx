import { useState } from "react";
import { Plus } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const mockAttendance = [
    { course: "Introduction to Programming", code: "CS101", present: 28, absent: 2, late: 1, rate: 94 },
    { course: "Data Structures", code: "CS201", present: 26, absent: 3, late: 2, rate: 90 },
    { course: "Web Development", code: "CS301", present: 27, absent: 1, late: 3, rate: 93 },
];

interface LeaveRequest {
    id: number;
    type: string;
    reason: string;
    startDate: string;
    endDate: string;
    status: "Pending" | "Approved" | "Rejected";
}

const mockLeaveRequests: LeaveRequest[] = [
    { id: 1, type: "Sick Leave", reason: "Viral fever", startDate: "2025-12-10", endDate: "2025-12-12", status: "Approved" },
    { id: 2, type: "Casual Leave", reason: "Family event", startDate: "2025-12-20", endDate: "2025-12-21", status: "Pending" },
];

export function StudentAttendancePage() {
    const { toast } = useToast();
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
    const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
    const [leaveForm, setLeaveForm] = useState({
        type: "",
        startDate: "",
        endDate: "",
        reason: "",
    });

    const handleApplyLeave = () => {
        if (!leaveForm.type || !leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
            toast({ title: "Please fill in all fields", variant: "destructive" });
            return;
        }

        const newRequest: LeaveRequest = {
            id: Date.now(),
            type: leaveForm.type,
            startDate: leaveForm.startDate,
            endDate: leaveForm.endDate,
            reason: leaveForm.reason,
            status: "Pending",
        };

        setLeaveRequests([newRequest, ...leaveRequests]);
        setIsLeaveDialogOpen(false);
        setLeaveForm({ type: "", startDate: "", endDate: "", reason: "" });
        toast({ title: "Leave application submitted successfully" });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Approved": return "bg-green-500 hover:bg-green-600";
            case "Rejected": return "bg-destructive hover:bg-destructive";
            default: return "bg-yellow-500 hover:bg-yellow-600";
        }
    };

    return (
        <MainLayout title="Attendance">
            <div className="space-y-6">

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

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">Leave Applications</CardTitle>
                        <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Apply for Leave
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Apply for Leave</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="leave-type">Leave Type</Label>
                                        <Select
                                            value={leaveForm.type}
                                            onValueChange={(val) => setLeaveForm({ ...leaveForm, type: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                                                <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                                                <SelectItem value="Medical Leave">Medical Leave</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="start-date">Start Date</Label>
                                            <Input
                                                id="start-date"
                                                type="date"
                                                value={leaveForm.startDate}
                                                onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="end-date">End Date</Label>
                                            <Input
                                                id="end-date"
                                                type="date"
                                                value={leaveForm.endDate}
                                                onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="reason">Reason</Label>
                                        <Textarea
                                            id="reason"
                                            placeholder="Please explain the reason for your leave..."
                                            value={leaveForm.reason}
                                            onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsLeaveDialogOpen(false)}>Cancel</Button>
                                    <Button onClick={handleApplyLeave}>Submit Application</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Dates</TableHead>
                                    <TableHead className="hidden md:table-cell">Reason</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leaveRequests.length > 0 ? (
                                    leaveRequests.map((req) => (
                                        <TableRow key={req.id}>
                                            <TableCell className="font-medium">{req.type}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {req.startDate} to {req.endDate}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-sm max-w-[200px] truncate" title={req.reason}>
                                                {req.reason}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusBadge(req.status)}>
                                                    {req.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                                            No leave applications found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
