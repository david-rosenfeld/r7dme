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
      <div className="flex justify-center items-center min-h-screen p-5">
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
    <div className="p-5 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Content Management System
          </h1>
          {/* Step 1 Test: Single shadcn/ui component */}
          <div className="mt-2.5">
            <Button 
              variant="outline" 
              size="sm"
              className="mr-2.5"
            >
              TEST: shadcn/ui Button
            </Button>
            <span className="text-xs text-muted-foreground">
              ↑ Testing component library compatibility
            </span>
          </div>
        </div>
        <div className="flex gap-2.5">
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
              <CardTitle>Available Pages</CardTitle>
            </CardHeader>
            <CardContent>
              {pages.length > 0 ? (
            <div className="flex flex-col gap-4">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="bg-muted p-4 rounded border border-border flex justify-between items-center"
                >
                  <div>
                    <h3 className="m-0 mb-1 text-lg text-foreground">
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
                    <button
                      onClick={() => {
                        setSelectedPage(page.slug);
                        setActiveTab('content');
                        loadPageContent(page.slug);
                      }}
                      className="px-3 py-1.5 bg-primary text-primary-foreground border-none rounded cursor-pointer text-sm hover:bg-primary/90"
                    >
                      Edit Content
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
                <p className="text-muted-foreground">
                  No pages found. Run the migration to create default pages.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Edit Page Content</CardTitle>
            </CardHeader>
            <CardContent>
          
          <div className="mb-5">
            <label className="block mb-1 font-medium">
              Select Page:
            </label>
            <select
              value={selectedPage}
              onChange={(e) => {
                setSelectedPage(e.target.value);
                if (e.target.value) {
                  loadPageContent(e.target.value);
                }
              }}
              className="p-2 border border-border rounded text-base min-w-48 bg-background text-foreground"
            >
              <option value="">Select a page to edit</option>
              {pages.map((page) => (
                <option key={page.id} value={page.slug}>
                  {page.title}
                </option>
              ))}
            </select>
          </div>

          {pageContent && pageContent.sections ? (
            <div className="flex flex-col gap-5">
              {pageContent.sections.map((section: any) => (
                <div
                  key={section.id}
                  className="bg-muted p-5 rounded border border-border"
                >
                  <h3 className="m-0 mb-4 text-xl text-foreground">
                    {section.title || `${section.type} Section`}
                  </h3>
                  
                  <div className="flex flex-col gap-4">
                    {section.elements.map((element: any) => (
                      <div
                        key={element.id}
                        className="bg-card p-4 rounded border border-border"
                      >
                        <div className="flex justify-between items-start mb-2.5">
                          <div>
                            <span className="px-1.5 py-0.5 bg-muted rounded text-xs mr-2">
                              {element.type}
                            </span>
                            {element.title && (
                              <span className="text-sm font-medium">
                                {element.title}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setEditingElement(element.id);
                              setEditContent(element.content || '');
                              setEditTitle(element.title || '');
                              setEditMetadata(element.metadata || {});
                            }}
                            className="px-2 py-1 bg-secondary text-secondary-foreground border-none rounded cursor-pointer text-xs hover:bg-secondary/80"
                          >
                            Edit
                          </button>
                        </div>

                        {editingElement === element.id ? (
                          <div>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              placeholder="Enter title..."
                              className="w-full p-2 border border-border rounded text-sm mb-2.5 bg-background text-foreground"
                            />
                            {element.type === 'experience_entry' && (
                              <>
                                <input
                                  type="text"
                                  value={editMetadata.company || ''}
                                  onChange={(e) => setEditMetadata({...editMetadata, company: e.target.value})}
                                  placeholder="Enter company name..."
                                  className="w-full p-2 border border-border rounded text-sm mb-2.5 bg-background text-foreground"
                                />
                                <input
                                  type="text"
                                  value={editMetadata.period || ''}
                                  onChange={(e) => setEditMetadata({...editMetadata, period: e.target.value})}
                                  placeholder="Enter period (e.g., 2020 - 2022)..."
                                  className="w-full p-2 border border-border rounded text-sm mb-2.5 bg-background text-foreground"
                                />
                              </>
                            )}
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              placeholder="Enter content..."
                              className="w-full min-h-24 p-2 border border-border rounded text-sm mb-2.5 bg-background text-foreground"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateElement(element.id, editTitle, editContent, editMetadata)}
                                className="px-3 py-1.5 bg-green-600 text-white border-none rounded cursor-pointer text-sm hover:bg-green-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingElement(null);
                                  setEditContent('');
                                  setEditTitle('');
                                  setEditMetadata({});
                                }}
                                className="px-3 py-1.5 bg-secondary text-secondary-foreground border-none rounded cursor-pointer text-sm hover:bg-secondary/80"
                              >
                                Cancel
                              </button>
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
              <CardTitle>Site Settings</CardTitle>
            </CardHeader>
            <CardContent>
          
          {settings.length > 0 ? (
            <div className="flex flex-col gap-4">
              {settings.map((setting) => (
                <div
                  key={setting.key}
                  className="bg-muted p-4 rounded border border-border"
                >
                  <h3 className="m-0 mb-1 text-lg text-foreground">
                    {setting.key.replace(/^social_|_url$/g, '').replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </h3>
                  <p className="m-0 mb-4 text-muted-foreground text-sm">
                    {setting.description}
                  </p>
                  
                  {editingSetting === setting.key ? (
                    <div>
                      <input
                        type="text"
                        value={editSettingValue}
                        onChange={(e) => setEditSettingValue(e.target.value)}
                        className="w-full p-2 border border-border rounded text-sm mb-2.5 bg-background text-foreground"
                        placeholder="Enter URL..."
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateSetting(setting.key, editSettingValue)}
                          className="px-3 py-1.5 bg-green-600 text-white border-none rounded cursor-pointer text-sm hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingSetting(null);
                            setEditSettingValue('');
                          }}
                          className="px-3 py-1.5 bg-secondary text-secondary-foreground border-none rounded cursor-pointer text-sm hover:bg-secondary/80"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <code className="bg-muted px-2 py-1 rounded text-xs text-foreground">
                        {setting.value}
                      </code>
                      <button
                        onClick={() => {
                          setEditingSetting(setting.key);
                          setEditSettingValue(setting.value);
                        }}
                        className="px-2 py-1 bg-secondary text-secondary-foreground border-none rounded cursor-pointer text-xs hover:bg-secondary/80"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
              <p className="text-muted-foreground">
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