import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useLocation } from "wouter";
import { Eye, Utensils, User, Wrench, Briefcase, Palette, Heart, Car, Camera } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  previewImage?: string;
  viewCount: number;
  content: any;
}

export default function TemplateGallery() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery({
    queryKey: ["/api/templates", selectedCategory === "all" ? "" : selectedCategory],
    queryFn: async () => {
      const url = selectedCategory === "all" ? "/api/templates" : `/api/templates?category=${selectedCategory}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch templates");
      return response.json();
    },
  });

  const useTemplateMutation = useMutation({
    mutationFn: async ({ templateId, websiteName, subdomain }: { templateId: string; websiteName: string; subdomain: string }) => {
      // First get the template
      const templateResponse = await fetch(`/api/templates/${templateId}`);
      if (!templateResponse.ok) throw new Error("Failed to fetch template");
      const template = await templateResponse.json();

      // Create website using template
      const response = await apiRequest("POST", "/api/websites", {
        name: websiteName,
        subdomain: subdomain,
        templateId: templateId,
        content: template.content,
        isPublished: false,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/websites"] });
      toast({
        title: "Success",
        description: "Website created from template successfully",
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
        description: error.message || "Failed to create website from template",
        variant: "destructive",
      });
    },
  });

  const handleUseTemplate = (template: Template) => {
    const websiteName = `${template.name} Copy`;
    const subdomain = template.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
    
    useTemplateMutation.mutate({
      templateId: template.id,
      websiteName,
      subdomain,
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      restaurant: Utensils,
      personal: User,
      service: Wrench,
      portfolio: Briefcase,
      creative: Palette,
      health: Heart,
      automotive: Car,
      photography: Camera,
    };
    return icons[category] || Briefcase;
  };

  const getCategoryGradient = (category: string) => {
    const gradients: Record<string, string> = {
      restaurant: "from-orange-400 to-red-500",
      personal: "from-purple-400 to-pink-500",
      service: "from-blue-400 to-indigo-500",
      portfolio: "from-green-400 to-teal-500",
      creative: "from-pink-400 to-purple-500",
      health: "from-green-400 to-blue-500",
      automotive: "from-gray-400 to-blue-500",
      photography: "from-yellow-400 to-orange-500",
    };
    return gradients[category] || "from-slate-400 to-slate-500";
  };

  const categories = [
    { value: "all", label: "All Templates" },
    { value: "restaurant", label: "Restaurant" },
    { value: "personal", label: "Personal Brand" },
    { value: "service", label: "Service Business" },
    { value: "portfolio", label: "Portfolio" },
    { value: "creative", label: "Creative" },
    { value: "health", label: "Health & Wellness" },
    { value: "automotive", label: "Automotive" },
    { value: "photography", label: "Photography" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Choose a Template</h2>
        <p className="text-slate-600">Select from our collection of AI-generated, professional templates</p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.value)}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Template Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="w-full h-48 bg-slate-200 animate-pulse"></div>
              <CardContent className="p-6">
                <div className="h-4 bg-slate-200 rounded mb-3 animate-pulse"></div>
                <div className="h-3 bg-slate-200 rounded mb-4 w-3/4 animate-pulse"></div>
                <div className="flex items-center justify-between">
                  <div className="h-3 bg-slate-200 rounded w-1/4 animate-pulse"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-8 w-20 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : templates && templates.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template: Template) => {
            const IconComponent = getCategoryIcon(template.category);
            const gradient = getCategoryGradient(template.category);

            return (
              <Card key={template.id} className="template-card overflow-hidden hover:shadow-lg transition-all">
                <div className={`w-full h-48 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                  {template.previewImage ? (
                    <img 
                      src={template.previewImage} 
                      alt={`${template.name} preview`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <IconComponent className="h-12 w-12 text-white" />
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-slate-900">{template.name}</h3>
                    <Badge variant="secondary" className="capitalize">
                      {template.category}
                    </Badge>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-slate-500">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{template.viewCount} views</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleUseTemplate(template)}
                        disabled={useTemplateMutation.isPending}
                      >
                        {useTemplateMutation.isPending ? "Creating..." : "Use Template"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-200 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="h-8 w-8 text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No templates found</h3>
          <p className="text-slate-600 mb-6">Try selecting a different category or check back later for new templates.</p>
          <Button onClick={() => setSelectedCategory("all")}>
            View All Templates
          </Button>
        </div>
      )}
    </div>
  );
}
