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
  layoutConfig: json("layout_config"), // Layout configuration: { columns: 2, style: 'grid', responsive: true }
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

export const dropdownOptions = pgTable("dropdown_options", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fieldName: text("field_name").notNull(), // e.g., 'research_status'
  optionValue: text("option_value").notNull(),
  optionLabel: text("option_label").notNull(),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Section type definitions - defines available section types and their default configurations
export const sectionTypeDefinitions = pgTable("section_type_definitions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  typeName: text("type_name").notNull().unique(), // e.g., 'skills', 'projects', 'experience'
  displayName: text("display_name").notNull(), // e.g., 'Skills & Technologies', 'Project Gallery'
  description: text("description"), // Description of what this section type is for
  defaultLayoutConfig: json("default_layout_config"), // Default layout: { columns: 2, style: 'grid', responsive: true }
  allowedContentTypes: json("allowed_content_types").notNull(), // Array of content element types allowed in this section
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Content element type definitions - defines available content element types and their metadata schemas
export const contentElementTypeDefinitions = pgTable("content_element_type_definitions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  typeName: text("type_name").notNull().unique(), // e.g., 'skill_card', 'project_card', 'experience_entry'
  displayName: text("display_name").notNull(), // e.g., 'Skill Card', 'Project Card', 'Experience Entry'
  description: text("description"), // Description of what this content type is for
  metadataSchema: json("metadata_schema"), // JSON schema defining required/optional metadata fields
  defaultValues: json("default_values"), // Default values for new instances of this type
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
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

export const insertDropdownOptionSchema = createInsertSchema(dropdownOptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertSectionTypeDefinitionSchema = createInsertSchema(sectionTypeDefinitions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertContentElementTypeDefinitionSchema = createInsertSchema(contentElementTypeDefinitions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const updatePageSchema = insertPageSchema.partial();
export const updatePageSectionSchema = insertPageSectionSchema.partial().omit({ pageId: true });
export const updateContentElementSchema = insertContentElementSchema.partial().omit({ sectionId: true });
// Note: type field is now included to allow changing element types
export const updateSiteSettingSchema = insertSiteSettingSchema.partial().omit({ key: true });
export const updateDropdownOptionSchema = insertDropdownOptionSchema.partial().omit({ fieldName: true });
export const updateSectionTypeDefinitionSchema = insertSectionTypeDefinitionSchema.partial().omit({ typeName: true });
export const updateContentElementTypeDefinitionSchema = insertContentElementTypeDefinitionSchema.partial().omit({ typeName: true });

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

export type DropdownOption = typeof dropdownOptions.$inferSelect;
export type InsertDropdownOption = z.infer<typeof insertDropdownOptionSchema>;
export type UpdateDropdownOption = z.infer<typeof updateDropdownOptionSchema>;

export type SectionTypeDefinition = typeof sectionTypeDefinitions.$inferSelect;
export type InsertSectionTypeDefinition = z.infer<typeof insertSectionTypeDefinitionSchema>;
export type UpdateSectionTypeDefinition = z.infer<typeof updateSectionTypeDefinitionSchema>;

export type ContentElementTypeDefinition = typeof contentElementTypeDefinitions.$inferSelect;
export type InsertContentElementTypeDefinition = z.infer<typeof insertContentElementTypeDefinitionSchema>;
export type UpdateContentElementTypeDefinition = z.infer<typeof updateContentElementTypeDefinitionSchema>;

// Layout Configuration Types
export interface LayoutConfig {
  columns?: number; // Number of columns (1, 2, 3)
  style?: 'grid' | 'list' | 'cards' | 'masonry'; // Layout style
  gap?: 'sm' | 'md' | 'lg'; // Spacing between items
  responsive?: boolean; // Whether to adjust columns on mobile
  useNetflixHover?: boolean; // Whether to use Netflix-style hover effects
}

// Content Metadata Types for different content element types
export interface SkillCardMetadata {
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category?: string;
}

export interface ProjectMetadata {
  technologies?: string[];
  links?: {
    demo?: string;
    github?: string;
    live?: string;
  };
  status?: 'active' | 'completed' | 'archived';
  featured?: boolean;
}

export interface ExperienceMetadata {
  company: string;
  period: string;
  location?: string;
  type?: 'full-time' | 'part-time' | 'contract' | 'internship';
}

export interface PublicationMetadata {
  authors: string;
  venue: string;
  year?: number;
  doiUrl?: string;
  citation?: string;
  type?: 'journal' | 'conference' | 'workshop' | 'preprint';
}

export interface ResearchProjectMetadata {
  status?: string; // Uses dropdown options
  tags?: string[];
  startDate?: string;
  endDate?: string;
  collaborators?: string[];
}

export interface ResearchInterestMetadata {
  keywords?: string[];
  relatedProjects?: string[];
}

// Union type for all possible metadata
export type ContentMetadata = 
  | SkillCardMetadata 
  | ProjectMetadata 
  | ExperienceMetadata 
  | PublicationMetadata 
  | ResearchProjectMetadata 
  | ResearchInterestMetadata 
  | Record<string, any>; // Fallback for other types

// Complex types for nested data
export type PageWithSections = Page & {
  sections: (PageSection & {
    elements: ContentElement[];
  })[];
};

export type SectionWithElements = PageSection & {
  elements: ContentElement[];
};

export type PageSectionWithLayout = PageSection & {
  layoutConfig?: LayoutConfig;
};

export type ContentElementWithTypedMetadata<T extends ContentMetadata = ContentMetadata> = Omit<ContentElement, 'metadata'> & {
  metadata?: T;
};
