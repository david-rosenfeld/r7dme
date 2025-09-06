import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHoverEffects } from '@/contexts/hover-effects-context';

interface NetflixHoverGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: number;
}

interface NetflixHoverItemProps {
  children: React.ReactNode;
  index?: number;
  totalItems?: number;
  cols?: number;
  className?: string;
  hoveredIndex?: number | null;
  setHoveredIndex?: (index: number | null) => void;
}

export function NetflixHoverGrid({ children, className = "", cols = 2 }: NetflixHoverGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { hoverEffectsEnabled } = useHoverEffects();

  // If hover effects are disabled, render as a simple grid
  if (!hoverEffectsEnabled) {
    return (
      <div 
        className={`grid gap-6 ${className}`}
        style={{ 
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
        }}
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return (
              <div key={index} data-testid={`simple-grid-item-${index}`}>
                {child.props.children}
              </div>
            );
          }
          return child;
        })}
      </div>
    );
  }

  // Render with hover effects enabled
  return (
    <div 
      className={`netflix-hover-grid ${className}`}
      style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: '1.5rem'
      }}
      data-hovered={hoveredIndex !== null}
      data-hovered-index={hoveredIndex}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<NetflixHoverItemProps>, {
            ...child.props,
            index,
            totalItems: React.Children.count(children),
            cols,
            hoveredIndex,
            setHoveredIndex,
          });
        }
        return child;
      })}
    </div>
  );
}

export function NetflixHoverItem({ 
  children, 
  index = 0, 
  totalItems = 4, 
  cols = 2, 
  className = "",
  hoveredIndex = null,
  setHoveredIndex = () => {} 
}: NetflixHoverItemProps) {
  const { hoverEffectsEnabled } = useHoverEffects();
  const isHovered = hoveredIndex === index;
  const isAnyHovered = hoveredIndex !== null;
  
  // Calculate position in grid
  const row = Math.floor(index / cols);
  const col = index % cols;
  const isLastCol = col === cols - 1;
  const isLastRow = row === Math.floor((totalItems - 1) / cols);
  
  // Calculate transforms based on position and hover state
  const getTransform = () => {
    if (!isAnyHovered) return 'scale(1) translateX(0) translateY(0)';
    
    if (isHovered) {
      return 'scale(1.3) translateX(0) translateY(0)';
    }
    
    // Non-hovered items
    const hoveredRow = Math.floor(hoveredIndex! / cols);
    const hoveredCol = hoveredIndex! % cols;
    
    let translateX = 0;
    let translateY = 0;
    
    // Same row - shift horizontally
    if (row === hoveredRow) {
      if (col > hoveredCol) {
        translateX = 15; // Shift right for items after hovered
      } else if (col < hoveredCol) {
        translateX = -15; // Shift left for items before hovered
      }
    }
    
    // Different row - shift vertically
    if (row !== hoveredRow) {
      if (row > hoveredRow) {
        translateY = 15; // Shift down for rows below hovered
      } else if (row < hoveredRow) {
        translateY = -15; // Shift up for rows above hovered
      }
    }
    
    return `scale(1) translateX(${translateX}%) translateY(${translateY}%)`;
  };

  const getOpacity = () => {
    if (!isAnyHovered) return 1;
    return isHovered ? 1 : 0.3;
  };

  const getZIndex = () => {
    return isHovered ? 10 : 1;
  };

  // If hover effects are disabled, render without interactions
  if (!hoverEffectsEnabled) {
    return (
      <div className={`${className}`} data-testid={`static-item-${index}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={`netflix-hover-item ${className}`}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      animate={{
        opacity: getOpacity(),
        zIndex: getZIndex(),
      }}
      transition={{
        opacity: { duration: 0.3, ease: "easeOut" },
        zIndex: { duration: 0 },
      }}
      style={{
        transform: getTransform(),
        willChange: 'transform, opacity, z-index',
      }}
      data-testid={`netflix-hover-item-${index}`}
    >
      {children}
    </motion.div>
  );
}