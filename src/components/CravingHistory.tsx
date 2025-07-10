import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { 
  Heart, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  Calendar as CalendarIcon,
  Repeat,
  Star,
  MapPin,
  ChefHat,
  Trash2
} from "lucide-react";
import { format } from "date-fns";

interface CravingEntry {
  id: string;
  date: Date;
  craving: string;
  satisfiedWith: string;
  rating: number;
  type: "restaurant" | "recipe" | "delivery";
  cuisine: string;
  moodTag?: string;
  weather?: string;
  location?: string;
}

interface FavoriteFood {
  id: string;
  name: string;
  type: "restaurant" | "recipe";
  cuisine: string;
  timesOrdered: number;
  avgRating: number;
  lastOrdered: Date;
  image: string;
  tags: string[];
}

const mockCravingHistory: CravingEntry[] = [
  {
    id: "1",
    date: new Date(2024, 1, 15),
    craving: "Something spicy and warming",
    satisfiedWith: "Thai Red Curry from Bangkok Street",
    rating: 5,
    type: "delivery",
    cuisine: "Thai",
    moodTag: "Cold Day",
    weather: "Rainy",
    location: "Home"
  },
  {
    id: "2", 
    date: new Date(2024, 1, 12),
    craving: "Comfort food after long day",
    satisfiedWith: "Homemade Mac & Cheese",
    rating: 4,
    type: "recipe",
    cuisine: "American",
    moodTag: "Stressed",
    location: "Home"
  },
  {
    id: "3",
    date: new Date(2024, 1, 10),
    craving: "Fresh and healthy",
    satisfiedWith: "Mediterranean Bowl at Olive Branch",
    rating: 4,
    type: "restaurant",
    cuisine: "Mediterranean",
    moodTag: "Health Kick",
    weather: "Sunny"
  }
];

const mockFavorites: FavoriteFood[] = [
  {
    id: "1",
    name: "Butter Chicken",
    type: "restaurant",
    cuisine: "Indian",
    timesOrdered: 12,
    avgRating: 4.8,
    lastOrdered: new Date(2024, 1, 8),
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
    tags: ["Comfort Food", "Creamy", "Spicy"]
  },
  {
    id: "2",
    name: "Homemade Pizza",
    type: "recipe", 
    cuisine: "Italian",
    timesOrdered: 8,
    avgRating: 4.5,
    lastOrdered: new Date(2024, 1, 5),
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    tags: ["Weekend", "Family", "Customizable"]
  },
  {
    id: "3",
    name: "Poke Bowl",
    type: "restaurant",
    cuisine: "Hawaiian",
    timesOrdered: 6,
    avgRating: 4.6,
    lastOrdered: new Date(2024, 1, 3),
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    tags: ["Healthy", "Fresh", "Light"]
  }
];

