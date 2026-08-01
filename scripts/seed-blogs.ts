import { db as prisma } from '../src/lib/db';

async function main() {
  console.log('Clearing existing blog posts...');
  await prisma.blogPost.deleteMany();

  const blogs = [
    {
      title: 'The Dawn of Superintelligence: Beyond Human Constraints',
      slug: 'dawn-of-superintelligence',
      shortDescription: 'Artificial Intelligence is rapidly evolving from highly specialized tools to generalized systems capable of reasoning across domains.',
      category: 'Artificial Intelligence',
      status: 'Published' as const,
      tags: 'AI, Machine Learning, Future Tech, AGI',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
      seoTitle: 'The Dawn of Superintelligence | InGrowwth',
      seoDescription: 'Explore how artificial intelligence is evolving into AGI and what it means for the future.',
      readTime: 6,
      authorName: 'InGrowwth AI Lab',
      publishDate: new Date(),
      content: `
## The Next Frontier

Artificial Intelligence (AI) is no longer just a buzzword; it is rapidly approaching a threshold that experts call Artificial General Intelligence (AGI). Unlike narrow AI, which excels at specific tasks like chess or language generation, AGI will possess the cognitive flexibility to understand, learn, and apply knowledge across an infinite array of domains.

### Why This Matters Now
The rapid acceleration in compute power, combined with novel neural architectures, has slashed the timeline for AGI. We are seeing models that don't just predict text—they reason, write code, and synthesize complex biological structures.

### The Corporate Imperative
For businesses, the question is no longer *if* AI will disrupt their industry, but *when* and *how fast*. Companies that fail to integrate AI fundamentally into their operations will not just fall behind; they will become structurally obsolete within a decade.
      `,
    },
    {
      title: 'The Future of App Development: Generative Code & Hyper-Personalization',
      slug: 'future-of-app-development-ai',
      shortDescription: 'How AI is rewriting the rules of software engineering and native application development.',
      category: 'App Development',
      status: 'Published' as const,
      tags: 'Software Engineering, App Dev, React Native, AI',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
      seoTitle: 'The Future of App Development | InGrowwth',
      seoDescription: 'Discover how AI is shaping the future of app development.',
      readTime: 5,
      authorName: 'Engineering Team',
      publishDate: new Date(),
      content: `
## AI as the Co-Pilot

The days of writing boilerplate code are ending. The future of app development is highly symbiotic: human engineers architecting the vision, while AI co-pilots execute the implementation.

### Generative UI
Imagine an app that doesn't just adapt to dark mode, but completely restructures its UI based on the user's cognitive preferences, generated in real-time by an AI engine. This is the future we are building towards. 

### The Shift in Engineering Skills
As AI takes over syntax and boilerplate, the value of a software engineer shifts heavily towards **systems design**, **security**, and **product intuition**. The future developer is an orchestrator of intelligent agents.
      `,
    },
    {
      title: 'EPM Financial Solutions: Drastic Changes Due to AI in Finance',
      slug: 'epm-financial-solutions-ai-changes',
      shortDescription: 'Enterprise Performance Management is undergoing a radical transformation as AI introduces predictive forecasting and automated reconciliation.',
      category: 'Finance & ERP',
      status: 'Published' as const,
      tags: 'EPM, Finance, OneStream, AI Forecasting',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
      seoTitle: 'AI in EPM Financial Solutions | InGrowwth',
      seoDescription: 'How AI is drastically changing EPM Financial Solutions like OneStream.',
      readTime: 7,
      authorName: 'Finance Tech Division',
      publishDate: new Date(),
      content: `
## The End of Manual Forecasting

Enterprise Performance Management (EPM) systems like OneStream and Hyperion have long been the backbone of corporate finance. However, they have traditionally relied on historical data and manual human forecasting. AI is violently disrupting this.

### Drastic Changes to Financial Planning
By integrating machine learning algorithms directly into EPM data lakes, finance teams can now generate highly accurate, variance-adjusted forecasts in milliseconds. AI can factor in external variables—geopolitical events, weather patterns, and real-time supply chain disruptions—that human analysts simply cannot process at scale.

### The Autonomous Close
The financial close process, which typically takes weeks of grueling manual reconciliation, is being reduced to days (and soon, hours) through autonomous AI agents that can cross-reference millions of ledger entries and intelligently resolve discrepancies.
      `,
    },
    {
      title: 'The Tech Industry Goes Bigger Post-AI (Despite the Naysayers)',
      slug: 'tech-industry-bigger-post-ai',
      shortDescription: 'Despite fears of AI downgrading the tech job market, the industry is actually expanding into a massive new golden age.',
      category: 'Industry Trends',
      status: 'Published' as const,
      tags: 'Tech Jobs, AI Economics, Future of Work',
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
      seoTitle: 'Tech Industry Boom Post AI | InGrowwth',
      seoDescription: 'Why the tech industry is growing bigger than ever because of AI.',
      readTime: 8,
      authorName: 'InGrowwth Insights',
      publishDate: new Date(),
      content: `
## The Myth of the Shrinking Tech Sector

A persistent narrative claims that AI will "downgrade" the tech industry, automating engineers and designers out of existence and shrinking the market. The reality is exactly the opposite: we are entering the biggest tech boom in human history.

### The Jevons Paradox in Software
When a resource becomes cheaper to produce, demand for it skyrockets. AI drastically lowers the cost of producing software. As a result, the demand for software is exploding. Every single physical industry—agriculture, construction, mining—can now afford bespoke, highly intelligent software solutions.

### The New Giants
We will see billion-dollar companies run by three people. But we will also see ten-thousand-person companies tackling engineering challenges previously thought impossible, like mapping the human connectome or building Dyson swarms. The pie isn't shrinking; it's going galactic.
      `,
    },
    {
      title: 'Blockchain: The Unhackable Realm Where AI Intervention Fails',
      slug: 'blockchain-ai-intervention-fails',
      shortDescription: 'Why cryptographic blockchains remain the ultimate safeguard against AI-driven manipulation and deepfakes.',
      category: 'Blockchain',
      status: 'Published' as const,
      tags: 'Blockchain, Web3, Cybersecurity, Deepfakes',
      thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f4ec651?auto=format&fit=crop&q=80&w=800',
      seoTitle: 'Blockchain: The Defense Against AI | InGrowwth',
      seoDescription: 'How blockchain provides cryptographic truth in an era of AI deepfakes.',
      readTime: 6,
      authorName: 'Web3 & Crypto Lab',
      publishDate: new Date(),
      content: `
## The Crisis of Truth

As AI models become capable of generating photorealistic video, flawless voice clones, and indistinguishable fake documents, human society faces a severe epistemological crisis: *How do we know what is real?*

### The Cryptographic Anchor
Blockchain technology provides the exact mathematical antidote to AI-driven falsehoods. While AI can manipulate pixels and waveforms, it cannot break SHA-256 encryption or forge a cryptographic signature. 

### Where AI Fails
AI intervention is fundamentally powerless against decentralized consensus mechanisms. In a future where an AI can spoof a CEO's voice on a phone call to authorize a wire transfer, only a blockchain-based multi-signature wallet can objectively verify human intent. Blockchain is no longer just about finance; it is the fundamental infrastructure for **truth** in the AI era.
      `,
    }
  ];

  for (const blog of blogs) {
    await prisma.blogPost.create({
      data: blog
    });
    console.log(`Seeded blog: ${blog.title}`);
  }

  console.log('Successfully seeded all blogs!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
