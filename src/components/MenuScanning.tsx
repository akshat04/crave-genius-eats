import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Camera, FileImage, Sparkles, CheckCircle, X, Eye, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface MenuDish {
  name: string;
  description: string;
  price: string;
  category: string;
  matchScore: number;
  reasons: string[];
  dietary: string[];
  spiceLevel?: number;
  estimatedPosition?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface MenuAnalysisResult {
  recommendations: MenuDish[];
  summary: string;
}

export const MenuScanning = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MenuAnalysisResult | null>(null);
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [cravings, setCravings] = useState("");
  const [isCameraMode, setIsCameraMode] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
        setAnalysisResult(null);
        toast.success("Menu uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera if available
      });
      setStream(mediaStream);
      setIsCameraMode(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraMode(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setUploadedImage(imageDataUrl);
        setAnalysisResult(null);
        stopCamera();
        toast.success("Photo captured successfully!");
      }
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
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-menu', {
        body: {
          imageBase64: uploadedImage,
          cravings: cravings.trim()
        }
      });

      if (error) {
        console.error('Error calling analyze-menu function:', error);
        toast.error('Failed to analyze menu. Please try again.');
        return;
      }

      if (data.success) {
        setAnalysisResult(data.analysis);
        toast.success('Menu analysis complete! Found perfect matches for your cravings.');
      } else {
        toast.error(data.error || 'Failed to analyze menu');
      }
    } catch (error) {
      console.error('Error analyzing menu:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleDishSelection = (dishName: string) => {
    setSelectedDishes(prev => 
      prev.includes(dishName) 
        ? prev.filter(name => name !== dishName)
        : [...prev, dishName]
    );
  };

  const getSpiceIndicator = (level?: number) => {
    if (!level) return null;
    return "🌶️".repeat(level);
  };

  const resetAnalysis = () => {
    setUploadedImage(null);
    setAnalysisResult(null);
    setSelectedDishes([]);
    setCravings("");
    setFeedbackGiven(false);
    setIsRegenerating(false);
    stopCamera();
  };

  const handleSatisfied = () => {
    setFeedbackGiven(true);
    toast.success("Great! Enjoy your meal!");
  };

  const handleNotSatisfied = async () => {
    if (!uploadedImage || !cravings.trim()) return;
    
    setIsRegenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-menu', {
        body: {
          imageBase64: uploadedImage,
          cravings: cravings.trim() + " (please provide different recommendations than before)"
        }
      });

      if (error) {
        console.error('Error regenerating recommendations:', error);
        toast.error('Failed to generate new recommendations. Please try again.');
        return;
      }

      if (data.success) {
        setAnalysisResult(data.analysis);
        setSelectedDishes([]);
        toast.success('Found new recommendations for you!');
      } else {
        toast.error(data.error || 'Failed to generate new recommendations');
      }
    } catch (error) {
      console.error('Error regenerating recommendations:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
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
                    <p className="text-muted-foreground mb-6">Supports JPG, PNG files up to 10MB</p>
                    
                    <label className="cursor-pointer">
                      <Button variant="hero" className="cursor-pointer">
                        <Upload className="w-4 h-4" />
                        Choose File
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
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
                      onClick={resetAnalysis}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {!analysisResult && (
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

          <Card className="p-8">
            <div className="text-center space-y-4">
              {!isCameraMode && !uploadedImage ? (
                <>
                  <Camera className="w-16 h-16 text-primary/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Camera Feature</h3>
                  <p className="text-muted-foreground mb-6">Take a photo of the menu directly</p>
                  <Button variant="hero" onClick={startCamera}>
                    <Camera className="w-4 h-4" />
                    Open Camera
                  </Button>
                </>
              ) : isCameraMode ? (
                <div className="space-y-4">
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full max-w-md mx-auto rounded-lg"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button variant="hero" onClick={captureImage}>
                      <Camera className="w-4 h-4" />
                      Capture
                    </Button>
                    <Button variant="outline" onClick={stopCamera}>
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={uploadedImage} 
                      alt="Captured menu"
                      className="max-w-full h-64 object-contain mx-auto rounded-lg shadow-card"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={resetAnalysis}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {!analysisResult && (
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
      </Tabs>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-2">
              <CheckCircle className="w-6 h-6 text-accent" />
              <h3 className="text-xl font-semibold">Menu Analysis Complete!</h3>
            </div>
            <p className="text-muted-foreground">{analysisResult.summary}</p>
          </div>

          <div className="grid gap-4">
            {analysisResult.recommendations.map((dish, index) => (
              <Card 
                key={`${dish.name}-${index}`}
                className={`p-6 cursor-pointer transition-all duration-300 ${
                  selectedDishes.includes(dish.name) 
                    ? 'ring-2 ring-primary shadow-primary' 
                    : 'hover:shadow-card'
                }`}
                onClick={() => toggleDishSelection(dish.name)}
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
                        {dish.reasons.map((reason, reasonIndex) => (
                          <span key={reasonIndex} className="text-sm bg-primary/5 text-primary px-2 py-1 rounded">
                            ✨ {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">{dish.price}</p>
                    {selectedDishes.includes(dish.name) && (
                      <CheckCircle className="w-6 h-6 text-accent mt-2" />
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Feedback Section */}
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