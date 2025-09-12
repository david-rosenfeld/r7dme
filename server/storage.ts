import { 
  type User, 
  type InsertUser,
  type Page,
  type InsertPage,
  type UpdatePage,
  type PageSection,
  type InsertPageSection,
  type UpdatePageSection,
  type ContentElement,
  type InsertContentElement,
  type UpdateContentElement,
  type PageWithSections,
  type SectionWithElements,
  type SiteSetting,
  type InsertSiteSetting,
  type UpdateSiteSetting,
  type DropdownOption,
  type InsertDropdownOption,
  type UpdateDropdownOption,
  type SectionTypeDefinition,
  type InsertSectionTypeDefinition,
  type UpdateSectionTypeDefinition,
  type ContentElementTypeDefinition,
  type InsertContentElementTypeDefinition,
  type UpdateContentElementTypeDefinition,
  type LayoutConfig
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Page methods
  getAllPages(): Promise<Page[]>;
  getPageBySlug(slug: string): Promise<PageWithSections | undefined>;
  getPage(id: string): Promise<Page | undefined>;
  createPage(page: InsertPage): Promise<Page>;
  updatePage(id: string, page: UpdatePage): Promise<Page>;
  deletePage(id: string): Promise<void>;

  // Page Section methods
  getSectionsByPageId(pageId: string): Promise<SectionWithElements[]>;
  getSection(id: string): Promise<PageSection | undefined>;
  createSection(section: InsertPageSection): Promise<PageSection>;
  updateSection(id: string, section: UpdatePageSection): Promise<PageSection>;
  deleteSection(id: string): Promise<void>;

  // Content Element methods
  getElementsBySectionId(sectionId: string): Promise<ContentElement[]>;
  getElement(id: string): Promise<ContentElement | undefined>;
  createElement(element: InsertContentElement): Promise<ContentElement>;
  updateElement(id: string, element: UpdateContentElement): Promise<ContentElement>;
  deleteElement(id: string): Promise<void>;

  // Site Settings methods
  getAllSettings(): Promise<SiteSetting[]>;
  getSetting(key: string): Promise<SiteSetting | undefined>;
  createSetting(setting: InsertSiteSetting): Promise<SiteSetting>;
  updateSetting(key: string, setting: UpdateSiteSetting): Promise<SiteSetting>;
  deleteSetting(key: string): Promise<void>;

  // Dropdown Options methods
  getDropdownOptions(fieldName: string): Promise<DropdownOption[]>;
  getAllDropdownOptions(): Promise<DropdownOption[]>;
  getDropdownOption(id: string): Promise<DropdownOption | undefined>;
  createDropdownOption(option: InsertDropdownOption): Promise<DropdownOption>;
  updateDropdownOption(id: string, option: UpdateDropdownOption): Promise<DropdownOption>;
  deleteDropdownOption(id: string): Promise<void>;

  // Section Type Definitions methods
  getAllSectionTypeDefinitions(): Promise<SectionTypeDefinition[]>;
  getActiveSectionTypeDefinitions(): Promise<SectionTypeDefinition[]>;
  getSectionTypeDefinition(id: string): Promise<SectionTypeDefinition | undefined>;
  getSectionTypeDefinitionByName(typeName: string): Promise<SectionTypeDefinition | undefined>;
  createSectionTypeDefinition(definition: InsertSectionTypeDefinition): Promise<SectionTypeDefinition>;
  updateSectionTypeDefinition(id: string, definition: UpdateSectionTypeDefinition): Promise<SectionTypeDefinition>;
  deleteSectionTypeDefinition(id: string): Promise<void>;

  // Content Element Type Definitions methods
  getAllContentElementTypeDefinitions(): Promise<ContentElementTypeDefinition[]>;
  getActiveContentElementTypeDefinitions(): Promise<ContentElementTypeDefinition[]>;
  getContentElementTypeDefinition(id: string): Promise<ContentElementTypeDefinition | undefined>;
  getContentElementTypeDefinitionByName(typeName: string): Promise<ContentElementTypeDefinition | undefined>;
  getContentElementTypeDefinitionsForSection(sectionTypeName: string): Promise<ContentElementTypeDefinition[]>;
  createContentElementTypeDefinition(definition: InsertContentElementTypeDefinition): Promise<ContentElementTypeDefinition>;
  updateContentElementTypeDefinition(id: string, definition: UpdateContentElementTypeDefinition): Promise<ContentElementTypeDefinition>;
  deleteContentElementTypeDefinition(id: string): Promise<void>;

  // Bulk operations and reordering
  reorderElements(sectionId: string, elementIds: string[]): Promise<void>;
  reorderSections(pageId: string, sectionIds: string[]): Promise<void>;
  bulkDeleteElements(elementIds: string[]): Promise<void>;
  bulkDeleteSections(sectionIds: string[]): Promise<void>;
  duplicateElement(elementId: string): Promise<ContentElement>;
  duplicateSection(sectionId: string, targetPageId?: string): Promise<PageSection>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private pages: Map<string, Page>;
  private pageSections: Map<string, PageSection>;
  private contentElements: Map<string, ContentElement>;
  private siteSettings: Map<string, SiteSetting>;
  private dropdownOptions: Map<string, DropdownOption>;
  private sectionTypeDefinitions: Map<string, SectionTypeDefinition>;
  private contentElementTypeDefinitions: Map<string, ContentElementTypeDefinition>;

  constructor() {
    this.users = new Map();
    this.pages = new Map();
    this.pageSections = new Map();
    this.contentElements = new Map();
    this.siteSettings = new Map();
    this.dropdownOptions = new Map();
    this.sectionTypeDefinitions = new Map();
    this.contentElementTypeDefinitions = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Page methods
  async getAllPages(): Promise<Page[]> {
    return Array.from(this.pages.values())
      .filter(page => page.isPublished)
      .sort((a, b) => a.title.localeCompare(b.title));
  }

  async getPageBySlug(slug: string): Promise<PageWithSections | undefined> {
    const page = Array.from(this.pages.values()).find(p => p.slug === slug && p.isPublished);
    if (!page) return undefined;

    const sections = await this.getSectionsByPageId(page.id);
    return { ...page, sections };
  }

  async getPage(id: string): Promise<Page | undefined> {
    return this.pages.get(id);
  }

  async createPage(insertPage: InsertPage): Promise<Page> {
    const id = randomUUID();
    const now = new Date();
    const page: Page = { 
      id, 
      slug: insertPage.slug,
      title: insertPage.title,
      metaDescription: insertPage.metaDescription ?? null,
      isPublished: insertPage.isPublished ?? true,
      createdAt: now, 
      updatedAt: now 
    };
    this.pages.set(id, page);
    return page;
  }

  async updatePage(id: string, updatePage: UpdatePage): Promise<Page> {
    const existing = this.pages.get(id);
    if (!existing) throw new Error('Page not found');
    
    const updated: Page = {
      ...existing,
      ...updatePage,
      updatedAt: new Date()
    };
    this.pages.set(id, updated);
    return updated;
  }

  async deletePage(id: string): Promise<void> {
    this.pages.delete(id);
    // Delete associated sections and elements
    const sectionEntries = Array.from(this.pageSections.entries());
    for (const [sectionId, section] of sectionEntries) {
      if (section.pageId === id) {
        await this.deleteSection(sectionId);
      }
    }
  }

  // Page Section methods
  async getSectionsByPageId(pageId: string): Promise<SectionWithElements[]> {
    const sections = Array.from(this.pageSections.values())
      .filter(section => section.pageId === pageId && section.isPublished)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const sectionsWithElements: SectionWithElements[] = [];
    for (const section of sections) {
      const elements = await this.getElementsBySectionId(section.id);
      sectionsWithElements.push({ ...section, elements });
    }
    
    return sectionsWithElements;
  }

  async getSection(id: string): Promise<PageSection | undefined> {
    return this.pageSections.get(id);
  }

  async createSection(insertSection: InsertPageSection): Promise<PageSection> {
    const id = randomUUID();
    const now = new Date();
    const section: PageSection = { 
      id, 
      pageId: insertSection.pageId,
      type: insertSection.type,
      title: insertSection.title ?? null,
      layoutConfig: insertSection.layoutConfig ?? null,
      order: insertSection.order ?? 0,
      isPublished: insertSection.isPublished ?? true,
      createdAt: now, 
      updatedAt: now 
    };
    this.pageSections.set(id, section);
    return section;
  }

  async updateSection(id: string, updateSection: UpdatePageSection): Promise<PageSection> {
    const existing = this.pageSections.get(id);
    if (!existing) throw new Error('Section not found');
    
    const updated: PageSection = {
      ...existing,
      ...updateSection,
      updatedAt: new Date()
    };
    this.pageSections.set(id, updated);
    return updated;
  }

  async deleteSection(id: string): Promise<void> {
    this.pageSections.delete(id);
    // Delete associated elements
    const elementEntries = Array.from(this.contentElements.entries());
    for (const [elementId, element] of elementEntries) {
      if (element.sectionId === id) {
        this.contentElements.delete(elementId);
      }
    }
  }

  // Content Element methods
  async getElementsBySectionId(sectionId: string): Promise<ContentElement[]> {
    return Array.from(this.contentElements.values())
      .filter(element => element.sectionId === sectionId && element.isPublished)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  async getElement(id: string): Promise<ContentElement | undefined> {
    return this.contentElements.get(id);
  }

  async createElement(insertElement: InsertContentElement): Promise<ContentElement> {
    const id = randomUUID();
    const now = new Date();
    const element: ContentElement = { 
      id, 
      sectionId: insertElement.sectionId,
      type: insertElement.type,
      title: insertElement.title ?? null,
      content: insertElement.content ?? null,
      metadata: insertElement.metadata ?? null,
      order: insertElement.order ?? 0,
      isPublished: insertElement.isPublished ?? true,
      createdAt: now, 
      updatedAt: now 
    };
    this.contentElements.set(id, element);
    return element;
  }

  async updateElement(id: string, updateElement: UpdateContentElement): Promise<ContentElement> {
    const existing = this.contentElements.get(id);
    if (!existing) throw new Error('Element not found');
    
    const updated: ContentElement = {
      ...existing,
      ...updateElement,
      updatedAt: new Date()
    };
    this.contentElements.set(id, updated);
    return updated;
  }

  async deleteElement(id: string): Promise<void> {
    this.contentElements.delete(id);
  }

  // Site Settings methods
  async getAllSettings(): Promise<SiteSetting[]> {
    return Array.from(this.siteSettings.values());
  }

  async getSetting(key: string): Promise<SiteSetting | undefined> {
    return Array.from(this.siteSettings.values()).find(setting => setting.key === key);
  }

  async createSetting(insertSetting: InsertSiteSetting): Promise<SiteSetting> {
    const id = randomUUID();
    const now = new Date();
    const setting: SiteSetting = { 
      id, 
      key: insertSetting.key,
      value: insertSetting.value,
      description: insertSetting.description ?? null,
      updatedAt: now 
    };
    this.siteSettings.set(insertSetting.key, setting);
    return setting;
  }

  async updateSetting(key: string, updateSetting: UpdateSiteSetting): Promise<SiteSetting> {
    const existing = await this.getSetting(key);
    if (!existing) throw new Error('Setting not found');
    
    const now = new Date();
    const updated: SiteSetting = { 
      ...existing, 
      value: updateSetting.value ?? existing.value,
      description: updateSetting.description !== undefined ? updateSetting.description : existing.description,
      updatedAt: now 
    };
    this.siteSettings.set(existing.key, updated);
    return updated;
  }

  async deleteSetting(key: string): Promise<void> {
    const setting = await this.getSetting(key);
    if (setting) {
      this.siteSettings.delete(key);
    }
  }

  // Dropdown Options methods
  async getDropdownOptions(fieldName: string): Promise<DropdownOption[]> {
    return Array.from(this.dropdownOptions.values())
      .filter(option => option.fieldName === fieldName && option.isActive)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  async getAllDropdownOptions(): Promise<DropdownOption[]> {
    return Array.from(this.dropdownOptions.values())
      .sort((a, b) => a.fieldName.localeCompare(b.fieldName) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  async getDropdownOption(id: string): Promise<DropdownOption | undefined> {
    return this.dropdownOptions.get(id);
  }

  async createDropdownOption(insertOption: InsertDropdownOption): Promise<DropdownOption> {
    const id = randomUUID();
    const now = new Date();
    const option: DropdownOption = {
      id,
      fieldName: insertOption.fieldName,
      optionValue: insertOption.optionValue,
      optionLabel: insertOption.optionLabel,
      sortOrder: insertOption.sortOrder ?? 0,
      isActive: insertOption.isActive ?? true,
      createdAt: now,
      updatedAt: now
    };
    this.dropdownOptions.set(id, option);
    return option;
  }

  async updateDropdownOption(id: string, updateOption: UpdateDropdownOption): Promise<DropdownOption> {
    const existing = this.dropdownOptions.get(id);
    if (!existing) throw new Error('Dropdown option not found');
    
    const updated: DropdownOption = {
      ...existing,
      ...updateOption,
      updatedAt: new Date()
    };
    this.dropdownOptions.set(id, updated);
    return updated;
  }

  async deleteDropdownOption(id: string): Promise<void> {
    this.dropdownOptions.delete(id);
  }

  // Section Type Definitions methods
  async getAllSectionTypeDefinitions(): Promise<SectionTypeDefinition[]> {
    return Array.from(this.sectionTypeDefinitions.values())
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }

  async getActiveSectionTypeDefinitions(): Promise<SectionTypeDefinition[]> {
    return Array.from(this.sectionTypeDefinitions.values())
      .filter(definition => definition.isActive)
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }

  async getSectionTypeDefinition(id: string): Promise<SectionTypeDefinition | undefined> {
    return this.sectionTypeDefinitions.get(id);
  }

  async getSectionTypeDefinitionByName(typeName: string): Promise<SectionTypeDefinition | undefined> {
    return Array.from(this.sectionTypeDefinitions.values())
      .find(definition => definition.typeName === typeName);
  }

  async createSectionTypeDefinition(insertDefinition: InsertSectionTypeDefinition): Promise<SectionTypeDefinition> {
    const id = randomUUID();
    const now = new Date();
    const definition: SectionTypeDefinition = {
      id,
      typeName: insertDefinition.typeName,
      displayName: insertDefinition.displayName,
      description: insertDefinition.description ?? null,
      defaultLayoutConfig: insertDefinition.defaultLayoutConfig ?? null,
      allowedContentTypes: insertDefinition.allowedContentTypes,
      isActive: insertDefinition.isActive ?? true,
      createdAt: now,
      updatedAt: now
    };
    this.sectionTypeDefinitions.set(id, definition);
    return definition;
  }

  async updateSectionTypeDefinition(id: string, updateDefinition: UpdateSectionTypeDefinition): Promise<SectionTypeDefinition> {
    const existing = this.sectionTypeDefinitions.get(id);
    if (!existing) throw new Error('Section type definition not found');
    
    const updated: SectionTypeDefinition = {
      ...existing,
      ...updateDefinition,
      updatedAt: new Date()
    };
    this.sectionTypeDefinitions.set(id, updated);
    return updated;
  }

  async deleteSectionTypeDefinition(id: string): Promise<void> {
    this.sectionTypeDefinitions.delete(id);
  }

  // Content Element Type Definitions methods
  async getAllContentElementTypeDefinitions(): Promise<ContentElementTypeDefinition[]> {
    return Array.from(this.contentElementTypeDefinitions.values())
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }

  async getActiveContentElementTypeDefinitions(): Promise<ContentElementTypeDefinition[]> {
    return Array.from(this.contentElementTypeDefinitions.values())
      .filter(definition => definition.isActive)
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }

  async getContentElementTypeDefinition(id: string): Promise<ContentElementTypeDefinition | undefined> {
    return this.contentElementTypeDefinitions.get(id);
  }

  async getContentElementTypeDefinitionByName(typeName: string): Promise<ContentElementTypeDefinition | undefined> {
    return Array.from(this.contentElementTypeDefinitions.values())
      .find(definition => definition.typeName === typeName);
  }

  async getContentElementTypeDefinitionsForSection(sectionTypeName: string): Promise<ContentElementTypeDefinition[]> {
    const sectionTypeDef = await this.getSectionTypeDefinitionByName(sectionTypeName);
    if (!sectionTypeDef || !sectionTypeDef.allowedContentTypes) {
      return [];
    }

    const allowedTypes = sectionTypeDef.allowedContentTypes as string[];
    return Array.from(this.contentElementTypeDefinitions.values())
      .filter(definition => definition.isActive && allowedTypes.includes(definition.typeName))
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }

  async createContentElementTypeDefinition(insertDefinition: InsertContentElementTypeDefinition): Promise<ContentElementTypeDefinition> {
    const id = randomUUID();
    const now = new Date();
    const definition: ContentElementTypeDefinition = {
      id,
      typeName: insertDefinition.typeName,
      displayName: insertDefinition.displayName,
      description: insertDefinition.description ?? null,
      metadataSchema: insertDefinition.metadataSchema ?? null,
      defaultValues: insertDefinition.defaultValues ?? null,
      isActive: insertDefinition.isActive ?? true,
      createdAt: now,
      updatedAt: now
    };
    this.contentElementTypeDefinitions.set(id, definition);
    return definition;
  }

  async updateContentElementTypeDefinition(id: string, updateDefinition: UpdateContentElementTypeDefinition): Promise<ContentElementTypeDefinition> {
    const existing = this.contentElementTypeDefinitions.get(id);
    if (!existing) throw new Error('Content element type definition not found');
    
    const updated: ContentElementTypeDefinition = {
      ...existing,
      ...updateDefinition,
      updatedAt: new Date()
    };
    this.contentElementTypeDefinitions.set(id, updated);
    return updated;
  }

  async deleteContentElementTypeDefinition(id: string): Promise<void> {
    this.contentElementTypeDefinitions.delete(id);
  }

  // Bulk operations and reordering
  async reorderElements(sectionId: string, elementIds: string[]): Promise<void> {
    // Update order for each element
    for (let i = 0; i < elementIds.length; i++) {
      const element = this.contentElements.get(elementIds[i]);
      if (element && element.sectionId === sectionId) {
        const updated: ContentElement = {
          ...element,
          order: i,
          updatedAt: new Date()
        };
        this.contentElements.set(elementIds[i], updated);
      }
    }
  }

  async reorderSections(pageId: string, sectionIds: string[]): Promise<void> {
    // Update order for each section
    for (let i = 0; i < sectionIds.length; i++) {
      const section = this.pageSections.get(sectionIds[i]);
      if (section && section.pageId === pageId) {
        const updated: PageSection = {
          ...section,
          order: i,
          updatedAt: new Date()
        };
        this.pageSections.set(sectionIds[i], updated);
      }
    }
  }

  async bulkDeleteElements(elementIds: string[]): Promise<void> {
    for (const elementId of elementIds) {
      this.contentElements.delete(elementId);
    }
  }

  async bulkDeleteSections(sectionIds: string[]): Promise<void> {
    for (const sectionId of sectionIds) {
      await this.deleteSection(sectionId); // This also deletes associated elements
    }
  }

  async duplicateElement(elementId: string): Promise<ContentElement> {
    const original = this.contentElements.get(elementId);
    if (!original) throw new Error('Element not found');

    // Find the highest order in the same section
    const sectionElements = await this.getElementsBySectionId(original.sectionId);
    const maxOrder = Math.max(...sectionElements.map(e => e.order ?? 0));

    const duplicate: InsertContentElement = {
      sectionId: original.sectionId,
      type: original.type,
      title: original.title ? `${original.title} (Copy)` : null,
      content: original.content,
      metadata: original.metadata as any,
      order: maxOrder + 1,
      isPublished: false // Mark as draft by default
    };

    return this.createElement(duplicate);
  }

  async duplicateSection(sectionId: string, targetPageId?: string): Promise<PageSection> {
    const original = this.pageSections.get(sectionId);
    if (!original) throw new Error('Section not found');

    const pageId = targetPageId || original.pageId;
    
    // Find the highest order in the target page
    const pageSections = await this.getSectionsByPageId(pageId);
    const maxOrder = Math.max(...pageSections.map(s => s.order ?? 0));

    // Duplicate the section
    const duplicateSection: InsertPageSection = {
      pageId,
      type: original.type,
      title: original.title ? `${original.title} (Copy)` : null,
      layoutConfig: original.layoutConfig as any,
      order: maxOrder + 1,
      isPublished: false // Mark as draft by default
    };

    const newSection = await this.createSection(duplicateSection);

    // Duplicate all elements in the section
    const elements = await this.getElementsBySectionId(sectionId);
    for (const element of elements) {
      const duplicateElement: InsertContentElement = {
        sectionId: newSection.id,
        type: element.type,
        title: element.title,
        content: element.content,
        metadata: element.metadata as any,
        order: element.order ?? 0,
        isPublished: false // Mark as draft by default
      };
      await this.createElement(duplicateElement);
    }

    return newSection;
  }
}

export const storage = new MemStorage();
