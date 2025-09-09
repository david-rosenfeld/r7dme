import { useState } from 'react';
import { Button } from '@/components/ui/button';

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

  const updateElement = async (elementId: string, title: string, content: string) => {
    try {
      const response = await fetch(`/api/admin/elements/${elementId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content })
      });
      
      if (response.ok) {
        setEditingElement(null);
        setEditContent('');
        setEditTitle('');
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
        <div className="bg-card p-10 rounded-lg shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-5 text-center text-foreground">
            Admin Login
          </h1>
          
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label className="block mb-1 font-medium text-muted-foreground">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 border border-border rounded text-base bg-background text-foreground"
                required
              />
            </div>
            
            {error && (
              <div className="bg-destructive/10 text-destructive p-2.5 rounded mb-5 text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-primary-foreground border-none rounded text-base font-medium cursor-pointer ${
                isLoading 
                  ? 'bg-muted cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
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
          <button
            onClick={runMigration}
            className="px-4 py-2 bg-green-600 text-white border-none rounded cursor-pointer hover:bg-green-700"
          >
            Run Migration
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-secondary text-secondary-foreground border-none rounded cursor-pointer hover:bg-secondary/80"
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-300 mb-5">
        <div className="flex">
          {['pages', 'content', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-6 border-none cursor-pointer text-base capitalize ${
                activeTab === tab 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-transparent text-foreground border-b border-border hover:bg-muted/50'
              }`}
            >
              {tab === 'content' ? 'Edit Content' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Pages Tab */}
      {activeTab === 'pages' && (
        <div className="bg-card p-5 rounded-lg border border-border">
          <h2 className="text-2xl mb-5 text-foreground">
            Available Pages
          </h2>
          
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
        </div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="bg-card p-5 rounded-lg border border-border">
          <h2 className="text-2xl mb-5 text-foreground">
            Edit Page Content
          </h2>
          
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
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              placeholder="Enter content..."
                              className="w-full min-h-24 p-2 border border-border rounded text-sm mb-2.5 bg-background text-foreground"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateElement(element.id, editTitle, editContent)}
                                className="px-3 py-1.5 bg-green-600 text-white border-none rounded cursor-pointer text-sm hover:bg-green-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingElement(null);
                                  setEditContent('');
                                  setEditTitle('');
                                }}
                                className="px-3 py-1.5 bg-secondary text-secondary-foreground border-none rounded cursor-pointer text-sm hover:bg-secondary/80"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="m-0 text-sm text-foreground whitespace-pre-wrap">
                            {element.content || 'No content'}
                          </p>
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
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-card p-5 rounded-lg border border-border">
          <h2 className="text-2xl mb-5 text-foreground">
            Site Settings
          </h2>
          
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
        </div>
      )}
    </div>
  );
}