import { useState, useRef, ChangeEvent } from "react";
import { Camera, Save, User, Mail, Phone, Building, Calendar, Lock } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChangePasswordDialog } from "@/components/ChangePasswordDialog";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

const roleLabels = {
  super_admin: "Super Admin",
  admin: "Admin",
  staff: "Staff Member",
  student: "Student",
};

const roleColors = {
  super_admin: "bg-destructive text-destructive-foreground",
  admin: "bg-primary text-primary-foreground",
  staff: "bg-primary text-primary-foreground",
  student: "bg-primary text-primary-foreground",
};

export function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 555-0100",
    department: user?.department || "",
  });

  const [avatarUrl, setAvatarUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Image size should be less than 5MB", variant: "destructive" });
        return;
      }
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      toast({ title: "Profile picture updated" });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({ title: "Profile updated successfully" });
  };

  return (
    <MainLayout title="Profile">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl} alt={user.name} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                {user.role === "super_admin" && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -bottom-2 -right-2 rounded-full"
                    data-testid="button-change-avatar"
                    onClick={triggerFileInput}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  data-testid="input-image-upload"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-semibold" data-testid="text-profile-name">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="mt-2">
                  <Badge className={roleColors[user.role]}>{roleLabels[user.role]}</Badge>
                </div>
              </div>
              {user.role === "super_admin" && (
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  className="gap-2"
                  data-testid="button-edit-profile"
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  ) : (
                    "Edit Profile"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Full Name
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    data-testid="input-profile-name"
                  />
                ) : (
                  <p className="text-sm font-medium py-2">{formData.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email Address
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    data-testid="input-profile-email"
                  />
                ) : (
                  <p className="text-sm font-medium py-2">{formData.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    data-testid="input-profile-phone"
                  />
                ) : (
                  <p className="text-sm font-medium py-2">{user.phone || formData.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  Department
                </Label>
                <p className="text-sm font-medium py-2">{formData.department}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin/Staff ID Card */}
        {user.role !== "student" && user.collegeId && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Identification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label className="text-muted-foreground">
                  {user.role === "staff" ? "Staff_Id" : "Admin_Id"}
                </Label>
                <p className="text-sm font-mono font-medium py-2">{user.collegeId}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {user.role === "student" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Student Identification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {user.collegeId && (
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Student_Id</Label>
                      <p className="text-sm font-mono font-medium py-2">{user.collegeId}</p>
                    </div>
                  )}
                  {user.universityId && (
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">University ID</Label>
                      <p className="text-sm font-mono font-medium py-2">{user.universityId}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {user.dateOfBirth && (
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Date of Birth</Label>
                      <p className="text-sm font-medium py-2">
                        {new Date(user.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {user.gender && (
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Gender</Label>
                      <p className="text-sm font-medium py-2 capitalize">{user.gender}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Academic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {user.currentClass && (
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Current Class</Label>
                      <p className="text-sm font-medium py-2">{user.currentClass}</p>
                    </div>
                  )}
                  {user.semester && (
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Semester</Label>
                      <p className="text-sm font-medium py-2">Semester {user.semester}</p>
                    </div>
                  )}
                  {user.enrollmentDate && (
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Enrollment Date</Label>
                      <p className="text-sm font-medium py-2">
                        {new Date(user.enrollmentDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Guardian Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {user.guardianName && (
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Guardian Name</Label>
                      <p className="text-sm font-medium py-2">{user.guardianName}</p>
                    </div>
                  )}
                  {user.guardianContact && (
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Guardian Contact</Label>
                      <p className="text-sm font-medium py-2">{user.guardianContact}</p>
                    </div>
                  )}
                  {user.guardianRelationship && (
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Relationship</Label>
                      <p className="text-sm font-medium py-2">{user.guardianRelationship}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Role
                </Label>
                <p className="text-sm font-medium py-2">{roleLabels[user.role]}</p>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Member Since
                </Label>
                <p className="text-sm font-medium py-2">September 2024</p>
              </div>
            </div>
            <div className="pt-2">
              <Button
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(true)}
                className="gap-2 w-full sm:w-auto"
                data-testid="button-change-password"
              >
                <Lock className="h-4 w-4" />
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {isEditing && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} data-testid="button-save-profile">
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <ChangePasswordDialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      />
    </MainLayout>
  );
}
