import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Sparkles, Send, Utensils, Heart, Zap, ChefHat, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CravingAnalysis {
  analysis: string;
  recommendations?: {
    name: string;
    description: string;
    cuisine: string;
    type: "restaurant" | "recipe";
    matchReason: string;
  }[];
}

const dietaryOptions = [
  "Vegan", "Vegetarian", "Keto", "Gluten-Free", "Dairy-Free", 
  "Paleo", "Low-Carb", "Halal", "Kosher", "Nut-Free"
];

const nationalityOptions = [
  "American", "Italian", "Chinese", "Japanese", "Indian", "Mexican", "French", "Thai", 
  "Greek", "Lebanese", "Korean", "Vietnamese", "Spanish", "Turkish", "British", 
  "German", "Brazilian", "Moroccan", "Ethiopian", "Peruvian", "Other"
];

const moodCravings = [
  { icon: Heart, text: "Comfort Food", color: "warm" },
  { icon: Zap, text: "Something Spicy", color: "fresh" },
  { icon: Sparkles, text: "Light & Fresh", color: "default" },
  { icon: Utensils, text: "Rich & Creamy", color: "warm" }
];

interface CravingInputProps {
  onAnalysisComplete?: (analysis: CravingAnalysis) => void;
}

export const CravingInput = ({ onAnalysisComplete }: CravingInputProps) => {
  const [craving, setCraving] = useState("");
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [nationality, setNationality] = useState("");
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
      const cravingText = `${craving.trim()}${nationality ? ` (I prefer ${nationality} cuisine)` : ''}`;
      
      const { data, error } = await supabase.functions.invoke('analyze-craving', {
        body: {
          craving: cravingText,
          dietaryPreferences: selectedDietary,
          nationality: nationality || null
        }
      });

      if (error) {
        console.error('Error calling analyze-craving function:', error);
        toast.error('Failed to analyze your craving. Please try again.');
        return;
      }

      if (data.success) {
        setAiResponse(data.analysis);
        const analysisData: CravingAnalysis = {
          analysis: data.analysis,
          recommendations: parseRecommendations(data.analysis)
        };
        onAnalysisComplete?.(analysisData);
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

  const parseRecommendations = (analysis: string) => {
    // Simple parsing to extract dish names from the AI response
    // This is a basic implementation - in a real app you'd want more sophisticated parsing
    const dishes: { name: string; description: string; cuisine: string; type: "restaurant" | "recipe"; matchReason: string; }[] = [];
    
    // Common food-related keywords to help identify dishes
    const lines = analysis.split('\n');
    const dishNames: string[] = [];
    
    // Look for numbered items or dishes mentioned
    lines.forEach(line => {
      // Look for patterns like "1. Dish Name" or "- Dish Name"
      const numbered = line.match(/^\d+\.\s*([^-:]+)/);
      const bulleted = line.match(/^-\s*([^-:]+)/);
      const colonSeparated = line.match(/\*\*([^*]+)\*\*/);
      
      if (numbered) dishNames.push(numbered[1].trim());
      else if (bulleted) dishNames.push(bulleted[1].trim());
      else if (colonSeparated) dishNames.push(colonSeparated[1].trim());
    });
    
    // If no structured format found, extract likely dish names
    if (dishNames.length === 0) {
      const commonDishes = [
        'curry', 'chicken', 'pasta', 'soup', 'noodles', 'rice', 'pizza', 'sandwich', 
        'salad', 'stir fry', 'tacos', 'burger', 'ramen', 'pho', 'biryani', 'risotto'
      ];
      
      commonDishes.forEach(dish => {
        if (analysis.toLowerCase().includes(dish)) {
          const context = analysis.match(new RegExp(`[^.]*${dish}[^.]*`, 'i'));
          if (context) {
            dishNames.push(context[0].trim());
          }
        }
      });
    }
    
    // Create dish objects with limited data we can extract
    const uniqueNames = [...new Set(dishNames)].slice(0, 3);
    uniqueNames.forEach((name, index) => {
      dishes.push({
        name: name.replace(/[^\w\s]/g, '').trim(),
        description: `Delicious ${name.toLowerCase()} that matches your craving perfectly`,
        cuisine: nationality || getCuisineFromDish(name),
        type: Math.random() > 0.5 ? "restaurant" : "recipe",
        matchReason: `Perfect for your ${craving.toLowerCase()} craving`
      });
    });
    
    return dishes.length > 0 ? dishes : getDefaultRecommendations();
  };

  const getCuisineFromDish = (dish: string): string => {
    const lowerDish = dish.toLowerCase();
    if (lowerDish.includes('curry') || lowerDish.includes('biryani')) return 'Indian';
    if (lowerDish.includes('pasta') || lowerDish.includes('pizza')) return 'Italian';
    if (lowerDish.includes('ramen') || lowerDish.includes('sushi')) return 'Japanese';
    if (lowerDish.includes('taco') || lowerDish.includes('burrito')) return 'Mexican';
    if (lowerDish.includes('pho') || lowerDish.includes('banh')) return 'Vietnamese';
    if (lowerDish.includes('pad thai') || lowerDish.includes('tom yum')) return 'Thai';
    return 'International';
  };

  const getDefaultRecommendations = () => [
    {
      name: "Spicy Thai Red Curry",
      description: "Rich coconut curry with fresh vegetables and aromatic spices",
      cuisine: "Thai",
      type: "restaurant" as const,
      matchReason: "Perfect for your spicy and warming craving"
    },
    {
      name: "Homemade Butter Chicken",
      description: "Creamy tomato-based curry that's comforting and rich",
      cuisine: "Indian", 
      type: "recipe" as const,
      matchReason: "Matches your comfort food mood perfectly"
    },
    {
      name: "Korean Fire Noodles",
      description: "Instant noodles with gochujang and fresh vegetables",
      cuisine: "Korean",
      type: "recipe" as const,
      matchReason: "Quick spicy fix for your craving"
    }
  ];

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

      {/* Cuisine Preference */}
      <Card className="p-6 shadow-card border-primary/10">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          Cuisine Preference
        </h4>
        <div className="space-y-2">
          <Label htmlFor="nationality">What type of cuisine do you prefer?</Label>
          <Select value={nationality} onValueChange={setNationality}>
            <SelectTrigger>
              <SelectValue placeholder="Select your preferred cuisine (optional)" />
            </SelectTrigger>
            <SelectContent>
              {nationalityOptions.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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