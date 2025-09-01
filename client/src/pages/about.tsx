import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

export default function About() {
  const skills = [
    { category: 'Skill 1', technologies: 'Lorem ipsum, dolor sit, amet consectetur' },
    { category: 'Skill 2', technologies: 'Adipiscing elit, sed do, eiusmod tempor' },
    { category: 'Skill 3', technologies: 'Incididunt ut, labore et, dolore magna' },
    { category: 'Skill 4', technologies: 'Aliqua ut enim, ad minim, veniam quis' },
    { category: 'Skill 5', technologies: 'Nostrud exercitation, ullamco laboris, nisi ut' },
    { category: 'Skill 6', technologies: 'Aliquip ex ea, commodo consequat, duis aute' },
  ];

  const experiences = [
    {
      title: 'Senior Position Title',
      company: 'Example Company Inc.',
      period: '2022 - Present',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
    },
    {
      title: 'Mid-Level Position',
      company: 'Sample Organization',
      period: '2020 - 2022',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
    },
    {
      title: 'Junior Role Title',
      company: 'Placeholder Corp',
      period: '2018 - 2020',
      description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae.',
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
          data-testid="text-about-title"
        >
          About Me
        </motion.h2>

        <motion.div
          className="prose prose-invert max-w-none mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-lg text-muted-foreground mb-6" data-testid="text-about-description-1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p className="text-lg text-muted-foreground mb-6" data-testid="text-about-description-2">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p className="text-lg text-muted-foreground" data-testid="text-about-description-3">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
        </motion.div>

        {/* Skills */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-2xl font-semibold mb-6 text-foreground" data-testid="text-skills-title">
            Skills & Technologies
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="bg-card p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                  <div className="font-medium text-foreground mb-2" data-testid={`text-skill-category-${skill.category.toLowerCase()}`}>
                    {skill.category}
                  </div>
                  <div className="text-sm text-muted-foreground" data-testid={`text-skill-technologies-${skill.category.toLowerCase()}`}>
                    {skill.technologies}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Experience Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-semibold mb-8 text-foreground" data-testid="text-experience-title">
            Experience
          </h3>
          <div className="space-y-8">
            {experiences.map((experience, index) => (
              <motion.div
                key={`${experience.company}-${experience.period}`}
                className="experience-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h4 className="text-xl font-semibold text-foreground" data-testid={`text-experience-title-${index}`}>
                    {experience.title}
                  </h4>
                  <span className="text-muted-foreground" data-testid={`text-experience-period-${index}`}>
                    {experience.period}
                  </span>
                </div>
                <div className="text-primary font-medium mb-3" data-testid={`text-experience-company-${index}`}>
                  {experience.company}
                </div>
                <p className="text-muted-foreground" data-testid={`text-experience-description-${index}`}>
                  {experience.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
