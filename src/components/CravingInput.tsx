import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Utensils, Heart, Zap, ChefHat } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [aiResponse, setAiResponse] = useState<string | null>(null);

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
    setAiResponse(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-craving', {
        body: {
          craving: craving.trim(),
          dietaryPreferences: selectedDietary
        }
      });

      if (error) {
        console.error('Error calling analyze-craving function:', error);
        toast.error('Failed to analyze your craving. Please try again.');
        return;
      }

      if (data.success) {
        setAiResponse(data.analysis);
        toast.success('Perfect match found!');
      } else {
        toast.error(data.error || 'Failed to analyze your craving');
      }
    } catch (error) {
      console.error('Error analyzing craving:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
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

      {/* AI Response */}
      {aiResponse && (
        <Card className="p-6 shadow-card border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex items-start gap-3">
            <div className="bg-primary rounded-full p-2 mt-1">
              <ChefHat className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-3 text-primary">AI Food Expert Says:</h4>
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {aiResponse}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};