import { db } from '../src/lib/db';
import { DEFAULT_PROCESS_STEPS } from '../src/lib/data-helpers';

async function backfill() {
  console.log('Starting service backfill...');

  const serviceData: Record<string, {
    features: string[];
    techStack: string[];
    process: { step: string; details: string }[];
  }> = {
    'web-development': {
      features: [
        'Next.js 15+ App Router & Server Components',
        'Responsive, Accessible & Pixel-Perfect UI/UX Design',
        'SEO Optimization & Core Web Vitals Excellence',
        'Enterprise Role-Based Access Control (RBAC) & Auth',
        'Third-Party API & Payment Gateway Integrations',
        'Performance Auditing & Continuous Optimization',
      ],
      techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'PostgreSQL', 'Prisma', 'Redis'],
      process: DEFAULT_PROCESS_STEPS,
    },
    'mobile-app-development': {
      features: [
        'Cross-platform iOS & Android from a single codebase',
        'Native-feel UI with fluid 60fps animations',
        'Offline-first architecture with local persistence',
        'Push notifications & background services',
        'App Store & Google Play submission support',
        'Analytics integration & crash reporting',
      ],
      techStack: ['Flutter', 'React Native', 'Dart', 'Firebase', 'Swift', 'Kotlin', 'REST APIs'],
      process: [
        {
          step: 'Concept & Platform Strategy',
          details: 'Defining device matrices, user personas, offline capabilities, and cross-platform native hooks.',
        },
        {
          step: 'Mobile UI/UX Prototyping',
          details: 'High-fidelity Figma prototypes with touch gestures, haptic feedback design, and platform guidelines.',
        },
        {
          step: 'App Development',
          details: 'Modular clean architecture with Flutter / React Native, reactive state management, and API integration.',
        },
        {
          step: 'Device Lab Testing',
          details: 'Testing across real physical devices, screen sizes, OS versions, and network throttling conditions.',
        },
        {
          step: 'Store Deployment & Launch',
          details: 'App Store and Google Play compliance review, submission handling, and live crash analytics.',
        },
      ],
    },
    'cloud-devops-solutions': {
      features: [
        'Cloud architecture design & migration (AWS / GCP / Azure)',
        'Automated CI/CD pipelines with GitHub Actions',
        'Kubernetes & Docker container orchestration',
        'Infrastructure as Code (IaC) with Terraform',
        'Real-time monitoring, alerting & observability',
        'Cost optimization & cloud FinOps strategies',
      ],
      techStack: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'],
      process: [
        {
          step: 'Infrastructure Audit & Scoping',
          details: 'Evaluating existing workloads, security posture, cost leaks, and uptime requirements.',
        },
        {
          step: 'Cloud Architecture Blueprint',
          details: 'Designing zero-trust network topologies, high-availability clusters, and automated backups.',
        },
        {
          step: 'IaC & Pipeline Implementation',
          details: 'Writing modular Terraform scripts and configuring GitHub Actions for automated build and deploy.',
        },
        {
          step: 'Hardening & Disaster Recovery',
          details: 'Failover testing, chaos engineering, role-based IAM lockdown, and CIS compliance benchmarks.',
        },
        {
          step: '24/7 Monitoring & Optimization',
          details: 'Setting up Prometheus, Grafana, alerts, and continuous FinOps cloud cost optimization.',
        },
      ],
    },
    'ai-machine-learning': {
      features: [
        'LLM integration & RAG pipeline development',
        'Custom model training & fine-tuning',
        'Predictive analytics & forecasting systems',
        'Computer vision & intelligent image recognition',
        'NLP for text classification & sentiment analysis',
        'AI model monitoring & MLOps pipelines',
      ],
      techStack: ['Python', 'PyTorch', 'LangChain', 'OpenAI API', 'Hugging Face', 'FastAPI'],
      process: [
        {
          step: 'Use Case & Data Feasibility',
          details: 'Identifying high-impact business applications, data hygiene, and privacy compliance.',
        },
        {
          step: 'Data Engineering & Pipeline Setup',
          details: 'Data cleaning, vector database ingestion, tokenization, and embedding pipelines.',
        },
        {
          step: 'Model Development & Fine-Tuning',
          details: 'Building domain-specific prompts, RAG architectures, or fine-tuning neural network weights.',
        },
        {
          step: 'Evaluation & Guardrails',
          details: 'Benchmarking accuracy, hallucination prevention, latency testing, and safety guardrails.',
        },
        {
          step: 'Production Deployment & MLOps',
          details: 'Deploying high-throughput inference APIs with continuous drift detection and active retraining.',
        },
      ],
    },
    'cybersecurity': {
      features: [
        'Penetration testing & vulnerability assessments',
        'Web application security audits (OWASP Top 10)',
        'Cloud security posture management (CSPM)',
        'SOC 2, ISO 27001 & GDPR compliance guidance',
        'Secure SDLC training & developer education',
        'Incident response planning & threat modeling',
      ],
      techStack: ['Burp Suite', 'OWASP ZAP', 'Nessus', 'AWS', 'Snyk', 'Kali Linux', 'Wireshark', 'Splunk'],
      process: [
        {
          step: 'Threat Modeling & Reconnaissance',
          details: 'Mapping digital attack surfaces, external assets, and potential threat actor vectors.',
        },
        {
          step: 'Active Penetration Testing',
          details: 'Executing ethical penetration tests across APIs, web apps, databases, and network perimeters.',
        },
        {
          step: 'Vulnerability Prioritization',
          details: 'Categorizing findings by CVSS risk ratings with clear remediation blueprints for engineering.',
        },
        {
          step: 'Remediation & Patch Verification',
          details: 'Assisting your engineering team in patching vulnerabilities and validating fixes.',
        },
        {
          step: 'Continuous Security Posture',
          details: 'Setting up automated SAST/DAST pipeline scanners and continuous compliance monitoring.',
        },
      ],
    },
    'erp-enterprise-software': {
      features: [
        'Custom ERP module design & development',
        'CRM integrations (Salesforce, HubSpot, Zoho)',
        'Business process automation & workflow engines',
        'Multi-tenant enterprise SaaS architecture',
        'Advanced reporting & business intelligence dashboards',
        'Legacy system migration & modernization',
      ],
      techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'Prisma', 'Redis', 'GraphQL', 'Odoo'],
      process: [
        {
          step: 'Business Workflow Mapping',
          details: 'Documenting operational departments, data dependencies, approval chains, and bottlenecks.',
        },
        {
          step: 'Data Model & Schema Design',
          details: 'Designing relational schemas, transactional guarantees, and multi-tenant data segregation.',
        },
        {
          step: 'Modular Module Engineering',
          details: 'Developing finance, inventory, HR, and CRM modules with real-time audit logging.',
        },
        {
          step: 'Data Migration & User Testing',
          details: 'Migrating historical records from legacy tools and running comprehensive departmental UAT.',
        },
        {
          step: 'Enterprise Rollout & Training',
          details: 'Phased rollout with role-based training programs, documentation, and dedicated SLA support.',
        },
      ],
    },
    'onestream-epm': {
      features: [
        'Financial Consolidation & Close Automation',
        'Budgeting, Planning & Rolling Forecasts',
        'Financial Reporting, Analysis & Dashboards',
        'Data Quality Management & Validation Rules',
        'Workflow Automation & Audit Trail Compliance',
        'Direct General Ledger & ERP Data Integration',
      ],
      techStack: ['OneStream', 'SQL', 'C#', 'REST APIs', 'Power BI'],
      process: [
        {
          step: 'Discovery & Scoping',
          details: 'Requirement gathering, financial process assessment, and chart-of-accounts mapping.',
        },
        {
          step: 'System Architecture & Design',
          details: 'Designing cube architecture, workflow profiles, dimensions, and financial business rules.',
        },
        {
          step: 'Implementation & Automation',
          details: 'Building business rules in C#/VB.NET, metadata configurations, and automated ETL pipelines.',
        },
        {
          step: 'Testing & Parallel Validation',
          details: 'Financial reconciliation, user acceptance testing (UAT), and data validation against legacy EPM.',
        },
        {
          step: 'Go-Live & Hypercare Support',
          details: 'Cutover execution, finance team training, and post-implementation dedicated hypercare support.',
        },
      ],
    },
  };

  const allServices = await db.service.findMany();
  console.log(`Found ${allServices.length} services in DB.`);

  for (const s of allServices) {
    const slug = s.slug || '';
    const data = serviceData[slug];
    if (data) {
      console.log(`Updating service "${s.title}" (${slug})...`);
      await db.service.update({
        where: { id: s.id },
        data: {
          features: data.features,
          techStack: data.techStack,
          process: data.process,
        },
      });
      console.log(`Updated "${s.title}" successfully.`);
    } else {
      console.log(`No preset for slug "${slug}", checking default process...`);
      if (!s.process || (Array.isArray(s.process) && s.process.length === 0)) {
        await db.service.update({
          where: { id: s.id },
          data: {
            process: DEFAULT_PROCESS_STEPS,
          },
        });
      }
    }
  }

  console.log('Backfill complete!');
}

backfill()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Backfill error:', err);
    process.exit(1);
  });
