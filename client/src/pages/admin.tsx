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

  const updateElement = async (elementId: string, content: string) => {
    try {
      const response = await fetch(`/api/admin/elements/${elementId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });
      
      if (response.ok) {
        setEditingElement(null);
        setEditContent('');
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
        <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-5 text-center text-gray-800">
            Admin Login
          </h1>
          
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label className="block mb-1 font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded text-base"
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-2.5 rounded mb-5 text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-white border-none rounded text-base font-medium cursor-pointer ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
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
          <h1 className="text-3xl font-bold text-gray-800">
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
            <span className="text-xs text-gray-500">
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
            className="px-4 py-2 bg-gray-600 text-white border-none rounded cursor-pointer hover:bg-gray-700"
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
                  ? 'bg-blue-600 text-white' 
                  : 'bg-transparent text-gray-800 border-b border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tab === 'content' ? 'Edit Content' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Pages Tab */}
      {activeTab === 'pages' && (
        <div className="bg-white p-5 rounded-lg border border-gray-300">
          <h2 className="text-2xl mb-5 text-gray-800">
            Available Pages
          </h2>
          
          {pages.length > 0 ? (
            <div className="flex flex-col gap-4">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="bg-gray-50 p-4 rounded border border-gray-200 flex justify-between items-center"
                >
                  <div>
                    <h3 className="m-0 mb-1 text-lg text-gray-800">
                      {page.title}
                    </h3>
                    <p className="m-0 mb-1 text-gray-600 text-sm">
                      /{page.slug}
                    </p>
                    {page.metaDescription && (
                      <p className="m-0 text-gray-500 text-xs">
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
                      className="px-3 py-1.5 bg-blue-600 text-white border-none rounded cursor-pointer text-sm hover:bg-blue-700"
                    >
                      Edit Content
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">
              No pages found. Run the migration to create default pages.
            </p>
          )}
        </div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="bg-white p-5 rounded-lg border border-gray-300">
          <h2 className="text-2xl mb-5 text-gray-800">
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
              className="p-2 border border-gray-300 rounded text-base min-w-48"
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
                  className="bg-gray-50 p-5 rounded border border-gray-200"
                >
                  <h3 className="m-0 mb-4 text-xl text-gray-800">
                    {section.title || `${section.type} Section`}
                  </h3>
                  
                  <div className="flex flex-col gap-4">
                    {section.elements.map((element: any) => (
                      <div
                        key={element.id}
                        className="bg-white p-4 rounded border border-gray-300"
                      >
                        <div className="flex justify-between items-start mb-2.5">
                          <div>
                            <span className="px-1.5 py-0.5 bg-gray-200 rounded text-xs mr-2">
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
                            }}
                            className="px-2 py-1 bg-gray-600 text-white border-none rounded cursor-pointer text-xs hover:bg-gray-700"
                          >
                            Edit
                          </button>
                        </div>

                        {editingElement === element.id ? (
                          <div>
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full min-h-24 p-2 border border-gray-300 rounded text-sm mb-2.5"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateElement(element.id, editContent)}
                                className="px-3 py-1.5 bg-green-600 text-white border-none rounded cursor-pointer text-sm hover:bg-green-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingElement(null);
                                  setEditContent('');
                                }}
                                className="px-3 py-1.5 bg-gray-600 text-white border-none rounded cursor-pointer text-sm hover:bg-gray-700"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="m-0 text-sm text-gray-700 whitespace-pre-wrap">
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
            <p className="text-gray-600">Loading page content...</p>
          ) : (
            <p className="text-gray-600">Select a page to edit its content.</p>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white p-5 rounded-lg border border-gray-300">
          <h2 className="text-2xl mb-5 text-gray-800">
            Site Settings
          </h2>
          
          {settings.length > 0 ? (
            <div className="flex flex-col gap-4">
              {settings.map((setting) => (
                <div
                  key={setting.key}
                  className="bg-gray-50 p-4 rounded border border-gray-200"
                >
                  <h3 className="m-0 mb-1 text-lg text-gray-800">
                    {setting.key.replace(/^social_|_url$/g, '').replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </h3>
                  <p className="m-0 mb-4 text-gray-600 text-sm">
                    {setting.description}
                  </p>
                  
                  {editingSetting === setting.key ? (
                    <div>
                      <input
                        type="text"
                        value={editSettingValue}
                        onChange={(e) => setEditSettingValue(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm mb-2.5"
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
                          className="px-3 py-1.5 bg-gray-600 text-white border-none rounded cursor-pointer text-sm hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <code className="bg-gray-200 px-2 py-1 rounded text-xs">
                        {setting.value}
                      </code>
                      <button
                        onClick={() => {
                          setEditingSetting(setting.key);
                          setEditSettingValue(setting.value);
                        }}
                        className="px-2 py-1 bg-gray-600 text-white border-none rounded cursor-pointer text-xs hover:bg-gray-700"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">
              No settings found. Run the migration to create default settings.
            </p>
          )}
        </div>
      )}
    </div>
  );
}