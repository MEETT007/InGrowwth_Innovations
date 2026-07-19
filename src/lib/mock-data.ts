import { Code, Cloud, Layers, Cpu, Shield, Smartphone } from 'lucide-react';
import React from 'react';

export interface Service {
  slug: string;
  title: string;
  icon: React.ReactNode;
  shortDesc: string;
  longDesc: string;
  features: string[];
  tech: string[];
  gradient: string;
  colorClass: string;
  accentColor: string;
}

export const services: Service[] = [
  {
    slug: 'web-development',
    title: 'Web Development',
    icon: React.createElement(Code, { className: 'h-6 w-6' }),
    shortDesc:
      'Custom web applications built with React, Next.js, and TypeScript — fast, SEO-optimized, and pixel-perfect.',
    longDesc:
      'We craft modern, high-performance web applications from the ground up. Using Next.js App Router, server components, and edge rendering, we build platforms that load instantly, rank well on search engines, and scale effortlessly under traffic surges. From landing pages to complex SaaS dashboards, every pixel is deliberate.',
    features: [
      'Next.js 15+ App Router & Server Components',
      'Responsive & accessible UI/UX design',
      'SEO optimization & Core Web Vitals excellence',
      'Authentication, authorization & role-based access',
      'Third-party API & payment gateway integrations',
      'Performance auditing & continuous optimization',
    ],
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
    gradient: 'from-indigo-600 to-purple-600',
    colorClass: 'text-indigo-500 dark:text-indigo-400 bg-indigo-500/10',
    accentColor: 'indigo',
  },
  {
    slug: 'mobile-apps',
    title: 'Mobile App Development',
    icon: React.createElement(Smartphone, { className: 'h-6 w-6' }),
    shortDesc:
      'Native and cross-platform mobile apps for iOS & Android, built with Flutter and React Native.',
    longDesc:
      'We develop beautiful, high-performance mobile applications for both iOS and Android platforms. Whether you need a cross-platform solution with Flutter or a React Native app that feels truly native, our team delivers smooth 60fps animations, offline capabilities, and seamless app store deployments.',
    features: [
      'Cross-platform iOS & Android from a single codebase',
      'Native-feel UI with fluid 60fps animations',
      'Offline-first architecture with local persistence',
      'Push notifications & background services',
      'App Store & Google Play submission support',
      'Analytics integration & crash reporting',
    ],
    tech: ['Flutter', 'React Native', 'Dart', 'Firebase', 'TypeScript', 'REST APIs'],
    gradient: 'from-purple-600 to-violet-600',
    colorClass: 'text-purple-500 dark:text-purple-400 bg-purple-500/10',
    accentColor: 'purple',
  },
  {
    slug: 'cloud-devops',
    title: 'Cloud & DevOps Solutions',
    icon: React.createElement(Cloud, { className: 'h-6 w-6' }),
    shortDesc:
      'Scalable cloud infrastructure, CI/CD pipelines, and container orchestration for enterprise reliability.',
    longDesc:
      'We architect and manage cloud environments on AWS, GCP, and Azure that are secure, cost-optimized, and built for scale. Our DevOps practice automates your entire delivery pipeline — from code commit to production deployment — reducing release cycles from weeks to hours while maintaining enterprise-grade reliability.',
    features: [
      'Cloud architecture design & migration (AWS / GCP / Azure)',
      'Automated CI/CD pipelines with GitHub Actions',
      'Kubernetes & Docker container orchestration',
      'Infrastructure as Code with Terraform',
      'Real-time monitoring, alerting & observability',
      'Cost optimization & cloud FinOps strategies',
    ],
    tech: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'],
    gradient: 'from-sky-600 to-cyan-600',
    colorClass: 'text-sky-500 dark:text-sky-400 bg-sky-500/10',
    accentColor: 'sky',
  },
  {
    slug: 'ai-ml',
    title: 'AI & Machine Learning',
    icon: React.createElement(Cpu, { className: 'h-6 w-6' }),
    shortDesc:
      'Intelligent AI-powered features, predictive analytics, and custom ML models integrated into your product.',
    longDesc:
      'We integrate cutting-edge AI and machine learning capabilities directly into your products. From building custom large language model pipelines and fine-tuned models to deploying recommendation engines and computer vision systems, we bring intelligence to your business in a practical, production-ready way.',
    features: [
      'LLM integration & RAG pipeline development',
      'Custom model training & fine-tuning',
      'Predictive analytics & forecasting systems',
      'Computer vision & image recognition',
      'NLP for text classification & sentiment analysis',
      'AI model monitoring & MLOps pipelines',
    ],
    tech: ['Python', 'PyTorch', 'LangChain', 'OpenAI API', 'Hugging Face', 'FastAPI'],
    gradient: 'from-violet-600 to-fuchsia-600',
    colorClass: 'text-violet-500 dark:text-violet-400 bg-violet-500/10',
    accentColor: 'violet',
  },
  {
    slug: 'cybersecurity',
    title: 'Cybersecurity',
    icon: React.createElement(Shield, { className: 'h-6 w-6' }),
    shortDesc:
      'End-to-end security audits, penetration testing, and compliance consulting to safeguard your digital assets.',
    longDesc:
      'Security cannot be an afterthought. Our cybersecurity team conducts thorough vulnerability assessments, penetration tests, and architecture reviews to identify and eliminate risks before attackers exploit them. We also guide your team through compliance frameworks like SOC 2, ISO 27001, and GDPR.',
    features: [
      'Penetration testing & vulnerability assessments',
      'Web application security audits (OWASP)',
      'Cloud security posture management (CSPM)',
      'SOC 2, ISO 27001 & GDPR compliance guidance',
      'Secure SDLC training & developer education',
      'Incident response planning & threat modeling',
    ],
    tech: ['Burp Suite', 'OWASP ZAP', 'Nessus', 'AWS Security Hub', 'Snyk', 'Vault'],
    gradient: 'from-pink-600 to-rose-600',
    colorClass: 'text-pink-500 dark:text-pink-400 bg-pink-500/10',
    accentColor: 'pink',
  },
  {
    slug: 'erp-enterprise',
    title: 'ERP & Enterprise Software',
    icon: React.createElement(Layers, { className: 'h-6 w-6' }),
    shortDesc:
      'Tailored ERP systems, CRM integrations, and business automation tools built for operational excellence.',
    longDesc:
      'Off-the-shelf ERP systems rarely fit the nuanced workflows of growing enterprises. We design and build custom ERP platforms, CRM integrations, and business process automation solutions that mirror exactly how your organization operates — eliminating manual work, unifying data, and empowering decision-makers with real-time insights.',
    features: [
      'Custom ERP module design & development',
      'CRM integrations (Salesforce, HubSpot, Zoho)',
      'Business process automation & workflow engines',
      'Multi-tenant SaaS architecture',
      'Advanced reporting & business intelligence dashboards',
      'Legacy system migration & modernization',
    ],
    tech: ['Next.js', 'Node.js', 'PostgreSQL', 'Prisma', 'Redis', 'REST / GraphQL'],
    gradient: 'from-amber-600 to-orange-600',
    colorClass: 'text-amber-500 dark:text-amber-400 bg-amber-500/10',
    accentColor: 'amber',
  },
];

