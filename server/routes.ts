import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { migrateContent } from "./migrate-content";
import {
  insertPageSchema,
  insertPageSectionSchema,
  insertContentElementSchema,
  updatePageSchema,
  updatePageSectionSchema,
  updateContentElementSchema,
  insertSiteSettingSchema,
  updateSiteSettingSchema,
  insertDropdownOptionSchema,
  updateDropdownOptionSchema
} from "@shared/schema";

// Session storage
interface Session {
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

class SessionManager {
  private sessions: Map<string, Session> = new Map();
  private readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  createSession(): string {
    const token = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.SESSION_DURATION);
    
    this.sessions.set(token, {
      token,
      createdAt: now,
      expiresAt
    });

    // Clean up expired sessions
    this.cleanupExpiredSessions();
    
    return token;
  }

  validateSession(token: string): boolean {
    const session = this.sessions.get(token);
    if (!session) {
      return false;
    }

    if (new Date() > session.expiresAt) {
      this.sessions.delete(token);
      return false;
    }

    return true;
  }

  deleteSession(token: string): void {
    this.sessions.delete(token);
  }

  private cleanupExpiredSessions(): void {
    const now = new Date();
    for (const [token, session] of this.sessions.entries()) {
      if (now > session.expiresAt) {
        this.sessions.delete(token);
      }
    }
  }
}

const sessionManager = new SessionManager();

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for deployment verification
  app.get("/health", (_req, res) => {
    res.status(200).json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // Public API routes - no authentication required
  
  // Get all pages
  app.get("/api/pages", async (_req, res) => {
    try {
      const pages = await storage.getAllPages();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pages" });
    }
  });

  // Get all site settings
  app.get("/api/settings", async (_req, res) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  // Get page by slug with full content
  app.get("/api/pages/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const page = await storage.getPageBySlug(slug);
      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch page" });
    }
  });

  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      
      if (!password || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ message: "Invalid password" });
      }
      
      // Create a proper session token
      const sessionToken = sessionManager.createSession();
      
      res.json({ 
        token: sessionToken,
        message: "Login successful" 
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Admin API routes - session-based auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthorized - Missing or invalid authorization header" });
    }
    
    const token = authHeader.split(' ')[1];
    if (!token || !sessionManager.validateSession(token)) {
      return res.status(401).json({ error: "Unauthorized - Invalid or expired session token" });
    }
    
    next();
  };

  // Admin logout endpoint
  app.post("/api/admin/logout", requireAuth, async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(' ')[1];
        sessionManager.deleteSession(token);
      }
      
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // Migration endpoint for initializing content
  app.post("/api/admin/migrate", requireAuth, async (_req, res) => {
    try {
      await migrateContent();
      res.json({ message: "Content migration completed successfully" });
    } catch (error: any) {
      console.error("Migration error:", error);
      res.status(500).json({ error: "Migration failed", details: error.message });
    }
  });

  // Dropdown options routes
  app.get("/api/dropdown-options/:fieldName", async (req, res) => {
    try {
      const { fieldName } = req.params;
      const options = await storage.getDropdownOptions(fieldName);
      res.json(options);
    } catch (error: any) {
      console.error("Error fetching dropdown options:", error);
      res.status(500).json({ error: "Failed to fetch dropdown options" });
    }
  });

  app.get("/api/admin/dropdown-options", requireAuth, async (_req, res) => {
    try {
      const options = await storage.getAllDropdownOptions();
      res.json(options);
    } catch (error: any) {
      console.error("Error fetching all dropdown options:", error);
      res.status(500).json({ error: "Failed to fetch dropdown options" });
    }
  });

  // Dropdown Options management endpoints
  app.post("/api/admin/dropdown-options", requireAuth, async (req, res) => {
    try {
      const validatedData = insertDropdownOptionSchema.parse(req.body);
      const option = await storage.createDropdownOption(validatedData);
      res.status(201).json(option);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create dropdown option" });
    }
  });

  app.put("/api/admin/dropdown-options/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updateDropdownOptionSchema.parse(req.body);
      const option = await storage.updateDropdownOption(id, validatedData);
      res.json(option);
    } catch (error: any) {
      if (error.message === 'Dropdown option not found') {
        return res.status(404).json({ error: "Dropdown option not found" });
      }
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update dropdown option" });
    }
  });

  app.delete("/api/admin/dropdown-options/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteDropdownOption(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: "Failed to delete dropdown option" });
    }
  });

  // Page management endpoints
  app.post("/api/admin/pages", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPageSchema.parse(req.body);
      const page = await storage.createPage(validatedData);
      res.status(201).json(page);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create page" });
    }
  });

  app.put("/api/admin/pages/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updatePageSchema.parse(req.body);
      const page = await storage.updatePage(id, validatedData);
      res.json(page);
    } catch (error: any) {
      if (error.message === 'Page not found') {
        return res.status(404).json({ error: "Page not found" });
      }
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update page" });
    }
  });

  app.delete("/api/admin/pages/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deletePage(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete page" });
    }
  });

  // Section management endpoints
  app.post("/api/admin/sections", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPageSectionSchema.parse(req.body);
      const section = await storage.createSection(validatedData);
      res.status(201).json(section);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create section" });
    }
  });

  app.put("/api/admin/sections/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updatePageSectionSchema.parse(req.body);
      const section = await storage.updateSection(id, validatedData);
      res.json(section);
    } catch (error: any) {
      if (error.message === 'Section not found') {
        return res.status(404).json({ error: "Section not found" });
      }
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update section" });
    }
  });

  app.delete("/api/admin/sections/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSection(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete section" });
    }
  });

  // Content element management endpoints
  app.post("/api/admin/elements", requireAuth, async (req, res) => {
    try {
      const validatedData = insertContentElementSchema.parse(req.body);
      const element = await storage.createElement(validatedData);
      res.status(201).json(element);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create element" });
    }
  });

  app.put("/api/admin/elements/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updateContentElementSchema.parse(req.body);
      const element = await storage.updateElement(id, validatedData);
      res.json(element);
    } catch (error: any) {
      if (error.message === 'Element not found') {
        return res.status(404).json({ error: "Element not found" });
      }
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update element" });
    }
  });

  app.delete("/api/admin/elements/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteElement(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete element" });
    }
  });

  // Site Settings management endpoints
  app.post("/api/admin/settings", requireAuth, async (req, res) => {
    try {
      const validatedData = insertSiteSettingSchema.parse(req.body);
      const setting = await storage.createSetting(validatedData);
      res.status(201).json(setting);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create setting" });
    }
  });

  app.put("/api/admin/settings/:key", requireAuth, async (req, res) => {
    try {
      const { key } = req.params;
      const validatedData = updateSiteSettingSchema.parse(req.body);
      const setting = await storage.updateSetting(key, validatedData);
      res.json(setting);
    } catch (error: any) {
      if (error.message === 'Setting not found') {
        return res.status(404).json({ error: "Setting not found" });
      }
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update setting" });
    }
  });

  app.delete("/api/admin/settings/:key", requireAuth, async (req, res) => {
    try {
      const { key } = req.params;
      await storage.deleteSetting(key);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete setting" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
