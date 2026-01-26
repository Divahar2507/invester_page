import { LayoutDashboard, Rocket, Users, Calendar, Settings, Zap, Briefcase, CircleHelp } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useEffect, useState } from "react";
import { api } from "@/services/api";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Events", url: "/events", icon: Calendar },
  { title: "Startups", url: "/startups", icon: Rocket },
  { title: "Investors", url: "/investors", icon: Briefcase },
  { title: "Leads", url: "/leads", icon: Zap },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await api.getMe();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <aside className="w-64 bg-sidebar min-h-screen border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain rounded-xl bg-white/10 p-1" />
          <div>
            <h1 className="font-bold text-white text-lg truncate max-w-[140px]">
              INVESTOR
            </h1>
            <p className="text-xs text-muted-foreground truncate max-w-[140px]">
              {user?.full_name || user?.username || "Loading..."}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end={item.url === "/"}
            className="sidebar-item"
            activeClassName="sidebar-item-active"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* Help */}
      <div className="p-4 border-t border-sidebar-border">
        <button className="sidebar-item w-full">
          <CircleHelp className="w-5 h-5" />
          <span>Help</span>
        </button>
      </div>
    </aside>
  );
}
