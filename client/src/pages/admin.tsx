import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
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
    }
  };

  const loadPageContent = async (slug: string) => {
    try {
      const response = await fetch(`/api/pages/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setPageContent(data);
      }
    } catch (err) {
      console.error('Failed to load page content:', err);
    }
  };

  const updateElement = async (elementId: string, title: string, content: string, metadata?: any) => {
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
        if (selectedPage) {
          loadPageContent(selectedPage);
        }
      }
    } catch (err) {
      console.error('Failed to update element:', err);
    }
  };

  const updateSetting = async (key: string, value: string) => {
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
        loadData();
      }
    } catch (err) {
      console.error('Failed to update setting:', err);
    }
  };

  const runMigration = async () => {
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
        alert('Migration completed successfully!');
      }
    } catch (err) {
      console.error('Failed to run migration:', err);
      alert('Migration failed. Check console for details.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthToken('');
    setPassword('');
    setError('');
    setPages([]);
    setSettings([]);
    setSelectedPage('');
    setPageContent(null);
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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            Content Management System
          </h1>
          {/* Step 1 Test: Single shadcn/ui component */}
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm"
              className="mr-4"
            >
              TEST: shadcn/ui Button
            </Button>
            <span className="text-xs text-muted-foreground">
              ↑ Testing component library compatibility
            </span>
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={runMigration}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Run Migration
          </Button>
          <Button
            onClick={handleLogout}
            variant="secondary"
          >
            Logout
          </Button>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="content">Edit Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-foreground">Available Pages</CardTitle>
            </CardHeader>
            <CardContent>
              {pages.length > 0 ? (
            <div className="flex flex-col gap-6">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="bg-muted p-6 rounded border border-border flex justify-between items-center"
                >
                  <div>
                    <h3 className="m-0 mb-2 text-xl font-semibold text-foreground">
                      {page.title}
                    </h3>
                    <p className="m-0 mb-1 text-muted-foreground text-sm">
                      /{page.slug}
                    </p>
                    {page.metaDescription && (
                      <p className="m-0 text-muted-foreground text-xs">
                        {page.metaDescription}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2 py-1 rounded text-xs ${
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
              <CardTitle className="text-2xl font-semibold text-foreground">Edit Page Content</CardTitle>
            </CardHeader>
            <CardContent>
          
          <div className="mb-6">
            <Label htmlFor="page-select" className="block mb-2 text-lg font-medium text-foreground">
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
              <SelectTrigger className="min-w-48" id="page-select" aria-label="Select a page to edit">
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

          {pageContent && pageContent.sections ? (
            <div className="flex flex-col gap-6">
              {pageContent.sections.map((section: any) => (
                <div
                  key={section.id}
                  className="bg-muted p-6 rounded border border-border"
                >
                  <h3 className="m-0 mb-6 text-xl font-semibold text-foreground">
                    {section.title || `${section.type} Section`}
                  </h3>
                  
                  <div className="flex flex-col gap-6">
                    {section.elements.map((element: any) => (
                      <div
                        key={element.id}
                        className="bg-card p-6 rounded border border-border"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="px-1.5 py-0.5 bg-muted rounded text-sm mr-2">
                              {element.type}
                            </span>
                            {element.title && (
                              <span className="text-sm font-medium">
                                {element.title}
                              </span>
                            )}
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
                            aria-label={`Edit ${element.type}`}
                          >
                            Edit
                          </Button>
                        </div>

                        {editingElement === element.id ? (
                          <div>
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
                            <div className="flex gap-4">
                              <Button
                                onClick={() => updateElement(element.id, editTitle, editContent, editMetadata)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                aria-label={`Save changes to ${element.type}`}
                              >
                                Save
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
                                aria-label="Cancel editing"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
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
                            <p className="m-0 text-sm text-foreground whitespace-pre-wrap">
                              {element.content || 'No content'}
                            </p>
                          </div>
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

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-foreground">Site Settings</CardTitle>
            </CardHeader>
            <CardContent>
          
          {settings.length > 0 ? (
            <div className="flex flex-col gap-6">
              {settings.map((setting) => (
                <div
                  key={setting.key}
                  className="bg-muted p-6 rounded border border-border"
                >
                  <h3 className="m-0 mb-2 text-xl font-semibold text-foreground">
                    {setting.key.replace(/^social_|_url$/g, '').replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </h3>
                  <p className="m-0 mb-6 text-lg text-muted-foreground">
                    {setting.description}
                  </p>
                  
                  {editingSetting === setting.key ? (
                    <div>
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
                      <div className="flex gap-4">
                        <Button
                          onClick={() => updateSetting(setting.key, editSettingValue)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          aria-label={`Save ${setting.key} setting`}
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingSetting(null);
                            setEditSettingValue('');
                          }}
                          variant="secondary"
                          size="sm"
                          aria-label="Cancel editing setting"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <code className="bg-muted px-2 py-1 rounded text-xs text-foreground">
                        {setting.value}
                      </code>
                      <Button
                        onClick={() => {
                          setEditingSetting(setting.key);
                          setEditSettingValue(setting.value);
                        }}
                        variant="secondary"
                        size="sm"
                        aria-label={`Edit ${setting.key} setting`}
                      >
                        Edit
                      </Button>
                    </div>
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
      </Tabs>
    </div>
  );
}