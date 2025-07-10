import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Camera, FileImage, Sparkles, CheckCircle, Clock, Star } from "lucide-react";
import { toast } from "sonner";

interface MenuDish {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  matchScore: number;
  reasons: string[];
  dietary: string[];
  spiceLevel?: number;
}

const mockMenuAnalysis: MenuDish[] = [
  {
    id: "1",
    name: "Butter Chicken",
    description: "Creamy tomato-based curry with tender chicken pieces",
    price: "$16.99",
    category: "Main Course",
    matchScore: 95,
    reasons: ["Perfect for your creamy craving", "Comfort food vibes", "Rich and satisfying"],
    dietary: ["Gluten-Free"],
    spiceLevel: 2
  },
  {
    id: "2", 
    name: "Paneer Tikka Masala",
    description: "Grilled cottage cheese in spiced tomato gravy",
    price: "$14.99",
    category: "Vegetarian",
    matchScore: 88,
    reasons: ["Vegetarian option", "Creamy texture you're craving", "Aromatic spices"],
    dietary: ["Vegetarian", "Gluten-Free"],
    spiceLevel: 3
  },
  {
    id: "3",
    name: "Mango Kulfi",
    description: "Traditional Indian ice cream with cardamom",
    price: "$6.99", 
    category: "Dessert",
    matchScore: 75,
    reasons: ["Sweet ending", "Creamy and cold", "Unique flavors"],
    dietary: ["Vegetarian"],
    spiceLevel: 0
  }
];

export const MenuScanning = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [cravings, setCravings] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        toast.success("Menu uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeMenu = async () => {
    if (!uploadedImage) {
      toast.error("Please upload a menu first");
      return;
    }

    if (!cravings.trim()) {
      toast.error("Please describe what you're craving first");
      return;
    }

    setIsAnalyzing(true);
    // Simulate AI analysis using cravings and menu image
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
    setAnalysisComplete(true);
    toast.success("Menu analysis complete! Found perfect matches for your cravings.");
  };

  const toggleDishSelection = (dishId: string) => {
    setSelectedDishes(prev => 
      prev.includes(dishId) 
        ? prev.filter(id => id !== dishId)
        : [...prev, dishId]
    );
  };

  const getSpiceIndicator = (level?: number) => {
    if (!level) return null;
    return "🌶️".repeat(level);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Smart Menu Scanning</h2>
        <p className="text-muted-foreground">Upload a menu and let AI highlight dishes that match your cravings</p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Menu</TabsTrigger>
          <TabsTrigger value="camera">Take Photo</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* Cravings Input */}
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="cravings" className="text-base font-semibold">What are you craving?</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Describe what you're in the mood for - spicy, creamy, vegetarian, comfort food, etc.
                </p>
              </div>
              <Textarea
                id="cravings"
                placeholder="e.g., Something creamy and comforting, spicy curry, fresh salad, chocolate dessert..."
                value={cravings}
                onChange={(e) => setCravings(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </Card>

          <Card className="p-8">
            <div className="text-center space-y-4">
              {!uploadedImage ? (
                <>
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-12 hover:border-primary/50 transition-colors">
                    <FileImage className="w-16 h-16 text-primary/50 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Drop your menu here</h3>
                    <p className="text-muted-foreground mb-6">Supports JPG, PNG, PDF files up to 10MB</p>
                    
                    <label className="cursor-pointer">
                      <Button variant="hero" className="pointer-events-none">
                        <Upload className="w-4 h-4" />
                        Choose File
                      </Button>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded menu"
                      className="max-w-full h-64 object-contain mx-auto rounded-lg shadow-card"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setUploadedImage(null);
                        setAnalysisComplete(false);
                        setSelectedDishes([]);
                      }}
                    >
                      Change
                    </Button>
                  </div>
                  
                  {!analysisComplete && (
                    <Button 
                      onClick={analyzeMenu}
                      disabled={isAnalyzing}
                      variant="hero"
                      size="lg"
                      className="w-full max-w-md mx-auto"
                    >
                      {isAnalyzing ? (
                        <>
                          <Sparkles className="w-4 h-4 animate-spin" />
                          Analyzing Menu with AI...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Analyze Menu
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="camera" className="space-y-6">
          {/* Cravings Input */}
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="cravings-camera" className="text-base font-semibold">What are you craving?</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Describe what you're in the mood for - spicy, creamy, vegetarian, comfort food, etc.
                </p>
              </div>
              <Textarea
                id="cravings-camera"
                placeholder="e.g., Something creamy and comforting, spicy curry, fresh salad, chocolate dessert..."
                value={cravings}
                onChange={(e) => setCravings(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </Card>

          <Card className="p-8 text-center">
            <Camera className="w-16 h-16 text-primary/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Camera Feature</h3>
            <p className="text-muted-foreground mb-6">Take a photo of the menu directly</p>
            <Button variant="hero" disabled>
              <Camera className="w-4 h-4" />
              Open Camera (Coming Soon)
            </Button>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Analysis Results */}
      {analysisComplete && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-center justify-center">
            <CheckCircle className="w-6 h-6 text-accent" />
            <h3 className="text-xl font-semibold">Menu Analysis Complete!</h3>
          </div>

          <div className="grid gap-4">
            {mockMenuAnalysis.map((dish) => (
              <Card 
                key={dish.id} 
                className={`p-6 cursor-pointer transition-all duration-300 ${
                  selectedDishes.includes(dish.id) 
                    ? 'ring-2 ring-primary shadow-primary' 
                    : 'hover:shadow-card'
                }`}
                onClick={() => toggleDishSelection(dish.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-lg">{dish.name}</h4>
                      <Badge variant="default" className="bg-accent text-accent-foreground">
                        {dish.matchScore}% Match
                      </Badge>
                      {getSpiceIndicator(dish.spiceLevel) && (
                        <span className="text-sm">{getSpiceIndicator(dish.spiceLevel)}</span>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground">{dish.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{dish.category}</Badge>
                      {dish.dietary.map(diet => (
                        <Badge key={diet} variant="secondary">{diet}</Badge>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-medium text-sm text-primary">Why this matches your craving:</p>
                      <div className="flex flex-wrap gap-2">
                        {dish.reasons.map((reason, index) => (
                          <span key={index} className="text-sm bg-primary/5 text-primary px-2 py-1 rounded">
                            ✨ {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">{dish.price}</p>
                    {selectedDishes.includes(dish.id) && (
                      <CheckCircle className="w-6 h-6 text-accent mt-2" />
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {selectedDishes.length > 0 && (
            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Selected Items ({selectedDishes.length})</h4>
                  <p className="text-muted-foreground">Ready to order your perfect matches!</p>
                </div>
                <Button variant="hero" size="lg">
                  Order Selected Items
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};