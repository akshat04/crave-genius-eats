// UI components and icons
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Camera, History, Truck, Menu } from "lucide-react";

// Props for Navigation component
interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

// Navigation items for different app views
const navigationItems = [
  {
    id: "discover",
    label: "Discover",
    icon: Sparkles,
    description: "Find your perfect food match"
  },
  {
    id: "menu-scan",
    label: "Menu Scan",
    icon: Camera,
    description: "AI-powered menu analysis"
  },
  {
    id: "delivery",
    label: "Delivery",
    icon: Truck,
    description: "Connected delivery apps"
  },
  {
    id: "history",
    label: "History",
    icon: History,
    description: "Your craving journey"
  }
];

// Navigation component for switching between app views
export const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  // State for mobile menu open/close
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button (visible on small screens) */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-card shadow-lg"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Mobile Menu Overlay (closes menu when clicked) */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Main navigation bar */}
      <nav className={`
        fixed top-4 left-1/2 transform -translate-x-1/2 z-40
        md:relative md:top-0 md:left-0 md:transform-none
        ${isMenuOpen ? 'block' : 'hidden md:block'}
      `}>
        <div className="bg-card/80 backdrop-blur-md rounded-full shadow-lg border border-border/50 p-2">
          <div className="flex gap-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentView === item.id;
              // Render navigation button for each item
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    onViewChange(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`
                    flex items-center gap-2 transition-all duration-300
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-primary scale-105' 
                      : 'hover:bg-primary/10 hover:scale-105'
                    }
                  `}
                  title={item.description}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};