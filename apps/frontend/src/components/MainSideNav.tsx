import { useState, createContext, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { Button } from "@repo/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@repo/ui/sheet";
import {
  BrainCircuit,
  Code2,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sparkles,
  SquareChevronRight,
  Sun,
  Trophy,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

type ActiveSection =
  | "problems"
  | "compiler"
  | "ai"
  | "contest"
  | "premium";
type NavItemKey = ActiveSection;

interface NavItem {
  key: NavItemKey;
  label: string;
  to: string;
  icon: typeof Code2;
}

interface MainSideNavProps {
  active: ActiveSection;
  theme: string;
  toggleTheme: () => void;
  avatarUrl?: string;
  avatarFallback?: string;
  onProfile: () => void;
  onSignOut: () => void;
}

const navItems: NavItem[] = [
  {
    key: "problems",
    label: "Problems",
    to: "/problems",
    icon: Code2,
  },
  {
    key: "contest",
    label: "Contests",
    to: "/contest",
    icon: Trophy,
  },
  {
    key: "compiler",
    label: "Compiler",
    to: "/compiler",
    icon: SquareChevronRight,
  },
  {
    key: "ai",
    label: "Grind AI",
    to: "/grind-ai",
    icon: BrainCircuit,
  },
  {
    key: "premium",
    label: "Premium",
    to: "/premium",
    icon: Sparkles,
  },
];

// Context to share sidebar state with consuming pages
const SidebarContext = createContext<{ collapsed: boolean }>({ collapsed: false });
export const useSidebarState = () => useContext(SidebarContext);

export default function MainSideNav({
  active,
  theme,
  toggleTheme,
  avatarUrl,
  avatarFallback,
  onProfile,
  onSignOut,
}: MainSideNavProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const activeItem = navItems.find((item) => item.key === active);
  const avatarLetter = (avatarFallback || "G").charAt(0).toUpperCase();
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate("/auth")
    setSheetOpen(false); 
    onSignOut(); 
  }

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden lg:flex flex-col border-r border-border/40 bg-background transition-all duration-300 ease-in-out ${
          collapsed ? "w-[68px]" : "w-64"
        }`}
      >
        <div className="flex h-full w-full flex-col">
          <div className="flex items-center justify-between px-3 h-14 border-b border-border/40">
            <Link
              to="/"
              className={`flex items-center gap-2.5 hover:opacity-80 transition-opacity ${
                collapsed ? "justify-center w-full" : ""
              }`}
            >
              {collapsed && (
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-foreground text-background flex-shrink-0">
                  <div className="h-8 w-8 overflow-hidden rounded-lg border border-border/60 bg-background p-0.5 shadow-sm">
                    <img
                      src="/new_logo.jpg"
                      alt="Grind logo"
                      className="h-full w-full rounded-md object-cover"
                    />
                  </div>
                </div>
              )}
              {!collapsed && (
                <span className="font-bold text-sm tracking-wide">GRIND</span>
              )}
            </Link>
            {!collapsed && (
              <button
                onClick={() => setCollapsed(true)}
                className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {collapsed && (
            <div className="flex justify-center py-2 border-b border-border/40">
              <button
                onClick={() => setCollapsed(false)}
                className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Expand sidebar"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.key === active;

              return (
                <Link
                  key={item.key}
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  className={`group relative flex items-center rounded-lg transition-all duration-200 ${
                    collapsed
                      ? "justify-center px-0 py-2.5"
                      : "gap-3 px-3 py-2.5"
                  } ${
                    isActive
                      ? "bg-foreground/[0.08] text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-foreground rounded-r-full" />
                  )}

                  <span
                    className={`flex items-center justify-center flex-shrink-0 ${
                      collapsed ? "w-5 h-5" : "w-5 h-5"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>

                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}

                  {/* Tooltip on hover when collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-foreground text-background text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50 shadow-lg">
                      {item.label}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-foreground rotate-45" />
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="border-t border-border/40 p-2 space-y-1">
            {/* Utility buttons */}
            {collapsed ? (
              <>
                <Link
                  to="/settings"
                  title="Settings"
                  className="w-full flex items-center justify-center py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                >
                  <Settings className="h-[18px] w-[18px]" />
                </Link>
                <button
                  onClick={toggleTheme}
                  title="Toggle theme"
                  className="w-full flex items-center justify-center py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                >
                  {theme === "dark" ? (
                    <Sun className="h-[18px] w-[18px]" />
                  ) : (
                    <Moon className="h-[18px] w-[18px]" />
                  )}
                </button>
                <button
                  onClick={onSignOut}
                  title="Sign out"
                  className="w-full flex items-center justify-center py-2.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/settings"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                >
                  <Settings className="h-[18px] w-[18px] flex-shrink-0" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                >
                  {theme === "dark" ? (
                    <Sun className="h-[18px] w-[18px] flex-shrink-0" />
                  ) : (
                    <Moon className="h-[18px] w-[18px] flex-shrink-0" />
                  )}
                  <span>Appearance</span>
                </button>
                <button
                  onClick={onSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
                  <span>Sign Out</span>
                </button>
              </>
            )}

            {/* User Avatar */}
            <div
              className={`flex items-center rounded-lg border border-border/40 bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors ${
                collapsed ? "justify-center p-2" : "gap-2.5 p-2.5 mt-2"
              }`}
              onClick={onProfile}
            >
              <Avatar className={collapsed ? "h-7 w-7" : "h-8 w-8"}>
                <AvatarImage src={avatarUrl || ""} alt="@user" />
                <AvatarFallback className="bg-foreground/10 text-foreground text-xs font-semibold">
                  {avatarLetter}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">Workspace</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {activeItem?.label || "Dashboard"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile Header + Sheet ── */}
      <div className="border-b border-border/40 bg-background/95 backdrop-blur-xl lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-foreground text-background">
              <SquareChevronRight className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-sm font-bold leading-none">
                GRIND
              </span>
              <span className="text-[10px] text-muted-foreground">
                {activeItem?.label || "Dashboard"}
              </span>
            </div>
          </Link>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-lg hover:bg-muted">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[280px] border-r border-border/40 bg-background p-0 sm:max-w-sm"
            >
              <div className="flex h-full flex-col">
                {/* Sheet Header */}
                <div className="flex items-center gap-2.5 px-4 h-14 border-b border-border/40">
                  <Link
                    to="/"
                    onClick={() => setSheetOpen(false)}
                    className="flex items-center gap-2.5"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-foreground text-background">
                      <SquareChevronRight className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-sm tracking-wide">GRIND</span>
                  </Link>
                </div>

                {/* Sheet Nav */}
                <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.key === active;

                    return (
                      <Link
                        key={item.key}
                        to={item.to}
                        onClick={() => setSheetOpen(false)}
                        className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
                          isActive
                            ? "bg-foreground/[0.08] text-foreground"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        }`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-foreground rounded-r-full" />
                        )}
                        <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Sheet Bottom */}
                <div className="border-t border-border/40 p-3 space-y-1">
                  <Link
                    to="/settings"
                    onClick={() => { setSheetOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  >
                    <Settings className="h-[18px] w-[18px]" />
                    Settings
                  </Link>
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-[18px] w-[18px]" />
                    ) : (
                      <Moon className="h-[18px] w-[18px]" />
                    )}
                    Appearance
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-[18px] w-[18px]" />
                    Sign Out
                  </button>

                  <div
                    className="flex items-center gap-2.5 rounded-lg border border-border/40 bg-muted/20 p-2.5 mt-2 cursor-pointer hover:bg-muted/40 transition-colors"
                    onClick={() => { setSheetOpen(false); onProfile(); }}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={avatarUrl || ""} alt="@user" />
                      <AvatarFallback className="bg-foreground/10 text-foreground text-xs font-semibold">
                        {avatarLetter}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">Workspace</p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {activeItem?.label || "Dashboard"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Spacer that adapts to sidebar width for the main content */}
      <style>{`
        @media (min-width: 1024px) {
          .sidebar-offset {
            padding-left: ${collapsed ? "68px" : "256px"};
            transition: padding-left 300ms ease-in-out;
            overflow-x: hidden;
            max-width: 100vw;
            box-sizing: border-box;
          }
        }
      `}</style>
    </>
  );
}
