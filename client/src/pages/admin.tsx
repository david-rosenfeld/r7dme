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

  // Working simple version without React Query
  return (
    <div className="p-8 max-w-7xl mx-auto bg-background text-foreground">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-bold" data-testid="text-admin-title">
          Content Management System
        </h1>
        <Button onClick={handleLogout} variant="outline" data-testid="button-logout">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
      <p className="text-muted-foreground mb-6">
        Manage your website content dynamically through this interface.
      </p>
      
      <Tabs defaultValue="pages" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pages" data-testid="tab-pages">Pages</TabsTrigger>
          <TabsTrigger value="content" data-testid="tab-content">Edit Content</TabsTrigger>
          <TabsTrigger value="settings" data-testid="tab-settings">Site Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Available Pages</h2>
            <p className="text-muted-foreground">
              Page management will be implemented once we solve the React Query issue.
              The backend is working correctly.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Edit Page Content</h2>
            <p className="text-muted-foreground">
              Content editing interface will be available here.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Site Settings</h2>
            <p className="text-muted-foreground">
              Settings management will be implemented once we solve the React Query issue.
              The backend API is working correctly.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}