import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

export default function About() {
  const skills = [
    { category: 'Frontend', technologies: 'React, Vue.js, TypeScript' },
    { category: 'Backend', technologies: 'Node.js, Python, PostgreSQL' },
    { category: 'ML/AI', technologies: 'TensorFlow, PyTorch, Scikit-learn' },
    { category: 'Cloud', technologies: 'AWS, Docker, Kubernetes' },
    { category: 'Research', technologies: 'Statistical Analysis, Data Mining' },
    { category: 'Tools', technologies: 'Git, VS Code, Jupyter' },
  ];

  const experiences = [
    {
      title: 'Senior Software Engineer',
      company: 'Tech Company Inc.',
      period: '2022 - Present',
      description: 'Leading development of scalable web applications and machine learning solutions. Collaborating with cross-functional teams to deliver high-impact features.',
    },
    {
      title: 'Research Associate',
      company: 'University Research Lab',
      period: '2020 - 2022',
      description: 'Conducted research in artificial intelligence and published papers in top-tier conferences. Mentored graduate students and collaborated on interdisciplinary projects.',
    },
    {
      title: 'Full Stack Developer',
      company: 'Startup Solutions',
      period: '2018 - 2020',
      description: 'Developed and maintained web applications using modern technologies. Worked in an agile environment to deliver features quickly and efficiently.',
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
            I'm a passionate developer and researcher with a keen interest in creating innovative solutions that bridge the gap between technology and human needs. My work spans across multiple disciplines, combining technical expertise with research methodologies to solve complex problems.
          </p>
          <p className="text-lg text-muted-foreground mb-6" data-testid="text-about-description-2">
            With a background in computer science and years of experience in both industry and academia, I've developed a unique perspective on how technology can be leveraged to create meaningful impact. I'm particularly interested in machine learning, web development, and user experience design.
          </p>
          <p className="text-lg text-muted-foreground" data-testid="text-about-description-3">
            When I'm not coding or researching, you can find me exploring new technologies, contributing to open source projects, or sharing knowledge through writing and speaking at conferences.
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
