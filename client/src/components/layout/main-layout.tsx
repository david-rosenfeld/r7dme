import { motion } from 'framer-motion';
import { Sidebar } from './sidebar';
import { CursorGlow } from '../cursor-glow';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <CursorGlow />
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 lg:ml-80">
        <motion.main
          className="p-8 lg:p-16 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
