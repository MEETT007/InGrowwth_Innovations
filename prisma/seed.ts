import { db } from '../src/lib/db';
import { projects, services, mockBlogPosts, mockJobs } from '../src/lib/mock-data';

const prisma = db;

async function main() {
  console.log('Start seeding...');

  // 1. Seed Services
  console.log('Seeding Services...');

  // Icon mapping for services since mock-data has React nodes
  const iconMap: Record<string, string> = {
    'web-development': 'Monitor',
    'mobile-apps': 'Smartphone',
    'cloud-devops': 'Cloud',
    'ai-ml': 'Cpu',
    cybersecurity: 'Shield',
    'erp-enterprise': 'Layers',
  };

  for (const s of services) {
    const existing = await prisma.service.findFirst({ where: { title: s.title } });
    if (!existing) {
      await prisma.service.create({
        data: {
          title: s.title,
          description: s.shortDesc,
          icon: iconMap[s.slug] || 'Code',
          content: s.longDesc,
        },
      });
    }
  }

  // 2. Seed Team Members (Hardcoded generic for now to support Author/Relations if needed later)
  const team = [
    {
      name: 'Sarah Jenkins',
      role: 'CEO & Founder',
      bio: 'Visionary leader with 10+ years in software engineering.',
      photo: '/avatars/01.png',
      email: 'sarah@example.com',
    },
    {
      name: 'David Chen',
      role: 'CTO',
      bio: 'Cloud architecture and scalable systems expert.',
      photo: '/avatars/02.png',
      email: 'david@example.com',
    },
  ];

  console.log('Seeding Team Members...');
  for (const t of team) {
    const existing = await prisma.teamMember.findFirst({ where: { name: t.name } });
    if (!existing) {
      await prisma.teamMember.create({ data: t });
    }
  }

  // 3. Seed Sample Blog Posts from legacy
  console.log('Seeding Blog Posts...');
  for (const b of mockBlogPosts) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: b.slug } });
    if (!existing) {
      await prisma.blogPost.create({
        data: {
          title: b.title,
          slug: b.slug,
          shortDescription: b.excerpt,
          category: b.category,
          status: 'Published',
          tags: 'Legacy, Tech', // default tag
          content: b.content,
          thumbnail: b.thumbnail,
          authorName: b.author.name,
          publishDate: new Date(b.publishDate),
        },
      });
    }
  }

  // 4. Seed Sample Portfolio Projects from legacy
  console.log('Seeding Portfolio Projects...');
  for (const p of projects) {
    const existing = await prisma.portfolioProject.findFirst({ where: { title: p.title } });
    if (!existing) {
      await prisma.portfolioProject.create({
        data: {
          title: p.title,
          client: 'InGrowwth Client', // fallback
          category: p.category,
          description: p.description,
          projectOverview: p.tagline,
          coverImage: p.coverImage,
          gallery: p.screenshots.map((s: { src: string }) => s.src).join(','),
          technologiesUsed: JSON.stringify(p.tech),
          features: JSON.stringify(p.functionality),
          projectStatus: 'Completed', // default for legacy
        },
      });
    }
  }

  // 5. Seed Jobs from legacy
  console.log('Seeding Jobs...');
  for (const j of mockJobs) {
    const existing = await prisma.job.findFirst({
      where: { title: j.title, department: j.department },
    });
    if (!existing) {
      await prisma.job.create({
        data: {
          title: j.title,
          department: j.department,
          location: j.location,
          type: j.type,
          description: j.description,
          requirements: JSON.stringify(j.requirements),
          status: 'OPEN',
        },
      });
    }
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
