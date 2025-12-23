import { createContext, useContext, useState, type ReactNode } from "react";

export type UserRole = "super_admin" | "admin" | "staff" | "student";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatarUrl?: string;
  // Staff-specific fields
  assignedCourses?: string[]; // Course codes that staff teaches
  collegeId?: string;
  superAdminId?: string;
  // Student-specific fields
  phone?: string;
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
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// todo: remove mock functionality
const mockUsers: Record<string, AuthUser> = {
  "admin@college.edu": {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "admin@college.edu",
    role: "super_admin",
    superAdminId: "SA2024001",
    department: "Administration",
  },
  "deptadmin@college.edu": {
    id: "4",
    name: "Prof. Alan Turing",
    email: "deptadmin@college.edu",
    role: "admin",
    collegeId: "ADM2024002",
    department: "Computer Science",
  },
  "staff@college.edu": {
    id: "2",
    name: "Prof. Michael Chen",
    email: "staff@college.edu",
    role: "staff",
    collegeId: "STF2024001",
    department: "Computer Science",
    assignedCourses: ["CS101", "CS201", "CS301", "CS401", "CS501"], // Courses this staff teaches
  },
  "student@college.edu": {
    id: "3",
    name: "Emily Parker",
    email: "student@college.edu",
    role: "student",
    department: "Computer Science",
    phone: "+1 555-0103",
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
    enrolledCourses: ["CS101", "CS201", "CS301"], // Courses student is enrolled in
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem("authUser");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error("Failed to restore user session:", e);
      localStorage.removeItem("authUser");
      return null;
    }
  });

  const login = async (email: string, _password: string) => {
    // todo: remove mock functionality - replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockUser = mockUsers[email];
    if (mockUser) {
      setUser(mockUser);
      localStorage.setItem("authUser", JSON.stringify(mockUser));
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
