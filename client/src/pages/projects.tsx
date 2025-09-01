import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';

export default function Projects() {
  const featuredProjects = [
    {
      title: 'AI-Powered Analytics Platform',
      description: 'A comprehensive analytics platform that leverages machine learning to provide real-time insights and predictive analytics for business intelligence.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
      technologies: ['React', 'Python', 'TensorFlow', 'AWS'],
      links: {
        demo: '#',
        github: '#',
      },
    },
    {
      title: 'Smart Health Tracker',
      description: 'A mobile application that uses IoT sensors and machine learning to track health metrics and provide personalized recommendations for wellness.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
      technologies: ['React Native', 'Node.js', 'IoT', 'MongoDB'],
      links: {
        demo: '#',
        github: '#',
      },
    },
    {
      title: 'Open Source Research Tools',
      description: 'A collection of open-source tools and libraries for data analysis and visualization, used by researchers worldwide for academic and commercial projects.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
      technologies: ['Python', 'R', 'D3.js', 'Jupyter'],
      links: {
        demo: '#',
        github: '#',
      },
    },
  ];

  const otherProjects = [
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with modern payment integration',
      technologies: ['Next.js', 'Stripe'],
    },
    {
      title: 'Chat Application',
      description: 'Real-time messaging app with video call functionality',
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
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-1/3">
                    <img
                      src={project.image}
                      alt={`${project.title} interface`}
                      className="rounded-lg w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      data-testid={`img-project-${index}`}
                    />
                  </div>
                  <div className="lg:w-2/3">
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
