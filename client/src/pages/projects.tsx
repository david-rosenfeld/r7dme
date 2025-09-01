import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';

export default function Projects() {
  const featuredProjects = [
    {
      title: 'Project 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
      technologies: ['React', 'Python', 'TensorFlow', 'AWS'],
      links: {
        demo: '#',
        github: '#',
      },
    },
    {
      title: 'Project 2',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
      technologies: ['React Native', 'Node.js', 'IoT', 'MongoDB'],
      links: {
        demo: '#',
        github: '#',
      },
    },
    {
      title: 'Project 3',
      description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore.',
      technologies: ['Python', 'R', 'D3.js', 'Jupyter'],
      links: {
        demo: '#',
        github: '#',
      },
    },
  ];

  const otherProjects = [
    {
      title: 'Project 4',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      technologies: ['Next.js', 'Stripe'],
    },
    {
      title: 'Project 5',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation',
      technologies: ['Socket.io', 'WebRTC'],
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
          data-testid="text-projects-title"
        >
          Featured Projects
        </motion.h2>

        <div className="space-y-8">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.title}
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
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
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
                    <div className="flex gap-4">
                      <motion.a
                        href={project.links.demo}
                        className="text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-1"
                        whileHover={{ scale: 1.05 }}
                        data-testid={`link-project-demo-${index}`}
                      >
                        View Project <ExternalLink className="w-4 h-4" />
                      </motion.a>
                      <motion.a
                        href={project.links.github}
                        className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                        whileHover={{ scale: 1.05 }}
                        data-testid={`link-project-github-${index}`}
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                      </motion.a>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Projects */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-semibold mb-6 text-foreground" data-testid="text-other-projects-title">
            Other Notable Projects
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {otherProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="bg-card p-6 rounded-lg border border-border hover:border-primary/50 transition-colors group">
                  <h4 className="text-lg font-semibold mb-2 text-foreground" data-testid={`text-other-project-title-${index}`}>
                    {project.title}
                  </h4>
                  <p className="text-muted-foreground text-sm mb-3" data-testid={`text-other-project-description-${index}`}>
                    {project.description}
                  </p>
                  <div className="flex gap-2 text-xs">
                    {project.technologies.map((tech) => (
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
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
