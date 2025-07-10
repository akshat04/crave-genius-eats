import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ExternalLink, MapPin, Clock, Star, Truck, CreditCard, Check } from "lucide-react";

interface DeliveryApp {
  id: string;
  name: string;
  logo: string;
  connected: boolean;
  deliveryTime: string;
  deliveryFee: string;
  rating: number;
  specialOffer?: string;
  available: boolean;
}

const deliveryApps: DeliveryApp[] = [
  {
    id: "zomato",
    name: "Zomato",
    logo: "🍕",
    connected: true,
    deliveryTime: "25-40 min",
    deliveryFee: "$2.99",
    rating: 4.3,
    specialOffer: "Free delivery on orders over $25",
    available: true
  },
  {
    id: "swiggy", 
    name: "Swiggy",
    logo: "🛵",
    connected: false,
    deliveryTime: "30-45 min",
    deliveryFee: "$1.99",
    rating: 4.1,
    available: true
  },
  {
    id: "ubereats",
    name: "Uber Eats",
    logo: "🚗",
    connected: true,
    deliveryTime: "20-35 min", 
    deliveryFee: "$3.49",
    rating: 4.4,
    specialOffer: "50% off first order",
    available: true
  },
  {
    id: "doordash",
    name: "DoorDash",
    logo: "🏠",
    connected: false,
    deliveryTime: "25-40 min",
    deliveryFee: "$2.49",
    rating: 4.2,
    available: false
  }
];

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  image: string;
  distance: string;
  availableOn: string[];
  specialOffer?: string;
}

const nearbyRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Spice Garden Indian",
    cuisine: "Indian",
    rating: 4.6,
    deliveryTime: "30-45 min",
    deliveryFee: "$2.99",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
    distance: "0.8 mi",
    availableOn: ["zomato", "ubereats"],
    specialOffer: "20% off orders over $30"
  },
  {
    id: "2",
    name: "Bangkok Street Food",
    cuisine: "Thai",
    rating: 4.4,
    deliveryTime: "25-40 min", 
    deliveryFee: "$1.99",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
    distance: "1.2 mi",
    availableOn: ["zomato", "swiggy", "ubereats"]
  },
  {
    id: "3",
    name: "Comfort Kitchen",
    cuisine: "American",
    rating: 4.3,
    deliveryTime: "35-50 min",
    deliveryFee: "$3.49",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
    distance: "2.1 mi",
    availableOn: ["ubereats"]
  }
];

export const DeliveryIntegration = () => {
  const [apps, setApps] = useState(deliveryApps);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);

  const toggleConnection = (appId: string) => {
    setApps(prev => prev.map(app => 
      app.id === appId 
        ? { ...app, connected: !app.connected }
        : app
    ));
  };

  const getAppLogo = (appId: string) => {
    const app = apps.find(a => a.id === appId);
    return app?.logo || "🍽️";
  };

  const isAppConnected = (appId: string) => {
    const app = apps.find(a => a.id === appId);
    return app?.connected || false;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Delivery Integration</h2>
        <p className="text-muted-foreground">Connect your favorite delivery apps for seamless ordering</p>
      </div>

      {/* Delivery Apps Management */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Connected Apps</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {apps.map((app) => (
            <Card key={app.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{app.logo}</div>
                  <div>
                    <h4 className="font-semibold text-lg">{app.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{app.rating}</span>
                      <span>•</span>
                      <Clock className="w-4 h-4" />
                      <span>{app.deliveryTime}</span>
                      <span>•</span>
                      <Truck className="w-4 h-4" />
                      <span>{app.deliveryFee}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {!app.available && (
                    <Badge variant="secondary">Not Available</Badge>
                  )}
                  <Switch
                    checked={app.connected}
                    onCheckedChange={() => toggleConnection(app.id)}
                    disabled={!app.available}
                  />
                </div>
              </div>
              
              {app.specialOffer && app.connected && (
                <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm text-accent font-medium">
                    🎉 {app.specialOffer}
                  </p>
                </div>
              )}
              
              {app.connected && (
                <div className="mt-4 flex items-center gap-2 text-sm text-accent">
                  <Check className="w-4 h-4" />
                  <span>Connected & Ready</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Available Restaurants */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Available Restaurants</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {nearbyRestaurants.map((restaurant) => (
            <Card 
              key={restaurant.id} 
              className={`overflow-hidden hover:shadow-warm transition-all duration-300 cursor-pointer ${
                selectedRestaurant === restaurant.id ? 'ring-2 ring-primary shadow-primary' : ''
              }`}
              onClick={() => setSelectedRestaurant(
                selectedRestaurant === restaurant.id ? null : restaurant.id
              )}
            >
              <div className="relative">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white/90 text-foreground">
                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {restaurant.rating}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3 flex gap-1">
                  {restaurant.availableOn.map(appId => (
                    <div 
                      key={appId}
                      className={`text-lg p-1 rounded bg-white/90 ${
                        isAppConnected(appId) ? '' : 'opacity-50'
                      }`}
                    >
                      {getAppLogo(appId)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h4 className="font-semibold text-lg">{restaurant.name}</h4>
                  <p className="text-muted-foreground">{restaurant.cuisine}</p>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{restaurant.distance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    <span>{restaurant.deliveryFee}</span>
                  </div>
                </div>

                {restaurant.specialOffer && (
                  <div className="bg-primary/5 rounded-lg p-2 border border-primary/10">
                    <p className="text-sm text-primary font-medium">
                      🎉 {restaurant.specialOffer}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm font-medium">Order through:</p>
                  <div className="flex gap-2">
                    {restaurant.availableOn.map(appId => {
                      const app = apps.find(a => a.id === appId);
                      const connected = isAppConnected(appId);
                      return (
                        <Button
                          key={appId}
                          variant={connected ? "default" : "outline"}
                          size="sm"
                          disabled={!connected}
                          className="flex-1"
                        >
                          <span className="mr-1">{getAppLogo(appId)}</span>
                          {app?.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {selectedRestaurant === restaurant.id && (
                  <Button variant="hero" className="w-full mt-4">
                    <ExternalLink className="w-4 h-4" />
                    View Menu & Order
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Connection Status */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Integration Status</h3>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {apps.filter(app => app.connected).length}
              </div>
              <div className="text-sm text-muted-foreground">Connected Apps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {nearbyRestaurants.length}
              </div>
              <div className="text-sm text-muted-foreground">Available Restaurants</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Connect more delivery apps to access more restaurants and better deals
          </p>
        </div>
      </Card>
    </div>
  );
};