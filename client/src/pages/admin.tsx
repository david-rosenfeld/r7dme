import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Save, Plus, Trash2, Edit3, LogOut } from 'lucide-react';
import type { PageWithSections, Page, PageSection, ContentElement, SiteSetting } from '@shared/schema';
import { AdminLogin } from '@/components/auth/admin-login';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [selectedPage, setSelectedPage] = useState<string>('');
  const [editingElement, setEditingElement] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [editingSetting, setEditingSetting] = useState<string | null>(null);
  const [editSettingValue, setEditSettingValue] = useState<string>('');
  const queryClient = useQueryClient();

  // Handle admin login
  const handleLogin = async (password: string) => {
    setIsLoggingIn(true);
    setLoginError('');
    
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
      } else {
        const error = await response.json();
        setLoginError(error.message || 'Invalid password');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthToken('');
    setSelectedPage('');
    setEditingElement(null);
    setEditContent('');
    setEditingSetting(null);
    setEditSettingValue('');
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <AdminLogin 
        onLogin={handleLogin}
        isLoading={isLoggingIn}
        error={loginError}
      />
    );
  }

  // Fetch site settings
  const { data: siteSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ['/api/settings'],
    queryFn: async (): Promise<SiteSetting[]> => {
      const response = await fetch('/api/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      return response.json();
    }
  });

  // Fetch all pages
  const { data: pages, isLoading: pagesLoading } = useQuery({
    queryKey: ['/api/pages'],
    queryFn: async (): Promise<Page[]> => {
      const response = await fetch('/api/pages');
      if (!response.ok) throw new Error('Failed to fetch pages');
      return response.json();
    }
  });

  // Fetch selected page with content
  const { data: pageData, isLoading: pageLoading } = useQuery({
    queryKey: ['/api/pages', selectedPage],
    queryFn: async (): Promise<PageWithSections | null> => {
      if (!selectedPage) return null;
      const response = await fetch(`/api/pages/${selectedPage}`);
      if (!response.ok) throw new Error('Failed to fetch page content');
      return response.json();
    },
    enabled: !!selectedPage
  });

  // Update element mutation
  const updateElementMutation = useMutation({
    mutationFn: async ({ elementId, content }: { elementId: string, content: string }) => {
      const response = await fetch(`/api/admin/elements/${elementId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });
      if (!response.ok) throw new Error('Failed to update element');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pages'] });
      setEditingElement(null);
      setEditContent('');
    }
  });

  // Migration mutation
  const migrationMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/migrate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Migration failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
    }
  });

  // Update setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string, value: string }) => {
      const response = await fetch(`/api/admin/settings/${key}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value })
      });
      if (!response.ok) throw new Error('Failed to update setting');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      setEditingSetting(null);
      setEditSettingValue('');
    }
  });

  const handleEdit = (element: ContentElement) => {
    setEditingElement(element.id);
    setEditContent(element.content || '');
  };

  const handleSave = () => {
    if (editingElement && editContent !== undefined) {
      updateElementMutation.mutate({ elementId: editingElement, content: editContent });
    }
  };

  const handleCancel = () => {
    setEditingElement(null);
    setEditContent('');
  };

  const handleEditSetting = (key: string, value: string) => {
    setEditingSetting(key);
    setEditSettingValue(value);
  };

  const handleSaveSetting = () => {
    if (editingSetting && editSettingValue !== undefined) {
      updateSettingMutation.mutate({ key: editingSetting, value: editSettingValue });
    }
  };

  const handleCancelSetting = () => {
    setEditingSetting(null);
    setEditSettingValue('');
  };

  const runMigration = () => {
    migrationMutation.mutate();
  };

  if (pagesLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-8 max-w-7xl mx-auto"
    >
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold text-foreground" data-testid="text-admin-title">
            Content Management System
          </h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
        <p className="text-muted-foreground mb-6">
          Manage your website content dynamically through this interface.
        </p>
        
        <div className="flex gap-4 mb-6">
          <Button
            onClick={runMigration}
            disabled={migrationMutation.isPending}
            className="flex items-center gap-2"
            data-testid="button-run-migration"
          >
            <RefreshCw className={`w-4 h-4 ${migrationMutation.isPending ? 'animate-spin' : ''}`} />
            {migrationMutation.isPending ? 'Running Migration...' : 'Run Content Migration'}
          </Button>
        </div>

        {migrationMutation.isSuccess && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
            <p className="text-green-400">Content migration completed successfully!</p>
          </div>
        )}

        {migrationMutation.isError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">Migration failed. Please check the console for details.</p>
          </div>
        )}
      </div>

      <Tabs defaultValue="pages" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pages" data-testid="tab-pages">Pages</TabsTrigger>
          <TabsTrigger value="content" data-testid="tab-content">Edit Content</TabsTrigger>
          <TabsTrigger value="settings" data-testid="tab-settings">Site Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Available Pages</h2>
            {pages && pages.length > 0 ? (
              <div className="space-y-4">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium text-foreground" data-testid={`text-page-title-${page.slug}`}>
                        {page.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">/{page.slug}</p>
                      {page.metaDescription && (
                        <p className="text-xs text-muted-foreground mt-1">{page.metaDescription}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={page.isPublished ? "default" : "secondary"}>
                        {page.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPage(page.slug)}
                        data-testid={`button-select-page-${page.slug}`}
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No pages found. Run the migration to create sample content.</p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Edit Content</h2>
            
            {!selectedPage ? (
              <p className="text-muted-foreground">Select a page from the Pages tab to edit its content.</p>
            ) : pageLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            ) : pageData ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Editing: {pageData.title}
                  </h3>
                  <Badge>{pageData.slug}</Badge>
                </div>

                <Separator />

                {pageData.sections.map((section, sectionIndex) => (
                  <Card key={section.id} className="p-4">
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-medium text-foreground">
                          {section.title || `Section ${sectionIndex + 1}`}
                        </h4>
                        <Badge variant="outline">{section.type}</Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {section.elements.map((element, elementIndex) => (
                        <div
                          key={element.id}
                          className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">
                                {element.title || `Element ${elementIndex + 1}`}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {element.type}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(element)}
                              disabled={editingElement === element.id}
                              data-testid={`button-edit-element-${element.id}`}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          </div>

                          {editingElement === element.id ? (
                            <div className="space-y-3">
                              <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full min-h-[100px]"
                                data-testid="textarea-edit-content"
                              />
                              <div className="flex gap-2">
                                <Button
                                  onClick={handleSave}
                                  disabled={updateElementMutation.isPending}
                                  size="sm"
                                  data-testid="button-save-content"
                                >
                                  <Save className="w-4 h-4 mr-2" />
                                  {updateElementMutation.isPending ? 'Saving...' : 'Save'}
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={handleCancel}
                                  size="sm"
                                  data-testid="button-cancel-edit"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {element.content || 'No content'}
                            </p>
                          )}

                          {element.metadata && (
                            <div className="mt-2 p-2 bg-muted/20 rounded text-xs">
                              <strong>Metadata:</strong> 
                              <pre className="mt-1">{JSON.stringify(element.metadata as Record<string, any>, null, 2)}</pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Failed to load page content.</p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Site Settings</h2>
            
            {settingsLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            ) : siteSettings && siteSettings.length > 0 ? (
              <div className="space-y-4">
                {siteSettings.map((setting) => (
                  <div
                    key={setting.key}
                    className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-foreground mb-1">
                          {setting.key.replace(/^social_|_url$/g, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {setting.description}
                        </p>
                        
                        {editingSetting === setting.key ? (
                          <div className="space-y-3">
                            <Input
                              value={editSettingValue}
                              onChange={(e) => setEditSettingValue(e.target.value)}
                              className="w-full"
                              placeholder="Enter URL..."
                              data-testid={`input-setting-${setting.key}`}
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={handleSaveSetting}
                                disabled={updateSettingMutation.isPending}
                                size="sm"
                                data-testid={`button-save-setting-${setting.key}`}
                              >
                                <Save className="w-4 h-4 mr-2" />
                                {updateSettingMutation.isPending ? 'Saving...' : 'Save'}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={handleCancelSetting}
                                size="sm"
                                data-testid={`button-cancel-setting-${setting.key}`}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {setting.value}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditSetting(setting.key, setting.value)}
                              data-testid={`button-edit-setting-${setting.key}`}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No settings found. Run the migration to create default settings.</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}