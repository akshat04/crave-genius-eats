import { useState } from "react";
import { 
  User, 
  Settings, 
  CreditCard, 
  Crown, 
  LogOut, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  HelpCircle,
  ChevronRight,
  X,
  LogIn
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";

// Props for UserSidebar component
interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// UserSidebar component displays user info, settings, and menu actions
export const UserSidebar = ({ isOpen, onClose }: UserSidebarProps) => {
  // State for notifications toggle
  const [notifications, setNotifications] = useState(true);
  // Get user and signOut from auth context
  const { user, signOut } = useAuth();
  // Get theme and setTheme from theme context
  const { theme, setTheme } = useTheme();

  // Sidebar menu items and their actions
  const menuItems = [
    {
      icon: User,
      label: "Profile Settings",
      description: "Manage your account details",
      action: () => console.log("Profile settings")
    },
    {
      icon: Crown,
      label: "Subscription",
      description: "Manage your premium plan",
      action: () => console.log("Subscription"),
      badge: "Pro"
    },
    {
      icon: CreditCard,
      label: "Payment Methods",
      description: "Manage billing and payments",
      action: () => console.log("Payment methods")
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Configure alert preferences",
      action: () => console.log("Notifications"),
      toggle: {
        checked: notifications,
        onChange: setNotifications
      }
    },
    {
      icon: Shield,
      label: "Privacy & Security",
      description: "Account security settings",
      action: () => console.log("Privacy")
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "Get help and contact support",
      action: () => console.log("Help")
    }
  ];

  return (
    <>
      {/* Overlay for closing sidebar */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar panel */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-background border-l shadow-lg z-50 
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header section with user info or sign in */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Account</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {/* Show user profile if signed in, else sign in prompt */}
            {user ? (
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium">
                    {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Free
                </Badge>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-3">
                  Sign in to access your account
                </p>
                <Link to="/auth" onClick={onClose}>
                  <Button variant="outline" size="sm" className="w-full">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar content: theme toggle and menu items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Theme toggle card */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Moon className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Sun className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Toggle theme</p>
                  </div>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
              </div>
            </Card>

            <Separator />

            {/* Menu items list */}
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <Card 
                  key={index}
                  className="p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={item.action}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{item.label}</p>
                          {/* Show badge if present (e.g. Pro) */}
                          {item.badge && (
                            <Badge variant="outline" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    {/* Show toggle switch if item has toggle, else chevron */}
                    {item.toggle ? (
                      <Switch
                        checked={item.toggle.checked}
                        onCheckedChange={item.toggle.onChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Footer: sign out button if user is signed in */}
          {user && (
            <div className="p-6 border-t">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={signOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};