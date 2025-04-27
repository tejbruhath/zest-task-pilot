import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, Bell, Sparkles, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSidebar } from "@/context/SidebarContext";

type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Task Due Soon",
      message: 'Your task "Complete project proposal" is due tomorrow',
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Welcome to TaskMaster.ai",
      message: "Thanks for joining! Start by creating your first task.",
      read: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);
  const [searchOpen, setSearchOpen] = useState(false);
  const { setSidebarOpen } = useSidebar();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    toast.success("Notification marked as read");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Search functionality
  const handleSearch = (search: string) => {
    console.log("Searching for:", search);
    // Here you would typically call a function to search tasks
    setSearchOpen(false);
    // Navigate to search results or filter the current page
    toast.success(`Search results for "${search}"`);
  };

  return (
    <div className="h-16 border-b border-border flex items-center justify-between px-4 bg-background">
      {/* Hamburger for mobile */}
      <button
        className="md:hidden mr-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu size={24} />
      </button>
      {/* Logo - visible on mobile, hidden on desktop (since sidebar has logo) */}
      <Link to="/" className="flex items-center space-x-2 md:hidden">
        <span className="font-bold text-primary text-xl">TaskMaster.ai</span>
      </Link>

      {/* Search bar */}
      <div className="hidden md:flex relative max-w-md w-full">
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="mr-2" size={18} />
          <span>Search tasks or projects...</span>
        </Button>
        <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
          <CommandInput placeholder="Search tasks and projects..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Tasks">
              <CommandItem
                onSelect={() => {
                  navigate("/tasks");
                  setSearchOpen(false);
                }}
              >
                Complete project proposal
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  navigate("/tasks");
                  setSearchOpen(false);
                }}
              >
                Weekly team meeting
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Workflows">
              <CommandItem
                onSelect={() => {
                  navigate("/workflows");
                  setSearchOpen(false);
                }}
              >
                Productivity
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  navigate("/workflows");
                  setSearchOpen(false);
                }}
              >
                Fitness
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-3">
        {/* AI Assistant Button */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-purple-600"
          onClick={() => navigate("/ai-assistant")}
        >
          <Sparkles size={20} />
        </Button>

        {/* Notifications */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                  {unreadCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-md border ${
                      notification.read ? "bg-background" : "bg-muted"
                    }`}
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium">{notification.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No notifications
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={user?.email || "User"} />
                <AvatarFallback>
                  {user?.email?.substring(0, 2).toUpperCase() || "ZT"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="w-full">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/ai-assistant" className="w-full">
                AI Assistant
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
