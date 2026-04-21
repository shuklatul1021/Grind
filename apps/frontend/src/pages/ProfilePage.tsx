import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
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
  ArrowLeft,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { BACKENDURL } from "../utils/urls";
import { toast } from "../../../../packages/ui/src/hooks/use-toast";
import type { UserInterface } from "../types/problem";
import { useDashboardData } from "../hooks/useDashboardData";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"view" | "edit">("view");
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [handleSaveLoading, setHandleSaveLoading] = useState<boolean>(false);

  const {
    userDetails: cachedUser,
    userDetailsLoaded, 
  } = useDashboardData(["userDetails"]);

  // Use cached data to avoid loading spinner if we already have data
  const [isLoading, setIsLoading] = useState(!userDetailsLoaded);

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
    // If we already have cached user data, use it immediately
    if (userDetailsLoaded && cachedUser?.id) {
      setProfile(cachedUser);
      setIsLoading(false);
    } else {
      getUserInfo();
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Background grid */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Floating back button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-5 left-5 z-50 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back
      </button>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
            <p className="text-sm text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      ) : (
        <main className="max-w-4xl mx-auto px-4 py-16">
          {/* Profile Header Card */}
          <div className="relative mb-8">
            {/* Banner */}
            <div className="h-32 rounded-t-2xl bg-gradient-to-r from-muted/80 via-muted/40 to-muted/80 border border-b-0 border-border/40" />

            {/* Avatar + Info */}
            <div className="relative bg-card/50 backdrop-blur-xl border border-border/40 rounded-b-2xl px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                {/* Avatar positioned to overlap banner */}
                <div className="-mt-12 flex-shrink-0">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className="text-xl bg-foreground/10 text-foreground font-bold">
                      {getInitials(profile.fullname || "")}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Name & meta */}
                <div className="flex-1 pt-2 sm:pt-3 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        {profile.fullname || "Grind User"}
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        @{profile.username || "username"}
                      </p>
                    </div>

                    {/* Tab buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant={activeTab === "view" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveTab("view")}
                        className={activeTab === "view" ? "bg-foreground text-background hover:bg-foreground/90" : ""}
                      >
                        <User className="mr-1.5 h-3.5 w-3.5" />
                        View
                      </Button>
                      <Button
                        variant={activeTab === "edit" ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setEditedProfile(profile);
                          setActiveTab("edit");
                        }}
                        className={activeTab === "edit" ? "bg-foreground text-background hover:bg-foreground/90" : ""}
                      >
                        <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </div>
                  </div>

                  {/* Bio */}
                  {profile.bio && (
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-lg">
                      {profile.bio}
                    </p>
                  )}

                  {/* Meta tags */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-muted-foreground">
                    {profile.email && (
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        {profile.email}
                      </span>
                    )}
                    {profile.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {profile.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Joined{" "}
                      {new Date(profile.createdAt || "").toLocaleDateString(
                        "en-US",
                        { month: "long", year: "numeric" }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {activeTab === "view" ? (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
                        <Target className="h-5 w-5 text-foreground/70" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold tracking-tight">
                          {profile.problemsSolved || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Problems Solved
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-foreground/70" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold tracking-tight">
                          {profile.contestsParticipated || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Contests Joined
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
                        <Flame className="h-5 w-5 text-foreground/70" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold tracking-tight">
                          {profile.currentStreak || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Day Streak
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Social Links */}
              <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Social Links</CardTitle>
                  <CardDescription className="text-xs">
                    Your connected platforms
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {profile?.social?.github ? (
                    <a
                      href={`https://github.com/${profile.social.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl border border-border/40 hover:bg-muted/40 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center">
                          <Github className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">GitHub</div>
                          <div className="text-xs text-muted-foreground">
                            github.com/{profile.social.github}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : null}

                  {profile?.social?.linkedin ? (
                    <a
                      href={`https://linkedin.com/in/${profile.social.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl border border-border/40 hover:bg-muted/40 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center">
                          <Linkedin className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">LinkedIn</div>
                          <div className="text-xs text-muted-foreground">
                            linkedin.com/in/{profile.social.linkedin}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : null}

                  {profile?.social?.twitter ? (
                    <a
                      href={`https://twitter.com/${profile.social.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl border border-border/40 hover:bg-muted/40 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center">
                          <Twitter className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Twitter</div>
                          <div className="text-xs text-muted-foreground">
                            twitter.com/{profile.social.twitter}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : null}

                  {!profile?.social?.github &&
                    !profile?.social?.linkedin &&
                    !profile?.social?.twitter && (
                      <div className="text-center py-6 text-sm text-muted-foreground">
                        No social links added yet. Edit your profile to add them.
                      </div>
                    )}
                </CardContent>
              </Card>
            </div>
          ) : (
            /* ── Edit Mode ── */
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Edit2 className="h-4 w-4 text-muted-foreground" />
                  Edit Profile
                </CardTitle>
                <CardDescription className="text-xs">
                  Update your information and social links
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-5">
                    <Avatar className="h-20 w-20 border-2 border-border/40">
                      <AvatarImage src={avatarPreview || profile.avatar} />
                      <AvatarFallback className="text-lg bg-foreground/10 text-foreground font-bold">
                        {getInitials(editedProfile.fullname || "")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Label htmlFor="avatar" className="cursor-pointer">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/40 hover:bg-muted/40 transition-colors text-sm font-medium">
                          <Camera className="h-4 w-4" />
                          {isUploading ? "Uploading..." : "Change Avatar"}
                        </div>
                        <input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </Label>
                      <p className="text-[11px] text-muted-foreground mt-1.5">
                        Square image, at least 400×400px
                      </p>
                    </div>
                  </div>

                  {/* Name fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm">Full Name</Label>
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
                        className="h-10 bg-background/50 border-border/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm">Username</Label>
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
                        className="h-10 bg-background/50 border-border/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm">Location</Label>
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
                      className="h-10 bg-background/50 border-border/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm">Bio</Label>
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
                      rows={3}
                      className="bg-background/50 border-border/40 resize-none"
                    />
                  </div>

                  {/* Social Links */}
                  <div className="space-y-4 pt-4 border-t border-border/40">
                    <h3 className="text-sm font-semibold text-muted-foreground">Social Links</h3>

                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="github" className="text-sm flex items-center gap-2">
                          <Github className="h-3.5 w-3.5" /> GitHub
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
                                github: _e.target.value,
                              },
                            })
                          }
                          className="h-10 bg-background/50 border-border/40"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="linkedin" className="text-sm flex items-center gap-2">
                          <Linkedin className="h-3.5 w-3.5" /> LinkedIn
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
                                linkedin: _e.target.value,
                              },
                            })
                          }
                          className="h-10 bg-background/50 border-border/40"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="twitter" className="text-sm flex items-center gap-2">
                          <Twitter className="h-3.5 w-3.5" /> Twitter
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
                                twitter: _e.target.value,
                              },
                            })
                          }
                          className="h-10 bg-background/50 border-border/40"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={handleSaveLoading}
                      className="flex-1 h-11 bg-foreground text-background hover:bg-foreground/90 font-medium"
                    >
                      {handleSaveLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="flex-1 h-11"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </main>
      )}
    </div>
  );
}
