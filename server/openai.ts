import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

interface WebsiteGenerationRequest {
  prompt: string;
  businessType: string;
  style: string;
}

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

export async function generateWebsiteFromPrompt(request: WebsiteGenerationRequest): Promise<GeneratedWebsite> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert website builder AI. Generate a complete website structure based on the user's business description. Return a JSON object with the following structure:
          {
            "title": "Business Name",
            "pages": [
              {
                "name": "Homepage",
                "slug": "home",
                "content": {
                  "hero": {
                    "title": "Main headline",
                    "subtitle": "Supporting text",
                    "cta": "Call to action text"
                  },
                  "sections": [
                    {
                      "type": "about",
                      "title": "Section title",
                      "content": "Section content"
                    }
                  ]
                }
              }
            ],
            "styling": {
              "primaryColor": "#3B82F6",
              "secondaryColor": "#6366F1",
              "fontFamily": "Inter"
            }
          }
          
          Create 3-5 relevant pages (always include Homepage, About, Contact, and relevant service/product pages). Make content specific to their business, not generic.`
        },
        {
          role: "user",
          content: `Business Description: ${request.prompt}
          Business Type: ${request.businessType}
          Preferred Style: ${request.style}
          
          Generate a complete website with specific, relevant content for this business.`
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as GeneratedWebsite;
  } catch (error) {
    throw new Error("Failed to generate website: " + (error as Error).message);
  }
}

interface ModificationRequest {
  currentContent: any;
  instruction: string;
}

export async function modifyWebsiteWithAI(request: ModificationRequest): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert website editor AI. Modify the provided website content based on the user's instruction. Return the updated content as JSON, maintaining the same structure but applying the requested changes. Be specific and make meaningful modifications.`
        },
        {
          role: "user",
          content: `Current website content: ${JSON.stringify(request.currentContent)}
          
          Instruction: ${request.instruction}
          
          Apply this change and return the updated content as JSON.`
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    throw new Error("Failed to modify website: " + (error as Error).message);
  }
}

export async function generateWebsiteContent(businessType: string, specificPrompt?: string): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Generate professional website content for a ${businessType} business. Return JSON with sections like hero, about, services/products, testimonials, and contact. Make it specific and professional.`
        },
        {
          role: "user",
          content: specificPrompt || `Generate content for a ${businessType} business website.`
        },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    throw new Error("Failed to generate content: " + (error as Error).message);
  }
}
