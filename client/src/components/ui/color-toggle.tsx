import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';

export function ColorToggle() {
  const { colorTheme, toggleColorTheme } = useTheme();

  return (
    <div className="flex items-center">
      <button
        onClick={toggleColorTheme}
        className="relative w-12 h-6 bg-muted rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary"
        data-testid="button-color-toggle"
      >
        <motion.div
          className="w-4 h-4 bg-primary rounded-full shadow-sm"
          animate={{
            x: colorTheme === 'cyan' ? 0 : 20,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        />
      </button>
    </div>
  );
}