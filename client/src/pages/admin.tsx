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
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            textAlign: 'center',
            color: '#333'
          }}>
            Admin Login
          </h1>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px',
                fontWeight: '500',
                color: '#555'
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                required
              />
            </div>
            
            {error && (
              <div style={{
                background: '#fee',
                color: '#c33',
                padding: '10px',
                borderRadius: '4px',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px',
                background: isLoading ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            Content Management System
          </h1>
          {/* Step 1 Test: Single shadcn/ui component */}
          <div style={{ marginTop: '10px' }}>
            <Button 
              variant="outline" 
              size="sm"
              style={{ marginRight: '10px' }}
            >
              TEST: shadcn/ui Button
            </Button>
            <span style={{ fontSize: '12px', color: '#666' }}>
              ↑ Testing component library compatibility
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={runMigration}
            style={{
              padding: '8px 16px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Run Migration
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div style={{
        borderBottom: '1px solid #dee2e6',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '0' }}>
          {['pages', 'content', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 24px',
                background: activeTab === tab ? '#007bff' : 'transparent',
                color: activeTab === tab ? 'white' : '#333',
                border: 'none',
                borderBottom: activeTab === tab ? 'none' : '1px solid #dee2e6',
                cursor: 'pointer',
                fontSize: '16px',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'content' ? 'Edit Content' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Pages Tab */}
      {activeTab === 'pages' && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h2 style={{
            fontSize: '24px',
            marginBottom: '20px',
            color: '#333'
          }}>
            Available Pages
          </h2>
          
          {pages.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {pages.map((page) => (
                <div
                  key={page.id}
                  style={{
                    background: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '6px',
                    border: '1px solid #e9ecef',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#333' }}>
                      {page.title}
                    </h3>
                    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>
                      /{page.slug}
                    </p>
                    {page.metaDescription && (
                      <p style={{ margin: '0', color: '#888', fontSize: '13px' }}>
                        {page.metaDescription}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      background: page.isPublished ? '#d4edda' : '#f8d7da',
                      color: page.isPublished ? '#155724' : '#721c24'
                    }}>
                      {page.isPublished ? 'Published' : 'Draft'}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedPage(page.slug);
                        setActiveTab('content');
                        loadPageContent(page.slug);
                      }}
                      style={{
                        padding: '6px 12px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Edit Content
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666' }}>
              No pages found. Run the migration to create default pages.
            </p>
          )}
        </div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h2 style={{
            fontSize: '24px',
            marginBottom: '20px',
            color: '#333'
          }}>
            Edit Page Content
          </h2>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
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
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                minWidth: '200px'
              }}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {pageContent.sections.map((section: any) => (
                <div
                  key={section.id}
                  style={{
                    background: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '6px',
                    border: '1px solid #e9ecef'
                  }}
                >
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '20px', color: '#333' }}>
                    {section.title || `${section.type} Section`}
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {section.elements.map((element: any) => (
                      <div
                        key={element.id}
                        style={{
                          background: 'white',
                          padding: '15px',
                          borderRadius: '4px',
                          border: '1px solid #dee2e6'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '10px'
                        }}>
                          <div>
                            <span style={{
                              padding: '2px 6px',
                              background: '#e9ecef',
                              borderRadius: '3px',
                              fontSize: '12px',
                              marginRight: '8px'
                            }}>
                              {element.type}
                            </span>
                            {element.title && (
                              <span style={{ fontSize: '14px', fontWeight: '500' }}>
                                {element.title}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setEditingElement(element.id);
                              setEditContent(element.content || '');
                            }}
                            style={{
                              padding: '4px 8px',
                              background: '#6c757d',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Edit
                          </button>
                        </div>

                        {editingElement === element.id ? (
                          <div>
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              style={{
                                width: '100%',
                                minHeight: '100px',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                marginBottom: '10px'
                              }}
                            />
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => updateElement(element.id, editContent)}
                                style={{
                                  padding: '6px 12px',
                                  background: '#28a745',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '14px'
                                }}
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingElement(null);
                                  setEditContent('');
                                }}
                                style={{
                                  padding: '6px 12px',
                                  background: '#6c757d',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '14px'
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p style={{
                            margin: '0',
                            fontSize: '14px',
                            color: '#555',
                            whiteSpace: 'pre-wrap'
                          }}>
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
            <p style={{ color: '#666' }}>Loading page content...</p>
          ) : (
            <p style={{ color: '#666' }}>Select a page to edit its content.</p>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h2 style={{
            fontSize: '24px',
            marginBottom: '20px',
            color: '#333'
          }}>
            Site Settings
          </h2>
          
          {settings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {settings.map((setting) => (
                <div
                  key={setting.key}
                  style={{
                    background: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '6px',
                    border: '1px solid #e9ecef'
                  }}
                >
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#333' }}>
                    {setting.key.replace(/^social_|_url$/g, '').replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </h3>
                  <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px' }}>
                    {setting.description}
                  </p>
                  
                  {editingSetting === setting.key ? (
                    <div>
                      <input
                        type="text"
                        value={editSettingValue}
                        onChange={(e) => setEditSettingValue(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px',
                          marginBottom: '10px'
                        }}
                        placeholder="Enter URL..."
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => updateSetting(setting.key, editSettingValue)}
                          style={{
                            padding: '6px 12px',
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingSetting(null);
                            setEditSettingValue('');
                          }}
                          style={{
                            padding: '6px 12px',
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <code style={{
                        background: '#e9ecef',
                        padding: '4px 8px',
                        borderRadius: '3px',
                        fontSize: '13px'
                      }}>
                        {setting.value}
                      </code>
                      <button
                        onClick={() => {
                          setEditingSetting(setting.key);
                          setEditSettingValue(setting.value);
                        }}
                        style={{
                          padding: '4px 8px',
                          background: '#6c757d',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666' }}>
              No settings found. Run the migration to create default settings.
            </p>
          )}
        </div>
      )}
    </div>
  );
}