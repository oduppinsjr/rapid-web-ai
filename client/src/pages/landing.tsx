import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, LayoutTemplate, MessageCircle, Eye, ExternalLink, Check, Star, Utensils, User, Wrench, Briefcase } from "lucide-react";

export default function Landing() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleGetStarted = () => {
    window.location.href = "/api/login";
  };

  const features = [
    {
      icon: LayoutTemplate,
      title: "Choose & Edit Templates",
      description: "Browse our curated collection of AI-generated websites for restaurants, personal brands, local services, and portfolios.",
      benefits: ["One-click duplicate", "Visual editor", "AI modifications"],
      color: "bg-blue-500"
    },
    {
      icon: Brain,
      title: "AI Prompt Builder", 
      description: "Describe your business and let AI create a complete website with pages, content, and styling tailored to your needs.",
      benefits: ["Smart content generation", "Multi-page layouts", "Custom branding"],
      color: "bg-purple-500"
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
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-slate-900">AutoSite</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <a href="#templates" className="text-slate-600 hover:text-slate-900 transition-colors">Templates</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
              <Button variant="ghost" onClick={handleGetStarted}>Sign In</Button>
              <Button onClick={handleGetStarted}>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Build Professional Websites with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI in Minutes
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Perfect for solopreneurs, freelancers, and small businesses. Choose from AI-generated templates, 
              create from prompts, or modify existing sites with simple chat commands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={handleGetStarted} className="px-8 py-4 text-lg">
                Start Building Free
              </Button>
              <Button variant="ghost" size="lg" className="px-8 py-4 text-lg">
                <Eye className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Three Ways to Build</h2>
            <p className="text-xl text-slate-600">Choose the approach that works best for you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="autosite-card-hover border-0 shadow-sm">
                <CardContent className="p-8">
                  <div className={`w-12 h-12 ${feature.color}/10 rounded-xl flex items-center justify-center mb-6`}>
                    <feature.icon className={`h-6 w-6 ${feature.color.replace('bg-', 'text-')}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-slate-600">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* LayoutTemplate Gallery Preview */}
      <section id="templates" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Start with Professional Templates</h2>
            <p className="text-xl text-slate-600">AI-generated, industry-specific websites ready to customize</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template, index) => (
              <Card key={index} className="template-card overflow-hidden cursor-pointer">
                <div className={`aspect-[4/3] bg-gradient-to-br ${template.gradient} flex items-center justify-center`}>
                  <template.icon className="h-12 w-12 text-white" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-1">{template.title}</h3>
                  <p className="text-sm text-slate-600 mb-2">{template.description}</p>
                  <div className="flex items-center text-sm text-slate-500">
                    <Eye className="h-4 w-4 mr-1" />
                    {template.views}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-600">Start free, upgrade when you're ready to grow</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative autosite-card-hover ${plan.popular ? 'border-2 border-blue-500 bg-blue-50' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{plan.price}</div>
                    {plan.period && <p className="text-slate-600">{plan.period}</p>}
                    {plan.description && <p className="text-slate-600">{plan.description}</p>}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={plan.buttonVariant}
                    className="w-full"
                    onClick={handleGetStarted}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">AutoSite</h3>
            <p className="text-slate-400 mb-6">AI Website Builder for Small Businesses</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
