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

  // Simple debug render to test basic functionality
  return (
    <div className="p-8 max-w-7xl mx-auto bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-4" data-testid="text-admin-title">
        Admin Panel Working
      </h1>
      <p className="mb-4">Authentication successful! You are now logged in to the admin panel.</p>
      <Button onClick={handleLogout} variant="outline" data-testid="button-logout">
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  );
}