import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, LayoutTemplate, MessageCircle, Eye, ExternalLink, Check, Star, Utensils, User, Wrench, Briefcase, Play, Sparkles, Zap, ArrowRight } from "lucide-react";

export default function Landing() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleGetStarted = () => {
    window.location.href = "/login";
  };

  const features = [
    {
      icon: LayoutTemplate,
      title: "Choose & Edit Templates",
      description: "Browse our curated collection of AI-generated websites for restaurants, personal brands, local services, and portfolios.",
      benefits: ["One-click duplicate", "Visual editor", "AI modifications"],
      color: "bg-purple-500"
    },
    {
      icon: Brain,
      title: "AI Prompt Builder", 
      description: "Describe your business and let AI create a complete website with pages, content, and styling tailored to your needs.",
      benefits: ["Smart content generation", "Multi-page layouts", "Custom branding"],
      color: "bg-yellow-500"
    },
    {
      icon: MessageCircle,
      title: "AI Chat Modifications",
      description: "Simply tell AI what you want to change. \"Make it dark mode\", \"Add testimonials\", \"Change to taco images\" - it's that easy.",
      benefits: ["Natural language editing", "Real-time updates", "Smart suggestions"],
      color: "bg-green-500"
    }
  ];

  const templates = [
    {
      title: "Restaurant",
      description: "Menu, reservations, location",
      icon: Utensils,
      gradient: "from-orange-400 to-red-500",
      views: "847 views"
    },
    {
      title: "Personal Brand", 
      description: "Portfolio, about, contact",
      icon: User,
      gradient: "from-purple-400 to-pink-500",
      views: "1.2k views"
    },
    {
      title: "Local Service",
      description: "Services, testimonials, booking", 
      icon: Wrench,
      gradient: "from-blue-400 to-indigo-500",
      views: "632 views"
    },
    {
      title: "Portfolio",
      description: "Projects, skills, experience",
      icon: Briefcase,
      gradient: "from-green-400 to-teal-500", 
      views: "1.5k views"
    }
  ];

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "1 website",
        "Limited AI generations", 
        "AutoSite subdomain",
        "Basic templates"
      ],
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "Most Popular",
      features: [
        "Unlimited websites",
        "Unlimited AI prompts",
        "Custom domain",
        "Priority support"
      ],
      buttonText: "Start Pro Trial",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Done-For-You",
      price: "$499",
      period: "One-time service",
      description: "",
      features: [
        "Professional design",
        "Custom content", 
        "Expert consultation",
        "2 revisions included"
      ],
      buttonText: "Contact Us",
      buttonVariant: "outline" as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-yellow-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-purple-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-yellow-500 rounded-lg mr-3 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">AutoSite</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">Features</a>
              <a href="#templates" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">Templates</a>
              <a href="#pricing" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">Pricing</a>
              <Button onClick={handleGetStarted} className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Video Background */}
      <section className="relative overflow-hidden">
        {/* Background Video/Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-yellow-600">
          <div className="absolute inset-0 bg-black/20"></div>
          {/* Animated background elements */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Website Builder
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Build Stunning
              <span className="block bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                Websites in Minutes
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your business ideas into professional websites using the power of AI. 
              No coding required, just describe what you want.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button 
                onClick={handleGetStarted}
                size="lg" 
                className="bg-white text-purple-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold min-w-[200px]"
              >
                Start Building Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold min-w-[200px]"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50,000+</div>
                <div className="text-white/80">Websites Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">2 Minutes</div>
                <div className="text-white/80">Average Build Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">99.9%</div>
                <div className="text-white/80">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">
              <Zap className="w-4 h-4 mr-2" />
              Three Powerful Ways to Build
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Building Method
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you prefer templates, AI generation, or natural language editing, 
              we've got the perfect approach for your workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="relative overflow-hidden border-2 hover:border-purple-200 transition-all duration-300 hover:shadow-xl group">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center text-gray-700">
                          <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-24 bg-gradient-to-br from-purple-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-100 text-yellow-700 border-yellow-200">
              <LayoutTemplate className="w-4 h-4 mr-2" />
              Professional Templates
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Start with AI-Generated Templates
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our collection of professionally designed, AI-generated templates 
              tailored for different industries and use cases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template, index) => {
              const IconComponent = template.icon;
              return (
                <Card key={index} className="group overflow-hidden border-2 hover:border-purple-200 transition-all duration-300 hover:shadow-xl">
                  <div className={`h-32 bg-gradient-to-br ${template.gradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                    <div className="absolute top-4 left-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-white/20 text-white border-white/30">
                        <Eye className="w-3 h-3 mr-1" />
                        {template.views}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{template.title}</h3>
                    <p className="text-gray-600 mb-4">{template.description}</p>
                    <Button 
                      onClick={handleGetStarted}
                      variant="outline" 
                      className="w-full group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300"
                    >
                      Use Template
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-700 border-green-200">
              <Star className="w-4 h-4 mr-2" />
              Simple Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Plans That Scale With You
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start for free and upgrade as your business grows. No hidden fees, 
              cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-purple-300 shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-yellow-500 text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <CardContent className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    {plan.description && (
                      <p className="text-gray-600 mb-4">{plan.description}</p>
                    )}
                    <div className="mb-6">
                      <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                      {plan.period && <span className="text-gray-500 ml-2">/{plan.period}</span>}
                    </div>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={handleGetStarted}
                    variant={plan.buttonVariant}
                    className={`w-full py-3 text-lg font-semibold ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white' 
                        : ''
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-600 via-purple-700 to-yellow-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Build Your Dream Website?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses who've transformed their online presence with AutoSite. 
            Start building today, no credit card required.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="bg-white text-purple-700 hover:bg-gray-100 px-12 py-4 text-xl font-semibold"
          >
            Start Building for Free
            <ArrowRight className="ml-3 w-6 h-6" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-yellow-500 rounded-lg mr-3 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold">AutoSite</h3>
            </div>
            <p className="text-gray-400 mb-6">
              The easiest way to build professional websites with AI
            </p>
            <div className="flex justify-center space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}