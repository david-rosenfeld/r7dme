import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Github, Menu, X } from 'lucide-react';
import { SiLinkedin, SiX } from 'react-icons/si';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { ColorToggle } from '@/components/ui/color-toggle';
import { HoverEffectsToggle } from '@/components/ui/hover-effects-toggle';
import type { SiteSetting } from '@shared/schema';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location, navigate] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Research', href: '/research' },
  ];

  // Fetch social media URLs from CMS
  const { data: socialSettings } = useQuery({
    queryKey: ['/api/settings'],
    queryFn: async (): Promise<SiteSetting[]> => {
      const response = await fetch('/api/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      return response.json();
    }
  });

  // Helper function to get setting value by key
  const getSocialUrl = (key: string): string => {
    const setting = socialSettings?.find(s => s.key === key);
    return setting?.value || '#';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (href: string) => {
    navigate(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-button fixed top-6 left-6 z-50 lg:hidden bg-card p-3 rounded-lg border border-border"
        onClick={toggleMobileMenu}
        data-testid="button-mobile-menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <motion.div
        className={cn(
          "fixed lg:static inset-y-0 left-0 w-80 bg-card border-r border-border z-40 flex flex-col",
          "lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
        initial={false}
        animate={{
          x: window.innerWidth >= 1024 ? 0 : (isMobileMenuOpen ? 0 : "-100%"),
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="p-8 pl-12">
          {/* Logo/Name */}
          <h1 className="text-3xl font-bold mb-2">
            <button
              onClick={() => handleNavClick('/')}
              className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
              data-testid="link-home"
            >
              David Rosenfeld
            </button>
          </h1>
          <p className="text-muted-foreground text-lg mb-8" data-testid="text-subtitle">
            Platform Engineer & Doctoral Student
          </p>

          {/* Navigation */}
          <nav className="space-y-6 relative overflow-visible" data-testid="nav-main">
            {navItems.map((item) => (
              <div key={item.href} className="nav-item-container relative">
                <motion.button
                  onClick={() => handleNavClick(item.href)}
                  className={cn(
                    "nav-link block text-lg font-medium hover:text-primary transition-colors w-full text-left relative z-10",
                    location === item.href && "active text-primary"
                  )}
                  whileHover={{ x: 32 }}
                  animate={{ x: location === item.href ? 32 : 0 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                  data-testid={`link-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </motion.button>
                <motion.div 
                  className="nav-line absolute left-[-24px] top-1/2 h-0.5 transform -translate-y-1/2"
                  initial={{ width: location === item.href ? 48 : 16 }}
                  animate={{ width: location === item.href ? 48 : 16 }}
                  whileHover={{ width: 48 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </div>
            ))}
          </nav>
        </div>

        {/* Social Links */}
        <div className="mt-auto p-8">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
            <motion.a
              href={getSocialUrl('social_github_url')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              data-testid="link-github"
            >
              <Github className="w-6 h-6" />
            </motion.a>
            <motion.a
              href={getSocialUrl('social_linkedin_url')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              data-testid="link-linkedin"
            >
              <SiLinkedin className="w-6 h-6" />
            </motion.a>
            <motion.a
              href={getSocialUrl('social_x_url')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              data-testid="link-x"
            >
              <SiX className="w-6 h-6" />
            </motion.a>
            </div>
            <div className="flex flex-col gap-2">
              <ColorToggle />
              <HoverEffectsToggle />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
