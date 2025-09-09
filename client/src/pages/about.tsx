import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import type { PageWithSections } from '@shared/schema';

export default function About() {
  const { data: pageData, isLoading } = useQuery({
    queryKey: ['/api/pages/about'],
    queryFn: async (): Promise<PageWithSections> => {
      const response = await fetch('/api/pages/about');
      if (!response.ok) {
        throw new Error('Failed to fetch about page content');
      }
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="mb-12 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
        <div className="space-y-4 mb-12">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
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

  const renderSection = (section: any, sectionIndex: number) => {
    switch (section.type) {
      case 'hero':
        return (
          <motion.h2
            key={section.id}
            className="text-4xl font-bold mb-8 text-foreground"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * sectionIndex }}
            data-testid="text-about-title"
          >
            {section.title}
          </motion.h2>
        );

      case 'bio':
        return (
          <motion.div
            key={section.id}
            className="prose prose-invert max-w-none mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * sectionIndex }}
          >
            {section.elements.map((element: any, idx: number) => (
              <p
                key={element.id}
                className="text-lg text-muted-foreground mb-6"
                data-testid={`text-about-description-${idx + 1}`}
              >
                {element.content}
              </p>
            ))}
          </motion.div>
        );

      case 'skills':
        return (
          <motion.div
            key={section.id}
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * sectionIndex }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-foreground" data-testid="text-skills-title">
              {section.title}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {section.elements.map((skill: any, index: number) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="bg-card p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <div className="font-medium text-foreground mb-2" data-testid={`text-skill-category-${skill.title?.toLowerCase()}`}>
                      {skill.title}
                    </div>
                    <div className="text-sm text-muted-foreground" data-testid={`text-skill-technologies-${skill.title?.toLowerCase()}`}>
                      {skill.content}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'experience':
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * sectionIndex }}
          >
            <h3 className="text-2xl font-semibold mb-8 text-foreground" data-testid="text-experience-title">
              {section.title}
            </h3>
            <div className="space-y-8">
              {section.elements.map((experience: any, index: number) => (
                <motion.div
                  key={experience.id}
                  className="border-l-4 border-primary pl-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h4 className="text-xl font-semibold text-foreground" data-testid={`text-experience-title-${index}`}>
                      {experience.title}
                    </h4>
                    <span className="text-muted-foreground" data-testid={`text-experience-period-${index}`}>
                      {experience.metadata?.period}
                    </span>
                  </div>
                  <div className="text-primary font-medium mb-3" data-testid={`text-experience-company-${index}`}>
                    {experience.metadata?.company}
                  </div>
                  <p className="text-muted-foreground" data-testid={`text-experience-description-${index}`}>
                    {experience.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-12"
    >
      <div className="mb-12">
        {pageData.sections.map((section, sectionIndex) => 
          renderSection(section, sectionIndex)
        )}
      </div>
    </motion.section>
  );
}
