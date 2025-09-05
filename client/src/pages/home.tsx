import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import type { PageWithSections } from '@shared/schema';

export default function Home() {
  const { data: pageData, isLoading } = useQuery({
    queryKey: ['/api/pages/home'],
    queryFn: async (): Promise<PageWithSections> => {
      const response = await fetch('/api/pages/home');
      if (!response.ok) {
        throw new Error('Failed to fetch home page content');
      }
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="mb-12 animate-pulse">
        <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="mb-12 text-muted-foreground">
        Failed to load content. Please try again later.
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-12"
    >
      <div className="mb-12">
        {pageData.sections.map((section, sectionIndex) => (
          <div key={section.id}>
            {section.title && (
              <motion.h2
                className="text-4xl font-bold mb-8 text-foreground"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * sectionIndex }}
              >
                {section.title}
              </motion.h2>
            )}
            {section.elements.map((element, elementIndex) => (
              <motion.p
                key={element.id}
                className="text-lg text-muted-foreground leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + (0.1 * elementIndex) }}
                data-testid="text-home-content"
              >
                {element.content}
              </motion.p>
            ))}
          </div>
        ))}
      </div>
    </motion.section>
  );
}
