import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CheckCircle, AlertCircle, Copy, Trash2, GripVertical, ChevronUp, ChevronDown, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('pages');
  const [pages, setPages] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>('');
  const [pageContent, setPageContent] = useState<any>(null);
  const [editingElement, setEditingElement] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [editTitle, setEditTitle] = useState<string>('');
  const [editMetadata, setEditMetadata] = useState<any>({});
  const [editingSetting, setEditingSetting] = useState<string | null>(null);
  const [editSettingValue, setEditSettingValue] = useState<string>('');
  const [loadingPages, setLoadingPages] = useState<boolean>(false);
  const [loadingContent, setLoadingContent] = useState<boolean>(false);
  const [savingElement, setSavingElement] = useState<string | null>(null);
  const [savingSetting, setSavingSetting] = useState<string | null>(null);
  const [migrationLoading, setMigrationLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [researchStatusOptions, setResearchStatusOptions] = useState<any[]>([]);
  const [loadingStatusOptions, setLoadingStatusOptions] = useState<boolean>(false);
  const [allDropdownOptions, setAllDropdownOptions] = useState<any[]>([]);
  const [loadingDropdownOptions, setLoadingDropdownOptions] = useState<boolean>(false);
  const [editingDropdownOption, setEditingDropdownOption] = useState<string | null>(null);
  const [newOptionFieldName, setNewOptionFieldName] = useState<string>('research_status');
  const [newOptionValue, setNewOptionValue] = useState<string>('');
  const [newOptionLabel, setNewOptionLabel] = useState<string>('');
  const [editDropdownFieldName, setEditDropdownFieldName] = useState<string>('');
  const [editDropdownValue, setEditDropdownValue] = useState<string>('');
  const [editDropdownLabel, setEditDropdownLabel] = useState<string>('');
  const [savingDropdownOption, setSavingDropdownOption] = useState<string | null>(null);
  
  // Content Types Management
  const [sectionTypes, setSectionTypes] = useState<any[]>([]);
  const [elementTypes, setElementTypes] = useState<any[]>([]);
  const [loadingSectionTypes, setLoadingSectionTypes] = useState<boolean>(false);
  const [loadingElementTypes, setLoadingElementTypes] = useState<boolean>(false);
  const [editingSectionType, setEditingSectionType] = useState<string | null>(null);
  const [editingElementType, setEditingElementType] = useState<string | null>(null);
  const [savingSectionType, setSavingSectionType] = useState<string | null>(null);
  const [savingElementType, setSavingElementType] = useState<string | null>(null);
  
  // New Section Type Form
  const [newSectionTypeName, setNewSectionTypeName] = useState<string>('');
  const [newSectionTypeDisplayName, setNewSectionTypeDisplayName] = useState<string>('');
  const [newSectionTypeDescription, setNewSectionTypeDescription] = useState<string>('');
  const [newSectionTypeLayoutConfig, setNewSectionTypeLayoutConfig] = useState<string>('{"columns": 1}');
  
  // New Element Type Form
  const [newElementTypeName, setNewElementTypeName] = useState<string>('');
  const [newElementTypeDisplayName, setNewElementTypeDisplayName] = useState<string>('');
  const [newElementTypeDescription, setNewElementTypeDescription] = useState<string>('');
  const [newElementTypeAllowedSections, setNewElementTypeAllowedSections] = useState<string[]>([]);
  const [newElementTypeMetadataSchema, setNewElementTypeMetadataSchema] = useState<string>('{}');
  
  // Bulk Operations
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set());
  const [selectedElements, setSelectedElements] = useState<Set<string>>(new Set());
  const [bulkOperationLoading, setBulkOperationLoading] = useState<boolean>(false);

  const clearMessages = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  const loadResearchStatusOptions = async () => {
    setLoadingStatusOptions(true);
    try {
      const response = await fetch('/api/dropdown-options/research_status');
      if (response.ok) {
        const options = await response.json();
        setResearchStatusOptions(options);
      }
    } catch (err) {
      console.error('Failed to load research status options:', err);
    } finally {
      setLoadingStatusOptions(false);
    }
  };

  const loadAllDropdownOptions = async () => {
    setLoadingDropdownOptions(true);
    try {
      const response = await fetch('/api/admin/dropdown-options', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const options = await response.json();
        setAllDropdownOptions(options);
      }
    } catch (err) {
      console.error('Failed to load dropdown options:', err);
      setErrorMessage('Failed to load dropdown options. Please try again.');
    } finally {
      setLoadingDropdownOptions(false);
    }
  };

  const createDropdownOption = async (fieldName: string, optionValue: string, optionLabel: string) => {
    setSavingDropdownOption('new');
    try {
      const response = await fetch('/api/admin/dropdown-options', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fieldName,
          optionValue,
          optionLabel,
          sortOrder: allDropdownOptions.filter(opt => opt.fieldName === fieldName).length
        })
      });
      
      if (response.ok) {
        setNewOptionValue('');
        setNewOptionLabel('');
        setSuccessMessage('Dropdown option created successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        loadAllDropdownOptions();
        loadResearchStatusOptions();
      } else {
        setErrorMessage('Failed to create dropdown option. Please try again.');
      }
    } catch (err) {
      console.error('Failed to create dropdown option:', err);
      setErrorMessage('Failed to create dropdown option. Please try again.');
    } finally {
      setSavingDropdownOption(null);
    }
  };

  const updateDropdownOption = async (id: string, fieldName: string, optionValue: string, optionLabel: string) => {
    setSavingDropdownOption(id);
    try {
      const response = await fetch(`/api/admin/dropdown-options/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fieldName,
          optionValue,
          optionLabel
        })
      });
      
      if (response.ok) {
        setEditingDropdownOption(null);
        setEditDropdownFieldName('');
        setEditDropdownValue('');
        setEditDropdownLabel('');
        setSuccessMessage('Dropdown option updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        loadAllDropdownOptions();
        loadResearchStatusOptions();
      } else {
        setErrorMessage('Failed to update dropdown option. Please try again.');
      }
    } catch (err) {
      console.error('Failed to update dropdown option:', err);
      setErrorMessage('Failed to update dropdown option. Please try again.');
    } finally {
      setSavingDropdownOption(null);
    }
  };

  const deleteDropdownOption = async (id: string) => {
    setSavingDropdownOption(id);
    try {
      const response = await fetch(`/api/admin/dropdown-options/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        setSuccessMessage('Dropdown option deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        loadAllDropdownOptions();
        loadResearchStatusOptions();
      } else {
        setErrorMessage('Failed to delete dropdown option. Please try again.');
      }
    } catch (err) {
      console.error('Failed to delete dropdown option:', err);
      setErrorMessage('Failed to delete dropdown option. Please try again.');
    } finally {
      setSavingDropdownOption(null);
    }
  };

  // Load content type data
  const loadSectionTypes = async () => {
    setLoadingSectionTypes(true);
    try {
      const response = await fetch('/api/admin/section-types', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const sectionTypesData = await response.json();
        setSectionTypes(sectionTypesData);
      } else {
        setErrorMessage('Failed to load section types. Please try again.');
      }
    } catch (err) {
      console.error('Failed to load section types:', err);
      setErrorMessage('Failed to load section types. Please try again.');
    } finally {
      setLoadingSectionTypes(false);
    }
  };

  const loadElementTypes = async () => {
    setLoadingElementTypes(true);
    try {
      const response = await fetch('/api/admin/element-types', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const elementTypesData = await response.json();
        setElementTypes(elementTypesData);
      } else {
        setErrorMessage('Failed to load element types. Please try again.');
      }
    } catch (err) {
      console.error('Failed to load element types:', err);
      setErrorMessage('Failed to load element types. Please try again.');
    } finally {
      setLoadingElementTypes(false);
    }
  };

  // Section Type CRUD operations
  const createSectionType = async () => {
    setSavingSectionType('new');
    try {
      let layoutConfig;
      try {
        layoutConfig = JSON.parse(newSectionTypeLayoutConfig);
      } catch (e) {
        setErrorMessage('Invalid JSON in layout configuration.');
        return;
      }

      const response = await fetch('/api/admin/section-types', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newSectionTypeName,
          displayName: newSectionTypeDisplayName,
          description: newSectionTypeDescription,
          layoutConfig,
          isActive: true
        })
      });
      
      if (response.ok) {
        setNewSectionTypeName('');
        setNewSectionTypeDisplayName('');
        setNewSectionTypeDescription('');
        setNewSectionTypeLayoutConfig('{"columns": 1}');
        setSuccessMessage('Section type created successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        loadSectionTypes();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to create section type. Please try again.');
      }
    } catch (err) {
      console.error('Failed to create section type:', err);
      setErrorMessage('Failed to create section type. Please try again.');
    } finally {
      setSavingSectionType(null);
    }
  };

  // Element Type CRUD operations
  const createElementType = async () => {
    setSavingElementType('new');
    try {
      let metadataSchema;
      try {
        metadataSchema = JSON.parse(newElementTypeMetadataSchema);
      } catch (e) {
        setErrorMessage('Invalid JSON in metadata schema.');
        return;
      }

      const response = await fetch('/api/admin/element-types', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newElementTypeName,
          displayName: newElementTypeDisplayName,
          description: newElementTypeDescription,
          allowedSectionTypes: newElementTypeAllowedSections,
          metadataSchema,
          isActive: true
        })
      });
      
      if (response.ok) {
        setNewElementTypeName('');
        setNewElementTypeDisplayName('');
        setNewElementTypeDescription('');
        setNewElementTypeAllowedSections([]);
        setNewElementTypeMetadataSchema('{}');
        setSuccessMessage('Element type created successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        loadElementTypes();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to create element type. Please try again.');
      }
    } catch (err) {
      console.error('Failed to create element type:', err);
      setErrorMessage('Failed to create element type. Please try again.');
    } finally {
      setSavingElementType(null);
    }
  };

  // Bulk operations
  const bulkDeleteSections = async () => {
    if (selectedSections.size === 0) return;
    
    setBulkOperationLoading(true);
    try {
      const response = await fetch('/api/admin/sections/bulk', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sectionIds: Array.from(selectedSections)
        })
      });
      
      if (response.ok) {
        setSelectedSections(new Set());
        setSuccessMessage(`${selectedSections.size} sections deleted successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);
        if (selectedPage) {
          loadPageContent(selectedPage);
        }
      } else {
        setErrorMessage('Failed to delete sections. Please try again.');
      }
    } catch (err) {
      console.error('Failed to bulk delete sections:', err);
      setErrorMessage('Failed to delete sections. Please try again.');
    } finally {
      setBulkOperationLoading(false);
    }
  };

  const bulkDeleteElements = async () => {
    if (selectedElements.size === 0) return;
    
    setBulkOperationLoading(true);
    try {
      const response = await fetch('/api/admin/elements/bulk', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          elementIds: Array.from(selectedElements)
        })
      });
      
      if (response.ok) {
        setSelectedElements(new Set());
        setSuccessMessage(`${selectedElements.size} elements deleted successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);
        if (selectedPage) {
          loadPageContent(selectedPage);
        }
      } else {
        setErrorMessage('Failed to delete elements. Please try again.');
      }
    } catch (err) {
      console.error('Failed to bulk delete elements:', err);
      setErrorMessage('Failed to delete elements. Please try again.');
    } finally {
      setBulkOperationLoading(false);
    }
  };

  const duplicateSection = async (sectionId: string, targetPageId: string) => {
    try {
      const response = await fetch(`/api/admin/sections/${sectionId}/duplicate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          targetPageId
        })
      });
      
      if (response.ok) {
        setSuccessMessage('Section duplicated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        if (selectedPage) {
          loadPageContent(selectedPage);
        }
      } else {
        setErrorMessage('Failed to duplicate section. Please try again.');
      }
    } catch (err) {
      console.error('Failed to duplicate section:', err);
      setErrorMessage('Failed to duplicate section. Please try again.');
    }
  };

  const duplicateElement = async (elementId: string, targetSectionId: string) => {
    try {
      const response = await fetch(`/api/admin/elements/${elementId}/duplicate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setSuccessMessage('Element duplicated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        if (selectedPage) {
          loadPageContent(selectedPage);
        }
      } else {
        setErrorMessage('Failed to duplicate element. Please try again.');
      }
    } catch (err) {
      console.error('Failed to duplicate element:', err);
      setErrorMessage('Failed to duplicate element. Please try again.');
    }
  };

  // Reordering functions
  const reorderSections = async (sectionOrders: Array<{id: string, order: number}>) => {
    try {
      const response = await fetch('/api/admin/sections/reorder', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sectionOrders
        })
      });
      
      if (response.ok) {
        setSuccessMessage('Sections reordered successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        if (selectedPage) {
          loadPageContent(selectedPage);
        }
      } else {
        setErrorMessage('Failed to reorder sections. Please try again.');
      }
    } catch (err) {
      console.error('Failed to reorder sections:', err);
      setErrorMessage('Failed to reorder sections. Please try again.');
    }
  };

  const reorderElements = async (elementOrders: Array<{id: string, order: number}>) => {
    try {
      const response = await fetch('/api/admin/elements/reorder', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          elementOrders
        })
      });
      
      if (response.ok) {
        setSuccessMessage('Elements reordered successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        if (selectedPage) {
          loadPageContent(selectedPage);
        }
      } else {
        setErrorMessage('Failed to reorder elements. Please try again.');
      }
    } catch (err) {
      console.error('Failed to reorder elements:', err);
      setErrorMessage('Failed to reorder elements. Please try again.');
    }
  };

  const moveSectionUp = (sectionIndex: number) => {
    if (!pageContent || sectionIndex <= 0) return;
    
    const currentSection = pageContent.sections[sectionIndex];
    const previousSection = pageContent.sections[sectionIndex - 1];
    
    const sectionOrders = [
      { id: currentSection.id, order: previousSection.order || 0 },
      { id: previousSection.id, order: currentSection.order || 0 }
    ];
    
    reorderSections(sectionOrders);
  };

  const moveSectionDown = (sectionIndex: number) => {
    if (!pageContent || sectionIndex >= pageContent.sections.length - 1) return;
    
    const currentSection = pageContent.sections[sectionIndex];
    const nextSection = pageContent.sections[sectionIndex + 1];
    
    const sectionOrders = [
      { id: currentSection.id, order: nextSection.order || 0 },
      { id: nextSection.id, order: currentSection.order || 0 }
    ];
    
    reorderSections(sectionOrders);
  };

  const moveElementUp = (sectionIndex: number, elementIndex: number) => {
    if (!pageContent || elementIndex <= 0) return;
    
    const section = pageContent.sections[sectionIndex];
    const currentElement = section.elements[elementIndex];
    const previousElement = section.elements[elementIndex - 1];
    
    const elementOrders = [
      { id: currentElement.id, order: previousElement.order || 0 },
      { id: previousElement.id, order: currentElement.order || 0 }
    ];
    
    reorderElements(elementOrders);
  };

  const moveElementDown = (sectionIndex: number, elementIndex: number) => {
    if (!pageContent) return;
    
    const section = pageContent.sections[sectionIndex];
    if (elementIndex >= section.elements.length - 1) return;
    
    const currentElement = section.elements[elementIndex];
    const nextElement = section.elements[elementIndex + 1];
    
    const elementOrders = [
      { id: currentElement.id, order: nextElement.order || 0 },
      { id: nextElement.id, order: currentElement.order || 0 }
    ];
    
    reorderElements(elementOrders);
  };

  // Create and delete functions
  const createNewSection = async () => {
    if (!selectedPage) return;
    
    try {
      const response = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pageId: selectedPage,
          type: 'content',
          title: 'New Section',
          content: 'New section content',
          isPublished: false
        })
      });
      
      if (response.ok) {
        setSuccessMessage('Section created successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        loadPageContent(selectedPage);
      } else {
        setErrorMessage('Failed to create section. Please try again.');
      }
    } catch (err) {
      console.error('Failed to create section:', err);
      setErrorMessage('Failed to create section. Please try again.');
    }
  };

  const deleteSection = async (sectionId: string) => {
    try {
      const response = await fetch(`/api/admin/sections/${sectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        setSuccessMessage('Section deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        if (selectedPage) {
          loadPageContent(selectedPage);
        }
      } else {
        setErrorMessage('Failed to delete section. Please try again.');
      }
    } catch (err) {
      console.error('Failed to delete section:', err);
      setErrorMessage('Failed to delete section. Please try again.');
    }
  };

  const createNewElement = async (sectionId: string) => {
    try {
      const response = await fetch('/api/admin/elements', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sectionId: sectionId,
          type: 'text',
          title: 'New Element',
          content: 'New element content',
          isPublished: false
        })
      });
      
      if (response.ok) {
        setSuccessMessage('Element created successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        if (selectedPage) {
          loadPageContent(selectedPage);
        }
      } else {
        setErrorMessage('Failed to create element. Please try again.');
      }
    } catch (err) {
      console.error('Failed to create element:', err);
      setErrorMessage('Failed to create element. Please try again.');
    }
  };

  const deleteElement = async (elementId: string) => {
    try {
      const response = await fetch(`/api/admin/elements/${elementId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        setSuccessMessage('Element deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        if (selectedPage) {
          loadPageContent(selectedPage);
        }
      } else {
        setErrorMessage('Failed to delete element. Please try again.');
      }
    } catch (err) {
      console.error('Failed to delete element:', err);
      setErrorMessage('Failed to delete element. Please try again.');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadResearchStatusOptions();
      loadAllDropdownOptions();
      loadSectionTypes();
      loadElementTypes();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    clearMessages();
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        const data = await response.json();
        setAuthToken(data.token);
        setIsAuthenticated(true);
        setPassword('');
        loadData();
      } else {
        const data = await response.json();
        setError(data.message || 'Invalid password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async () => {
    setLoadingPages(true);
    try {
      const [pagesRes, settingsRes] = await Promise.all([
        fetch('/api/pages'),
        fetch('/api/settings')
      ]);
      
      if (pagesRes.ok) {
        const pagesData = await pagesRes.json();
        setPages(pagesData);
      }
      
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      setErrorMessage('Failed to load data. Please try again.');
    } finally {
      setLoadingPages(false);
    }
  };

  const loadPageContent = async (slug: string) => {
    setLoadingContent(true);
    try {
      const response = await fetch(`/api/pages/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setPageContent(data);
      }
    } catch (err) {
      console.error('Failed to load page content:', err);
      setErrorMessage('Failed to load page content. Please try again.');
    } finally {
      setLoadingContent(false);
    }
  };

  const updateElement = async (elementId: string, title: string, content: string, metadata?: any) => {
    setSavingElement(elementId);
    try {
      const updateData: any = { title, content };
      if (metadata && Object.keys(metadata).length > 0) {
        updateData.metadata = metadata;
      }
      
      const response = await fetch(`/api/admin/elements/${elementId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        setEditingElement(null);
        setEditContent('');
        setEditTitle('');
        setEditMetadata({});
        setSuccessMessage('Element updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        if (selectedPage) {
          loadPageContent(selectedPage);
        }
      } else {
        setErrorMessage('Failed to update element. Please try again.');
      }
    } catch (err) {
      console.error('Failed to update element:', err);
      setErrorMessage('Failed to update element. Please try again.');
    } finally {
      setSavingElement(null);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    setSavingSetting(key);
    try {
      const response = await fetch(`/api/admin/settings/${key}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value })
      });
      
      if (response.ok) {
        setEditingSetting(null);
        setEditSettingValue('');
        setSuccessMessage('Setting updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        loadData();
      } else {
        setErrorMessage('Failed to update setting. Please try again.');
      }
    } catch (err) {
      console.error('Failed to update setting:', err);
      setErrorMessage('Failed to update setting. Please try again.');
    } finally {
      setSavingSetting(null);
    }
  };

  const runMigration = async () => {
    setMigrationLoading(true);
    try {
      const response = await fetch('/api/admin/migrate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        loadData();
        setSuccessMessage('Migration completed successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage('Migration failed. Please try again.');
      }
    } catch (err) {
      console.error('Failed to run migration:', err);
      setErrorMessage('Migration failed. Check console for details.');
    } finally {
      setMigrationLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Call the logout endpoint to invalidate the session
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      // Clear local state regardless of server response
      setIsAuthenticated(false);
      setAuthToken('');
      setPassword('');
      setError('');
      setPages([]);
      setSettings([]);
      setSelectedPage('');
      setPageContent(null);
      setSuccessMessage('');
      setErrorMessage('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen p-6">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-center">
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Success/Error Messages */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          </motion.div>
        )}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            Content Management System
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mt-2">
            Manage your website content, settings, and data
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Button
            onClick={runMigration}
            disabled={migrationLoading}
            className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
            size="sm"
          >
            {migrationLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              'Run Migration'
            )}
          </Button>
          <Button
            onClick={handleLogout}
            variant="secondary"
            className="w-full sm:w-auto"
            size="sm"
          >
            Logout
          </Button>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); clearMessages(); }} className="w-full">
        <TabsList className="grid w-full grid-cols-5 text-sm">
          <TabsTrigger value="pages" className="text-xs sm:text-sm">Pages</TabsTrigger>
          <TabsTrigger value="content" className="text-xs sm:text-sm">Edit Content</TabsTrigger>
          <TabsTrigger value="content-types" className="text-xs sm:text-sm">Content Types</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
          <TabsTrigger value="dropdowns" className="text-xs sm:text-sm">Dropdown Options</TabsTrigger>
        </TabsList>

        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">Available Pages</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPages ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Loading pages...
                </div>
              ) : pages.length > 0 ? (
            <div className="flex flex-col gap-6">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="bg-muted p-4 sm:p-6 rounded border border-border flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0"
                >
                  <div className="flex-1">
                    <h3 className="m-0 mb-2 text-lg sm:text-xl font-semibold text-foreground">
                      {page.title}
                    </h3>
                    <p className="m-0 mb-1 text-muted-foreground text-sm">
                      /{page.slug}
                    </p>
                    {page.metaDescription && (
                      <p className="m-0 text-muted-foreground text-xs line-clamp-2 sm:line-clamp-none">
                        {page.metaDescription}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2.5">
                    <span className={`px-2 py-1 rounded text-xs text-center sm:text-left ${
                      page.isPublished ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {page.isPublished ? 'Published' : 'Draft'}
                    </span>
                    <Button
                      onClick={() => {
                        setSelectedPage(page.slug);
                        setActiveTab('content');
                        loadPageContent(page.slug);
                      }}
                      size="sm"
                      className="w-full sm:w-auto"
                      aria-label={`Edit content for ${page.title}`}
                    >
                      Edit Content
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
                <p className="text-lg text-muted-foreground">
                  No pages found. Run the migration to create default pages.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">Edit Page Content</CardTitle>
            </CardHeader>
            <CardContent>
          
          <div className="mb-6">
            <Label htmlFor="page-select" className="block mb-2 text-base sm:text-lg font-medium text-foreground">
              Select Page:
            </Label>
            <Select
              value={selectedPage}
              onValueChange={(value) => {
                setSelectedPage(value);
                if (value) {
                  loadPageContent(value);
                }
              }}
            >
              <SelectTrigger className="w-full sm:min-w-48" id="page-select" aria-label="Select a page to edit">
                <SelectValue placeholder="Select a page to edit" />
              </SelectTrigger>
              <SelectContent>
                {pages.map((page) => (
                  <SelectItem key={page.id} value={page.slug}>
                    {page.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loadingContent ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading content...
            </div>
          ) : pageContent && pageContent.sections ? (
            <div className="flex flex-col gap-6">
              {/* Header with Create Section Button */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-foreground">Page Sections</h3>
                <Button
                  onClick={createNewSection}
                  variant="default"
                  size="sm"
                  data-testid="button-create-section"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Section
                </Button>
              </div>

              {/* Bulk Operations Bar */}
              {(selectedSections.size > 0 || selectedElements.size > 0) && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        {selectedSections.size > 0 && `${selectedSections.size} section${selectedSections.size > 1 ? 's' : ''} selected`}
                        {selectedSections.size > 0 && selectedElements.size > 0 && ', '}
                        {selectedElements.size > 0 && `${selectedElements.size} element${selectedElements.size > 1 ? 's' : ''} selected`}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {selectedSections.size > 0 && (
                        <Button
                          onClick={bulkDeleteSections}
                          disabled={bulkOperationLoading}
                          variant="destructive"
                          size="sm"
                          data-testid="button-bulk-delete-sections"
                        >
                          {bulkOperationLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="mr-2 h-4 w-4" />
                          )}
                          Delete Sections
                        </Button>
                      )}
                      {selectedElements.size > 0 && (
                        <Button
                          onClick={bulkDeleteElements}
                          disabled={bulkOperationLoading}
                          variant="destructive"
                          size="sm"
                          data-testid="button-bulk-delete-elements"
                        >
                          {bulkOperationLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="mr-2 h-4 w-4" />
                          )}
                          Delete Elements
                        </Button>
                      )}
                      <Button
                        onClick={() => {
                          setSelectedSections(new Set());
                          setSelectedElements(new Set());
                        }}
                        variant="secondary"
                        size="sm"
                        data-testid="button-clear-selection"
                      >
                        Clear Selection
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {pageContent.sections.map((section: any, sectionIndex: number) => (
                <div
                  key={section.id}
                  className={`bg-muted p-4 sm:p-6 rounded border-2 ${
                    selectedSections.has(section.id) ? 'border-blue-500' : 'border-border'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <Checkbox
                      checked={selectedSections.has(section.id)}
                      onCheckedChange={(checked) => {
                        const newSelection = new Set(selectedSections);
                        if (checked) {
                          newSelection.add(section.id);
                        } else {
                          newSelection.delete(section.id);
                        }
                        setSelectedSections(newSelection);
                      }}
                      data-testid={`checkbox-section-${section.id}`}
                    />
                    <div className="flex-1">
                      <h3 className="m-0 mb-2 text-lg sm:text-xl font-semibold text-foreground">
                        {section.title || `${section.type} Section`}
                      </h3>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex flex-col gap-1">
                        <Button
                          onClick={() => moveSectionUp(sectionIndex)}
                          disabled={sectionIndex === 0}
                          variant="ghost"
                          size="sm"
                          data-testid={`button-move-section-up-${section.id}`}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => moveSectionDown(sectionIndex)}
                          disabled={sectionIndex === pageContent.sections.length - 1}
                          variant="ghost"
                          size="sm"
                          data-testid={`button-move-section-down-${section.id}`}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        onClick={() => duplicateSection(section.id, pageContent.id)}
                        variant="secondary"
                        size="sm"
                        data-testid={`button-duplicate-section-${section.id}`}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </Button>
                      <Button
                        onClick={() => deleteSection(section.id)}
                        variant="destructive"
                        size="sm"
                        data-testid={`button-delete-section-${section.id}`}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-6">
                    {section.elements.map((element: any, elementIndex: number) => (
                      <div
                        key={element.id}
                        className={`bg-card p-4 sm:p-6 rounded border-2 ${
                          selectedElements.has(element.id) ? 'border-blue-500' : 'border-border'
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <Checkbox
                            checked={selectedElements.has(element.id)}
                            onCheckedChange={(checked) => {
                              const newSelection = new Set(selectedElements);
                              if (checked) {
                                newSelection.add(element.id);
                              } else {
                                newSelection.delete(element.id);
                              }
                              setSelectedElements(newSelection);
                            }}
                            data-testid={`checkbox-element-${element.id}`}
                          />
                          <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
                            <div className="flex-1">
                              <span className="px-1.5 py-0.5 bg-muted rounded text-sm mr-2">
                                {element.type}
                              </span>
                              {element.title && (
                                <span className="text-sm font-medium">
                                  {element.title}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <div className="flex flex-col gap-1">
                                <Button
                                  onClick={() => moveElementUp(sectionIndex, elementIndex)}
                                  disabled={elementIndex === 0}
                                  variant="ghost"
                                  size="sm"
                                  data-testid={`button-move-element-up-${element.id}`}
                                >
                                  <ChevronUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  onClick={() => moveElementDown(sectionIndex, elementIndex)}
                                  disabled={elementIndex === section.elements.length - 1}
                                  variant="ghost"
                                  size="sm"
                                  data-testid={`button-move-element-down-${element.id}`}
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                onClick={() => {
                                  setEditingElement(element.id);
                                  setEditContent(element.content || '');
                                  setEditTitle(element.title || '');
                                  setEditMetadata(element.metadata || {});
                                }}
                                variant="secondary"
                                size="sm"
                                className="w-full sm:w-auto"
                                aria-label={`Edit ${element.type}`}
                                data-testid={`button-edit-element-${element.id}`}
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => duplicateElement(element.id, section.id)}
                                variant="secondary"
                                size="sm"
                                data-testid={`button-duplicate-element-${element.id}`}
                              >
                                <Copy className="mr-1 h-3 w-3" />
                                Duplicate
                              </Button>
                              <Button
                                onClick={() => deleteElement(element.id)}
                                variant="destructive"
                                size="sm"
                                data-testid={`button-delete-element-${element.id}`}
                              >
                                <X className="mr-1 h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>

                        {editingElement === element.id ? (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Label htmlFor={`title-${element.id}`} className="sr-only">
                              Element Title
                            </Label>
                            <Input
                              id={`title-${element.id}`}
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              placeholder="Enter title..."
                              className="mb-4"
                              aria-label="Element title"
                            />
                            {element.type === 'experience_entry' && (
                              <>
                                <Label htmlFor={`company-${element.id}`} className="sr-only">
                                  Company Name
                                </Label>
                                <Input
                                  id={`company-${element.id}`}
                                  type="text"
                                  value={editMetadata.company || ''}
                                  onChange={(e) => setEditMetadata({...editMetadata, company: e.target.value})}
                                  placeholder="Enter company name..."
                                  className="mb-4"
                                  aria-label="Company name"
                                />
                                <Label htmlFor={`period-${element.id}`} className="sr-only">
                                  Employment Period
                                </Label>
                                <Input
                                  id={`period-${element.id}`}
                                  type="text"
                                  value={editMetadata.period || ''}
                                  onChange={(e) => setEditMetadata({...editMetadata, period: e.target.value})}
                                  placeholder="Enter period (e.g., 2020 - 2022)..."
                                  className="mb-4"
                                  aria-label="Employment period"
                                />
                              </>
                            )}
                            {element.type === 'publication' && (
                              <>
                                <Label htmlFor={`authors-${element.id}`} className="sr-only">
                                  Authors
                                </Label>
                                <Input
                                  id={`authors-${element.id}`}
                                  type="text"
                                  value={editMetadata.authors || ''}
                                  onChange={(e) => setEditMetadata({...editMetadata, authors: e.target.value})}
                                  placeholder="Enter authors..."
                                  className="mb-4"
                                  aria-label="Publication authors"
                                />
                                <Label htmlFor={`venue-${element.id}`} className="sr-only">
                                  Publication Venue
                                </Label>
                                <Input
                                  id={`venue-${element.id}`}
                                  type="text"
                                  value={editMetadata.venue || ''}
                                  onChange={(e) => setEditMetadata({...editMetadata, venue: e.target.value})}
                                  placeholder="Enter publication venue..."
                                  className="mb-4"
                                  aria-label="Publication venue"
                                />
                                <Label htmlFor={`doiUrl-${element.id}`} className="sr-only">
                                  DOI URL
                                </Label>
                                <Input
                                  id={`doiUrl-${element.id}`}
                                  type="url"
                                  value={editMetadata.doiUrl || ''}
                                  onChange={(e) => setEditMetadata({...editMetadata, doiUrl: e.target.value})}
                                  placeholder="Enter DOI URL (e.g., https://doi.org/10.1000/...)..."
                                  className="mb-4"
                                  aria-label="DOI URL"
                                />
                                <Label htmlFor={`citation-${element.id}`} className="sr-only">
                                  Citation Text
                                </Label>
                                <Textarea
                                  id={`citation-${element.id}`}
                                  value={editMetadata.citation || ''}
                                  onChange={(e) => setEditMetadata({...editMetadata, citation: e.target.value})}
                                  placeholder="Enter full citation text..."
                                  className="min-h-20 mb-4"
                                  aria-label="Citation text"
                                />
                              </>
                            )}
                            {element.type === 'research_project' && (
                              <>
                                <Label htmlFor={`status-${element.id}`} className="block mb-2 text-sm font-medium">
                                  Project Status
                                </Label>
                                <Select
                                  value={editMetadata.status || ''}
                                  onValueChange={(value) => setEditMetadata({...editMetadata, status: value})}
                                  disabled={loadingStatusOptions}
                                >
                                  <SelectTrigger className="w-full mb-4" data-testid={`select-status-${element.id}`}>
                                    <SelectValue placeholder="Select project status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {researchStatusOptions.map((option) => (
                                      <SelectItem key={option.id} value={option.optionValue}>
                                        {option.optionLabel}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Label htmlFor={`tags-${element.id}`} className="sr-only">
                                  Project Tags
                                </Label>
                                <Input
                                  id={`tags-${element.id}`}
                                  type="text"
                                  value={editMetadata.tags ? editMetadata.tags.join(', ') : ''}
                                  onChange={(e) => setEditMetadata({...editMetadata, tags: e.target.value.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)})}
                                  placeholder="Enter tags separated by commas..."
                                  className="mb-4"
                                  aria-label="Project tags"
                                />
                              </>
                            )}
                            {element.type !== 'publication' && element.type !== 'research_project' && (
                              <>
                                <Label htmlFor={`content-${element.id}`} className="sr-only">
                                  Element Content
                                </Label>
                                <Textarea
                                  id={`content-${element.id}`}
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  placeholder="Enter content..."
                                  className="min-h-24 mb-4"
                                  aria-label="Element content"
                                />
                              </>
                            )}
                            {element.type === 'research_project' && (
                              <>
                                <Label htmlFor={`content-${element.id}`} className="sr-only">
                                  Project Description
                                </Label>
                                <Textarea
                                  id={`content-${element.id}`}
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  placeholder="Enter project description..."
                                  className="min-h-24 mb-4"
                                  aria-label="Project description"
                                />
                              </>
                            )}
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                              <Button
                                onClick={() => updateElement(element.id, editTitle, editContent, editMetadata)}
                                disabled={savingElement === element.id}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                                aria-label={`Save changes to ${element.type}`}
                              >
                                {savingElement === element.id ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                  </>
                                ) : (
                                  'Save'
                                )}
                              </Button>
                              <Button
                                onClick={() => {
                                  setEditingElement(null);
                                  setEditContent('');
                                  setEditTitle('');
                                  setEditMetadata({});
                                }}
                                variant="secondary"
                                size="sm"
                                className="w-full sm:w-auto"
                                aria-label="Cancel editing"
                              >
                                Cancel
                              </Button>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {element.type === 'experience_entry' && element.metadata && (
                              <div className="mb-2 text-sm">
                                {element.metadata.company && (
                                  <p className="m-0 mb-1 text-muted-foreground">
                                    <strong>Company:</strong> {element.metadata.company}
                                  </p>
                                )}
                                {element.metadata.period && (
                                  <p className="m-0 mb-1 text-muted-foreground">
                                    <strong>Period:</strong> {element.metadata.period}
                                  </p>
                                )}
                              </div>
                            )}
                            {element.type === 'publication' && element.metadata && (
                              <div className="mb-2 text-sm">
                                {element.metadata.authors && (
                                  <p className="m-0 mb-1 text-muted-foreground">
                                    <strong>Authors:</strong> {element.metadata.authors}
                                  </p>
                                )}
                                {element.metadata.venue && (
                                  <p className="m-0 mb-1 text-muted-foreground">
                                    <strong>Venue:</strong> {element.metadata.venue}
                                  </p>
                                )}
                                {element.metadata.doiUrl && (
                                  <p className="m-0 mb-1 text-muted-foreground">
                                    <strong>DOI URL:</strong> <a href={element.metadata.doiUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{element.metadata.doiUrl}</a>
                                  </p>
                                )}
                                {element.metadata.citation && (
                                  <div className="m-0 mb-1 text-muted-foreground">
                                    <strong>Citation:</strong>
                                    <div className="mt-1 p-2 bg-muted rounded text-xs font-mono leading-relaxed">
                                      {element.metadata.citation}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            {element.type === 'research_project' && element.metadata && (
                              <div className="mb-2 text-sm">
                                {element.metadata.status && (
                                  <p className="m-0 mb-1 text-muted-foreground">
                                    <strong>Status:</strong> 
                                    <Badge 
                                      variant={
                                        element.metadata.status === 'published' ? 'default' :
                                        element.metadata.status === 'accepted' ? 'secondary' :
                                        element.metadata.status === 'in_review' ? 'outline' :
                                        'destructive'
                                      }
                                      className="ml-2"
                                      data-testid={`badge-status-${element.id}`}
                                    >
                                      {researchStatusOptions.find(opt => opt.optionValue === element.metadata.status)?.optionLabel || element.metadata.status}
                                    </Badge>
                                  </p>
                                )}
                                {element.metadata.tags && element.metadata.tags.length > 0 && (
                                  <div className="m-0 mb-1 text-muted-foreground">
                                    <strong>Tags:</strong>
                                    <div className="mt-1 flex flex-wrap gap-1">
                                      {element.metadata.tags.map((tag: string, index: number) => (
                                        <Badge key={index} variant="outline" className="text-xs" data-testid={`badge-tag-${element.id}-${index}`}>
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            {element.type !== 'publication' && element.type !== 'research_project' && (
                              <p className="m-0 text-sm text-foreground whitespace-pre-wrap">
                                {element.content || 'No content'}
                              </p>
                            )}
                            {element.type === 'research_project' && (
                              <p className="m-0 text-sm text-foreground whitespace-pre-wrap">
                                {element.content || 'No description'}
                              </p>
                            )}
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : selectedPage ? (
            <p className="text-muted-foreground">Loading page content...</p>
          ) : (
            <p className="text-muted-foreground">Select a page to edit its content.</p>
          )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content-types">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">Content Type Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Section Types Column */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground">Section Types</h3>
                  
                  {/* Add New Section Type */}
                  <div className="bg-muted p-6 rounded border border-border">
                    <h4 className="text-lg font-semibold text-foreground mb-4">Add New Section Type</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="new-section-type-name" className="text-sm font-medium">Name (identifier)</Label>
                        <Input
                          id="new-section-type-name"
                          type="text"
                          value={newSectionTypeName}
                          onChange={(e) => setNewSectionTypeName(e.target.value)}
                          placeholder="e.g., hero_section"
                          data-testid="input-new-section-type-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-section-type-display-name" className="text-sm font-medium">Display Name</Label>
                        <Input
                          id="new-section-type-display-name"
                          type="text"
                          value={newSectionTypeDisplayName}
                          onChange={(e) => setNewSectionTypeDisplayName(e.target.value)}
                          placeholder="e.g., Hero Section"
                          data-testid="input-new-section-type-display-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-section-type-description" className="text-sm font-medium">Description</Label>
                        <Textarea
                          id="new-section-type-description"
                          value={newSectionTypeDescription}
                          onChange={(e) => setNewSectionTypeDescription(e.target.value)}
                          placeholder="Describe what this section type is used for..."
                          data-testid="textarea-new-section-type-description"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-section-type-layout-config" className="text-sm font-medium">Layout Configuration (JSON)</Label>
                        <Textarea
                          id="new-section-type-layout-config"
                          value={newSectionTypeLayoutConfig}
                          onChange={(e) => setNewSectionTypeLayoutConfig(e.target.value)}
                          placeholder='{"columns": 1, "spacing": "normal"}'
                          data-testid="textarea-new-section-type-layout-config"
                        />
                      </div>
                      <Button
                        onClick={createSectionType}
                        disabled={!newSectionTypeName || !newSectionTypeDisplayName || savingSectionType === 'new'}
                        className="bg-green-600 hover:bg-green-700 w-full"
                        data-testid="button-create-section-type"
                      >
                        {savingSectionType === 'new' ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          'Add Section Type'
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Existing Section Types */}
                  {loadingSectionTypes ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      Loading section types...
                    </div>
                  ) : sectionTypes.length > 0 ? (
                    <div className="space-y-4">
                      {sectionTypes.map((sectionType) => (
                        <div key={sectionType.id} className="bg-card p-4 rounded border border-border">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {sectionType.name}
                                </Badge>
                                <span className="font-medium text-foreground">
                                  {sectionType.displayName}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {sectionType.description}
                              </p>
                              <div className="text-xs text-muted-foreground">
                                <span className={sectionType.isActive ? 'text-green-600' : 'text-red-600'}>
                                  {sectionType.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="secondary" size="sm" data-testid={`button-edit-section-type-${sectionType.id}`}>
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No section types found. Create one above to get started.
                    </p>
                  )}
                </div>

                {/* Element Types Column */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground">Element Types</h3>
                  
                  {/* Add New Element Type */}
                  <div className="bg-muted p-6 rounded border border-border">
                    <h4 className="text-lg font-semibold text-foreground mb-4">Add New Element Type</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="new-element-type-name" className="text-sm font-medium">Name (identifier)</Label>
                        <Input
                          id="new-element-type-name"
                          type="text"
                          value={newElementTypeName}
                          onChange={(e) => setNewElementTypeName(e.target.value)}
                          placeholder="e.g., text_block"
                          data-testid="input-new-element-type-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-element-type-display-name" className="text-sm font-medium">Display Name</Label>
                        <Input
                          id="new-element-type-display-name"
                          type="text"
                          value={newElementTypeDisplayName}
                          onChange={(e) => setNewElementTypeDisplayName(e.target.value)}
                          placeholder="e.g., Text Block"
                          data-testid="input-new-element-type-display-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-element-type-description" className="text-sm font-medium">Description</Label>
                        <Textarea
                          id="new-element-type-description"
                          value={newElementTypeDescription}
                          onChange={(e) => setNewElementTypeDescription(e.target.value)}
                          placeholder="Describe what this element type is used for..."
                          data-testid="textarea-new-element-type-description"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-element-type-metadata-schema" className="text-sm font-medium">Metadata Schema (JSON)</Label>
                        <Textarea
                          id="new-element-type-metadata-schema"
                          value={newElementTypeMetadataSchema}
                          onChange={(e) => setNewElementTypeMetadataSchema(e.target.value)}
                          placeholder='{"type": "object", "properties": {}}'
                          data-testid="textarea-new-element-type-metadata-schema"
                        />
                      </div>
                      <Button
                        onClick={createElementType}
                        disabled={!newElementTypeName || !newElementTypeDisplayName || savingElementType === 'new'}
                        className="bg-green-600 hover:bg-green-700 w-full"
                        data-testid="button-create-element-type"
                      >
                        {savingElementType === 'new' ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          'Add Element Type'
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Existing Element Types */}
                  {loadingElementTypes ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      Loading element types...
                    </div>
                  ) : elementTypes.length > 0 ? (
                    <div className="space-y-4">
                      {elementTypes.map((elementType) => (
                        <div key={elementType.id} className="bg-card p-4 rounded border border-border">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {elementType.name}
                                </Badge>
                                <span className="font-medium text-foreground">
                                  {elementType.displayName}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {elementType.description}
                              </p>
                              <div className="text-xs text-muted-foreground">
                                <span className={elementType.isActive ? 'text-green-600' : 'text-red-600'}>
                                  {elementType.isActive ? 'Active' : 'Inactive'}
                                </span>
                                {elementType.allowedSectionTypes && elementType.allowedSectionTypes.length > 0 && (
                                  <>
                                    <span> • Allowed in: </span>
                                    <span>{elementType.allowedSectionTypes.join(', ')}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="secondary" size="sm" data-testid={`button-edit-element-type-${elementType.id}`}>
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No element types found. Create one above to get started.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">Site Settings</CardTitle>
            </CardHeader>
            <CardContent>
          
          {settings.length > 0 ? (
            <div className="flex flex-col gap-6">
              {settings.map((setting) => (
                <div
                  key={setting.key}
                  className="bg-muted p-4 sm:p-6 rounded border border-border"
                >
                  <h3 className="m-0 mb-2 text-lg sm:text-xl font-semibold text-foreground">
                    {setting.key.replace(/^social_|_url$/g, '').replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </h3>
                  <p className="m-0 mb-4 sm:mb-6 text-base sm:text-lg text-muted-foreground">
                    {setting.description}
                  </p>
                  
                  {editingSetting === setting.key ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Label htmlFor={`setting-${setting.key}`} className="sr-only">
                        {setting.key} URL
                      </Label>
                      <Input
                        id={`setting-${setting.key}`}
                        type="text"
                        value={editSettingValue}
                        onChange={(e) => setEditSettingValue(e.target.value)}
                        className="mb-4"
                        placeholder="Enter URL..."
                        aria-label={`${setting.key} URL`}
                      />
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <Button
                          onClick={() => updateSetting(setting.key, editSettingValue)}
                          disabled={savingSetting === setting.key}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                          aria-label={`Save ${setting.key} setting`}
                        >
                          {savingSetting === setting.key ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            'Save'
                          )}
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingSetting(null);
                            setEditSettingValue('');
                          }}
                          variant="secondary"
                          size="sm"
                          className="w-full sm:w-auto"
                          aria-label="Cancel editing setting"
                        >
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <code className="bg-muted px-2 py-1 rounded text-xs text-foreground break-all">
                        {setting.value}
                      </code>
                      <Button
                        onClick={() => {
                          setEditingSetting(setting.key);
                          setEditSettingValue(setting.value);
                        }}
                        variant="secondary"
                        size="sm"
                        className="w-full sm:w-auto"
                        aria-label={`Edit ${setting.key} setting`}
                      >
                        Edit
                      </Button>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          ) : (
              <p className="text-lg text-muted-foreground">
                No settings found. Run the migration to create default settings.
              </p>
            )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dropdowns">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">Dropdown Options Management</CardTitle>
            </CardHeader>
            <CardContent>
              
              {/* Add New Dropdown Option */}
              <div className="mb-8 p-4 sm:p-6 bg-muted rounded border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Add New Option</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="new-field-name" className="text-sm font-medium">Field Name</Label>
                    <Select
                      value={newOptionFieldName}
                      onValueChange={setNewOptionFieldName}
                    >
                      <SelectTrigger className="w-full" id="new-field-name" data-testid="select-new-field-name">
                        <SelectValue placeholder="Select field name" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="research_status">Research Status</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="new-option-value" className="text-sm font-medium">Option Value</Label>
                    <Input
                      id="new-option-value"
                      type="text"
                      value={newOptionValue}
                      onChange={(e) => setNewOptionValue(e.target.value)}
                      placeholder="e.g., in_progress"
                      data-testid="input-new-option-value"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-option-label" className="text-sm font-medium">Option Label</Label>
                    <Input
                      id="new-option-label"
                      type="text"
                      value={newOptionLabel}
                      onChange={(e) => setNewOptionLabel(e.target.value)}
                      placeholder="e.g., In Progress"
                      data-testid="input-new-option-label"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => createDropdownOption(newOptionFieldName, newOptionValue, newOptionLabel)}
                  disabled={!newOptionValue || !newOptionLabel || savingDropdownOption === 'new'}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  data-testid="button-create-option"
                >
                  {savingDropdownOption === 'new' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Add Option'
                  )}
                </Button>
              </div>

              {/* Existing Dropdown Options */}
              {loadingDropdownOptions ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Loading dropdown options...
                </div>
              ) : allDropdownOptions.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {/* Group options by field name */}
                  {Object.entries(
                    allDropdownOptions.reduce((groups: Record<string, any[]>, option) => {
                      if (!groups[option.fieldName]) {
                        groups[option.fieldName] = [];
                      }
                      groups[option.fieldName].push(option);
                      return groups;
                    }, {} as Record<string, any[]>)
                  ).map(([fieldName, options]) => (
                    <div key={fieldName} className="bg-muted p-4 sm:p-6 rounded border border-border">
                      <h3 className="text-lg font-semibold text-foreground mb-4 capitalize">
                        {fieldName.replace(/_/g, ' ')} Options
                      </h3>
                      <div className="space-y-3">
                        {options
                          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                          .map((option) => (
                          <div
                            key={option.id}
                            className="bg-card p-4 rounded border border-border flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0"
                          >
                            {editingDropdownOption === option.id ? (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex-1"
                              >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <Label htmlFor={`edit-value-${option.id}`} className="text-sm font-medium">Option Value</Label>
                                    <Input
                                      id={`edit-value-${option.id}`}
                                      type="text"
                                      value={editDropdownValue}
                                      onChange={(e) => setEditDropdownValue(e.target.value)}
                                      placeholder="e.g., in_progress"
                                      data-testid={`input-edit-value-${option.id}`}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`edit-label-${option.id}`} className="text-sm font-medium">Option Label</Label>
                                    <Input
                                      id={`edit-label-${option.id}`}
                                      type="text"
                                      value={editDropdownLabel}
                                      onChange={(e) => setEditDropdownLabel(e.target.value)}
                                      placeholder="e.g., In Progress"
                                      data-testid={`input-edit-label-${option.id}`}
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                  <Button
                                    onClick={() => updateDropdownOption(option.id, editDropdownFieldName, editDropdownValue, editDropdownLabel)}
                                    disabled={!editDropdownValue || !editDropdownLabel || savingDropdownOption === option.id}
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                                    data-testid={`button-save-option-${option.id}`}
                                  >
                                    {savingDropdownOption === option.id ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                      </>
                                    ) : (
                                      'Save'
                                    )}
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setEditingDropdownOption(null);
                                      setEditDropdownFieldName('');
                                      setEditDropdownValue('');
                                      setEditDropdownLabel('');
                                    }}
                                    variant="secondary"
                                    size="sm"
                                    className="w-full sm:w-auto"
                                    data-testid={`button-cancel-edit-${option.id}`}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </motion.div>
                            ) : (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                                className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <Badge variant="outline" className="text-xs" data-testid={`badge-option-value-${option.id}`}>
                                      {option.optionValue}
                                    </Badge>
                                    <span className="text-foreground font-medium" data-testid={`text-option-label-${option.id}`}>
                                      {option.optionLabel}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>Sort Order: {option.sortOrder ?? 0}</span>
                                    <span>•</span>
                                    <span className={option.isActive ? 'text-green-600' : 'text-red-600'}>
                                      {option.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <Button
                                    onClick={() => {
                                      setEditingDropdownOption(option.id);
                                      setEditDropdownFieldName(option.fieldName);
                                      setEditDropdownValue(option.optionValue);
                                      setEditDropdownLabel(option.optionLabel);
                                    }}
                                    variant="secondary"
                                    size="sm"
                                    className="w-full sm:w-auto"
                                    data-testid={`button-edit-option-${option.id}`}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    onClick={() => deleteDropdownOption(option.id)}
                                    disabled={savingDropdownOption === option.id}
                                    variant="destructive"
                                    size="sm"
                                    className="w-full sm:w-auto"
                                    data-testid={`button-delete-option-${option.id}`}
                                  >
                                    {savingDropdownOption === option.id ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Deleting...
                                      </>
                                    ) : (
                                      'Delete'
                                    )}
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-lg text-muted-foreground">
                  No dropdown options found. Create some options above.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}