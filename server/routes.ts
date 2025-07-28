import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { generateWebsiteFromPrompt, modifyWebsiteWithAI } from "./openai";
import { insertWebsiteSchema } from "@shared/schema";
import { z } from "zod";

const generateWebsiteRequestSchema = z.object({
  prompt: z.string().min(10),
  businessType: z.string(),
  style: z.string(),
});

const modifyWebsiteRequestSchema = z.object({
  websiteId: z.string(),
  instruction: z.string().min(5),
});

const createWebsiteSchema = insertWebsiteSchema.extend({
  name: z.string().min(1),
  subdomain: z.string().min(1),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Template routes
  app.get('/api/templates', async (req, res) => {
    try {
      const category = req.query.category as string;
      const templates = category 
        ? await storage.getTemplatesByCategory(category)
        : await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get('/api/templates/:id', async (req, res) => {
    try {
      const template = await storage.getTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      await storage.incrementTemplateViewCount(req.params.id);
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  // Website routes
  app.get('/api/websites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const websites = await storage.getUserWebsites(userId);
      res.json(websites);
    } catch (error) {
      console.error("Error fetching websites:", error);
      res.status(500).json({ message: "Failed to fetch websites" });
    }
  });

  app.get('/api/websites/:id', isAuthenticated, async (req: any, res) => {
    try {
      const website = await storage.getWebsite(req.params.id);
      if (!website) {
        return res.status(404).json({ message: "Website not found" });
      }
      
      // Check if user owns this website
      const userId = req.user.claims.sub;
      if (website.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(website);
    } catch (error) {
      console.error("Error fetching website:", error);
      res.status(500).json({ message: "Failed to fetch website" });
    }
  });

  app.post('/api/websites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const validatedData = createWebsiteSchema.parse(req.body);
      
      // Check subdomain availability
      const existingWebsite = await storage.getWebsiteBySubdomain(validatedData.subdomain);
      if (existingWebsite) {
        return res.status(400).json({ message: "Subdomain already taken" });
      }

      const website = await storage.createWebsite({
        ...validatedData,
        userId,
      });
      
      res.status(201).json(website);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating website:", error);
      res.status(500).json({ message: "Failed to create website" });
    }
  });

  app.patch('/api/websites/:id', isAuthenticated, async (req: any, res) => {
    try {
      const website = await storage.getWebsite(req.params.id);
      if (!website) {
        return res.status(404).json({ message: "Website not found" });
      }
      
      // Check if user owns this website
      const userId = req.user.claims.sub;
      if (website.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedWebsite = await storage.updateWebsite(req.params.id, req.body);
      res.json(updatedWebsite);
    } catch (error) {
      console.error("Error updating website:", error);
      res.status(500).json({ message: "Failed to update website" });
    }
  });

  app.delete('/api/websites/:id', isAuthenticated, async (req: any, res) => {
    try {
      const website = await storage.getWebsite(req.params.id);
      if (!website) {
        return res.status(404).json({ message: "Website not found" });
      }
      
      // Check if user owns this website
      const userId = req.user.claims.sub;
      if (website.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deleteWebsite(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting website:", error);
      res.status(500).json({ message: "Failed to delete website" });
    }
  });

  // AI Generation routes
  app.post('/api/ai/generate-website', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check AI generation limits
      if (user.plan === 'free' && user.aiGenerationsUsed >= 3) {
        return res.status(403).json({ message: "AI generation limit reached. Upgrade to Pro for unlimited generations." });
      }

      const validatedData = generateWebsiteRequestSchema.parse(req.body);
      
      const generatedWebsite = await generateWebsiteFromPrompt(validatedData);
      
      // Increment AI generations used
      await storage.incrementAIGenerations(userId);
      
      res.json(generatedWebsite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error generating website:", error);
      res.status(500).json({ message: "Failed to generate website" });
    }
  });

  app.post('/api/ai/modify-website', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = modifyWebsiteRequestSchema.parse(req.body);
      
      const website = await storage.getWebsite(validatedData.websiteId);
      if (!website) {
        return res.status(404).json({ message: "Website not found" });
      }
      
      // Check if user owns this website
      const userId = req.user.claims.sub;
      if (website.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const modifiedContent = await modifyWebsiteWithAI({
        currentContent: website.content,
        instruction: validatedData.instruction,
      });

      // Update the website with modified content
      const updatedWebsite = await storage.updateWebsite(validatedData.websiteId, {
        content: modifiedContent,
      });

      res.json({ 
        message: "Website modified successfully", 
        content: modifiedContent,
        website: updatedWebsite 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error modifying website:", error);
      res.status(500).json({ message: "Failed to modify website" });
    }
  });

  // Public website serving route
  app.get('/api/sites/:subdomain', async (req, res) => {
    try {
      const website = await storage.getWebsiteBySubdomain(req.params.subdomain);
      if (!website || !website.isPublished) {
        return res.status(404).json({ message: "Website not found" });
      }
      res.json(website);
    } catch (error) {
      console.error("Error serving website:", error);
      res.status(500).json({ message: "Failed to serve website" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
