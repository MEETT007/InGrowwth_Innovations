import { db as prisma } from '../src/lib/db';

const servicesData = [
  {
    title: 'Mobile App Development',
    slug: 'mobile-app-development',
    icon: 'Smartphone',
    description: 'We build high-performance, intuitive, and scalable mobile applications for iOS and Android platforms, tailored to elevate your user engagement and business growth.',
    content: 'Our mobile app development process goes beyond just writing code. We focus on creating immersive digital experiences that users love. Whether you need a native iOS app, a native Android app, or a cross-platform solution, our expert engineering team delivers products that are fast, secure, and visually stunning. We leverage modern frameworks to ensure your application can scale seamlessly as your user base grows.',
    features: [
      'Native iOS & Android Development',
      'Cross-Platform Solutions (React Native, Flutter)',
      'UI/UX Pro Max Design Principles',
      'App Store & Google Play Optimization',
      'Advanced API Integrations',
      'Performance Optimization & Testing'
    ],
    process: [
      { step: 'Discovery', details: 'Understanding your business goals, target audience, and feature requirements.' },
      { step: 'Prototyping', details: 'Creating wireframes and high-fidelity interactive prototypes for user testing.' },
      { step: 'Development', details: 'Writing clean, scalable code utilizing the latest mobile technologies.' },
      { step: 'Testing', details: 'Rigorous QA testing across multiple devices to ensure a flawless experience.' },
      { step: 'Launch', details: 'Deploying the app to stores and providing post-launch monitoring and support.' }
    ],
    techStack: ['Swift', 'Kotlin', 'React', 'Flutter', 'Firebase', 'GraphQL']
  },
  {
    title: 'Blockchain Solutions',
    slug: 'blockchain-solutions',
    icon: 'Layers',
    description: 'Empower your business with decentralized, transparent, and immutable blockchain architectures, from smart contracts to custom Web3 dApps.',
    content: 'Blockchain technology is revolutionizing how we handle trust, transactions, and data ownership. At InGrowwth Innovations, we architect robust blockchain solutions designed to eliminate intermediaries and secure your digital assets. We specialize in private ledgers, decentralized finance (DeFi) platforms, NFT marketplaces, and custom smart contract development. Our focus is on delivering secure, gas-efficient, and highly scalable Web3 infrastructure.',
    features: [
      'Custom Smart Contract Development',
      'Decentralized Application (dApp) Creation',
      'Private & Consortium Blockchain Networks',
      'Tokenomics & NFT Marketplace Development',
      'Comprehensive Smart Contract Auditing',
      'Wallet Integration & Web3 Onboarding'
    ],
    process: [
      { step: 'Strategy', details: 'Identifying the optimal blockchain architecture and consensus mechanism for your use case.' },
      { step: 'Architecture', details: 'Designing the network topology, smart contract logic, and tokenomics.' },
      { step: 'Development', details: 'Coding smart contracts and building the frontend Web3 integration.' },
      { step: 'Auditing', details: 'Executing rigorous security audits and testnet deployments to ensure safety.' },
      { step: 'Mainnet', details: 'Deploying to mainnet and handing over administrative keys securely.' }
    ],
    techStack: ['Solidity', 'Ethereum', 'Web3.js', 'Rust', 'Polygon', 'IPFS']
  },
  {
    title: 'Cybersecurity Services',
    slug: 'cybersecurity-services',
    icon: 'Shield',
    description: 'Protect your digital assets with enterprise-grade security protocols, comprehensive threat modeling, and proactive vulnerability management.',
    content: 'In an era of relentless cyber threats, perimeter defense is no longer enough. We employ a Zero Trust architecture approach to safeguard your sensitive data and infrastructure. Our cybersecurity services span from rigorous penetration testing and vulnerability assessments to 24/7 proactive threat monitoring. We ensure your business complies with international security standards while maintaining operational agility and resilience against zero-day exploits.',
    features: [
      'Advanced Penetration Testing',
      'Zero Trust Network Architecture',
      'Compliance & Risk Management (SOC2, GDPR)',
      'Incident Response & Forensics',
      'Cloud Security Posture Management (CSPM)',
      'Endpoint Detection and Response (EDR)'
    ],
    process: [
      { step: 'Assessment', details: 'Evaluating your current security posture and identifying critical vulnerabilities.' },
      { step: 'Hardening', details: 'Implementing robust access controls, encryption, and network defenses.' },
      { step: 'Monitoring', details: 'Deploying SIEM tools for real-time threat detection and analytics.' },
      { step: 'Testing', details: 'Simulating cyber-attacks to validate the effectiveness of security measures.' },
      { step: 'Optimization', details: 'Continuously refining security protocols to adapt to emerging threat vectors.' }
    ],
    techStack: ['Kali Linux', 'Splunk', 'CrowdStrike', 'Cloudflare', 'AWS', 'Datadog']
  },
  {
    title: 'ERP Solutions',
    slug: 'erp-solutions',
    icon: 'Briefcase',
    description: 'Streamline your business operations with powerful, customized ERP systems, specializing in comprehensive Odoo ERP implementations.',
    content: 'Enterprise Resource Planning (ERP) is the central nervous system of any scaling business. We specialize in deploying, customizing, and scaling Odoo ERP to unify your sales, operations, HR, and financial data into one intuitive dashboard. By eliminating data silos, we help you automate repetitive workflows, generate real-time business intelligence, and dramatically improve operational efficiency across all departments.',
    features: [
      'End-to-End Odoo ERP Implementation',
      'Custom Module Development & Workflows',
      'Data Migration from Legacy Systems',
      'Third-Party API Integrations',
      'Real-Time Analytics & Reporting Dashboards',
      'Comprehensive Staff Training & Support'
    ],
    process: [
      { step: 'Analysis', details: 'Mapping out your existing business processes and identifying bottlenecks.' },
      { step: 'Customization', details: 'Configuring Odoo modules and developing custom extensions to fit your needs.' },
      { step: 'Migration', details: 'Safely extracting, cleaning, and migrating data from your legacy systems.' },
      { step: 'Deployment', details: 'Rolling out the ERP system in a staging environment for User Acceptance Testing.' },
      { step: 'Go-Live', details: 'Executing a seamless cutover to production with 24/7 hypercare support.' }
    ],
    techStack: ['Odoo', 'Python', 'PostgreSQL', 'Docker', 'Linux', 'Nginx']
  },
  {
    title: 'EPM - Financial Solutions',
    slug: 'epm-financial-solutions',
    icon: 'BarChart3',
    description: 'Transform your financial planning and analysis with cutting-edge EPM solutions, specializing in OneStream and Oracle Hyperion.',
    content: 'Modern finance demands agility, precision, and foresight. Our Enterprise Performance Management (EPM) practice empowers CFOs and finance teams to transition from spreadsheet chaos to unified, cloud-based financial intelligence. Specializing in industry leaders like OneStream and Oracle Hyperion, we architect solutions for complex consolidations, dynamic forecasting, and strategic scenario modeling to drive profitable growth.',
    features: [
      'OneStream XF Implementation & Optimization',
      'Oracle Hyperion Financial Management (HFM)',
      'Complex Financial Consolidations',
      'Dynamic Budgeting & Rolling Forecasts',
      'Automated Account Reconciliations',
      'Executive KPI Dashboards'
    ],
    process: [
      { step: 'Blueprint', details: 'Defining financial data models, hierarchies, and consolidation rules.' },
      { step: 'Integration', details: 'Connecting the EPM platform directly to your ERP and GL systems.' },
      { step: 'Configuration', details: 'Building business rules, calculation scripts, and tailored reporting cubes.' },
      { step: 'Validation', details: 'Parallel testing against historical financial periods to ensure accuracy.' },
      { step: 'Adoption', details: 'Training the finance team to take full ownership of the unified platform.' }
    ],
    techStack: ['OneStream', 'Oracle', 'Microsoft SQL Server', 'Tableau', 'PowerBI', 'Azure']
  },
  {
    title: 'Artificial Intelligence & Machine Learning Solutions',
    slug: 'ai-ml-solutions',
    icon: 'BrainCircuit',
    description: 'Unlock unprecedented business value by integrating generative AI, predictive analytics, and custom machine learning models into your ecosystem.',
    content: 'Artificial Intelligence is no longer a buzzword; it is a competitive necessity. We help enterprises harness the power of machine learning and large language models (LLMs) to automate complex cognitive tasks, personalize customer experiences, and extract predictive insights from massive datasets. From custom chatbot deployments to sophisticated computer vision algorithms, our AI solutions are built to be ethical, scalable, and highly impactful.',
    features: [
      'Generative AI & LLM Integration (OpenAI, Anthropic)',
      'Predictive Analytics & Churn Modeling',
      'Natural Language Processing (NLP)',
      'Computer Vision & Image Recognition',
      'AI-Powered Chatbots & Virtual Assistants',
      'MLOps & Model Lifecycle Management'
    ],
    process: [
      { step: 'Ideation', details: 'Identifying high-impact use cases where AI can drive measurable ROI.' },
      { step: 'Data Prep', details: 'Aggregating, cleaning, and labeling datasets to train robust models.' },
      { step: 'Modeling', details: 'Selecting architectures and training machine learning algorithms.' },
      { step: 'Validation', details: 'Testing model accuracy, reducing bias, and ensuring ethical compliance.' },
      { step: 'Deployment', details: 'Serving the model via scalable APIs and establishing MLOps pipelines.' }
    ],
    techStack: ['Python', 'TensorFlow', 'PyTorch', 'OpenAI', 'HuggingFace', 'Docker']
  }
];

async function main() {
  console.log('Clearing existing services...');
  // We wipe the table to ensure ONLY the 6 requested services remain
  await prisma.service.deleteMany({});
  
  console.log('Seeding curated services...');
  for (const s of servicesData) {
    console.log(`Processing ${s.slug}...`);
    try {
      await prisma.service.create({
        data: s,
      });
      console.log(`Updated ${s.slug}`);
    } catch (error) {
      console.error(`Error with ${s.slug}:`, error);
    }
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
