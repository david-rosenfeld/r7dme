import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText, Copy, Check } from 'lucide-react';
import { NetflixHoverGrid, NetflixHoverItem } from '@/components/effects/netflix-hover';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type { PageWithSections } from '@shared/schema';

export default function Research() {
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);

  const { data: pageData, isLoading } = useQuery({
    queryKey: ['/api/pages/research'],
    queryFn: async (): Promise<PageWithSections> => {
      const response = await fetch('/api/pages/research');
      if (!response.ok) {
        throw new Error('Failed to fetch research page content');
      }
      return response.json();
    }
  });

  const { data: researchStatusOptions = [] } = useQuery({
    queryKey: ['/api/dropdown-options/research_status'],
    queryFn: async () => {
      const response = await fetch('/api/dropdown-options/research_status');
      if (!response.ok) {
        throw new Error('Failed to fetch research status options');
      }
      return response.json();
    }
  });

  const copyToClipboard = async (text: string, publicationId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCitation(publicationId);
      setTimeout(() => setCopiedCitation(null), 2000);
    } catch (err) {
      console.error('Failed to copy citation:', err);
    }
  };

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
            data-testid="text-research-title"
          >
            {section.title}
          </motion.h2>
        );

      case 'research_interests':
        return (
          <motion.div
            key={section.id}
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * sectionIndex }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-foreground" data-testid="text-research-interests-title">
              {section.title}
            </h3>
            <NetflixHoverGrid cols={2} className="gap-6">
              {section.elements.map((interest: any, index: number) => (
                <NetflixHoverItem
                  key={interest.id}
                  index={index}
                  totalItems={section.elements.length}
                  cols={2}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <Card className="bg-card p-6 rounded-lg border border-border hover:border-primary/50 transition-colors h-full">
                      <h4 className="text-lg font-semibold mb-3 text-foreground" data-testid={`text-interest-title-${index}`}>
                        {interest.title}
                      </h4>
                      <p className="text-muted-foreground" data-testid={`text-interest-description-${index}`}>
                        {interest.content}
                      </p>
                    </Card>
                  </motion.div>
                </NetflixHoverItem>
              ))}
            </NetflixHoverGrid>
          </motion.div>
        );

      case 'publications':
        return (
          <motion.div
            key={section.id}
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * sectionIndex }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-foreground" data-testid="text-publications-title">
              {section.title}
            </h3>
            <div className="space-y-6">
              {section.elements.map((publication: any, index: number) => (
                <motion.div
                  key={publication.id}
                  className="border-l-4 border-primary pl-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                    <h4 className="text-lg font-semibold mb-2 text-foreground" data-testid={`text-publication-title-${index}`}>
                      "{publication.title}"
                    </h4>
                    <p className="text-muted-foreground mb-2" data-testid={`text-publication-authors-${index}`}>
                      {publication.metadata?.authors}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3" data-testid={`text-publication-venue-${index}`}>
                      Published in {publication.metadata?.venue}
                    </p>
                    <div className="flex gap-4">
                      <motion.a
                        href={publication.metadata?.doiUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors text-sm flex items-center gap-1"
                        whileHover={{ scale: 1.05 }}
                        data-testid={`link-publication-doi-${index}`}
                      >
                        <FileText className="w-4 h-4" />
                        DOI
                      </motion.a>
                      <Dialog>
                        <DialogTrigger asChild>
                          <motion.button
                            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                            whileHover={{ scale: 1.05 }}
                            data-testid={`button-publication-cite-${index}`}
                          >
                            Cite
                          </motion.button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Citation Information</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Citation Text:</h4>
                              <div className="bg-muted p-4 rounded-md text-sm font-mono leading-relaxed">
                                {publication.metadata?.citation || 'Citation not available'}
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <Button
                                onClick={() => copyToClipboard(publication.metadata?.citation || '', publication.id)}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                                data-testid={`button-copy-citation-${index}`}
                              >
                                {copiedCitation === publication.id ? (
                                  <>
                                    <Check className="w-4 h-4" />
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4" />
                                    Copy Citation
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'ongoing_projects':
        return (
          <motion.div
            key={section.id}
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * sectionIndex }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-foreground" data-testid="text-ongoing-projects-title">
              {section.title}
            </h3>
            <div className="space-y-6">
              {section.elements.map((project: any, index: number) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="bg-card p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-semibold text-foreground" data-testid={`text-ongoing-title-${index}`}>
                        {project.title}
                      </h4>
                      <Badge
                        variant="secondary"
                        className="text-sm px-3 py-1 rounded-full text-foreground"
                        data-testid={`badge-project-status-${index}`}
                      >
                        {researchStatusOptions.find((opt: any) => opt.optionValue === project.metadata?.status)?.optionLabel || project.metadata?.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4" data-testid={`text-ongoing-description-${index}`}>
                      {project.content}
                    </p>
                    <div className="flex gap-2 text-sm">
                      {project.metadata?.tags?.map((tag: string) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="bg-primary/20 text-primary px-3 py-1 rounded-full"
                          data-testid={`badge-project-tag-${tag.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      default:
        // Generic fallback renderer for any unknown section types
        return (
          <motion.div
            key={section.id}
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * sectionIndex }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-foreground" data-testid={`text-section-title-${section.type}`}>
              {section.title}
            </h3>
            {section.elements && section.elements.length > 0 ? (
              <div className="space-y-4">
                {section.elements.map((element: any, index: number) => (
                  <motion.div
                    key={element.id}
                    className="bg-card p-4 rounded-lg border border-border"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <h4 className="text-lg font-semibold mb-2 text-foreground" data-testid={`text-element-title-${index}`}>
                      {element.title}
                    </h4>
                    <div className="text-muted-foreground" data-testid={`text-element-content-${index}`}>
                      {element.content}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground italic">
                This section has no content yet.
              </div>
            )}
          </motion.div>
        );
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
