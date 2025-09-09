import { storage } from "./storage";

// Migration script to import existing static content into CMS
export async function migrateContent() {
  console.log("Starting content migration...");

  try {
    // Create Home page
    const homePage = await storage.createPage({
      slug: "home",
      title: "Home",
      metaDescription: "Portfolio homepage featuring introduction and overview"
    });

    // Home page content section
    const homeSection = await storage.createSection({
      pageId: homePage.id,
      type: "intro",
      title: null,
      order: 0
    });

    await storage.createElement({
      sectionId: homeSection.id,
      type: "paragraph",
      title: null,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      order: 0
    });

    // Create About page
    const aboutPage = await storage.createPage({
      slug: "about",
      title: "About Me",
      metaDescription: "Learn about my background, skills, and experience as a Platform Engineer"
    });

    // About hero section
    const aboutHeroSection = await storage.createSection({
      pageId: aboutPage.id,
      type: "hero",
      title: "About Me",
      order: 0
    });

    // About bio section
    const aboutBioSection = await storage.createSection({
      pageId: aboutPage.id,
      type: "bio",
      title: null,
      order: 1
    });

    // Bio paragraphs
    await storage.createElement({
      sectionId: aboutBioSection.id,
      type: "paragraph",
      title: null,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      order: 0
    });

    await storage.createElement({
      sectionId: aboutBioSection.id,
      type: "paragraph",
      title: null,
      content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      order: 1
    });

    await storage.createElement({
      sectionId: aboutBioSection.id,
      type: "paragraph",
      title: null,
      content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
      order: 2
    });

    // Skills section
    const aboutSkillsSection = await storage.createSection({
      pageId: aboutPage.id,
      type: "skills",
      title: "Skills & Technologies",
      order: 2
    });

    // Skills cards
    const skills = [
      { category: 'Skill 1', technologies: 'Lorem ipsum, dolor sit, amet consectetur' },
      { category: 'Skill 2', technologies: 'Adipiscing elit, sed do, eiusmod tempor' },
      { category: 'Skill 3', technologies: 'Incididunt ut, labore et, dolore magna' },
      { category: 'Skill 4', technologies: 'Aliqua ut enim, ad minim, veniam quis' },
      { category: 'Skill 5', technologies: 'Nostrud exercitation, ullamco laboris, nisi ut' },
      { category: 'Skill 6', technologies: 'Aliquip ex ea, commodo consequat, duis aute' },
    ];

    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i];
      await storage.createElement({
        sectionId: aboutSkillsSection.id,
        type: "skill_card",
        title: skill.category,
        content: skill.technologies,
        order: i
      });
    }

    // Experience section
    const aboutExperienceSection = await storage.createSection({
      pageId: aboutPage.id,
      type: "experience",
      title: "Experience",
      order: 3
    });

    // Experience entries
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

    for (let i = 0; i < experiences.length; i++) {
      const exp = experiences[i];
      await storage.createElement({
        sectionId: aboutExperienceSection.id,
        type: "experience_entry",
        title: exp.title,
        content: exp.description,
        metadata: {
          company: exp.company,
          period: exp.period
        },
        order: i
      });
    }

    // Create Projects page
    const projectsPage = await storage.createPage({
      slug: "projects",
      title: "Projects",
      metaDescription: "Featured projects and portfolio showcasing my technical expertise"
    });

    // Projects hero section
    const projectsHeroSection = await storage.createSection({
      pageId: projectsPage.id,
      type: "hero",
      title: "Featured Projects",
      order: 0
    });

    // Featured projects section
    const featuredProjectsSection = await storage.createSection({
      pageId: projectsPage.id,
      type: "projects",
      title: null,
      order: 1
    });

    // Featured projects
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

    for (let i = 0; i < featuredProjects.length; i++) {
      const project = featuredProjects[i];
      await storage.createElement({
        sectionId: featuredProjectsSection.id,
        type: "project_card",
        title: project.title,
        content: project.description,
        metadata: {
          technologies: project.technologies,
          links: project.links,
          isFeatured: true
        },
        order: i
      });
    }

    // Other projects section
    const otherProjectsSection = await storage.createSection({
      pageId: projectsPage.id,
      type: "projects_other",
      title: "Other Notable Projects",
      order: 2
    });

    // Other projects
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

    for (let i = 0; i < otherProjects.length; i++) {
      const project = otherProjects[i];
      await storage.createElement({
        sectionId: otherProjectsSection.id,
        type: "project_card",
        title: project.title,
        content: project.description,
        metadata: {
          technologies: project.technologies,
          isFeatured: false
        },
        order: i
      });
    }

    // Create Research page
    const researchPage = await storage.createPage({
      slug: "research",
      title: "Research",
      metaDescription: "Research interests, publications, and ongoing projects in platform engineering and technology"
    });

    // Research hero section
    const researchHeroSection = await storage.createSection({
      pageId: researchPage.id,
      type: "hero",
      title: "Research",
      order: 0
    });

    // Research interests section
    const researchInterestsSection = await storage.createSection({
      pageId: researchPage.id,
      type: "research_interests",
      title: "Current Research Interests",
      order: 1
    });

    // Research interests
    const researchInterests = [
      {
        title: 'Platform Engineering',
        description: 'Exploring infrastructure automation, developer experience optimization, and scalable system architectures for modern software development workflows.',
      },
      {
        title: 'Cloud Native Technologies',
        description: 'Research in containerization, microservices architectures, and distributed systems for improved scalability and reliability.',
      },
      {
        title: 'Developer Tooling',
        description: 'Investigating tools and processes that enhance developer productivity, code quality, and collaborative software development.',
      },
      {
        title: 'System Performance',
        description: 'Analysis of system optimization techniques, performance monitoring, and capacity planning for large-scale applications.',
      },
    ];

    for (let i = 0; i < researchInterests.length; i++) {
      const interest = researchInterests[i];
      await storage.createElement({
        sectionId: researchInterestsSection.id,
        type: "research_interest",
        title: interest.title,
        content: interest.description,
        order: i
      });
    }

    // Publications section
    const publicationsSection = await storage.createSection({
      pageId: researchPage.id,
      type: "publications",
      title: "Recent Publications",
      order: 2
    });

    // Publications
    const publications = [
      {
        title: 'Platform Engineering Best Practices: A Modern Approach to Developer Experience',
        authors: 'David Rosenfeld, et al. (2024)',
        venue: 'Journal of Software Engineering Practices',
        doiUrl: 'https://doi.org/10.1000/j.swe.2024.01.001',
        citation: 'Rosenfeld, D., Smith, J., & Johnson, M. (2024). Platform Engineering Best Practices: A Modern Approach to Developer Experience. Journal of Software Engineering Practices, 45(3), 123-145. doi:10.1000/j.swe.2024.01.001',
      },
      {
        title: 'Scalable Infrastructure Patterns: Lessons from Cloud Native Implementations',
        authors: 'D. Rosenfeld, Engineering Team (2023)',
        venue: 'International Conference on Cloud Computing',
        doiUrl: 'https://doi.org/10.1000/icc.2023.02.042',
        citation: 'Rosenfeld, D., Anderson, K., Lee, S., & Engineering Team (2023). Scalable Infrastructure Patterns: Lessons from Cloud Native Implementations. In Proceedings of the International Conference on Cloud Computing (pp. 287-302). IEEE. doi:10.1000/icc.2023.02.042',
      },
      {
        title: 'Developer Productivity Metrics: Measuring Impact in Modern Development Workflows',
        authors: 'Rosenfeld, D., Research Collaborators (2023)',
        venue: 'Software Development Research Symposium',
        doiUrl: 'https://doi.org/10.1000/sdrs.2023.03.018',
        citation: 'Rosenfeld, D., Wang, L., & Research Collaborators (2023). Developer Productivity Metrics: Measuring Impact in Modern Development Workflows. Software Development Research Symposium, 12(4), 67-89. doi:10.1000/sdrs.2023.03.018',
      },
    ];

    for (let i = 0; i < publications.length; i++) {
      const publication = publications[i];
      await storage.createElement({
        sectionId: publicationsSection.id,
        type: "publication",
        title: publication.title,
        content: null,
        metadata: {
          authors: publication.authors,
          venue: publication.venue,
          doiUrl: publication.doiUrl,
          citation: publication.citation
        },
        order: i
      });
    }

    // Ongoing projects section
    const ongoingProjectsSection = await storage.createSection({
      pageId: researchPage.id,
      type: "ongoing_projects",
      title: "Ongoing Research Projects",
      order: 3
    });

    // Ongoing projects
    const ongoingProjects = [
      {
        title: 'Infrastructure Automation Framework',
        description: 'Developing a comprehensive framework for automated infrastructure provisioning and management across multi-cloud environments with focus on developer experience.',
        status: 'Ongoing',
        tags: ['DevOps', 'Infrastructure', 'Automation', 'Cloud'],
      },
      {
        title: 'Developer Experience Metrics',
        description: 'Research into quantifiable metrics for measuring and improving developer experience, productivity, and satisfaction in modern software development teams.',
        status: 'In Review',
        tags: ['Developer Experience', 'Metrics', 'Productivity', 'Research'],
      },
    ];

    for (let i = 0; i < ongoingProjects.length; i++) {
      const project = ongoingProjects[i];
      await storage.createElement({
        sectionId: ongoingProjectsSection.id,
        type: "research_project",
        title: project.title,
        content: project.description,
        metadata: {
          status: project.status,
          tags: project.tags
        },
        order: i
      });
    }

    // Create default site settings for social media links
    await storage.createSetting({
      key: 'social_github_url',
      value: 'https://github.com',
      description: 'GitHub profile URL'
    });

    await storage.createSetting({
      key: 'social_linkedin_url',
      value: 'https://linkedin.com/in/username',
      description: 'LinkedIn profile URL'
    });

    await storage.createSetting({
      key: 'social_x_url',
      value: 'https://x.com/username',
      description: 'X (Twitter) profile URL'
    });

    console.log("Content migration completed successfully!");
    console.log(`Created ${await (await storage.getAllPages()).length} pages`);
    console.log(`Created ${await (await storage.getAllSettings()).length} settings`);

  } catch (error) {
    console.error("Content migration failed:", error);
    throw error;
  }
}

// This function can be called from routes or directly