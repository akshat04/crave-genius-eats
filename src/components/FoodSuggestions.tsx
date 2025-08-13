import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, ExternalLink, ChefHat, ThumbsUp, ThumbsDown, RefreshCw, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CravingAnalysis } from "./CravingInput";

interface FoodSuggestion {
  id: string;
  name: string;
  description: string;
  image: string;
  type: "restaurant" | "recipe";
  cuisine: string;
  rating?: number;
  prepTime?: string;
  distance?: string;
  price?: string;
  matchReason: string;
}

interface FoodSuggestionsProps {
  analysis?: CravingAnalysis;
}

const mockSuggestions: FoodSuggestion[] = [
  {
    id: "1",
    name: "Spicy Thai Red Curry",
    description: "Rich coconut curry with fresh vegetables and aromatic spices",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
    type: "restaurant",
    cuisine: "Thai",
    rating: 4.8,
    distance: "0.8 mi",
    price: "$$",
    matchReason: "Perfect for your spicy and warming craving"
  },
  {
    id: "2", 
    name: "Homemade Butter Chicken",
    description: "Creamy tomato-based curry that's comforting and rich",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
    type: "recipe",
    cuisine: "Indian",
    prepTime: "45 min",
    matchReason: "Matches your comfort food mood perfectly"
  },
  {
    id: "3",
    name: "Korean Fire Noodles",
    description: "Instant noodles with gochujang and fresh vegetables",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
    type: "recipe",
    cuisine: "Korean", 
    prepTime: "15 min",
    matchReason: "Quick spicy fix for your craving"
  }
];