export const CravingHistory = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);

  const getCravingsByDate = (date: Date) => {
    return mockCravingHistory.filter(entry => 
      entry.date.toDateString() === date.toDateString()
    );
  };

  const getPopularCuisines = () => {
    const cuisineCount = mockCravingHistory.reduce((acc, entry) => {
      acc[entry.cuisine] = (acc[entry.cuisine] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(cuisineCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
  };

  const getAverageRating = () => {
    const total = mockCravingHistory.reduce((sum, entry) => sum + entry.rating, 0);
    return (total / mockCravingHistory.length).toFixed(1);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Your Craving Journey</h2>
        <p className="text-muted-foreground">Track your food discoveries and get smarter recommendations</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold">{mockCravingHistory.length}</div>
          <div className="text-sm text-muted-foreground">Total Cravings</div>
        </Card>
        <Card className="p-4 text-center">
          <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{mockFavorites.length}</div>
          <div className="text-sm text-muted-foreground">Favorites</div>
        </Card>
        <Card className="p-4 text-center">
          <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{getAverageRating()}</div>
          <div className="text-sm text-muted-foreground">Avg Rating</div>
        </Card>
        <Card className="p-4 text-center">
          <TrendingUp className="w-8 h-8 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold">{getPopularCuisines()[0]?.[0] || "Thai"}</div>
          <div className="text-sm text-muted-foreground">Top Cuisine</div>
        </Card>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history">Craving History</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Craving Calendar
              </h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="pointer-events-auto"
                modifiers={{
                  hasCraving: mockCravingHistory.map(entry => entry.date)
                }}
                modifiersStyles={{
                  hasCraving: { 
                    backgroundColor: 'hsl(var(--primary))', 
                    color: 'white',
                    borderRadius: '50%'
                  }
                }}
              />
            </Card>

            {/* History List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-semibold">
                {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "All Cravings"}
              </h3>
              
              {(selectedDate ? getCravingsByDate(selectedDate) : mockCravingHistory).map((entry) => (
                <Card 
                  key={entry.id} 
                  className={`p-6 cursor-pointer transition-all duration-300 ${
                    selectedEntry === entry.id ? 'ring-2 ring-primary shadow-primary' : 'hover:shadow-card'
                  }`}
                  onClick={() => setSelectedEntry(selectedEntry === entry.id ? null : entry.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{entry.cuisine}</Badge>
                        <Badge variant="secondary">{entry.type}</Badge>
                        {entry.moodTag && (
                          <Badge variant="outline" className="text-primary border-primary/30">
                            {entry.moodTag}
                          </Badge>
                        )}
                      </div>
                      
                      <div>
                        <p className="font-medium text-muted-foreground text-sm">You craved:</p>
                        <p className="font-semibold italic">"{entry.craving}"</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-muted-foreground text-sm">Satisfied with:</p>
                        <p className="font-semibold">{entry.satisfiedWith}</p>
                      </div>
                      
                      {selectedEntry === entry.id && (
                        <div className="pt-3 border-t space-y-2">
                          {entry.weather && (
                            <p className="text-sm text-muted-foreground">
                              🌤️ Weather: {entry.weather}
                            </p>
                          )}
                          {entry.location && (
                            <p className="text-sm text-muted-foreground">
                              📍 Location: {entry.location}
                            </p>
                          )}
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm">
                              <Repeat className="w-4 h-4" />
                              Order Again
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {format(entry.date, "MMM d")}
                      </p>
                      <div className="flex">{renderStars(entry.rating)}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockFavorites.map((favorite) => (
              <Card key={favorite.id} className="overflow-hidden hover:shadow-warm transition-all duration-300">
                <div className="relative">
                  <img 
                    src={favorite.image} 
                    alt={favorite.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="default" className="bg-white/90 text-foreground">
                      {favorite.type === "restaurant" ? (
                        <><MapPin className="w-3 h-3 mr-1" /> Restaurant</>
                      ) : (
                        <><ChefHat className="w-3 h-3 mr-1" /> Recipe</>
                      )}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{favorite.name}</h3>
                    <p className="text-muted-foreground">{favorite.cuisine}</p>
                  </div>

                  <div className="flex justify-between text-sm">
                    <div>
                      <div className="font-semibold">{favorite.timesOrdered}</div>
                      <div className="text-muted-foreground">Times Ordered</div>
                    </div>
                    <div>
                      <div className="flex">{renderStars(Math.round(favorite.avgRating))}</div>
                      <div className="text-muted-foreground text-center">{favorite.avgRating}</div>
                    </div>
                    <div>
                      <div className="font-semibold">{format(favorite.lastOrdered, "MMM d")}</div>
                      <div className="text-muted-foreground">Last Order</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {favorite.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button variant="hero" className="w-full">
                    <Repeat className="w-4 h-4" />
                    Order Again
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Popular Cuisines */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Popular Cuisines
              </h3>
              <div className="space-y-4">
                {getPopularCuisines().map(([cuisine, count], index) => (
                  <div key={cuisine} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                        {index + 1}
                      </div>
                      <span className="font-medium">{cuisine}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${(count / mockCravingHistory.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Mood Patterns */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Mood Patterns</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Comfort Food Days</span>
                  <span className="font-semibold">67%</span>
                </div>
                <div className="flex justify-between">
                  <span>Healthy Cravings</span>
                  <span className="font-semibold">25%</span>
                </div>
                <div className="flex justify-between">
                  <span>Adventure Mode</span>
                  <span className="font-semibold">8%</span>
                </div>
              </div>
            </Card>

            {/* Weekly Trends */}
            <Card className="p-6 md:col-span-2">
              <h3 className="font-semibold mb-4">Weekly Craving Trends</h3>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Interactive charts coming soon!</p>
                <p className="text-sm">Track your craving patterns by day, weather, and mood</p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};