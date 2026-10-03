import { db } from '../src/lib/db';

async function seedDemoData() {
  console.log('🚀 Seeding comprehensive demo data into Remote Development Neon Database...');

  // 1. SERVICES
  console.log('📦 Seeding Services...');
  const servicesData = [
    {
      slug: 'ai-machine-learning',
      title: 'AI & Machine Learning',
      description: 'End-to-end intelligent systems, custom LLM fine-tuning, RAG pipelines, and predictive computer vision architectures built to scale enterprise workflows.',
      icon: 'Cpu',
      content: `### Transforming Enterprises Through Autonomous Intelligence

At InGrowwth Innovations, we architect bespoke machine learning systems that convert unstructured organizational data into competitive market advantage. From real-time predictive analytics to self-healing agentic workflows, our engineers build scalable pipelines that integrate seamlessly with your core infrastructure.

#### Enterprise Machine Learning Capabilities:
- **Retrieval-Augmented Generation (RAG):** Ultra-low-latency semantic retrieval with hybrid dense/sparse vector indexing.
- **Computer Vision & Video Analytics:** High-precision defect detection, spatial intelligence, and automated document OCR.
- **Predictive Time-Series Intelligence:** High-frequency demand forecasting, anomaly detection, and algorithmic resource allocation.
- **Edge Model Optimization:** Quantized neural models deployable on resource-constrained embedded systems and mobile chips.`,
      features: [
        'Custom LLM Fine-Tuning & Model Distillation',
        'Hybrid Semantic RAG & Vector Knowledge Repositories',
        'Autonomous Multi-Agent Orchestration & Workflow Routing',
        'Real-Time Anomaly Detection & Predictive Analytics Engine',
        'Secure On-Premises & Private VPC LLM Deployment',
      ],
      process: [
        { step: '01', title: 'Data Audit & Feasibility', description: 'Evaluate schema health, labeling density, and algorithmic viability for targeted ROI.' },
        { step: '02', title: 'Architecture Blueprint', description: 'Design inference latency budgets, embedding pipelines, and hardware topology.' },
        { step: '03', title: 'Iterative Model Training', description: 'Train, benchmark, and hyper-tune models against rigorous validation loss baselines.' },
        { step: '04', title: 'Production Hardening', description: 'Deploy redundant inference endpoints behind global caching and autoscaling clusters.' },
      ],
      techStack: ['Python', 'PyTorch', 'TensorFlow', 'HuggingFace', 'FastAPI', 'Qdrant', 'Docker', 'Kubernetes'],
    },
    {
      slug: 'cloud-devops-solutions',
      title: 'Cloud & DevOps Solutions',
      description: 'Zero-downtime microservices infrastructure, Infrastructure as Code, Kubernetes orchestration, and SOC-2 compliant multi-cloud pipelines.',
      icon: 'Cloud',
      content: `### Resilient, Multi-Region Infrastructure Engineered for Maximum Uptime

Modern enterprises cannot afford single points of failure. InGrowwth Innovations architects resilient, self-healing cloud topologies across AWS, Google Cloud, and Azure, leveraging modern GitOps paradigms and Infrastructure as Code.

#### Cloud & DevOps Solutions We Deliver:
- **Kubernetes Cluster Management:** Enterprise-grade EKS/GKE cluster configurations with automated autoscaling and service mesh security.
- **GitOps CI/CD Pipelines:** Declarative deployment pipelines with automated rollback, canary analysis, and dynamic preview environments.
- **Cloud Cost Optimization (FinOps):** Deep workload audits to eliminate cloud waste, yielding average infrastructure bill reductions of 35-50%.
- **Zero-Trust Security & Compliance:** Granular IAM enforcement, secret rotation, and automated vulnerability scanning at every build step.`,
      features: [
        'Declarative Terraform & OpenTofu Infrastructure as Code',
        'Multi-Region Active-Active High Availability Topologies',
        'Automated CI/CD Delivery with Canary & Blue/Green Deployments',
        'Comprehensive Prometheus, Grafana & Datadog Observability',
        'Automated Backup, Disaster Recovery & Chaos Engineering Tests',
      ],
      process: [
        { step: '01', title: 'Infrastructure Telemetry Scan', description: 'Analyze existing server footprints, latency bottlenecks, and spending efficiency.' },
        { step: '02', title: 'IaC Modular Design', description: 'Formulate immutable Terraform infrastructure definitions with isolated state locks.' },
        { step: '03', title: 'Automated Pipeline Build', description: 'Implement automated testing, security linting, and multi-stage container builds.' },
        { step: '04', title: 'Zero-Downtime Cutover', description: 'Execute zero-downtime DNS traffic shifts with real-time error budget monitoring.' },
      ],
      techStack: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'GitHub Actions', 'PostgreSQL', 'Redis', 'Prometheus'],
    },
    {
      slug: 'web-development',
      title: 'Web Development',
      description: 'Mission-critical web applications with sub-second page loads, accessible responsive interfaces, and robust serverless backend integrations.',
      icon: 'Monitor',
      content: `### High-Performance Web Applications Built with Modern Frameworks

We engineer web applications that combine aesthetic elegance with uncompromised engineering rigor. Utilizing Next.js 16, React 19, TypeScript, and modern edge runtimes, our solutions achieve perfect Core Web Vitals and drive conversion velocity.

#### Full-Stack Web Development Specialties:
- **Enterprise SaaS Portals:** Multi-tenant SaaS architectures with role-based access control, stripe billing, and real-time collaboration.
- **Ultra-Fast E-Commerce Platforms:** Headless commerce engines supporting thousands of concurrent checkouts with zero slowdowns.
- **Dynamic Data Visualization Dashboards:** Interactive WebGL and SVG analytical dashboards rendering millions of telemetry points smoothly.
- **Progressive Web Apps (PWAs):** Offline-first web applications delivering native-grade responsiveness across all desktop and mobile browsers.`,
      features: [
        'Next.js 16 App Router with Server-Side Rendering (SSR) & Streaming',
        'Strict Type-Safe Architecture with TypeScript & Zod Schema Validation',
        'Ultra-Responsive Fluid UI Designed with Curated Glassmorphic Tokens',
        'Enterprise State Management with Optimistic UI & WebSockets',
        'Full Accessibility (WCAG 2.1 AA) & SEO Optimization',
      ],
      process: [
        { step: '01', title: 'Product Architecture', description: 'Define user flows, entity-relationship diagrams, and API contract specifications.' },
        { step: '02', title: 'Interactive Prototyping', description: 'Build component design systems and test responsive layouts with motion prototypes.' },
        { step: '03', title: 'Full-Stack Implementation', description: 'Develop type-safe API routes, secure database models, and resilient frontend views.' },
        { step: '04', title: 'Performance Optimization', description: 'Audit Core Web Vitals (LCP, INP, CLS) and deploy behind global CDN caching.' },
      ],
      techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Prisma', 'PostgreSQL', 'Framer Motion'],
    },
    {
      slug: 'mobile-app-development',
      title: 'Mobile App Development',
      description: 'Fluid cross-platform and native mobile applications for iOS and Android with offline-first synchronization and real-time biometric security.',
      icon: 'Smartphone',
      content: `### Seamless Mobile Experiences Engineered for Global App Stores

Our mobile engineering team develops cross-platform and native mobile apps that delight millions of users. By combining Flutter and native Swift/Kotlin modules, we build applications that deliver 60 FPS performance, low battery footprint, and offline persistence.`,
      features: [
        'Cross-Platform Codebase Sharing with Flutter & React Native',
        'Native Hardware Integration (Biometrics, Camera, Accelerometer, BLE)',
        'Local SQLite & WatermelonDB Offline-First Synchronization',
        'Automated App Store Review & Fastlane Distribution Pipelines',
      ],
      process: [
        { step: '01', title: 'UX Flow Design', description: 'Design tactile mobile interfaces adhering to Apple Human Interface & Material 3 rules.' },
        { step: '02', title: 'Core Logic & Local DB', description: 'Implement offline-first repositories and state management architectures.' },
        { step: '03', title: 'Device Testing', description: 'Execute comprehensive automated tests across real physical iOS and Android devices.' },
        { step: '04', title: 'App Store Submission', description: 'Publish to Apple App Store and Google Play with complete compliance checklists.' },
      ],
      techStack: ['Flutter', 'Dart', 'Swift', 'Kotlin', 'Firebase', 'SQLite'],
    },
    {
      slug: 'erp-enterprise-software',
      title: 'ERP & Enterprise Software',
      description: 'Custom modular ERPs, CRM platforms, supply chain managers, and automated financial accounting systems tailored to unique business processes.',
      icon: 'Layers',
      content: `### Unified Enterprise Systems to Orchestrate Global Operations

Eliminate disjointed software silos with unified ERP platforms designed around your exact workflows. We integrate inventory tracking, human resource management, automated invoicing, and executive reporting into a cohesive single source of truth.`,
      features: [
        'Custom Modular ERP Architecture Tailored to Exact Business Workflows',
        'Automated Invoicing, Taxation & Multi-Currency Ledger Support',
        'Real-Time Warehouse Inventory & Predictive Supply Chain Tracking',
        'Complete RBAC Security with Audited Change Logging for Compliance',
      ],
      process: [
        { step: '01', title: 'Process Mapping', description: 'Interview departmental stakeholders to chart every operational touchpoint.' },
        { step: '02', title: 'Modular Architecture', description: 'Design decoupled micro-services for inventory, billing, HR, and analytics.' },
        { step: '03', title: 'Data Migration', description: 'Safely extract, transform, and validate historical records from legacy software.' },
        { step: '04', title: 'Staff Onboarding', description: 'Deploy role-specific training dashboards and execute seamless operational cutover.' },
      ],
      techStack: ['Odoo', 'Python', 'PostgreSQL', 'Docker', 'React', 'TypeScript'],
    },
    {
      slug: 'cybersecurity',
      title: 'Cybersecurity',
      description: 'Continuous penetration testing, threat hunting, infrastructure hardening, and automated SOC monitoring to protect mission-critical IP.',
      icon: 'Shield',
      content: `### Proactive Defensive Engineering Against Sophisticated Threat Vectors

Security is never an afterthought. We implement multi-layered defense architectures that safeguard customer data, prevent zero-day privilege escalations, and satisfy SOC-2, ISO 27001, and HIPAA compliance mandates.`,
      features: [
        'Automated SAST & DAST Scanning in CI/CD Delivery Pipelines',
        'Penetration Testing & Red-Teaming for Web, Mobile, and API Surfaces',
        'Zero-Trust Network Architecture with Mutual TLS & Granular IAM',
        'Automated Incident Response & Real-Time SIEM Event Logging',
      ],
      process: [
        { step: '01', title: 'Vulnerability Assessment', description: 'Scan all perimeter IPs, public APIs, and third-party dependencies for known CVEs.' },
        { step: '02', title: 'Hardening & Remediation', description: 'Patch attack surfaces, enforce least-privilege IAM, and rotate cryptographic keys.' },
        { step: '03', title: 'Red-Team Simulation', description: 'Simulate adversarial intrusion attempts to validate defensive safeguards.' },
        { step: '04', title: 'Compliance Sign-off', description: 'Deliver comprehensive audit reports with verified remediation proof for regulators.' },
      ],
      techStack: ['Kali Linux', 'Wireshark', 'Splunk', 'Docker', 'Python', 'AWS'],
    },
    {
      slug: 'onestream-epm',
      title: 'OneStream EPM',
      description: 'Corporate financial consolidation, automated budgeting, rolling forecasting, and executive reporting solutions on the OneStream platform.',
      icon: 'Briefcase',
      content: `### Unified Financial Intelligence for Global CFO Offices

Streamline complex multi-entity financial consolidation and rolling forecasting. InGrowwth Innovations implements customized OneStream software solutions that compress closing cycles from weeks to hours.`,
      features: [
        'Multi-Entity Currency Translation & Intercompany Elimination Rules',
        'Dynamic Rolling Forecasts with Integrated Scenario Modeling',
        'Direct Integration with SAP, Oracle, NetSuite, and Custom Data Warehouses',
        'Automated Statutory Reporting & Board-Ready Financial Dashboards',
      ],
      process: [
        { step: '01', title: 'Chart of Accounts Audit', description: 'Normalize disparate subsidiary financial ledgers and consolidation rules.' },
        { step: '02', title: 'Model Configuration', description: 'Build cube schemas, workflow profiles, and automated calculation logic.' },
        { step: '03', title: 'Parallel Close Testing', description: 'Run test cycles alongside legacy systems to verify ledger parity to the cent.' },
        { step: '04', title: 'Executive Go-Live', description: 'Transition finance teams with tailored training and live closing support.' },
      ],
      techStack: ['PostgreSQL', 'React', 'TypeScript', 'Node.js', 'AWS'],
    },
  ];

  for (const s of servicesData) {
    const existing = await db.service.findFirst({ where: { slug: s.slug } });
    if (existing) {
      await db.service.update({
        where: { id: existing.id },
        data: s,
      });
    } else {
      await db.service.create({ data: s });
    }
  }

  // 2. TEAM MEMBERS
  console.log('👥 Seeding Team Members...');
  const teamMembers = [
    {
      name: 'Meet Trivedi',
      role: 'CEO & Founder',
      bio: 'Visionary technologist and founder leading InGrowwth Innovations. Passionate about empowering enterprises with cutting-edge AI architectures, mission-critical cloud software, and world-class digital engineering.',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
      email: 'meet@ingrowwthinnovations.com',
      linkedin: 'https://linkedin.com/in/meettrivedi',
      twitter: 'https://twitter.com/meettrivedi',
      github: 'https://github.com/meettrivedi',
    },
    {
      name: 'Saurav Patel',
      role: 'Chief Technology Officer (CTO)',
      bio: 'Veteran systems architect specializing in high-throughput distributed systems, Kubernetes infrastructure, and enterprise AI model fine-tuning.',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
      email: 'saurav@ingrowwthinnovations.com',
      linkedin: 'https://linkedin.com/in/sauravpatel',
      twitter: 'https://twitter.com/sauravpatel',
      github: 'https://github.com/sauravpatel',
    },
    {
      name: 'Elena Rostova',
      role: 'Head of AI & Intelligent Systems',
      bio: 'Former research scientist with deep expertise in transformer model distillation, semantic retrieval systems, and autonomous agent orchestration.',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
      email: 'elena@ingrowwthinnovations.com',
      linkedin: 'https://linkedin.com/in/elenarostova',
      twitter: 'https://twitter.com/elenarostova',
      github: 'https://github.com/elenarostova',
    },
    {
      name: 'Marcus Vance',
      role: 'VP of Enterprise Solutions',
      bio: '15+ years delivering multi-million dollar digital transformations, ERP modernization, and financial systems for Fortune 500 organizations.',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
      email: 'marcus@ingrowwthinnovations.com',
      linkedin: 'https://linkedin.com/in/marcusvance',
      twitter: 'https://twitter.com/marcusvance',
      github: 'https://github.com/marcusvance',
    },
  ];

  for (const t of teamMembers) {
    const existing = await db.teamMember.findFirst({ where: { name: t.name } });
    if (existing) {
      await db.teamMember.update({
        where: { id: existing.id },
        data: t,
      });
    } else {
      await db.teamMember.create({ data: t });
    }
  }

  // 3. CASE STUDIES
  console.log('📑 Seeding Enterprise Case Studies...');
  const caseStudiesData = [
    {
      slug: 'fintech-core-banking-transformation',
      title: 'Autonomous FinTech Core Banking Migration & High-Throughput Settlement',
      clientName: 'Aura Global Capital',
      industry: 'FinTech & Capital Markets',
      coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200',
      heroBanner: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1600',
      problemStatement: 'Aura Global Capital handled over $4.2B in daily cross-border remittances but was constrained by a monolithic 14-year-old COBOL and Oracle core banking architecture that suffered from daily settlement latency spikes, high database lock contention, and an annual downtime cost exceeding $2.4M.',
      businessChallenges: 'Legacy mainframe architecture with 8-second transaction settlement latency; inability to comply with new ISO 20022 real-time settlement mandates; severe batch reconciliation bottleneck during market close.',
      objectives: 'Migrate to a distributed event-driven microservices architecture; achieve sub-100ms settlement confirmation; guarantee zero transaction loss with strict ACID compliance across distributed ledgers.',
      research: 'Conducted rigorous load simulations testing 85,000 transactions per second under network partition scenarios. Benchmarked Raft-based consensus ledgers against CockroachDB and PostgreSQL event-sourced stores.',
      strategy: 'Engineered a phased strangler-fig migration pattern where real-time transactions were progressively routed through an Apache Kafka event spine with dual-write reconciliation against the legacy ledger for 90 days.',
      solution: 'Delivered an ultra-resilient distributed ledger utilizing Go microservices, Apache Kafka event streams, and CockroachDB distributed SQL, complete with automated fraud telemetry and ISO 20022 messaging.',
      architecture: 'Distributed multi-region AWS topology across us-east-1, eu-west-1, and ap-southeast-1. Implemented mTLS zero-trust communication with Envoy service mesh and HashiCorp Vault key rotation.',
      technologies: 'Go, Apache Kafka, CockroachDB, Kubernetes, AWS EKS, HashiCorp Vault, Prometheus, Grafana, Docker',
      beforeVsAfter: JSON.stringify({
        before: '8.2 second average transaction settlement latency with 42 minutes daily end-of-day reconciliation halt and 99.4% uptime.',
        after: '46 millisecond global settlement latency with continuous zero-downtime streaming reconciliation and 99.999% verified availability.',
      }),
      kpis: JSON.stringify([
        { label: 'Settlement Latency', value: '46ms' },
        { label: 'Daily Volume Processed', value: '$8.4B' },
        { label: 'Infrastructure Savings', value: '58%' },
        { label: 'Availability SLA', value: '99.999%' },
      ]),
      roi: 'Achieved an estimated $6.8M in annual operational savings and enabled Aura Capital to launch instant merchant settlements across 32 new international markets within 6 months.',
      results: 'Zero lost transactions across 450M+ processed events; settlement verification time reduced by 99.4%; SOC-2 Type II and PCI-DSS Level 1 compliance achieved on first audit.',
      clientTestimonial: JSON.stringify({
        quote: "InGrowwth Innovations executed what three major consulting giants declared impossible: a live, zero-downtime migration of our entire core settlement engine without dropping a single cent in customer transactions.",
        author: 'Alexander Sterling',
        role: 'Chief Information Officer, Aura Global Capital',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      }),
      status: 'PUBLISHED' as const,
      seoTitle: 'FinTech Core Banking Migration Case Study | InGrowwth Innovations',
      seoDescription: 'Discover how InGrowwth Innovations engineered a sub-50ms distributed settlement engine for Aura Global Capital handling $8.4B daily volume.',
    },
    {
      slug: 'ai-supply-chain-predictive-logistics',
      title: 'Autonomous AI Supply Chain Optimization & Fleet Trajectory Intelligence',
      clientName: 'Nexus Global Freight Logistics',
      industry: 'Logistics & Supply Chain',
      coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200',
      heroBanner: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&q=80&w=1600',
      problemStatement: 'Nexus Logistics managed a fleet of 4,200 cargo vessels and intermodal trucks across Europe and Asia. Volatile fuel costs, port congestion delays, and rigid static routing schedules resulted in over $18M in preventable demurrage penalties annually.',
      businessChallenges: 'Inability to predict port delays beyond 4 hours; static fuel procurement yielding severe price exposure; lack of real-time telemetry from refrigerated containers carrying temperature-sensitive pharmaceuticals.',
      objectives: 'Build an autonomous spatial intelligence platform capable of predicting port congestion 72 hours in advance and dynamically rerouting intermodal shipments to optimize fuel and demurrage.',
      strategy: 'Deployed an edge-to-cloud IoT ingestion pipeline paired with graph neural networks (GNN) and weather prediction models to simulate millions of maritime and overland route permutations in real time.',
      solution: 'Architected an intelligent fleet command station that analyzes satellite AIS telemetry, tidal dynamics, port crane productivity metrics, and diesel spot prices to dispatch optimal multimodal waypoints.',
      architecture: 'Hybrid multi-cloud topology utilizing Google Cloud BigQuery for historical spatial analysis, PyTorch on GPU inference clusters, and edge IoT microcontrollers running on vessel satellite uplinks.',
      technologies: 'Python, PyTorch, Google Cloud BigQuery, FastAPI, Next.js, Mapbox GL, Docker, Kafka, Redis',
      beforeVsAfter: JSON.stringify({
        before: 'Static route scheduling updated once weekly; 38 hours average port waiting delay; 14.2% avoidable demurrage rate.',
        after: 'Real-time dynamic route recommendations recalculated every 15 minutes; port delay reduced to 6.2 hours; 89% decrease in demurrage penalties.',
      }),
      kpis: JSON.stringify([
        { label: 'Demurrage Cost Cut', value: '-89%' },
        { label: 'Fuel Efficiency Gain', value: '+22.4%' },
        { label: 'Congestion Accuracy', value: '94.8%' },
        { label: 'Active Fleet Tracked', value: '4,200+' },
      ]),
      roi: 'Delivered $14.2M in direct fuel and penalty reductions within the first 12 months, paying for the platform engineering cost within 45 days of deployment.',
      results: 'Nexus Logistics was awarded Global Supply Chain Innovator of the Year, and carbon emissions across their intermodal fleet were reduced by 48,000 metric tons.',
      clientTestimonial: JSON.stringify({
        quote: "The spatial AI engine engineered by InGrowwth Innovations transformed our fleet from a reactive carrier into the most efficient, predictive maritime logistics network in the Eastern hemisphere.",
        author: 'Capt. Henrik Lindqvist',
        role: 'VP of Global Maritime Operations, Nexus Freight',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      }),
      status: 'PUBLISHED' as const,
      seoTitle: 'AI Supply Chain & Fleet Logistics Case Study | InGrowwth Innovations',
      seoDescription: 'Learn how InGrowwth Innovations built an autonomous spatial AI platform cutting demurrage by 89% across a 4,200-vessel fleet.',
    },
    {
      slug: 'healthcare-ehr-telemetry-platform',
      title: 'HIPAA-Compliant Real-Time HealthTech Telemetry & Diagnostic Platform',
      clientName: 'Vitalis Health Systems',
      industry: 'HealthTech & MedTech',
      coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200',
      heroBanner: 'https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&q=80&w=1600',
      problemStatement: 'Vitalis Health needed to ingest continuous physiological vital data from 180,000 remote patient cardiac monitors into hospital EHR systems while meeting strict HIPAA, FHIR, and HL7 data exchange regulations.',
      businessChallenges: 'Fragmented HL7 legacy pipes prone to silent data drops; strict sub-second alert requirement for acute arrhythmia events; rigorous medical device data security audit compliance.',
      objectives: 'Build a zero-data-loss biometric streaming platform that analyzes patient telemetry and surfaces predictive clinical alerts to intensive care physicians before cardiac decompensation occurs.',
      strategy: 'Implemented an event-driven microservices architecture using HL7/FHIR converters, encrypted MQTT edge brokers, and real-time Kafka streams connected to an audited clinical diagnostic dashboard.',
      solution: 'Delivered the Vitalis Continuous Care Platform, connecting remote biometric patient monitors to regional hospital cardiac centers with end-to-end AES-256 field-level encryption.',
      architecture: 'HIPAA-certified AWS GovCloud deployment featuring isolated VPC peering, envelope encryption via AWS KMS, and automated audit trails recorded to immutable write-once S3 storage.',
      technologies: 'TypeScript, Next.js, Node.js, AWS GovCloud, Kafka, PostgreSQL, Redis, Tailwind CSS, Docker',
      beforeVsAfter: JSON.stringify({
        before: 'Manual nurse charting every 4 hours; 22 minute average delay in detecting nocturnal cardiac arrhythmias; disparate EHR silos.',
        after: 'Sub-second real-time vital ingestion; automated arrhythmia detection alerting physicians within 1.8 seconds; full FHIR bidirectional EHR sync.',
      }),
      kpis: JSON.stringify([
        { label: 'Alert Dispatch Latency', value: '<2.0s' },
        { label: 'Active Patients Monitored', value: '180,000' },
        { label: 'Clinical Readmissions', value: '-31%' },
        { label: 'EHR Parity Accuracy', value: '99.99%' },
      ]),
      roi: 'Reduced 30-day post-operative cardiac readmission rates by 31%, saving hospital networks over $34M in preventable intensive care bed utilization.',
      results: 'Successfully passed rigorous FDA 510(k) and HIPAA security audits with zero findings; scaled to support over 180,000 concurrent patients seamlessly.',
      clientTestimonial: JSON.stringify({
        quote: "InGrowwth Innovations gave our clinical teams the gift of time. Their real-time biometric telemetry platform has literally saved hundreds of lives by detecting cardiac anomalies minutes before they became fatal.",
        author: 'Dr. Aris Thorne, MD, FACC',
        role: 'Chief Medical Officer, Vitalis Health',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
      }),
      status: 'PUBLISHED' as const,
      seoTitle: 'HealthTech EHR Biometric Telemetry Case Study | InGrowwth Innovations',
      seoDescription: 'Discover how InGrowwth Innovations engineered a real-time HIPAA-compliant cardiac telemetry platform for 180,000 patients.',
    },
  ];

  for (const cs of caseStudiesData) {
    const existing = await db.caseStudy.findUnique({ where: { slug: cs.slug } });
    if (existing) {
      await db.caseStudy.update({
        where: { id: existing.id },
        data: cs,
      });
    } else {
      await db.caseStudy.create({ data: cs });
    }
  }

  // 4. PORTFOLIO PROJECTS
  console.log('🚀 Seeding Client Portfolio Projects...');
  const portfolioProjects = [
    {
      slug: 'lumina-ai-creative-copilot',
      title: 'Lumina: Enterprise Generative AI Copilot & Creative Suite',
      client: 'Lumina Creative Studio',
      category: 'AI & Machine Learning',
      industry: 'Media & Generative AI',
      websiteUrl: 'https://lumina-ai.demo',
      description: 'An enterprise multimodal creative workspace that enables marketing directors and design agencies to generate branded marketing campaigns, vector artwork, and video assets in minutes.',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
      gallery: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200,https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200',
      servicesUsed: JSON.stringify(['AI & Machine Learning', 'Web Development', 'Cloud & DevOps Solutions']),
      technologiesUsed: JSON.stringify(['Next.js', 'React', 'TypeScript', 'PyTorch', 'FastAPI', 'Tailwind CSS', 'AWS']),
      teamMembers: JSON.stringify(['Meet Trivedi', 'Elena Rostova', 'Saurav Patel']),
      duration: '4 Months',
      projectStatus: 'Completed',
      projectOverview: 'Lumina required an ultra-responsive web workspace integrating text-to-image diffusion models, brand style guides, and instant Figma export capabilities for creative agencies.',
      challenges: 'Managing long-running GPU inference jobs without freezing browser UIs, enforcing brand color palette constraints on generative outputs, and supporting canvas collaboration between multiple designers.',
      solution: 'Architected a real-time WebSockets canvas backed by an asynchronous Celery task queue, custom LoRA model adapters trained on client brand assets, and an edge CDN cache for generated imagery.',
      features: JSON.stringify([
        'Real-time infinite canvas with multiplayer cursor collaboration',
        'Custom LoRA brand consistency fine-tuning module',
        'Direct export to Figma, Adobe Creative Cloud, and high-res SVG',
        'Instant multi-variant marketing copy and banner generation',
      ]),
      results: 'Scaled to 45,000 active agency subscribers within 90 days; generated over 3.2M branded marketing assets; achieved an average user session length of 42 minutes.',
      metrics: JSON.stringify([
        { label: 'Creative Velocity', value: '+450%' },
        { label: 'Active Creators', value: '45,000' },
        { label: 'Generation Speed', value: '1.4s' },
        { label: 'Asset Retention', value: '98.2%' },
      ]),
      testimonial: JSON.stringify({
        quote: "Lumina has revolutionized our marketing agency's workflow. What previously took a team of four designers two weeks is now finalized and approved in under four hours.",
        author: 'Chloe Deschanel',
        role: 'Head of Creative, Horizon Media',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      }),
      cta: 'Explore AI Engineering Services',
      seoTitle: 'Lumina AI Creative Copilot | InGrowwth Innovations Portfolio',
      seoDescription: 'Case breakdown of Lumina, an enterprise multimodal generative AI platform engineered by InGrowwth Innovations.',
    },
    {
      slug: 'strata-erp-manufacturing-intelligence',
      title: 'Strata Cloud: Automated Manufacturing ERP & Supply Chain Engine',
      client: 'Strata Precision Industrial',
      category: 'ERP & Enterprise Software',
      industry: 'Industrial Manufacturing',
      websiteUrl: 'https://strata-erp.demo',
      description: 'A modern, modular ERP built to synchronize real-time machine telemetry from CNC milling factories with automated procurement, warehouse inventory, and automated customer invoicing.',
      coverImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
      gallery: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200,https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
      servicesUsed: JSON.stringify(['ERP & Enterprise Software', 'Web Development', 'Cloud & DevOps Solutions']),
      technologiesUsed: JSON.stringify(['Python', 'PostgreSQL', 'React', 'Docker', 'Odoo', 'Tailwind CSS']),
      teamMembers: JSON.stringify(['Marcus Vance', 'Saurav Patel']),
      duration: '6 Months',
      projectStatus: 'Completed',
      projectOverview: 'Strata Precision operated 8 manufacturing facilities across North America, struggling with disparate paper logs, delayed material procurement, and inaccurate machine maintenance forecasting.',
      challenges: 'Extracting live telemetry from 350+ legacy PLC machines, synchronizing raw material consumption with dynamic steel price fluctuations, and migrating 20 years of historical accounting ledgers.',
      solution: 'Engineered an edge IoT daemon capturing machine vibration and cycle metrics, connected to a modular PostgreSQL ERP engine with automated purchase orders and real-time plant floor dashboards.',
      features: JSON.stringify([
        'Live factory floor layout showing real-time machine telemetry and OEE scores',
        'Automated bill-of-materials calculation based on raw metal price indices',
        'Predictive maintenance alerts triggered by abnormal spindle vibration frequencies',
        'Unified multi-plant financial consolidation and GAAP-compliant ledgers',
      ]),
      results: 'Increased overall equipment effectiveness (OEE) by 28%; reduced unplanned machine downtime by 62%; eliminated $3.4M in annual excess inventory holding costs.',
      metrics: JSON.stringify([
        { label: 'OEE Efficiency', value: '+28%' },
        { label: 'Unplanned Downtime', value: '-62%' },
        { label: 'Inventory Cost Saved', value: '$3.4M' },
        { label: 'Plants Orchestrated', value: '8 Facilities' },
      ]),
      testimonial: JSON.stringify({
        quote: "InGrowwth Innovations modernized our operations without halting a single assembly line. We now know the exact cost and margin of every precision component produced in real time.",
        author: 'Robert K. Vance',
        role: 'Chief Operating Officer, Strata Precision Industrial',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      }),
      cta: 'Request ERP Modernization Consultation',
      seoTitle: 'Strata Manufacturing ERP | InGrowwth Innovations Portfolio',
      seoDescription: 'Case breakdown of Strata Cloud, a custom modular manufacturing ERP built by InGrowwth Innovations.',
    },
    {
      slug: 'solari-defi-cross-chain-vaults',
      title: 'Solari: Cross-Chain Liquidity & Algorithmic Yield Protocol',
      client: 'Solari Protocol DAO',
      category: 'Web Development',
      industry: 'Web3 & Decentralized Finance',
      websiteUrl: 'https://solari.demo',
      description: 'An institutional decentralized asset management portal enabling automated cross-chain yield optimization, audited smart contract vaults, and real-time portfolio analytics.',
      coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200',
      gallery: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200,https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&q=80&w=1200',
      servicesUsed: JSON.stringify(['Web Development', 'Cybersecurity', 'Cloud & DevOps Solutions']),
      technologiesUsed: JSON.stringify(['Next.js', 'TypeScript', 'Solidity', 'Rust', 'Ethers.js', 'Tailwind CSS', 'AWS']),
      teamMembers: JSON.stringify(['Meet Trivedi', 'Saurav Patel']),
      duration: '3 Months',
      projectStatus: 'Completed',
      projectOverview: 'Solari Protocol required a bank-grade user interface for institutional capital allocators, featuring sub-second liquidity charting, gas estimation, and multi-signature hardware wallet connection.',
      challenges: 'Ensuring zero front-running vulnerability on rebalancing transactions, handling dynamic RPC node failover across 6 blockchains, and maintaining responsive 60 FPS charts under extreme market volatility.',
      solution: 'Constructed an ultra-fast Next.js interface with Wagmi integration, redundant multi-region RPC load balancing, and automated smart contract circuit breakers verified by top security auditing firms.',
      features: JSON.stringify([
        'Multi-chain wallet connection supporting Ledger, Trezor, and WalletConnect v2',
        'Live candlestick charts with institutional order depth visualization',
        'One-click cross-chain bridge execution with automated slippage protection',
        'Historical yield performance analytics and downloadable tax reports',
      ]),
      results: 'Surpassed $240M Total Value Locked (TVL) within the first 60 days of mainnet launch; audited with zero critical vulnerabilities; zero exploit incidents recorded.',
      metrics: JSON.stringify([
        { label: 'Total Value Locked', value: '$240M+' },
        { label: 'Security Audit Score', value: '100%' },
        { label: 'Transaction Latency', value: '450ms' },
        { label: 'Chains Supported', value: '6 Networks' },
      ]),
      testimonial: JSON.stringify({
        quote: "The interface designed and built by InGrowwth Innovations set a new benchmark for institutional DeFi UX. It feels as fast and responsive as a Bloomberg Terminal.",
        author: 'Dmitri Koslov',
        role: 'Core Contributor, Solari DAO',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      }),
      cta: 'View FinTech Engineering Services',
      seoTitle: 'Solari Cross-Chain DeFi Protocol | InGrowwth Innovations Portfolio',
      seoDescription: 'Explore Solari, a high-throughput institutional DeFi protocol interface built by InGrowwth Innovations.',
    },
    {
      slug: 'apex-pulse-fitness-app',
      title: 'Apex Pulse: AI Personalized Fitness & Biometric Health Companion',
      client: 'Apex Health & Athletics',
      category: 'Mobile App Development',
      industry: 'Fitness, Health & Wearables',
      websiteUrl: 'https://apex-pulse.demo',
      description: 'A native iOS and Android application that syncs with Apple Watch and Garmin wearables to deliver real-time AI workout coaching, metabolic recovery scores, and personalized nutrition plans.',
      coverImage: 'https://images.unsplash.com/photo-1510519138161-5844a49f70d7?auto=format&fit=crop&q=80&w=1200',
      gallery: 'https://images.unsplash.com/photo-1510519138161-5844a49f70d7?auto=format&fit=crop&q=80&w=1200',
      servicesUsed: JSON.stringify(['Mobile App Development', 'AI & Machine Learning']),
      technologiesUsed: JSON.stringify(['Flutter', 'Dart', 'Swift', 'Kotlin', 'Firebase', 'Python']),
      teamMembers: JSON.stringify(['Elena Rostova', 'Saurav Patel']),
      duration: '5 Months',
      projectStatus: 'Completed',
      projectOverview: 'Apex Health wanted to differentiate their smart athletic wear by offering an intelligent companion app that analyzes biometric sensor data and adjusts workout intensity on the fly.',
      challenges: 'Processing continuous Bluetooth Low Energy (BLE) vital streams without draining mobile phone batteries, and calculating complex HRV recovery algorithms locally while offline.',
      solution: 'Developed a high-performance Flutter mobile application with native Swift and Kotlin background BLE workers, localized SQLite cache, and an offline-capable Onnx machine learning model.',
      features: JSON.stringify([
        'Sub-second BLE synchronization with smart rings, watches, and chest straps',
        'Voice-guided AI coaching adapting workout intervals based on live heart rate zones',
        'Daily readiness and metabolic strain score calculated upon morning wake',
        'Social community leaderboards and peer encouragement challenges',
      ]),
      results: 'Maintained a 4.9-star rating across 25,000+ App Store reviews; 68% day-30 retention rate; featured as Apple App of the Day in the Health & Fitness category.',
      metrics: JSON.stringify([
        { label: 'App Store Rating', value: '4.9 ★' },
        { label: 'Day-30 Retention', value: '68%' },
        { label: 'Active Users', value: '120k' },
        { label: 'Battery Overhead', value: '<2.5%/hr' },
      ]),
      testimonial: JSON.stringify({
        quote: "Our users constantly praise how smooth and responsive the Apex Pulse app is. InGrowwth Innovations delivered a mobile product that rivals Apple and Nike in polish.",
        author: 'Samantha Reed',
        role: 'Head of Product, Apex Athletics',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      }),
      cta: 'Discuss Your Mobile App Idea',
      seoTitle: 'Apex Pulse Mobile Fitness App | InGrowwth Innovations Portfolio',
      seoDescription: 'Case study of Apex Pulse, a 4.9-star AI biometric health and fitness application engineered by InGrowwth Innovations.',
    },
  ];

  for (const p of portfolioProjects) {
    const existing = await db.portfolioProject.findUnique({ where: { slug: p.slug } });
    if (existing) {
      await db.portfolioProject.update({
        where: { id: existing.id },
        data: p,
      });
    } else {
      await db.portfolioProject.create({ data: p });
    }
  }

  // 5. JOBS & CAREERS
  console.log('💼 Seeding Career Opportunities...');
  const jobsData = [
    {
      title: 'Senior Full-Stack AI Engineer',
      department: 'Engineering',
      location: 'Remote / Ahmedabad, India',
      type: 'Full-Time',
      description: 'We are seeking an exceptional Senior Full-Stack AI Engineer to architect, build, and deploy high-throughput LLM applications, multi-agent systems, and responsive Next.js interfaces for global enterprise clients. Compensation: $90,000 - $140,000 / ₹24 - 36 LPA.',
      requirements: JSON.stringify([
        '5+ years of full-stack engineering experience with TypeScript, Next.js, and Node.js.',
        'Proven expertise implementing RAG architectures, vector databases (Qdrant, Pinecone), and LLM frameworks (LangChain, LlamaIndex).',
        'Strong database proficiency in PostgreSQL, Prisma ORM, and high-concurrency Redis caching.',
        'Experience deploying containerized applications on AWS (EKS, ECS) with Docker and Terraform.',
      ]),
      status: 'OPEN' as const,
    },
    {
      title: 'Principal Cloud & DevOps Architect',
      department: 'Infrastructure',
      location: 'Remote',
      type: 'Full-Time',
      description: 'Lead the design, automation, and operational resilience of multi-region cloud infrastructures for InGrowwth Innovations and our enterprise partners. Compensation: $110,000 - $160,000 / ₹30 - 45 LPA.',
      requirements: JSON.stringify([
        '7+ years architecting enterprise Kubernetes (EKS/GKE) clusters and declarative Terraform infrastructure.',
        'Extensive experience with GitOps pipelines, Prometheus/Grafana observability, and zero-trust security postures.',
        'Deep understanding of multi-region active-active database replication and automated failover topologies.',
        'AWS Certified Solutions Architect Professional or equivalent cloud certification.',
      ]),
      status: 'OPEN' as const,
    },
    {
      title: 'Lead UI/UX Product Designer',
      department: 'Design',
      location: 'Hybrid / Remote',
      type: 'Full-Time',
      description: 'Own the visual and interaction design systems for next-generation enterprise applications, SaaS platforms, and mobile apps. Turn complex technological workflows into intuitive, breathtaking digital experiences. Compensation: $75,000 - $115,000 / ₹18 - 28 LPA.',
      requirements: JSON.stringify([
        '4+ years designing high-impact web and mobile products with a standout portfolio.',
        'Mastery of modern typography, glassmorphism, micro-animations, and fluid design systems in Figma.',
        'Deep knowledge of web accessibility standards (WCAG 2.1 AA) and responsive breakpoint design.',
        'Ability to collaborate closely with frontend engineers to ensure 100% design fidelity.',
      ]),
      status: 'OPEN' as const,
    },
    {
      title: 'Senior Mobile Applications Engineer (Flutter/iOS)',
      department: 'Mobile',
      location: 'Remote',
      type: 'Full-Time',
      description: 'Develop high-performance, 60 FPS cross-platform and native mobile applications with offline-first persistence, Bluetooth Low Energy connectivity, and biometric authentication. Compensation: $80,000 - $125,000 / ₹20 - 32 LPA.',
      requirements: JSON.stringify([
        '4+ years building production mobile apps in Flutter/Dart and native Swift or Kotlin.',
        'Experience with state management solutions (Bloc, Riverpod) and local databases (SQLite, Hive).',
        'Proven track record publishing top-rated apps to the Apple App Store and Google Play Store.',
        'Familiarity with CI/CD mobile pipelines using Fastlane and GitHub Actions.',
      ]),
      status: 'OPEN' as const,
    },
  ];

  for (const j of jobsData) {
    const existing = await db.job.findFirst({
      where: { title: j.title, department: j.department },
    });
    if (existing) {
      await db.job.update({
        where: { id: existing.id },
        data: j,
      });
    } else {
      await db.job.create({ data: j });
    }
  }

  // 6. BLOG POSTS
  console.log('✍️ Seeding Thought Leadership Blogs...');
  const blogPostsData = [
    {
      slug: 'architecting-production-grade-rag-pipelines',
      title: 'Architecting Production-Grade RAG: From Naive Vector Search to Hybrid Agentic Retrieval',
      shortDescription: 'Why basic cosine similarity search fails in enterprise environments, and how hybrid dense-sparse indexing with rerankers achieves 94% retrieval accuracy.',
      category: 'AI & Engineering',
      tags: 'AI, LLM, RAG, Architecture, VectorDB',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
      authorName: 'Meet Trivedi',
      readTime: 8,
      status: 'Published' as const,
      publishDate: new Date('2026-09-15'),
      content: `## The Fallacy of Naive Vector Search

In 2024, deploying Retrieval-Augmented Generation (RAG) was as simple as chunking text into 500-token chunks, generating embeddings with OpenAI text-embedding-3-small, and querying a vector index.

However, once deployed into enterprise environments with hundreds of thousands of specialized technical documents, naive vector search fails in three critical scenarios:
1. **Keyword-Specific Exact Matches:** Finding product SKUs, error codes, and legal clauses where semantic synonyms fail.
2. **Context Fragmentation:** Chunks cut across table borders or structured sections lose critical surrounding context.
3. **Retrieval Noise Degradation:** Passing 10 noisy vector chunks to an LLM induces hallucinations and dilutes inference attention.

### The Solution: Hybrid Sparse-Dense Retrieval with Cross-Encoder Reranking

At InGrowwth Innovations, our production RAG architecture implements a two-stage retrieval pipeline:

\`\`\`
User Query
    ├──> BM25 Keyword Search (Sparse Vector) ────┐
    └──> Dense Embedding Search (Qdrant) ────────┴──> Reciprocal Rank Fusion (RRF)
                                                            │
                                                            ▼
                                                    Cross-Encoder Reranker (BGE-Reranker-Large)
                                                            │
                                                            ▼ Top 5 Pristine Context Chunks
                                                    LLM Inference Generator
\`\`\`

By combining reciprocal rank fusion with a cross-encoder reranker, context relevancy jumps from 68% to 94.2%, drastically reducing hallucination rates while keeping query latencies under 280ms.`,
      seoTitle: 'Architecting Production-Grade RAG Pipelines | InGrowwth Blog',
      seoDescription: 'Learn how to build enterprise RAG pipelines combining sparse and dense retrieval with cross-encoder reranking for maximum accuracy.',
    },
    {
      slug: 'zero-downtime-kubernetes-deployments',
      title: 'Zero-Downtime Microservices: Implementing Flawless Canary Deployments on EKS',
      shortDescription: 'A practical deep-dive into Argo Rollouts, Prometheus error budget analysis, and Envoy service mesh traffic splitting for enterprise systems.',
      category: 'Cloud & DevOps',
      tags: 'Kubernetes, DevOps, AWS, CI/CD, Reliability',
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200',
      authorName: 'Saurav Patel',
      readTime: 6,
      status: 'Published' as const,
      publishDate: new Date('2026-09-28'),
      content: `## Beyond Standard Rolling Updates

Kubernetes native RollingUpdates are sufficient for stateless hobby projects, but they fail when database migrations, API contract changes, or subtle memory leaks emerge under production load.

### Progressive Delivery with Argo Rollouts and Prometheus Metrics

By adopting progressive delivery patterns, we route only 2% of live traffic to new container versions, continuously evaluating HTTP 5xx error rates and p99 latency against baseline metrics before promoting traffic further.

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: api-gateway
spec:
  replicas: 10
  strategy:
    canary:
      analysis:
        templates:
          - templateName: success-rate-metric
        args:
          - name: service-name
            value: api-gateway
      steps:
        - setWeight: 5
        - pause: { duration: 10m }
        - setWeight: 25
        - pause: { duration: 30m }
        - setWeight: 100
\`\`\`

If error rates exceed 0.05% during the 10-minute 5% canary window, Argo automatically halts and reverts the release without human intervention, ensuring enterprise SLAs remain unbroken.`,
      seoTitle: 'Zero-Downtime Kubernetes Canary Deployments | InGrowwth Blog',
      seoDescription: 'Master progressive delivery and automated canary deployments on Kubernetes with Argo Rollouts and Prometheus.',
    },
  ];

  for (const b of blogPostsData) {
    const existing = await db.blogPost.findUnique({ where: { slug: b.slug } });
    if (existing) {
      await db.blogPost.update({
        where: { id: existing.id },
        data: b,
      });
    } else {
      await db.blogPost.create({ data: b });
    }
  }

  // 7. LEADS & RFQ QUOTES
  console.log('📬 Seeding Inbound Leads & Enterprise Quotes...');
  const demoLeads = [
    {
      name: 'Victoria Sterling',
      email: 'v.sterling@vanguard-holdings.com',
      phone: '+1 (415) 890-3412',
      type: 'QUOTE' as const,
      status: 'NEW' as const,
      subject: 'Custom AI Portfolio Analysis Engine for Hedge Fund Operations',
      message: 'We are seeking an engineering partner to build an automated financial document parser and predictive sentiment engine across global equity filings. Project timeline is 4 months with a dedicated engineering team.',
      budget: '$50,000 - $100,000',
      timeline: '3 - 6 Months',
      service: 'AI & Machine Learning',
      projectDetails: 'Need strict on-premise VPC deployment on AWS GovCloud with SOC-2 compliance.',
    },
    {
      name: 'Dr. Julian Morales',
      email: 'morales@bionext-labs.org',
      phone: '+44 20 7946 0912',
      type: 'QUOTE' as const,
      status: 'CONTACTED' as const,
      subject: 'Cloud Telemetry & Real-Time Genomic Sequencing Dashboard',
      message: 'Our lab processes petabytes of raw DNA sequencing FASTQ files. We need a web-based analytical pipeline to visualize genomic variants and generate clinical reports.',
      budget: '$25,000 - $50,000',
      timeline: '1 - 3 Months',
      service: 'Web Development',
      projectDetails: 'Requires integration with AWS S3, Next.js frontend, and Python bio-informatics workers.',
    },
    {
      name: 'Marcus Holloway',
      email: 'm.holloway@nexus-retail.de',
      phone: '+49 30 901820',
      type: 'CONTACT' as const,
      status: 'CONTACTED' as const,
      subject: 'Inquiry: Cloud Modernization & Kubernetes Migration',
      message: 'Hi team InGrowwth, we would like to schedule a technical architecture review to discuss migrating our legacy Magento cluster to an automated EKS microservices stack.',
    },
    {
      name: 'Sophia Chen',
      email: 'sophia@zenith-robotics.io',
      phone: '+65 6789 0123',
      type: 'CONTACT' as const,
      status: 'NEW' as const,
      subject: 'Mobile Fleet Telemetry App for Autonomous Warehouse Drones',
      message: 'Looking to contract InGrowwth Innovations to develop our cross-platform iOS and Android operator control interface. Please share availability for an introductory call.',
    },
    {
      name: 'Daniel Al-Mansoor',
      email: 'daniel@emirates-logistics.ae',
      phone: '+971 4 312 4567',
      type: 'QUOTE' as const,
      status: 'CONTACTED' as const,
      subject: 'Enterprise Modular ERP Implementation across Middle East Hubs',
      message: 'We operate 14 distribution centers across the UAE and Saudi Arabia. We need a modern, cloud-based ERP to replace our custom legacy Oracle software.',
      budget: '$100,000+',
      timeline: '6+ Months',
      service: 'ERP & Enterprise Software',
      projectDetails: 'Complete multi-currency, multi-lingual Arabic/English interface with automated customs tax reporting.',
    },
  ];

  for (const l of demoLeads) {
    const existing = await db.lead.findFirst({ where: { email: l.email, subject: l.subject } });
    if (!existing) {
      await db.lead.create({ data: l });
    }
  }

  // 8. NEWSLETTER SUBSCRIBERS & CAMPAIGNS
  console.log('✉️ Seeding Newsletter Network & Campaigns...');
  const demoSubscribers = [
    { email: 'sarah.connor@cyberdyne-ai.com', name: 'Sarah Connor', status: 'ACTIVE' as const },
    { email: 'alex.chen@sequoia-invest.com', name: 'Alex Chen', status: 'ACTIVE' as const },
    { email: 'jordan.belfort@wallst-advisors.com', name: 'Jordan Belfort', status: 'ACTIVE' as const },
    { email: 'devon.miles@knight-industries.org', name: 'Devon Miles', status: 'ACTIVE' as const },
    { email: 'priya.sharma@tata-digital.in', name: 'Priya Sharma', status: 'ACTIVE' as const },
    { email: 'lukas.weber@siemens-health.de', name: 'Lukas Weber', status: 'ACTIVE' as const },
  ];

  for (const sub of demoSubscribers) {
    const existing = await db.newsletterSubscriber.findUnique({ where: { email: sub.email } });
    if (!existing) {
      await db.newsletterSubscriber.create({ data: sub });
    }
  }

  const demoCampaign = {
    subject: 'Inside InGrowwth: How Enterprise Leaders Are Scaling AI in Production',
    content: `## InGrowwth Quarterly Executive Briefing

Welcome to our quarterly engineering intelligence dispatch. In this issue, we examine the shifting paradigm of enterprise AI architecture:

### 1. The Death of Naive Vector Search
Why top engineering organizations are abandoning basic cosine similarity in favor of hybrid reciprocal rank fusion and cross-encoders.

### 2. Multi-Region Active-Active Cloud Architecture
How our team engineered 99.999% uptime for Aura Capital's $8.4B daily transaction engine.

### 3. Case Studies Published
Explore our new in-depth analysis on Nexus Logistics cutting demurrage penalties by 89% using autonomous fleet routing.`,
    status: 'SENT' as const,
    stats: JSON.stringify({ totalSent: 6, delivered: 6, failed: 0, opens: 5, clicks: 3 }),
    sentAt: new Date(),
    bannerImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
  };

  const existingCampaign = await db.newsletterCampaign.findFirst({ where: { subject: demoCampaign.subject } });
  if (!existingCampaign) {
    await db.newsletterCampaign.create({ data: demoCampaign });
  }

  console.log('🎉 Seeding successfully completed for Remote Development Database!');
}

seedDemoData()
  .then(async () => {
    await db.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('❌ Error during demo data seeding:', e);
    await db.$disconnect();
    process.exit(1);
  });
