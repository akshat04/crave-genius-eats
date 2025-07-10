import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Utensils, Heart, Zap } from "lucide-react";

const dietaryOptions = [
  "Vegan", "Vegetarian", "Keto", "Gluten-Free", "Dairy-Free", 
  "Paleo", "Low-Carb", "Halal", "Kosher", "Nut-Free"
];

const moodCravings = [
  { icon: Heart, text: "Comfort Food", color: "warm" },
  { icon: Zap, text: "Something Spicy", color: "fresh" },
  { icon: Sparkles, text: "Light & Fresh", color: "default" },
  { icon: Utensils, text: "Rich & Creamy", color: "warm" }
];

export const CravingInput = () => {
  const [craving, setCraving] = useState("");
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDietaryToggle = (option: string) => {
    setSelectedDietary(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleQuickCraving = (text: string) => {
    setCraving(text);
  };

  const analyzeCraving = async () => {
    if (!craving.trim()) return;
    
    setIsAnalyzing(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      {/* Quick Mood Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {moodCravings.map((mood) => {
          const IconComponent = mood.icon;
          return (
            <Button
              key={mood.text}
              variant="craving"
              className="h-16 flex-col gap-2"
              onClick={() => handleQuickCraving(mood.text)}
            >
              <IconComponent className="w-5 h-5" />
              <span className="text-xs">{mood.text}</span>
            </Button>
          );
        })}
      </div>

      {/* Main Craving Input */}
      <Card className="p-6 shadow-card border-primary/10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">What are you craving?</h3>
          </div>
          
          <Textarea
            placeholder="Describe your craving... 'I want something spicy and warming' or 'Craving something creamy and cold' or just 'pizza'"
            value={craving}
            onChange={(e) => setCraving(e.target.value)}
            className="min-h-24 resize-none border-primary/20 focus:border-primary"
          />
          
          <Button 
            onClick={analyzeCraving}
            disabled={!craving.trim() || isAnalyzing}
            variant="hero"
            size="lg"
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Analyzing your craving...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Find My Perfect Match
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Dietary Preferences */}
      <Card className="p-6 shadow-card border-primary/10">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Utensils className="w-4 h-4 text-primary" />
          Dietary Preferences
        </h4>
        <div className="flex flex-wrap gap-2">
          {dietaryOptions.map((option) => (
            <Badge
              key={option}
              variant={selectedDietary.includes(option) ? "default" : "secondary"}
              className={`cursor-pointer transition-all duration-200 ${
                selectedDietary.includes(option) 
                  ? "bg-primary text-primary-foreground shadow-primary scale-105" 
                  : "hover:bg-primary/10 hover:scale-105"
              }`}
              onClick={() => handleDietaryToggle(option)}
            >
              {option}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
};