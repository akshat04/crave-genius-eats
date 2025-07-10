import { useState } from "react";
import { Hero } from "@/components/Hero";
import { Navigation } from "@/components/Navigation";
import { CravingInput } from "@/components/CravingInput";
import { FoodSuggestions } from "@/components/FoodSuggestions";
import { MenuScanning } from "@/components/MenuScanning";
import { DeliveryIntegration } from "@/components/DeliveryIntegration";
import { CravingHistory } from "@/components/CravingHistory";

const Index = () => {
  const [currentView, setCurrentView] = useState("discover");
  const [showHero, setShowHero] = useState(true);

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    // Hide hero when navigating to other sections
    if (view !== "discover") {
      setShowHero(false);
    }
  };

  const scrollToContent = () => {
    setShowHero(false);
    document.getElementById('main-content')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "discover":
        return (
          <div className="space-y-16">
            <section id="craving-section" className="max-w-4xl mx-auto">
              <CravingInput />
            </section>
            <section className="max-w-6xl mx-auto">
              <FoodSuggestions />
            </section>
          </div>
        );
      case "menu-scan":
        return (
          <section className="max-w-6xl mx-auto">
            <MenuScanning />
          </section>
        );
      case "delivery":
        return (
          <section className="max-w-6xl mx-auto">
            <DeliveryIntegration />
          </section>
        );
      case "history":
        return (
          <section className="max-w-6xl mx-auto">
            <CravingHistory />
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section - only show on initial load */}
      {showHero && (
        <Hero onStartDiscovering={scrollToContent} />
      )}
      
      {/* Navigation */}
      {!showHero && (
        <div className="container mx-auto px-6 pt-8 pb-4">
          <Navigation currentView={currentView} onViewChange={handleViewChange} />
        </div>
      )}

      {/* Main Content */}
      <div id="main-content" className={`container mx-auto px-6 ${showHero ? 'py-16' : 'pb-16'}`}>
        {renderCurrentView()}

        {/* Back to Discovery - only show on other views */}
        {!showHero && currentView !== "discover" && (
          <div className="text-center mt-16">
            <button
              onClick={() => {
                setCurrentView("discover");
                setShowHero(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-primary hover:text-primary/80 underline font-medium"
            >
              ← Back to Food Discovery
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
