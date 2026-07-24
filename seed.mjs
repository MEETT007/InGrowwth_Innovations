import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MOCK_JOBS = [
  {
    title: 'Senior Frontend Engineer (React)',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description:
      'We are looking for a Senior Frontend Engineer to lead the development of our core web applications using React, Next.js, and Tailwind CSS.',
    requirements: JSON.stringify([
      '5+ years of experience with React and modern web technologies.',
      'Strong understanding of Next.js App Router and Server Components.',
      'Experience with state management and performance optimization.',
      'A keen eye for design and UI/UX best practices.',
    ]),
  },
  {
    title: 'Backend Engineer (Node.js)',
    department: 'Engineering',
    location: 'New York, NY / Hybrid',
    type: 'Full-time',
    description:
      'Join our backend team to build scalable APIs and microservices using Node.js, Express, and PostgreSQL.',
    requirements: JSON.stringify([
      '3+ years of backend development experience.',
      'Proficiency in Node.js and TypeScript.',
      'Experience with SQL databases, particularly PostgreSQL and Prisma ORM.',
      'Familiarity with AWS or cloud deployment architectures.',
    ]),
  },
  {
    title: 'Senior Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    description:
      'Shape the future of our product interfaces. We need a visionary designer who can translate complex requirements into beautiful, intuitive experiences.',
    requirements: JSON.stringify([
      'Portfolio demonstrating exceptional UI/UX design skills.',
      'Experience with Figma and design systems.',
      'Ability to prototype and communicate interaction design.',
      'Understanding of frontend capabilities and constraints.',
    ]),
  },
  {
    title: 'Growth Marketing Manager',
    department: 'Marketing',
    location: 'London, UK / Remote',
    type: 'Full-time',
    description:
      'Lead our growth initiatives across multiple channels to drive acquisition, activation, and retention.',
    requirements: JSON.stringify([
      'Proven track record in B2B SaaS growth marketing.',
      'Data-driven approach to experiments and A/B testing.',
      'Experience with SEO, SEM, and content strategy.',
      'Strong analytical skills using tools like Google Analytics or Mixpanel.',
    ]),
  },
];

const team = [
  {
    name: 'Meet Trivedi',
    role: 'Founder & CEO',
    bio: 'Leading business strategy, client operations, and overall growth to deliver high-impact enterprise solutions.',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Darshan Dalwadi',
    role: 'Co-Founder & CTO',
    bio: 'Lead architect driving technical strategy, cloud infrastructure design, and custom software systems. Passionate about Next.js performance and distributed databases.',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Saurav Patel',
    role: 'Co-Founder & COO',
    bio: 'Directing daily business operations, project execution, quality assurance, and developer relations to ensure seamless project delivery.',
    linkedin: 'https://linkedin.com',
  },
];

async function main() {
  console.log('Seeding jobs...');
  for (const job of MOCK_JOBS) {
    await prisma.job.create({ data: job });
  }

  console.log('Seeding team members...');
  for (const member of team) {
    await prisma.teamMember.create({ data: member });
  }

  console.log('Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
