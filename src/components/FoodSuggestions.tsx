import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, ExternalLink, ChefHat } from "lucide-react";

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

export const FoodSuggestions = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Perfect Matches for You</h2>
        <p className="text-muted-foreground">Here are some options that match your craving</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockSuggestions.map((suggestion) => (
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
    </div>
  );
};