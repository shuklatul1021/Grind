import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Textarea } from "@repo/ui/textarea";
import { useTheme } from "../contexts/ThemeContext";
import {
  SquareChevronRight,
  Sun,
  Moon,
  LogOut,
  User,
  Mail,
  MapPin,
  Calendar,
  Github,
  Linkedin,
  Twitter,
  Save,
  Edit2,
  Camera,
  Trophy,
  Flame,
  Target,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { BACKENDURL } from "../utils/urls";
import { toast } from "../../../../packages/ui/src/hooks/use-toast";
import type { UserInterface } from "../types/problem";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"view" | "edit">("view");
  const [isLoading, setIsLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [handleSaveLoading , setHandleSaveLoading] = useState<boolean>(false);

  const [profile, setProfile] = useState<UserInterface>({
    id: "",
    username: "",
    fullname: "",
    email: "",
    bio: "",
    avatar: "",
    location: "",
    social: {
      id: "",
      github: "",
      linkedin: "",
      twitter: "",
    },
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "grind_assistes");
    formData.append("cloud_name", "dwrrfy5wd");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dwrrfy5wd/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.secure_url;

        console.log("Uploaded Image URL:", imageUrl);
        setEditedProfile({ ...editedProfile, avatar: imageUrl });
        setAvatarPreview(imageUrl);
        setIsUploading(false);
      } else {
        console.error("Upload failed");
        setIsUploading(false);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setHandleSaveLoading(true);

    try {
      const response = await fetch(`${BACKENDURL}/user/editinfo`, {
        method: "PUT",
        headers: {
          token: localStorage.getItem("token") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: editedProfile.username,
          fullname: editedProfile.fullname,
          bio: editedProfile.bio,
          avatar: editedProfile.avatar,
          location: editedProfile.location,
          github: editedProfile.social?.github,
          linkedin: editedProfile.social?.linkedin,
          twitter: editedProfile.social?.linkedin,
        }),
      });

      if (response.ok) {
        setHandleSaveLoading(false);
        toast({
          title: "Updated Successfully",
          description: "Your Details Updated Successfully",
          variant: "soon",
        });
      } else {
        setHandleSaveLoading(false);
        toast({
          title: "Error While Updating",
          description: "Error While Updating Your Credential",
          variant: "destructive",
        });
      }
      setActiveTab("view");
      getUserInfo();
      setAvatarPreview("");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
      setHandleSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setActiveTab("view");
    setAvatarPreview("");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKENDURL}/user/details`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setIsLoading(false);
      } else {
        toast({
          title: "Error",
          description: "Internal Server Error Try Again",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Internal Server Error Try Again",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => navigate("/")}
          >
            <SquareChevronRight className="h-6 w-6" />
            <span className="text-xl font-bold">Grind</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/problems"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Problems
            </Link>
            <Link
              to="/contest"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Contest
            </Link>
            <Link
              to="/compiler"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Compiler
            </Link>
            <Link
              to="/grind-ai"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Grind AI
            </Link>
            {/* <Link 
              to="/room" 
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Rooms
            </Link> */}
            <Link
              to="/you"
              className="px-4 py-2 rounded-full bg-blue-500 text-white text-base font-medium transition-all hover:bg-blue-600 hover:text-white"
            >
              Profile
            </Link>
            <Link
              to="/premium"
              className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Premium
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <main className="container flex-1 px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                Your
                <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  {" "}
                  Profile
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                View your coding stats, manage your account settings, and
                showcase your achievements
              </p>
            </div>

            {/* Tab Buttons */}
            <div className="flex justify-center gap-4 mb-8">
              <Button
                variant={activeTab === "view" ? "default" : "outline"}
                onClick={() => setActiveTab("view")}
                className="px-8"
              >
                <User className="mr-2 h-4 w-4" />
                View Profile
              </Button>
              <Button
                variant={activeTab === "edit" ? "default" : "outline"}
                onClick={() => setActiveTab("edit")}
                className="px-8"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
            <div className="max-w-4xl mx-auto space-y-6">
              {activeTab === "view" ? (
                <>
                  <Card className="border-border/40 bg-card/50 backdrop-blur">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        <Avatar className="h-32 w-32 border-4 border-blue-500">
                          <AvatarImage src={profile.avatar} />
                          <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {getInitials(profile.fullname || "")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-4 text-left">
                          <div>
                            <h2 className="text-3xl font-bold mb-1">
                              {profile.fullname || ""}
                            </h2>
                            <p className="text-lg text-muted-foreground">
                              @{profile.username || ""}
                            </p>
                          </div>

                          <p className="text-base">{profile.bio}</p>

                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              {profile.email}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {profile.location || ""}
                            </div>
                            <br />
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              Joined{" "}
                              {new Date(
                                profile.createdAt || ""
                              ).toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric",
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border/40 bg-card/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        Statistics
                      </CardTitle>
                      <CardDescription>
                        Your coding journey at a glance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
                          <div className="flex items-center gap-3 mb-2">
                            <Target className="h-6 w-6 text-blue-500" />
                            <div className="text-3xl font-bold text-blue-500">
                              {profile.problemsSolved}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Problems Solved
                          </div>
                        </div>

                        <div className="p-6 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20">
                          <div className="flex items-center gap-3 mb-2">
                            <Trophy className="h-6 w-6 text-purple-500" />
                            <div className="text-3xl font-bold text-purple-500">
                              {profile.contestsParticipated}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Contests Participated
                          </div>
                        </div>

                        <div className="p-6 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20">
                          <div className="flex items-center gap-3 mb-2">
                            <Flame className="h-6 w-6 text-orange-500" />
                            <div className="text-3xl font-bold text-orange-500">
                              {profile.currentStreak}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Day Streak
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Social Links Card */}
                  <Card className="border-border/40 bg-card/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle>Social Links</CardTitle>
                      <CardDescription>
                        Connect with me on other platforms
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {profile?.social?.github && (
                        <a
                          href={`https://github.com/${profile.social.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 rounded-lg border border-border/40 hover:bg-muted transition-colors"
                        >
                          <Github className="h-5 w-5" />
                          <span>github.com/{profile.social.github}</span>
                        </a>
                      )}
                      {profile?.social?.linkedin && (
                        <a
                          href={`https://linkedin.com/in/${profile.social.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 rounded-lg border border-border/40 hover:bg-muted transition-colors"
                        >
                          <Linkedin className="h-5 w-5 text-blue-600" />
                          <span>linkedin.com/in/{profile.social.linkedin}</span>
                        </a>
                      )}
                      {profile?.social?.twitter && (
                        <a
                          href={`https://twitter.com/${profile.social.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 rounded-lg border border-border/40 hover:bg-muted transition-colors"
                        >
                          <Twitter className="h-5 w-5 text-blue-400" />
                          <span>twitter.com/{profile.social.twitter}</span>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                // Edit Profile Card
                <Card className="border-border/40 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Edit2 className="h-5 w-5 text-blue-500" />
                      Edit Profile
                    </CardTitle>
                    <CardDescription>
                      Update your profile information and social links
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSave} className="space-y-6">
                      {/* Avatar Upload */}
                      <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24 border-4 border-blue-500">
                          <AvatarImage src={avatarPreview || profile.avatar} />
                          <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {getInitials(editedProfile.fullname || "")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Label htmlFor="avatar" className="cursor-pointer">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
                              <Camera className="h-4 w-4" />
                              <span className="text-sm">{isUploading ? "Uploading..." : "Change Avatar"}</span>
                            </div>
                            <input
                              id="avatar"
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarChange}
                              className="hidden"
                            />
                          </Label>
                          <p className="text-xs text-muted-foreground mt-2">
                            Recommended: Square image, at least 400x400px
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            value={editedProfile.fullname || ""}
                            onChange={(e) =>
                              setEditedProfile({
                                ...editedProfile,
                                fullname: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username">Username *</Label>
                          <Input
                            id="username"
                            value={editedProfile.username}
                            onChange={(e) =>
                              setEditedProfile({
                                ...editedProfile,
                                username: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="e.g., San Francisco, CA"
                          value={editedProfile.location}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          placeholder="Tell us about yourself..."
                          value={editedProfile.bio}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              bio: e.target.value,
                            })
                          }
                          rows={4}
                        />
                        <p className="text-xs text-muted-foreground">
                          Brief description for your profile
                        </p>
                      </div>

                      {/* Social Links */}
                      <div className="space-y-4 pt-4 border-t border-border/40">
                        <h3 className="text-sm font-medium">Social Links</h3>

                        <div className="space-y-2">
                          <Label
                            htmlFor="github"
                            className="flex items-center gap-2"
                          >
                            <Github className="h-4 w-4" />
                            GitHub Username
                          </Label>
                          <Input
                            id="github"
                            placeholder="username"
                            value={editedProfile?.social?.github || ""}
                            onChange={(_e) =>
                              setEditedProfile({
                                ...editedProfile,
                                social: { 
                                  ...editedProfile.social, 
                                  id: editedProfile.social?.id ?? "", 
                                  github: _e.target.value 
                                }
                              })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="linkedin"
                            className="flex items-center gap-2"
                          >
                            <Linkedin className="h-4 w-4" />
                            LinkedIn Username
                          </Label>
                          <Input
                            id="linkedin"
                            placeholder="username"
                            value={editedProfile?.social?.linkedin || ""}
                            onChange={(_e) =>
                              setEditedProfile({
                                ...editedProfile,
                                social: { 
                                  ...editedProfile.social, 
                                  id: editedProfile.social?.id ?? "", 
                                  linkedin: _e.target.value 
                                }
                              })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="twitter"
                            className="flex items-center gap-2"
                          >
                            <Twitter className="h-4 w-4" />
                            Twitter Username
                          </Label>
                          <Input
                            id="twitter"
                            placeholder="username"
                            value={editedProfile?.social?.twitter || ""}
                            onChange={(_e) =>
                              setEditedProfile({
                                ...editedProfile,
                                social: { 
                                  ...editedProfile.social, 
                                  id: editedProfile.social?.id ?? "", 
                                  twitter: _e.target.value 
                                }
                              })
                            }
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <Button
                          type="submit"
                          disabled={handleSaveLoading}
                          className="flex-1"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          {handleSaveLoading ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancel}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