export const FoodSuggestions = ({ analysis }: FoodSuggestionsProps) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<FoodSuggestion[]>([]);

  const getSpecificDishImage = (dishName: string): string => {
    const lowerName = dishName.toLowerCase();
    
    // Enhanced mapping for specific Indian and international dishes
    const dishImageMap: { [key: string]: string } = {
      'chana masala': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
      'chole': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
      'butter chicken': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
      'murgh makhani': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
      'dal': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
      'daal': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
      'dal tadka': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
      'biryani': 'https://images.unsplash.com/photo-1563379091339-03246963d29c?w=400&h=300&fit=crop',
      'palak paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
      'saag paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
      'rajma': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop',
      'paneer makhani': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
      'aloo gobi': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
      'samosa': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
      'tandoori chicken': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
      'naan': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop',
      'roti': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop',
      'chapati': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop',
      'paneer curry': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
      'chicken curry': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
      'vegetable curry': 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop',
      'masala': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
      'korma': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
      'vindaloo': 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop',
      'tikka masala': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
      'paneer tikka': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
      'chicken tikka': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
      'pulao': 'https://images.unsplash.com/photo-1563379091339-03246963d29c?w=400&h=300&fit=crop',
      'jeera rice': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop',
    };

    // Check for exact matches first
    for (const [dish, image] of Object.entries(dishImageMap)) {
      if (lowerName.includes(dish)) {
        return image;
      }
    }

    // Fallback to existing generic mapping
    return getImageForDish(dishName);
  };

  const getImageForDish = (dishName: string): string => {
    const lowerName = dishName.toLowerCase();
    
    // Map dishes to appropriate Unsplash images with better matching
    if (lowerName.includes('chana masala') || lowerName.includes('chole')) {
      return "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop";
    } else if (lowerName.includes('butter chicken') || lowerName.includes('murgh makhani')) {
      return "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop";
    } else if (lowerName.includes('dal') || lowerName.includes('daal')) {
      return "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop";
    } else if (lowerName.includes('biryani')) {
      return "https://images.unsplash.com/photo-1563379091339-03246963d29c?w=400&h=300&fit=crop";
    } else if (lowerName.includes('palak paneer') || lowerName.includes('saag')) {
      return "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop";
    } else if (lowerName.includes('risotto')) {
      return "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop";
    } else if (lowerName.includes('curry')) {
      return "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop";
    } else if (lowerName.includes('chicken') || lowerName.includes('butter chicken')) {
      return "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop";
    } else if (lowerName.includes('shepherd') || lowerName.includes('pie') || lowerName.includes('potato')) {
      return "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop";
    } else if (lowerName.includes('mac') || lowerName.includes('cheese') || lowerName.includes('pasta')) {
      return "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=300&fit=crop";
    } else if (lowerName.includes('noodles') || lowerName.includes('ramen')) {
      return "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop";
    } else if (lowerName.includes('pizza')) {
      return "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop";
    } else if (lowerName.includes('soup')) {
      return "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop";
    } else if (lowerName.includes('rice') || lowerName.includes('biryani')) {
      return "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop";
    } else if (lowerName.includes('salad')) {
      return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop";
    } else if (lowerName.includes('burger')) {
      return "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop";
    } else if (lowerName.includes('taco')) {
      return "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop";
    } else if (lowerName.includes('stir fry') || lowerName.includes('stirfry')) {
      return "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop";
    } else {
      // Default food images
      const defaultImages = [
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop"
      ];
      return defaultImages[Math.floor(Math.random() * defaultImages.length)];
    }
  };

  const cleanDescription = (description: string): string => {
    // Remove markdown formatting like ** and other unwanted characters
    // Also handle HTML entities and special characters properly
    return description
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .trim();
  };

  const generateSuggestions = (): FoodSuggestion[] => {
    if (analysis?.recommendations && analysis.recommendations.length > 0) {
      return analysis.recommendations.map((rec, index) => ({
        id: `ai-${index}`,
        name: cleanDescription(rec.name),
        description: cleanDescription(rec.description),
        image: getSpecificDishImage(cleanDescription(rec.name)),
        type: rec.type,
        cuisine: rec.cuisine,
        rating: rec.type === "restaurant" ? parseFloat((4.2 + Math.random() * 0.6).toFixed(2)) : undefined,
        prepTime: rec.type === "recipe" ? `${15 + Math.floor(Math.random() * 45)} min` : undefined,
        distance: rec.type === "restaurant" ? `${(0.3 + Math.random() * 2).toFixed(1)} mi` : undefined,
        price: rec.type === "restaurant" ? (Math.random() > 0.5 ? "$$" : "$$$") : undefined,
        matchReason: cleanDescription(rec.matchReason)
      }));
    }
    
    return mockSuggestions;
  };

  useEffect(() => {
    setSuggestions(generateSuggestions());
  }, [analysis]);

  const handleSatisfied = () => {
    setFeedbackGiven(true);
    toast.success("Great! Enjoy your meal!");
  };

  const handleNotSatisfied = () => {
    setIsRegenerating(true);
    
    // Scroll back to craving input section to re-run analysis
    setTimeout(() => {
      const cravingSection = document.getElementById('craving-section');
      if (cravingSection) {
        cravingSection.scrollIntoView({ behavior: 'smooth' });
        
        // Trigger the "Find My Perfect Match" button click
        const findButton = cravingSection.querySelector('button[type="submit"], button:has(svg)');
        if (findButton && findButton.textContent?.includes('Find My Perfect Match')) {
          (findButton as HTMLButtonElement).click();
        }
      }
      
      setIsRegenerating(false);
      toast.success("Scroll up to adjust your craving and find new recommendations!");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Perfect Matches for You</h2>
        <p className="text-muted-foreground">Here are some options that match your craving</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((suggestion) => (
          <Card key={suggestion.id} className="overflow-hidden hover:shadow-warm transition-all duration-300 group hover:scale-102">
            <div className="relative">
              <img 
                src={suggestion.image} 
                alt={suggestion.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <Badge 
                  variant={suggestion.type === "restaurant" ? "default" : "secondary"}
                  className="bg-white/90 text-foreground"
                >
                  {suggestion.type === "restaurant" ? (
                    <><MapPin className="w-3 h-3 mr-1" /> Restaurant</>
                  ) : (
                    <><ChefHat className="w-3 h-3 mr-1" /> Recipe</>
                  )}
                </Badge>
              </div>
              {suggestion.rating && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white/90 text-foreground">
                    <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
                    {suggestion.rating}
                  </Badge>
                </div>
              )}
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">{suggestion.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {suggestion.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  {suggestion.cuisine}
                </Badge>
                {suggestion.distance && (
                  <Badge variant="outline" className="text-xs">
                    <MapPin className="w-3 h-3 mr-1" />
                    {suggestion.distance}
                  </Badge>
                )}
                {suggestion.prepTime && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {suggestion.prepTime}
                  </Badge>
                )}
                {suggestion.price && (
                  <Badge variant="outline" className="text-xs">
                    {suggestion.price}
                  </Badge>
                )}
              </div>

              <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                <p className="text-sm text-primary font-medium">
                  ✨ {suggestion.matchReason}
                </p>
              </div>

              <Button 
                variant={suggestion.type === "restaurant" ? "warm" : "fresh"} 
                className="w-full"
              >
                {suggestion.type === "restaurant" ? (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    Order Now
                  </>
                ) : (
                  <>
                    <ChefHat className="w-4 h-4" />
                    View Recipe
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Satisfaction Feedback UI */}
      {!feedbackGiven && (
        <Card className="p-6 bg-gradient-subtle border-primary/20">
          <div className="text-center space-y-4">
            <h4 className="text-lg font-semibold">Are you satisfied with these recommendations?</h4>
            <p className="text-muted-foreground">
              Let us know if these dishes match what you're craving, or if you'd like to see more options.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                variant="hero" 
                onClick={handleSatisfied}
                className="flex items-center gap-2"
              >
                <ThumbsUp className="w-4 h-4" />
                Yes, these look perfect!
              </Button>
              <Button 
                variant="outline" 
                onClick={handleNotSatisfied}
                disabled={isRegenerating}
                className="flex items-center gap-2"
              >
                {isRegenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Finding more options...
                  </>
                ) : (
                  <>
                    <ThumbsDown className="w-4 h-4" />
                    Show me more options
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {feedbackGiven && (
        <Card className="p-6 bg-accent/10 border-accent/20">
          <div className="text-center">
            <CheckCircle className="w-8 h-8 text-accent mx-auto mb-2" />
            <h4 className="font-semibold text-accent">Perfect! Enjoy your meal!</h4>
            <p className="text-muted-foreground mt-1">
              We're glad we could help you find something delicious.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};