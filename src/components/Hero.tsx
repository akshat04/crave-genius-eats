import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles, Brain, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-food.jpg";

interface HeroProps {
  onStartDiscovering?: () => void;
}

export const Hero = ({ onStartDiscovering }: HeroProps) => {
  const scrollToCraving = () => {
    if (onStartDiscovering) {
      onStartDiscovering();
    } else {
      document.getElementById('craving-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8 text-primary-glow mr-3 animate-bounce-gentle" />
          <h1 className="text-6xl md:text-7xl font-bold text-white">
            Crave<span className="text-primary-glow">AI</span>
          </h1>
        </div>
        
        <h2 className="text-xl md:text-2xl text-white/90 mb-8 font-light leading-relaxed">
          Never wonder "what should I eat?" again. Describe your craving,
          <br className="hidden md:block" />
          and let AI find your perfect food match.
        </h2>

        {/* Feature highlights */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 text-white/80">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary-glow" />
            <span>AI-Powered Suggestions</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary-glow" />
            <span>Local Restaurant Finder</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-glow" />
            <span>Personalized Recommendations</span>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={scrollToCraving}
            variant="hero" 
            size="lg"
            className="text-lg px-8 py-4 h-auto animate-glow"
          >
            <Sparkles className="w-5 h-5" />
            Start Discovering Food
          </Button>
          
          <div className="flex justify-center">
            <Button 
              onClick={scrollToCraving}
              variant="ghost" 
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ArrowDown className="w-4 h-4 animate-bounce-gentle" />
              Explore Below
            </Button>
          </div>
        </div>
      </div>

      {/* Floating food particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-glow rounded-full opacity-60 animate-bounce-gentle" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-accent rounded-full opacity-40 animate-bounce-gentle" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-primary-glow rounded-full opacity-30 animate-bounce-gentle" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
};