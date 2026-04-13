import { useNavigate } from "react-router-dom";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { ArrowLeft, Bell, Shield, Key, Palette, Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex flex-col">
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

      <main className="w-full max-w-3xl mx-auto px-4 py-16 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account preferences and settings.
          </p>
        </div>

        <div className="space-y-6">
          {/* Appearance Section */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Palette className="h-5 w-5 text-muted-foreground" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how Grind looks on your device.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-background/50">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-foreground/5 flex items-center justify-center">
                    {theme === "dark" ? (
                      <Moon className="h-5 w-5 text-foreground" />
                    ) : (
                      <Sun className="h-5 w-5 text-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Theme Preference</p>
                    <p className="text-xs text-muted-foreground">
                      Current: {theme === "dark" ? "Dark mode" : "Light mode"}
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={toggleTheme}>
                  Switch to {theme === "dark" ? "Light" : "Dark"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure how you receive alerts and updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-background/50">
                <div>
                  <p className="text-sm font-medium">Email Notifications</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Receive weekly updates and progress reports.
                  </p>
                </div>
                <Button variant="outline" size="sm" className="opacity-70 pointer-events-none">
                  Subscribed
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-background/50">
                <div>
                  <p className="text-sm font-medium">Contest Reminders</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get notified 15 minutes before a contest starts.
                  </p>
                </div>
                <Button variant="outline" size="sm" className="opacity-70 pointer-events-none">
                  Enabled
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                Security
              </CardTitle>
              <CardDescription>
                Manage your password and security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-background/50 flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="h-10 w-10 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
                    <Key className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Authentication</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Update your password or change login methods.
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/auth")}
                  className="w-full sm:w-auto shrink-0"
                >
                  Manage Access
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
