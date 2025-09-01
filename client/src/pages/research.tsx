import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, FileText } from 'lucide-react';

export default function Research() {
  const researchInterests = [
    {
      title: 'Area 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      title: 'Area 2',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      title: 'Area 3',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
    {
      title: 'Area 4',
      description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
  ];

  const publications = [
    {
      title: 'Lorem Ipsum Dolor Sit Amet: Consectetur Adipiscing Research',
      authors: 'Lorem Author, Et Al. (2024)',
      venue: 'Lorem Ipsum Conference Proceedings',
      links: {
        paper: '#',
        cite: '#',
      },
    },
    {
      title: 'Ut Enim Ad Minim Veniam: A Comprehensive Study on Lorem Techniques',
      authors: 'Sample Researcher, Co-Author (2023)',
      venue: 'Journal of Lorem Ipsum Studies',
      links: {
        paper: '#',
        cite: '#',
      },
    },
    {
      title: 'Duis Aute Irure Dolor: Advanced Methods for Lorem Implementation',
      authors: 'Example Writer, Research Team (2023)',
      venue: 'International Lorem Ipsum Symposium',
      links: {
        paper: '#',
        cite: '#',
      },
    },
  ];

  const ongoingProjects = [
    {
      title: 'AI Ethics in Automated Decision Making',
      description: 'Investigating the ethical implications of AI systems in high-stakes decision making scenarios, focusing on bias detection and mitigation strategies.',
      status: 'Ongoing',
      tags: ['AI Ethics', 'Bias Detection', 'Policy'],
    },
    {
      title: 'Quantum-Classical Hybrid Computing',
      description: 'Exploring the potential of hybrid quantum-classical algorithms for solving complex optimization problems in machine learning and data analysis.',
      status: 'In Review',
      tags: ['Quantum Computing', 'Optimization', 'Algorithms'],
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-12"
    >
      <div className="mb-12">
        <motion.h2
          className="text-4xl font-bold mb-8 text-foreground"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          data-testid="text-research-title"
        >
          Research
        </motion.h2>

        {/* Current Research */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-2xl font-semibold mb-6 text-foreground" data-testid="text-research-interests-title">
            Current Research Interests
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {researchInterests.map((interest, index) => (
              <motion.div
                key={interest.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="bg-card p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
                  <h4 className="text-lg font-semibold mb-3 text-foreground" data-testid={`text-interest-title-${index}`}>
                    {interest.title}
                  </h4>
                  <p className="text-muted-foreground" data-testid={`text-interest-description-${index}`}>
                    {interest.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Publications */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-2xl font-semibold mb-6 text-foreground" data-testid="text-publications-title">
            Recent Publications
          </h3>
          <div className="space-y-6">
            {publications.map((publication, index) => (
              <motion.div
                key={publication.title}
                className="border-l-4 border-primary pl-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <h4 className="text-lg font-semibold mb-2 text-foreground" data-testid={`text-publication-title-${index}`}>
                  "{publication.title}"
                </h4>
                <p className="text-muted-foreground mb-2" data-testid={`text-publication-authors-${index}`}>
                  {publication.authors}
                </p>
                <p className="text-sm text-muted-foreground mb-3" data-testid={`text-publication-venue-${index}`}>
                  Published in {publication.venue}
                </p>
                <div className="flex gap-4">
                  <motion.a
                    href={publication.links.paper}
                    className="text-primary hover:text-primary/80 transition-colors text-sm flex items-center gap-1"
                    whileHover={{ scale: 1.05 }}
                    data-testid={`link-publication-paper-${index}`}
                  >
                    <FileText className="w-4 h-4" />
                    Read Paper
                  </motion.a>
                  <motion.a
                    href={publication.links.cite}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    whileHover={{ scale: 1.05 }}
                    data-testid={`link-publication-cite-${index}`}
                  >
                    Cite
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Research Projects */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-semibold mb-6 text-foreground" data-testid="text-ongoing-projects-title">
            Ongoing Research Projects
          </h3>
          <div className="space-y-6">
            {ongoingProjects.map((project, index) => (
              <motion.div
                key={project.title}
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
                      className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full"
                      data-testid={`badge-project-status-${index}`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4" data-testid={`text-ongoing-description-${index}`}>
                    {project.description}
                  </p>
                  <div className="flex gap-2 text-sm">
                    {project.tags.map((tag) => (
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
      </div>
    </motion.section>
  );
}
