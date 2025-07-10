import { useState } from "react";
import { Hero } from "@/components/Hero";
import { CravingInput } from "@/components/CravingInput";
import { FoodSuggestions } from "@/components/FoodSuggestions";

const Index = () => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <Hero />
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 space-y-16">
        {/* Craving Input Section */}
        <section id="craving-section" className="max-w-4xl mx-auto">
          <CravingInput />
        </section>

        {/* Mock suggestions - in real app this would be conditional */}
        <section className="max-w-6xl mx-auto">
          <FoodSuggestions />
        </section>

        {/* Future Features Preview */}
        <section className="max-w-4xl mx-auto text-center py-16">
          <h2 className="text-3xl font-bold mb-8">Coming Soon</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold">Menu Scanning</h3>
              <p className="text-muted-foreground text-sm">
                Upload restaurant menus and get personalized dish recommendations
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-warm rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🛒</span>
              </div>
              <h3 className="font-semibold">Delivery Integration</h3>
              <p className="text-muted-foreground text-sm">
                Direct ordering through Zomato, Swiggy, and Uber Eats
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-fresh rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold">Craving History</h3>
              <p className="text-muted-foreground text-sm">
                Track your food preferences and get smarter recommendations
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
