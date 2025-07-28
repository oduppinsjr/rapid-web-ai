import { Button } from "@/components/ui/button";

interface Website {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  content: any;
  isPublished: boolean;
}

interface VisualEditorProps {
  website: Website;
  primaryColor: string;
  fontFamily: string;
}

export default function VisualEditor({ website, primaryColor, fontFamily }: VisualEditorProps) {
  // This is a simplified version - in a real implementation, you'd have
  // drag-and-drop functionality, content editing, etc.
  
  const getDefaultContent = () => {
    if (website.content && website.content.pages) {
      return website.content;
    }
    
    // Default restaurant content as fallback
    return {
      pages: [
        {
          name: "Homepage",
          slug: "home",
          content: {
            hero: {
              title: website.name || "Your Business Name",
              subtitle: "Professional services you can trust",
              cta: "Get Started"
            },
            about: {
              title: "About Us",
              content: "We provide exceptional services to help your business grow and succeed."
            },
            contact: {
              title: "Contact Us",
              phone: "(555) 123-4567",
              email: "info@yourbusiness.com",
              address: "123 Main Street, Your City"
            }
          }
        }
      ],
      styling: {
        primaryColor: primaryColor,
        fontFamily: fontFamily
      }
    };
  };

  const content = getDefaultContent();
  const homePage = content.pages?.find((page: any) => page.slug === "home") || content.pages?.[0];
  const pageContent = homePage?.content || {};

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ fontFamily }}>
      {/* Hero Section */}
      <div 
        className="text-white p-12 text-center"
        style={{ 
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` 
        }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {pageContent.hero?.title || website.name || "Your Business Name"}
        </h1>
        <p className="text-xl mb-8 opacity-90">
          {pageContent.hero?.subtitle || "Professional services you can trust"}
        </p>
        <Button 
          className="bg-white text-slate-900 hover:bg-slate-100"
          size="lg"
        >
          {pageContent.hero?.cta || "Get Started"}
        </Button>
      </div>

      {/* About Section */}
      <div className="p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            {pageContent.about?.title || "About Our Business"}
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            {pageContent.about?.content || 
              "We are dedicated to providing exceptional services that help our clients achieve their goals. With years of experience and a commitment to excellence, we deliver results that exceed expectations."}
          </p>
          <div className="w-full h-64 bg-slate-200 rounded-xl flex items-center justify-center">
            <span className="text-slate-500">Image Placeholder</span>
          </div>
        </div>
      </div>

      {/* Services/Features Section */}
      <div className="bg-slate-50 p-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 text-center">
                <div 
                  className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <div 
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Service {i}</h3>
                <p className="text-slate-600">Professional service description that highlights the value we provide to our clients.</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            {pageContent.contact?.title || "Get In Touch"}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div 
                className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <span style={{ color: primaryColor }}>📍</span>
              </div>
              <h4 className="font-semibold mb-2">Location</h4>
              <p className="text-slate-600">
                {pageContent.contact?.address || "123 Main Street\nYour City, State 12345"}
              </p>
            </div>
            <div>
              <div 
                className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <span style={{ color: primaryColor }}>📞</span>
              </div>
              <h4 className="font-semibold mb-2">Phone</h4>
              <p className="text-slate-600">
                {pageContent.contact?.phone || "(555) 123-4567"}
              </p>
            </div>
            <div>
              <div 
                className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <span style={{ color: primaryColor }}>✉️</span>
              </div>
              <h4 className="font-semibold mb-2">Email</h4>
              <p className="text-slate-600">
                {pageContent.contact?.email || "info@yourbusiness.com"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
