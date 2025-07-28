import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import VisualEditor from "@/components/visual-editor";
import AIChat from "@/components/ai-chat";
import { ArrowLeft, Eye, Save, Rocket, Menu, GripVertical, Heading, Image, MousePointer, Grid3X3 } from "lucide-react";

interface Website {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  content: any;
  isPublished: boolean;
}

export default function Editor() {
  const [, params] = useRoute("/editor/:websiteId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#DC2626");
  const [fontFamily, setFontFamily] = useState("Inter");

  const websiteId = params?.websiteId;

  const { data: website, isLoading } = useQuery({
    queryKey: ["/api/websites", websiteId],
    enabled: !!websiteId,
  });

  const saveMutation = useMutation({
    mutationFn: async (updates: Partial<Website>) => {
      await apiRequest("PATCH", `/api/websites/${websiteId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/websites", websiteId] });
      toast({
        title: "Success",
        description: "Website saved successfully",
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
        description: "Failed to save website",
        variant: "destructive",
      });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", `/api/websites/${websiteId}`, {
        isPublished: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/websites", websiteId] });
      toast({
        title: "Success",
        description: "Website published successfully",
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
        description: "Failed to publish website",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!websiteId) {
      setLocation("/");
    }
  }, [websiteId, setLocation]);

  const handleSave = () => {
    if (!website) return;
    
    setIsSaving(true);
    saveMutation.mutate({
      content: {
        ...website.content,
        styling: {
          ...website.content?.styling,
          primaryColor,
          fontFamily,
        },
      },
    });
    
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handlePublish = () => {
    publishMutation.mutate();
  };

  const handlePreview = () => {
    if (website?.subdomain) {
      window.open(`https://${website.subdomain}.autosite.app`, '_blank');
    }
  };

  const handleBack = () => {
    setLocation("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Loading editor...</h3>
          <p className="text-slate-600">Please wait while we load your website</p>
        </div>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Website not found</h3>
          <p className="text-slate-600 mb-6">The website you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={handleBack}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Editor Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-slate-900">{website.name}</h1>
              <span className="text-sm text-slate-500">
                {website.customDomain || `${website.subdomain}.autosite.app`}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSave}
                disabled={isSaving || saveMutation.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving || saveMutation.isPending ? "Saving..." : "Save"}
              </Button>
              <Button 
                onClick={handlePublish}
                disabled={publishMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <Rocket className="mr-2 h-4 w-4" />
                {publishMutation.isPending ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Editor Sidebar */}
        <div className="w-80 bg-slate-50 border-r border-slate-200 h-screen overflow-y-auto autosite-scrollbar">
          {/* AI Chat Section */}
          <div className="p-6 border-b border-slate-200">
            <AIChat websiteId={websiteId!} currentContent={website.content} />
          </div>

          {/* Visual Editor Tools */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Design Tools</h3>
            
            {/* Page Sections */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Page Sections</h4>
              <div className="space-y-2">
                {["Hero Section", "About Us", "Services", "Contact"].map((section) => (
                  <div key={section} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center">
                      <GripVertical className="h-4 w-4 text-slate-400 mr-3" />
                      <span className="text-sm font-medium">{section}</span>
                    </div>
                    <Menu className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Add Components */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Add Components</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Heading, label: "Text" },
                  { icon: Image, label: "Image" },
                  { icon: MousePointer, label: "Button" },
                  { icon: Grid3X3, label: "Gallery" },
                ].map((component) => (
                  <Button 
                    key={component.label}
                    variant="outline" 
                    className="h-auto p-3 flex flex-col items-center space-y-1"
                  >
                    <component.icon className="h-4 w-4" />
                    <span className="text-xs font-medium">{component.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Style Settings */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-3">Style Settings</h4>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-medium text-slate-600 mb-2">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-lg border border-slate-200"
                      style={{ backgroundColor: primaryColor }}
                    ></div>
                    <Input 
                      type="text" 
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-600 mb-2">Font Family</Label>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Website Preview */}
        <div className="flex-1 bg-slate-100 p-6">
          <div className="max-w-4xl mx-auto">
            <VisualEditor 
              website={website} 
              primaryColor={primaryColor}
              fontFamily={fontFamily}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
