import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// CMS Schema - Hierarchical structure
export const pages = pgTable("pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(), // 'home', 'about', 'projects', 'research'
  title: text("title").notNull(),
  metaDescription: text("meta_description"),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const pageSections = pgTable("page_sections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pageId: varchar("page_id").notNull().references(() => pages.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'hero', 'bio', 'skills', 'experience', 'projects'
  title: text("title"), // Section heading like "About Me", "Skills & Technologies"
  order: integer("order").default(0),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const contentElements = pgTable("content_elements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sectionId: varchar("section_id").notNull().references(() => pageSections.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'paragraph', 'skill_card', 'project_card', 'experience_entry'
  title: text("title"),
  content: text("content"),
  metadata: json("metadata"), // Flexible field for type-specific data like skills array, links, etc.
  order: integer("order").default(0),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPageSchema = createInsertSchema(pages).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertPageSectionSchema = createInsertSchema(pageSections).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertContentElementSchema = createInsertSchema(contentElements).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true
});

export const updatePageSchema = insertPageSchema.partial();
export const updatePageSectionSchema = insertPageSectionSchema.partial().omit({ pageId: true });
export const updateContentElementSchema = insertContentElementSchema.partial().omit({ sectionId: true });
export const updateSiteSettingSchema = insertSiteSettingSchema.partial().omit({ key: true });

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Page = typeof pages.$inferSelect;
export type InsertPage = z.infer<typeof insertPageSchema>;
export type UpdatePage = z.infer<typeof updatePageSchema>;

export type PageSection = typeof pageSections.$inferSelect;
export type InsertPageSection = z.infer<typeof insertPageSectionSchema>;
export type UpdatePageSection = z.infer<typeof updatePageSectionSchema>;

export type ContentElement = typeof contentElements.$inferSelect;
export type InsertContentElement = z.infer<typeof insertContentElementSchema>;
export type UpdateContentElement = z.infer<typeof updateContentElementSchema>;

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type UpdateSiteSetting = z.infer<typeof updateSiteSettingSchema>;

// Complex types for nested data
export type PageWithSections = Page & {
  sections: (PageSection & {
    elements: ContentElement[];
  })[];
};

export type SectionWithElements = PageSection & {
  elements: ContentElement[];
};