export type TechGroup = {
  category: string;
  colorClass: string;
  gradient: string;
  items: { name: string; emoji: string }[];
};

export const technologies: TechGroup[] = [
  {
    category: 'Frontend',
    colorClass: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    gradient: 'from-indigo-500 to-purple-500',
    items: [
      { name: 'Next.js', emoji: '▲' },
      { name: 'React', emoji: '⚛️' },
      { name: 'TypeScript', emoji: '🔷' },
      { name: 'Tailwind CSS', emoji: '🎨' },
      { name: 'Framer Motion', emoji: '🎞️' },
      { name: 'Vite', emoji: '⚡' },
      { name: 'Redux Toolkit', emoji: '🔴' },
      { name: 'shadcn/ui', emoji: '🧩' },
    ],
  },
  {
    category: 'Backend',
    colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    gradient: 'from-emerald-500 to-teal-500',
    items: [
      { name: 'Node.js', emoji: '🟢' },
      { name: 'FastAPI', emoji: '🐍' },
      { name: 'Express.js', emoji: '🚂' },
      { name: 'GraphQL', emoji: '◈' },
      { name: 'tRPC', emoji: '🔗' },
      { name: 'Prisma', emoji: '🔺' },
      { name: 'Python', emoji: '🐍' },
      { name: 'Go', emoji: '🐹' },
    ],
  },
  {
    category: 'Database',
    colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    gradient: 'from-amber-500 to-orange-500',
    items: [
      { name: 'PostgreSQL', emoji: '🐘' },
      { name: 'MongoDB', emoji: '🍃' },
      { name: 'Redis', emoji: '🔴' },
      { name: 'MySQL', emoji: '🐬' },
      { name: 'Supabase', emoji: '⚡' },
      { name: 'Firebase', emoji: '🔥' },
      { name: 'PlanetScale', emoji: '🪐' },
      { name: 'Neon DB', emoji: '💡' },
    ],
  },
  {
    category: 'DevOps & Cloud',
    colorClass: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
    gradient: 'from-sky-500 to-cyan-500',
    items: [
      { name: 'AWS', emoji: '☁️' },
      { name: 'GCP', emoji: '🌐' },
      { name: 'Docker', emoji: '🐳' },
      { name: 'Kubernetes', emoji: '⎈' },
      { name: 'Terraform', emoji: '🏗️' },
      { name: 'GitHub Actions', emoji: '🔄' },
      { name: 'Vercel', emoji: '▲' },
      { name: 'Nginx', emoji: '🛡️' },
    ],
  },
  {
    category: 'Mobile',
    colorClass: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    gradient: 'from-purple-500 to-violet-500',
    items: [
      { name: 'Flutter', emoji: '💙' },
      { name: 'React Native', emoji: '⚛️' },
      { name: 'Dart', emoji: '🎯' },
      { name: 'Expo', emoji: '📱' },
      { name: 'SwiftUI', emoji: '🍎' },
      { name: 'Jetpack Compose', emoji: '🤖' },
      { name: 'Firebase', emoji: '🔥' },
      { name: 'App Center', emoji: '📊' },
    ],
  },
];
