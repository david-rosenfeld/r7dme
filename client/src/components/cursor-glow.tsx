import { useEffect, useState } from 'react';

export function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Track mouse movement to show cursor
    document.addEventListener('mousemove', updatePosition);
    
    // Hide cursor when mouse leaves the viewport
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Show cursor when mouse enters the viewport  
    document.addEventListener('mouseenter', handleMouseEnter);

    // Set initial visibility on mount
    setIsVisible(true);

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <div
      className={`cursor-glow hidden lg:block transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
      data-testid="cursor-glow"
    />
  );
}
