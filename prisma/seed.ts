import { db } from '../src/lib/db';
const prisma = db;

async function main() {
  console.log('Start seeding...');

  // 1. Seed Services
  const services = [
    {
      title: 'Web Application Development',
      description: 'Custom React & Next.js web applications built for scale and performance.',
      icon: 'Monitor',
      body: 'Full-stack engineering from concept to deployment.',
    },
    {
      title: 'Mobile App Design',
      description: 'Native and cross-platform mobile apps for iOS and Android.',
      icon: 'Smartphone',
      body: 'React Native and Flutter experts.',
    },
    {
      title: 'Cloud Infrastructure & DevOps',
      description: 'AWS, Azure, and Vercel infrastructure setup and CI/CD pipelines.',
      icon: 'Cloud',
      body: 'Infrastructure as Code using Terraform and Docker.',
    },
  ];

  for (const s of services) {
    await prisma.service.create({ data: s });
  }

  // 2. Seed Team Members
  const team = [
    {
      name: 'Sarah Jenkins',
      role: 'CEO & Founder',
      bio: 'Visionary leader with 10+ years in software engineering.',
      photo: '/avatars/01.png',
    },
    {
      name: 'David Chen',
      role: 'CTO',
      bio: 'Cloud architecture and scalable systems expert.',
      photo: '/avatars/02.png',
    },
  ];

  for (const t of team) {
    await prisma.teamMember.create({ data: t });
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
