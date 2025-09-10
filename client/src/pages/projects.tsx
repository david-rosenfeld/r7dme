import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';
import { NetflixHoverGrid, NetflixHoverItem } from '@/components/effects/netflix-hover';
import { useQuery } from '@tanstack/react-query';
import type { PageWithSections } from '@shared/schema';

export default function Projects() {
  const { data: pageData, isLoading } = useQuery({
    queryKey: ['/api/pages/projects'],
    queryFn: async (): Promise<PageWithSections> => {
      const response = await fetch('/api/pages/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects page content');
      }
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="mb-12 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted rounded-lg h-48"></div>
          ))}
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
            data-testid="text-projects-title"
          >
            {section.title}
          </motion.h2>
        );

      case 'projects':
        return (
          <div key={section.id} className="mb-12">
            <NetflixHoverGrid cols={1} className="space-y-8">
              {section.elements.map((project: any, index: number) => (
                <NetflixHoverItem
                  key={project.id}
                  index={index}
                  totalItems={section.elements.length}
                  cols={1}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                  >
                    <Card className="bg-card rounded-lg p-6 border border-border hover:border-primary/50 transition-all duration-300 group">
                      <div className="flex flex-col gap-6">
                        <div className="w-full">
                          <h3 className="text-2xl font-semibold mb-3 text-foreground" data-testid={`text-project-title-${index}`}>
                            {project.title}
                          </h3>
                          <p className="text-muted-foreground mb-4" data-testid={`text-project-description-${index}`}>
                            {project.content}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.metadata?.technologies?.map((tech: string) => (
                              <Badge
                                key={tech}
                                variant="secondary"
                                className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm hover:bg-primary/30 transition-colors"
                                data-testid={`badge-tech-${tech.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          {project.metadata?.links && (
                            <div className="flex gap-4">
                              {project.metadata.links.demo && (
                                <motion.a
                                  href={project.metadata.links.demo}
                                  className="text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-1"
                                  whileHover={{ scale: 1.05 }}
                                  data-testid={`link-project-demo-${index}`}
                                >
                                  View Project <ExternalLink className="w-4 h-4" />
                                </motion.a>
                              )}
                              {project.metadata.links.github && (
                                <motion.a
                                  href={project.metadata.links.github}
                                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                                  whileHover={{ scale: 1.05 }}
                                  data-testid={`link-project-github-${index}`}
                                >
                                  <Github className="w-4 h-4" />
                                  GitHub
                                </motion.a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </NetflixHoverItem>
              ))}
            </NetflixHoverGrid>
          </div>
        );

      case 'projects_other':
        return (
          <motion.div
            key={section.id}
            className="mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-foreground" data-testid="text-other-projects-title">
              {section.title}
            </h3>
            <NetflixHoverGrid cols={2} className="gap-6">
              {section.elements.map((project: any, index: number) => (
                <NetflixHoverItem
                  key={project.id}
                  index={index}
                  totalItems={section.elements.length}
                  cols={2}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <Card className="bg-card p-6 rounded-lg border border-border hover:border-primary/50 transition-colors group h-full">
                      <h4 className="text-lg font-semibold mb-2 text-foreground" data-testid={`text-other-project-title-${index}`}>
                        {project.title}
                      </h4>
                      <p className="text-muted-foreground text-sm mb-3" data-testid={`text-other-project-description-${index}`}>
                        {project.content}
                      </p>
                      <div className="flex gap-2 text-xs">
                        {project.metadata?.technologies?.map((tech: string) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="bg-muted text-muted-foreground px-2 py-1 rounded"
                            data-testid={`badge-other-tech-${tech.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                </NetflixHoverItem>
              ))}
            </NetflixHoverGrid>
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
