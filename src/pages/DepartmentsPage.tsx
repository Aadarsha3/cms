import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth-context";

interface Department {
    id: string;
    name: string;
    code: string;
    programIds: string[];
    createdAt: string;
}

interface Program {
    id: string;
    name: string;
    code: string;
}

// Mock data
const mockPrograms: Program[] = [
    { id: "1", name: "Bachelor of Computer Science", code: "BCS" },
    { id: "2", name: "Master of Business Administration", code: "MBA" },
    { id: "3", name: "Bachelor of Mechanical Engineering", code: "BME" },
    { id: "4", name: "Bachelor of Civil Engineering", code: "BCE" },
    { id: "5", name: "Bachelor of Information Technology", code: "BIT" },
    { id: "6", name: "Master of Computer Applications", code: "MCA" },
    { id: "7", name: "Bachelor of Electronics Engineering", code: "BEE" },
    { id: "8", name: "Doctor of Philosophy in Physics", code: "PhD-PHY" },
];

const mockDepartments: Department[] = [
    {
        id: "1",
        name: "Computer Science & IT",
        code: "CS",
        programIds: ["1", "5", "6"],
        createdAt: "2025-01-01",
    },
    {
        id: "2",
        name: "Business Administration",
        code: "BUS",
        programIds: ["2"],
        createdAt: "2025-01-01",
    },
    {
        id: "3",
        name: "Mechanical Engineering",
        code: "ME",
        programIds: ["3"],
        createdAt: "2025-01-05",
    },
    {
        id: "4",
        name: "Civil Engineering",
        code: "CE",
        programIds: ["4"],
        createdAt: "2025-01-10",
    },
    {
        id: "5",
        name: "Electronics & Communications",
        code: "ECE",
        programIds: ["7"],
        createdAt: "2025-01-15",
    },
    {
        id: "6",
        name: "Science & Research",
        code: "SCI",
        programIds: ["8"],
        createdAt: "2025-02-01",
    },
];


export function DepartmentsPage() {
    const { user } = useAuth();
    const { toast } = useToast();

    // Admin-only access control
    const isAdmin = user?.role === "super_admin";

    if (!isAdmin) {
        return (
            <MainLayout title="Access Denied">
                <Card>
                    <CardContent className="p-8 text-center">
                        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                        <p className="text-muted-foreground">
                            You don't have permission to access this page. Only administrators can manage departments.
                        </p>
                    </CardContent>
                </Card>
            </MainLayout>
        );
    }
    const [departments, setDepartments] = useState<Department[]>(mockDepartments);
    const [programs] = useState<Program[]>(mockPrograms);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        code: "",
        programIds: [] as string[],
    });

    const resetForm = () => {
        setFormData({ name: "", code: "", programIds: [] });
        setEditingDepartment(null);
    };

    const handleEdit = (department: Department) => {
        setEditingDepartment(department);
        setFormData({
            name: department.name,
            code: department.code,
            programIds: department.programIds,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setDepartments(prev => prev.filter(d => d.id !== id));
        toast({ title: "Department deleted successfully" });
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.code) {
            toast({ title: "Please fill in all required fields", variant: "destructive" });
            return;
        }

        if (editingDepartment) {
            // Update existing
            setDepartments(prev =>
                prev.map(d =>
                    d.id === editingDepartment.id
                        ? { ...d, name: formData.name, code: formData.code, programIds: formData.programIds }
                        : d
                )
            );
            toast({ title: "Department updated successfully" });
        } else {
            // Create new
            const newDepartment: Department = {
                id: Date.now().toString(),
                name: formData.name,
                code: formData.code,
                programIds: formData.programIds,
                createdAt: new Date().toISOString().split('T')[0],
            };
            setDepartments(prev => [...prev, newDepartment]);
            toast({ title: "Department created successfully" });
        }

        setIsDialogOpen(false);
        resetForm();
    };

    const toggleProgram = (programId: string) => {
        setFormData(prev => ({
            ...prev,
            programIds: prev.programIds.includes(programId)
                ? prev.programIds.filter(id => id !== programId)
                : [...prev.programIds, programId],
        }));
    };

    const getProgramsByIds = (programIds: string[]) => {
        return programs.filter(p => programIds.includes(p.id));
    };

    return (
        <MainLayout title="Department Management">
            <div className="space-y-6">
                {/* Header with Title and Action */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Departments</h2>
                        <p className="text-muted-foreground mt-1">
                            Manage departments and assign programs
                        </p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2" size="lg" onClick={resetForm}>
                                <Plus className="h-4 w-4" />
                                Add Department
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingDepartment ? "Edit Department" : "Add New Department"}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Department Name *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g., Computer Science"
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="code">Department Code *</Label>
                                        <Input
                                            id="code"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                            placeholder="e.g., CS"
                                            className="h-11"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label>Assign Programs</Label>
                                    <div className="border-2 rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto bg-muted/30">
                                        {programs.map((program) => (
                                            <div key={program.id} className="flex items-center space-x-3 p-2 hover:bg-background rounded-md transition-colors">
                                                <Checkbox
                                                    id={`program-${program.id}`}
                                                    checked={formData.programIds.includes(program.id)}
                                                    onCheckedChange={() => toggleProgram(program.id)}
                                                />
                                                <Label
                                                    htmlFor={`program-${program.id}`}
                                                    className="text-sm font-normal cursor-pointer flex-1"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span>{program.name}</span>
                                                        <Badge variant="outline">{program.code}</Badge>
                                                    </div>
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsDialogOpen(false);
                                        resetForm();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit}>
                                    {editingDepartment ? "Update Department" : "Add Department"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Statistics */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-600">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{departments.length}</p>
                                <p className="text-sm text-muted-foreground">Total Departments</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Departments Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-32">Code</TableHead>
                                    <TableHead>Department Name</TableHead>
                                    <TableHead>Assigned Programs</TableHead>
                                    <TableHead className="w-32">Created</TableHead>
                                    <TableHead className="w-32">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {departments.length > 0 ? (
                                    departments.map((department) => (
                                        <TableRow key={department.id}>
                                            <TableCell className="font-mono font-semibold">{department.code}</TableCell>
                                            <TableCell className="font-medium">{department.name}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {getProgramsByIds(department.programIds).map((program) => (
                                                        <Badge key={program.id} variant="secondary">
                                                            {program.code}
                                                        </Badge>
                                                    ))}
                                                    {department.programIds.length === 0 && (
                                                        <span className="text-sm text-muted-foreground">No programs assigned</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(department.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(department)}
                                                        className="h-8 w-8"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(department.id)}
                                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                            No departments found. Click "Add Department" to create one.
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
