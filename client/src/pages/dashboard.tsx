import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@shared/schema";
import { LayoutTemplate, Brain, Upload, Bell, Plus, Edit, ExternalLink, Utensils, User as UserIcon, Wrench, Briefcase } from "lucide-react";
import TemplateGallery from "@/components/template-gallery";
import AIBuilder from "@/components/ai-builder";
import { useLocation } from "wouter";

interface Website {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  isPublished: boolean;
  updatedAt: string;
  templateId?: string;
}

export default function Dashboard() {
  const { user } = useAuth() as { user: User | undefined };
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: websites, isLoading: websitesLoading } = useQuery<Website[]>({
    queryKey: ["/api/websites"],
    enabled: !!user,
  });

  const handleEditWebsite = (websiteId: string) => {
    setLocation(`/editor/${websiteId}`);
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getStatusColor = (isPublished: boolean) => {
    return isPublished ? "bg-green-500" : "bg-yellow-500";
  };

  const getTemplateIcon = (templateId?: string) => {
    // You could map template IDs to specific icons based on category
    const icons = [Utensils, UserIcon, Wrench, Briefcase];
    const IconComponent = icons[Math.floor(Math.random() * icons.length)];
    return IconComponent;
  };

  const getTemplateGradient = (templateId?: string) => {
    const gradients = [
      "from-orange-400 to-red-500",
      "from-purple-400 to-pink-500", 
      "from-blue-400 to-indigo-500",
      "from-green-400 to-teal-500"
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Updated 1 day ago";
    if (diffDays < 7) return `Updated ${diffDays} days ago`;
    if (diffDays < 14) return "Updated 1 week ago";
    return `Updated ${Math.floor(diffDays / 7)} weeks ago`;
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-slate-900">AutoSite</h1>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden md:block">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Dashboard</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                  <TabsTrigger value="ai-builder">AI Builder</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                {user.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                    </span>
                  </div>
                )}
                <Button variant="ghost" onClick={handleLogout} className="text-sm">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Welcome back, {user.firstName || user.email?.split('@')[0] || 'there'}
              </h2>
              <p className="text-slate-600">Ready to build something amazing?</p>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <Button 
                variant="outline" 
                className="h-auto p-6 flex flex-col items-start space-y-4 hover:shadow-lg transition-all"
                onClick={() => setActiveTab("templates")}
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <LayoutTemplate className="h-6 w-6 text-blue-500" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Browse Templates</h3>
                  <p className="text-slate-600 text-sm">Start with pre-built AI websites</p>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto p-6 flex flex-col items-start space-y-4 hover:shadow-lg transition-all"
                onClick={() => setActiveTab("ai-builder")}
              >
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-purple-500" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">AI Builder</h3>
                  <p className="text-slate-600 text-sm">Create from a simple prompt</p>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto p-6 flex flex-col items-start space-y-4 hover:shadow-lg transition-all"
                disabled
              >
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <Upload className="h-6 w-6 text-green-500" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Import Site</h3>
                  <p className="text-slate-600 text-sm">Modify existing websites</p>
                </div>
              </Button>
            </div>

            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Websites</CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                {websitesLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-slate-50 rounded-xl p-4 animate-pulse">
                        <div className="aspect-[16/10] bg-slate-200 rounded-lg mb-4"></div>
                        <div className="h-4 bg-slate-200 rounded mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded mb-3 w-3/4"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : websites && websites.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {websites.map((website: Website) => {
                      const IconComponent = getTemplateIcon(website.templateId);
                      const gradient = getTemplateGradient(website.templateId);
                      
                      return (
                        <Card key={website.id} className="autosite-card-hover cursor-pointer">
                          <div className={`aspect-[16/10] bg-gradient-to-br ${gradient} rounded-t-xl flex items-center justify-center`}>
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-slate-900 truncate">{website.name}</h4>
                              <div className={`w-2 h-2 ${getStatusColor(website.isPublished)} rounded-full`}></div>
                            </div>
                            <p className="text-sm text-slate-600 mb-3 truncate">
                              {website.customDomain || `${website.subdomain}.autosite.app`}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-500">{formatDate(website.updatedAt)}</span>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleEditWebsite(website.id)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    
                    {/* Add New Website Card */}
                    <Card className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 transition-colors cursor-pointer">
                      <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
                        <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center mb-4">
                          <Plus className="h-6 w-6 text-slate-600" />
                        </div>
                        <h4 className="font-semibold text-slate-900 mb-2">Create New Website</h4>
                        <p className="text-sm text-slate-600 text-center">Start with a template or use AI</p>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Plus className="h-8 w-8 text-slate-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No websites yet</h3>
                    <p className="text-slate-600 mb-6">Create your first website to get started</p>
                    <div className="flex gap-3 justify-center">
                      <Button onClick={() => setActiveTab("templates")}>
                        Browse Templates
                      </Button>
                      <Button variant="outline" onClick={() => setActiveTab("ai-builder")}>
                        Use AI Builder
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates">
            <TemplateGallery />
          </TabsContent>

          {/* AI Builder Tab */}
          <TabsContent value="ai-builder">
            <AIBuilder />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
