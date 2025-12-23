import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-context";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ProgramsPage } from "@/pages/ProgramsPage";
import { DepartmentsPage } from "@/pages/DepartmentsPage";
import { CoursesPage } from "@/pages/CoursesPage";
import { UsersPage } from "@/pages/UsersPage";
import { AttendancePage } from "@/pages/AttendancePage";
import { ResultsPage } from "@/pages/ResultsPage";
import { StudentReportsPage } from "@/pages/StudentReportsPage";
import { StudentAttendancePage } from "@/pages/StudentAttendancePage";
import { ClassRoutinePage } from "@/pages/ClassRoutinePage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ChangePasswordPage } from "@/pages/ChangePasswordPage";
import { CalendarPage } from "@/pages/CalendarPage";
import NotFound from "@/pages/not-found";

function ProtectedRoute({
  component: Component,
  roles
}: {
  component: React.ComponentType;
  roles?: string[];
}) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Redirect to="/dashboard" />;
  }

  return <Component />;
}

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/dashboard" /> : <LoginPage />}
      </Route>
      <Route path="/">
        {isAuthenticated ? <Redirect to="/dashboard" /> : <Redirect to="/login" />}
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute component={DashboardPage} />
      </Route>
      <Route path="/programs">
        <ProtectedRoute component={ProgramsPage} roles={["super_admin", "admin"]} />
      </Route>
      <Route path="/departments">
        <ProtectedRoute component={DepartmentsPage} roles={["super_admin"]} />
      </Route>
      <Route path="/courses">
        <ProtectedRoute component={CoursesPage} roles={["super_admin", "admin", "staff"]} />
      </Route>
      <Route path="/users">
        <ProtectedRoute component={UsersPage} roles={["super_admin", "admin", "staff"]} />
      </Route>
      <Route path="/attendance">
        <ProtectedRoute component={AttendancePage} roles={["super_admin", "admin", "staff"]} />
      </Route>
      <Route path="/results">
        <ProtectedRoute component={ResultsPage} roles={["super_admin", "admin", "staff"]} />
      </Route>
      <Route path="/my-reports">
        <ProtectedRoute component={StudentReportsPage} roles={["student"]} />
      </Route>
      <Route path="/student-attendance">
        <ProtectedRoute component={StudentAttendancePage} roles={["student"]} />
      </Route>
      <Route path="/class-routine">
        <ProtectedRoute component={ClassRoutinePage} roles={["super_admin", "admin", "student"]} />
      </Route>
      <Route path="/profile">
        <ProtectedRoute component={ProfilePage} />
      </Route>
      <Route path="/change-password">
        <ProtectedRoute component={ChangePasswordPage} />
      </Route>
      <Route path="/calendar">
        <ProtectedRoute component={CalendarPage} />
      </Route>
      <Route component={NotFound} />
    </Switch >
  );
}

function App() {
  console.log("App component rendering");
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
