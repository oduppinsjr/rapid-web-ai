import {
  users,
  websites,
  templates,
  type User,
  type UpsertUser,
  type Website,
  type InsertWebsite,
  type Template,
  type InsertTemplate,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Website operations
  getUserWebsites(userId: string): Promise<Website[]>;
  getWebsite(id: string): Promise<Website | undefined>;
  createWebsite(website: InsertWebsite): Promise<Website>;
  updateWebsite(id: string, updates: Partial<InsertWebsite>): Promise<Website>;
  deleteWebsite(id: string): Promise<void>;
  getWebsiteBySubdomain(subdomain: string): Promise<Website | undefined>;
  
  // Template operations
  getTemplates(): Promise<Template[]>;
  getTemplatesByCategory(category: string): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  incrementTemplateViewCount(id: string): Promise<void>;
  
  // User plan operations
  updateUserPlan(userId: string, plan: string): Promise<User>;
  incrementAIGenerations(userId: string): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Website operations
  async getUserWebsites(userId: string): Promise<Website[]> {
    return await db
      .select()
      .from(websites)
      .where(eq(websites.userId, userId))
      .orderBy(desc(websites.updatedAt));
  }

  async getWebsite(id: string): Promise<Website | undefined> {
    const [website] = await db.select().from(websites).where(eq(websites.id, id));
    return website;
  }

  async createWebsite(website: InsertWebsite): Promise<Website> {
    const [newWebsite] = await db
      .insert(websites)
      .values(website)
      .returning();
    return newWebsite;
  }

  async updateWebsite(id: string, updates: Partial<InsertWebsite>): Promise<Website> {
    const [website] = await db
      .update(websites)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(websites.id, id))
      .returning();
    return website;
  }

  async deleteWebsite(id: string): Promise<void> {
    await db.delete(websites).where(eq(websites.id, id));
  }

  async getWebsiteBySubdomain(subdomain: string): Promise<Website | undefined> {
    const [website] = await db
      .select()
      .from(websites)
      .where(eq(websites.subdomain, subdomain));
    return website;
  }

  // Template operations
  async getTemplates(): Promise<Template[]> {
    return await db
      .select()
      .from(templates)
      .where(eq(templates.isActive, true))
      .orderBy(desc(templates.viewCount));
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return await db
      .select()
      .from(templates)
      .where(and(eq(templates.category, category), eq(templates.isActive, true)))
      .orderBy(desc(templates.viewCount));
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template;
  }

  async incrementTemplateViewCount(id: string): Promise<void> {
    await db
      .update(templates)
      .set({ viewCount: sql`${templates.viewCount} + 1` })
      .where(eq(templates.id, id));
  }

  // User plan operations
  async updateUserPlan(userId: string, plan: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ plan, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async incrementAIGenerations(userId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        aiGenerationsUsed: sql`${users.aiGenerationsUsed} + 1`,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
