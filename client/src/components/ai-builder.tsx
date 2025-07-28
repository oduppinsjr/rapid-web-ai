import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useLocation } from "wouter";
import { Brain, Wand2, RefreshCw, Home, Cog, Phone } from "lucide-react";

interface GeneratedWebsite {
  title: string;
  pages: Array<{
    name: string;
    slug: string;
    content: any;
  }>;
  styling: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
}

export default function AIBuilder() {
  const [prompt, setPrompt] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [style, setStyle] = useState("Modern & Clean");
  const [generatedWebsite, setGeneratedWebsite] = useState<GeneratedWebsite | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ai/generate-website", {
        prompt,
        businessType,
        style,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedWebsite(data);
      toast({
        title: "Success",
        description: "Website generated successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to generate website",
        variant: "destructive",
      });
    },
  });

  const createWebsiteMutation = useMutation({
    mutationFn: async () => {
      if (!generatedWebsite) throw new Error("No generated website");
      
      const websiteName = generatedWebsite.title;
      const subdomain = generatedWebsite.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
      
      const response = await apiRequest("POST", "/api/websites", {
        name: websiteName,
        subdomain: subdomain,
        content: {
          pages: generatedWebsite.pages,
          styling: generatedWebsite.styling,
        },
        isPublished: false,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/websites"] });
      toast({
        title: "Success",
        description: "Website created successfully!",
      });
      setLocation(`/editor/${data.id}`);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to create website",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please describe your business first!",
        variant: "destructive",
      });
      return;
    }
    if (!businessType) {
      toast({
        title: "Error",
        description: "Please select a business type!",
        variant: "destructive",
      });
      return;
    }
    generateMutation.mutate();
  };

  const handleRegenerate = () => {
    setGeneratedWebsite(null);
    generateMutation.mutate();
  };

  const handleCreateWebsite = () => {
    createWebsiteMutation.mutate();
  };

  const businessTypes = [
    "Restaurant/Food",
    "Professional Services",
    "Retail/E-commerce",
    "Health & Wellness",
    "Technology",
    "Creative/Agency",
    "Education",
    "Real Estate",
    "Automotive",
    "Photography",
    "Consulting",
    "Other",
  ];

  const styles = [
    "Modern & Clean",
    "Bold & Colorful",
    "Minimal & Elegant",
    "Professional & Corporate",
    "Creative & Artistic",
    "Vintage & Classic",
    "Tech & Futuristic",
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">AI Website Builder</h2>
        <p className="text-slate-600">Describe your business and let AI create a complete website for you</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {!generatedWebsite && !generateMutation.isPending && (
          <Card>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <Label className="text-lg font-semibold text-slate-900 mb-4 block">
                    Tell us about your business
                  </Label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-32 resize-none"
                    placeholder="Example: I run a mobile car detailing service in Atlanta. We offer premium wash, wax, and interior cleaning services for busy professionals. We come to your location and use eco-friendly products."
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">Business Type</Label>
                    <Select value={businessType} onValueChange={setBusinessType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">Preferred Style</Label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {styles.map((styleOption) => (
                          <SelectItem key={styleOption} value={styleOption}>
                            {styleOption}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending}
                  className="w-full py-4 text-lg"
                >
                  <Brain className="mr-3 h-5 w-5" />
                  {generateMutation.isPending ? "Generating Your Website..." : "Generate My Website"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {generateMutation.isPending && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Creating your website...</h3>
              <p className="text-slate-600">AI is analyzing your business and generating content. This may take 30-60 seconds.</p>
            </CardContent>
          </Card>
        )}

        {/* AI Generated Result */}
        {generatedWebsite && (
          <Card>
            <CardContent className="p-0">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-900">Your AI-Generated Website</h3>
                  <Button 
                    variant="outline" 
                    onClick={handleRegenerate}
                    disabled={generateMutation.isPending}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                </div>
              </div>
              <div className="p-6">
                {/* Preview of generated website */}
                <div className="bg-slate-100 rounded-xl p-6 mb-6">
                  <div className="text-center mb-4">
                    <h4 className="text-2xl font-bold text-slate-900 mb-2" style={{ color: generatedWebsite.styling.primaryColor }}>
                      {generatedWebsite.title}
                    </h4>
                    <p className="text-slate-600">AI-generated website with {generatedWebsite.pages.length} pages</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    {generatedWebsite.pages.slice(0, 3).map((page, index) => {
                      const icons = [Home, Cog, Phone];
                      const IconComponent = icons[index % icons.length];
                      
                      return (
                        <div key={page.slug} className="bg-white rounded-lg p-3 text-center">
                          <IconComponent className="h-6 w-6 mx-auto mb-2" style={{ color: generatedWebsite.styling.primaryColor }} />
                          <div className="font-medium">{page.name}</div>
                        </div>
                      );
                    })}
                  </div>
                  {generatedWebsite.pages.length > 3 && (
                    <div className="text-center mt-4 text-sm text-slate-600">
                      +{generatedWebsite.pages.length - 3} more pages
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    Generated {generatedWebsite.pages.length} pages • Mobile responsive • SEO optimized
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline">
                      Preview
                    </Button>
                    <Button 
                      onClick={handleCreateWebsite}
                      disabled={createWebsiteMutation.isPending}
                    >
                      <Wand2 className="mr-2 h-4 w-4" />
                      {createWebsiteMutation.isPending ? "Creating..." : "Customize & Publish"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
