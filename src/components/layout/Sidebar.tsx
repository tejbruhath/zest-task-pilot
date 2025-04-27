import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChartBar,
  List,
  Calendar,
  User,
  MessageSquare,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";

type SidebarItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
  extraClass?: string;
};

const sidebarItems: SidebarItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: <TrendingUp size={20} /> },
  { name: "My Tasks", path: "/tasks", icon: <List size={20} /> },
  { name: "Workflows", path: "/workflows", icon: <Calendar size={20} /> },
  { name: "Statistics", path: "/statistics", icon: <ChartBar size={20} /> },
  { name: "Team Tasks", path: "/team", icon: <MessageSquare size={20} /> },
  { name: "Profile", path: "/profile", icon: <User size={20} /> },
  {
    name: "About",
    path: "/about",
    icon: <span className="font-bold text-lg">i</span>,
    extraClass: "mt-8 ml-2",
  },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="relative z-10">
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 md:hidden z-20"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <Menu size={20} /> : <X size={20} />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 overflow-hidden",
          collapsed ? "w-0 md:w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <h1 className={cn("font-bold text-xl", collapsed && "md:hidden")}>
            TaskMaster.ai
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex"
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </Button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-8">
          <nav className="px-2 space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 rounded-md transition-colors text-sidebar-foreground",
                  location.pathname === item.path
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/70",
                  collapsed && "md:justify-center md:px-2",
                  item.extraClass
                )}
              >
                <span className="mr-3">{item.icon}</span>
                <span className={cn(collapsed && "md:hidden")}>
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className={cn("p-4 text-sm", collapsed && "md:hidden")}>
          <p>TaskMaster.ai v1.0</p>
        </div>
      </div>
    </div>
  );
};
