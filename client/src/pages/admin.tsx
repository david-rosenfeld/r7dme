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
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
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

  const clearMessages = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

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

  const handleLogout = () => {
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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
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
        <TabsList className="grid w-full grid-cols-3 text-sm">
          <TabsTrigger value="pages" className="text-xs sm:text-sm">Pages</TabsTrigger>
          <TabsTrigger value="content" className="text-xs sm:text-sm">Edit Content</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-foreground">Available Pages</CardTitle>
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
              <CardTitle className="text-xl sm:text-2xl font-semibold text-foreground">Edit Page Content</CardTitle>
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
              {pageContent.sections.map((section: any) => (
                <div
                  key={section.id}
                  className="bg-muted p-4 sm:p-6 rounded border border-border"
                >
                  <h3 className="m-0 mb-4 sm:mb-6 text-lg sm:text-xl font-semibold text-foreground">
                    {section.title || `${section.type} Section`}
                  </h3>
                  
                  <div className="flex flex-col gap-6">
                    {section.elements.map((element: any) => (
                      <div
                        key={element.id}
                        className="bg-card p-4 sm:p-6 rounded border border-border"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-4">
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
                          >
                            Edit
                          </Button>
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
                            {element.type !== 'publication' && (
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
                            {element.type !== 'publication' && (
                              <p className="m-0 text-sm text-foreground whitespace-pre-wrap">
                                {element.content || 'No content'}
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

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-semibold text-foreground">Site Settings</CardTitle>
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
      </Tabs>
    </div>
  );
}