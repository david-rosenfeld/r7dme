import { motion } from 'framer-motion';
import { useHoverEffects } from '@/contexts/hover-effects-context';

export function HoverEffectsToggle() {
  const { hoverEffectsEnabled, toggleHoverEffects } = useHoverEffects();

  return (
    <div className="flex items-center">
      <button
        onClick={toggleHoverEffects}
        className="relative w-12 h-6 bg-muted rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary"
        data-testid="button-hover-effects-toggle"
        title={`${hoverEffectsEnabled ? 'Disable' : 'Enable'} hover effects`}
      >
        <motion.div
          className="w-4 h-4 bg-primary rounded-full shadow-sm"
          animate={{
            x: hoverEffectsEnabled ? 20 : 0,
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